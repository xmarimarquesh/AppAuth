import React, { useState } from 'react';
import { View, Button, Text, Alert, StyleSheet, ImageSourcePropType, Image } from 'react-native';

export const Card = ({image, title} : {image: ImageSourcePropType, title: string}) => {

  return (
    <View style={styles.view}>
        <Image style={styles.img} source={image}></Image>
        <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  img: {
    width: 100,
    height: 100,
    padding: 12
  },
  view: {
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center',
    borderColor: "#AD00FF",
    borderWidth: 1,
    padding: 6,
    margin: 6,
    borderRadius: 12
  }, 
  title: {
    fontWeight: "bold"
  }

});
