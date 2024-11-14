import React, { useState } from 'react';
import { View, Button, Text, Alert, StyleSheet, ImageSourcePropType, Image, TouchableOpacity, ScrollView } from 'react-native';

export const Bedroom = () => {
  const [isLampOn, setisLampOn] = useState(false);
  const [isAirOn, setisAirOn] = useState(false);

  const toggleSwitchLamp = () => {
    setisLampOn(!isLampOn);
  };

  const toggleSwitchAir = () => {
    setisAirOn(!isAirOn);
  };

  const imageSource = isLampOn
    ? require('../assets/images/lampada_ligada.png')  
    : require('../assets/images/lampada.png');


  return (
    <View style={styles.view_principal}>
      <View style={styles.view}>
          <Image source={imageSource} style={styles.img}/>
          <TouchableOpacity onPress={toggleSwitchLamp} style={[styles.button, isLampOn ? styles.on : styles.off]}>
            <Text style={styles.buttonText}>{isLampOn ? 'ON' : 'OFF'}</Text>
          </TouchableOpacity>
      </View>
      <View style={styles.view}>
          <Image source={require('../assets/images/ar-condicionado.png')} style={styles.img}/>
          <TouchableOpacity onPress={toggleSwitchAir} style={[styles.button, isAirOn ? styles.on : styles.off]}>
            <Text style={styles.buttonText}>{isAirOn ? 'ON' : 'OFF'}</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}

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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
