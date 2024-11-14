import React, { useState } from 'react';
import { View, Button, Text, Alert, StyleSheet, ImageSourcePropType, Image } from 'react-native';

export const Garage = () => {

  return (
    <View style={styles.view}>
        <Text>Garage</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center',
    borderColor: "#AD00FF",
    borderWidth: 1,
    padding: 6,
    margin: 6,
    borderRadius: 12
  }
});
