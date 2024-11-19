import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { listenToData, updateData } from '@/firebase/firebaseDatabase'; // Certifique-se que `updateData` está implementado

export const Bedroom = () => {
  const [isLampOn, setisLampOn] = useState(false);
  const [isAirOn, setisAirOn] = useState(false);

  // Atualiza o estado local e o Firebase
  const toggleSwitchLamp = async () => {
    const newState = !isLampOn;
    setisLampOn(newState);
    await updateData('home/bedroom/light', newState); // Atualiza no Firebase
  };

  const toggleSwitchAir = async () => {
    const newState = !isAirOn;
    setisAirOn(newState);
    await updateData('home/bedroom/air', newState); // Atualiza no Firebase
  };

  const imageSource = isLampOn
    ? require('../assets/images/lampada_ligada.png')  
    : require('../assets/images/lampada.png');

  useEffect(() => {
    // Escuta mudanças do estado da lâmpada no Firebase
    const unsubscribeLamp = listenToData('sensors/lamp', (data) => {
      setisLampOn(data); // Atualiza o estado local com os dados do Firebase
    });

    const unsubscribeAir = listenToData('sensors/air', (data) => {
      setisAirOn(data); // Atualiza o estado local com os dados do Firebase
    });

    return () => {
      // Remove os listeners quando o componente for desmontado
      unsubscribeLamp();
      unsubscribeAir();
    };
  }, []);

  return (
    <View style={styles.view_principal}>
      <View style={styles.view}>
          <Image source={imageSource} style={styles.img} />
          <TouchableOpacity onPress={toggleSwitchLamp} style={[styles.button, isLampOn ? styles.on : styles.off]}>
            <Text style={styles.buttonText}>{isLampOn ? 'ON' : 'OFF'}</Text>
          </TouchableOpacity>
      </View>
      <View style={styles.view}>
          <Image source={require('../assets/images/ar-condicionado.png')} style={styles.img} />
          <TouchableOpacity onPress={toggleSwitchAir} style={[styles.button, isAirOn ? styles.on : styles.off]}>
            <Text style={styles.buttonText}>{isAirOn ? 'ON' : 'OFF'}</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  img: {
    width: 64,
    height: 64,
    margin: 12
  },
  view_principal: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  view: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: "#FFFFFFFF",
    padding: 12,
    margin: 12,
    borderRadius: 12,
    justifyContent: "space-around",
    width: "40%"
  },
  text_view: {
    color: "#000000FF",
    fontWeight: "bold"
  },
  button: {
    width: 100,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  on: {
    backgroundColor: 'green',
  },
  off: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
