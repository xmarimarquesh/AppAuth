import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { listenToData, updateData } from '@/firebase/firebaseDatabase';

export const Pool = () => {
  const [isLampOn, setisLampOn] = useState(false);
  const [isAirOn, setisAirOn] = useState(false);

  // ---- ATUALIZAR NO FIREBASE
  const toggleSwitchLamp = async () => {
    const newState = !isLampOn;
    setisLampOn(newState);
    await updateData('home/pool/light', newState);
  };

  const toggleSwitchAir = async () => {
    const newState = !isAirOn;
    setisAirOn(newState);
    await updateData('home/pool/air', newState);
  };

  // ---- ATUALIZAR IMAGENS
  const imageSource = isLampOn
    ? require('../assets/images/lampada_ligada.png')  
    : require('../assets/images/lampada.png');

  // ---- ESCUTAR MUDANÇAS DO FIREBASE E ATUALIZAR ESTADO LOCAL
  useEffect(() => {
    const unsubscribeLamp = listenToData('home/pool/light', (data) => {
      setisLampOn(data);
    });

    const unsubscribeAir = listenToData('home/pool/air', (data) => {
      setisAirOn(data);
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
          <Image source={require('../assets/images/cascata.png')} style={styles.img} />
          <TouchableOpacity onPress={toggleSwitchAir} style={[styles.button, isAirOn ? styles.on : styles.off]}>
            <Text style={styles.buttonText}>{isAirOn ? 'ON' : 'OFF'}</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view_principal: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  img: {
    width: 64,
    height: 64,
    margin: 12
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
