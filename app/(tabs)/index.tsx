import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '@/components/Card';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LivingRoom } from '@/components/LivingRoom';
import { Bedroom } from '@/components/Bedroom';
import { Kitchen } from '@/components/Kitchen';
import { Garage } from '@/components/Garage';
import { Pool } from '@/components/Pool';
import { Bathroom } from '@/components/Bathroom';
import * as LocalAuthentication from 'expo-local-authentication';
import { listenToData, updateData } from '@/firebase/firebaseDatabase'

export default function HomeScreen() {
  const [name, setName] = useState('');
  const [isNameStored, setIsNameStored] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [selectedRoomInfo, setSelectedRoomInfo] = useState('');

  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [door, setDoor] = useState<boolean | null>(null);

  const handleAuthForUpdate = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      Alert.alert("Erro", "Este dispositivo não suporta autenticação biométrica");
      return;
    }

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      Alert.alert("Erro", "Nenhuma biometria configurada no dispositivo");
      return;
    }

    const message = door ? "Authenticate to close the door" : "Authenticate to open the door"

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: message,
      fallbackLabel: "Use sua senha",
    });

    if (result.success) {
      const newState = !door;
      setDoor(newState);
      await updateData('home/door', newState);
      if(newState)
        Alert.alert("Success", "Main door open");
      else
        Alert.alert("Success", "Main door closed");

    } else {
      Alert.alert("Error", "Unable to open the main door");
    }
  };

  const handleSaveName = async () => {
    try {
      await AsyncStorage.setItem('userName', name);
      setIsNameStored(true);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', 
      day: '2-digit',
      month: 'long',
    };
    
    const formattedDate = now.toLocaleDateString('en-US', options);
    setCurrentDate(formattedDate);

    listenToData('home/temperature', (data) => setTemperature(data));
    listenToData('home/humidity', (data) => setHumidity(data));
    listenToData('home/door', (data) => setDoor(data));
    
    const loadName = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userName');
        if (storedName) {
          setName(storedName);
          setIsNameStored(true);
        }
      } catch (e) {
        console.log(e);
      }
    };

    loadName();

  }, []);

  const cadeadoSource = door
    ? require('../../assets/images/cadeado-aberto.png')  
    : require('../../assets/images/cadeado.png');

  const doorSource = door
    ? require('../../assets/images/porta-aberta.png')  
    : require('../../assets/images/porta.png');

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
          {isNameStored ? (
            <SafeAreaView style={styles.container_principal}>
              <View style={styles.container_um}>
                <Text style={styles.greeting}>Welcome home, </Text>
                <Text style={styles.greeting}>{name}</Text>
                <Text style={styles.greeting1}>{currentDate}</Text>
              </View>
              <View style={styles.container_dois}>
                <View style={styles.cards}>
                  <View style={styles.cards_deitados}>
                    <TouchableOpacity onPress={() => setSelectedRoomInfo('Living Room')}>
                      <Card image={require('../../assets/images/sala-de-estar.png')} title='Living Room' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedRoomInfo('Bedroom')}>
                      <Card image={require('../../assets/images/quarto.png')} title='Bedroom' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedRoomInfo('Kitchen')}>
                      <Card image={require('../../assets/images/cozinha.png')} title='Kitchen' />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.cards_deitados}>
                    <TouchableOpacity onPress={() => setSelectedRoomInfo('Bathroom')}>
                      <Card image={require('../../assets/images/banheiro.png')} title='Bathroom' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedRoomInfo('Garage')}>
                      <Card image={require('../../assets/images/garagem.png')} title='Garage' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedRoomInfo('Pool')}>
                      <Card image={require('../../assets/images/piscina.png')} title='Pool' />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.infos}>
                  <Text style={styles.roomInfo}>{selectedRoomInfo}</Text>
                  {(() => {
                    switch (selectedRoomInfo) {
                      case 'Living Room':
                        return <LivingRoom />;
                      case 'Bedroom':
                        return <Bedroom />;
                      case 'Kitchen':
                        return <Kitchen />;
                      case 'Bathroom':
                        return <Bathroom />;
                      case 'Garage':
                        return <Garage />;
                      case 'Pool':
                        return <Pool />;
                      default:
                        return <Text style={styles.roomInfo}>Select a room to see more details</Text>;
                    }
                  })()}
                </View>
                <View style={styles.device}>
                  <Text style={styles.device_text}>Device</Text>
                  <View style={styles.view}>
                    <View style={styles.door}>
                      <Text style={styles.text_view}>Main Door</Text>
                      <Image style={styles.img_grande} source={doorSource}></Image>
                    </View>
                    <TouchableOpacity onPress={handleAuthForUpdate} style={[styles.button, door ? styles.on : styles.off]}>
                      <Text style={styles.buttonText}>{door ? 'Open' : 'Closed'}</Text>
                      <Image source={cadeadoSource} style={styles.img}></Image>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.view}>
                    <Text style={styles.text_temp}><Image style={styles.img_grande} source={require('../../assets/images/temperatura.png')}></Image> {temperature}°C</Text>
                    <Text style={styles.text_temp}><Image style={styles.img_grande} source={require('../../assets/images/umidade.png')}></Image> {humidity}%</Text>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          ) : (
            <View style={styles.container_principal}>
              <Text>Digite seu nome:</Text>
              <TextInput
                style={styles.input}
                placeholder="Seu nome"
                value={name}
                onChangeText={setName}
              />
              <Button title="Salvar nome" onPress={handleSaveName} />
            </View>
          )}
    </ScrollView> 
  );
}

const styles = StyleSheet.create({
  door: {
    borderWidth: 1,
    borderColor: "#9244A7FF",
    padding: 12,
    borderRadius: 12
  },
  img: {
    width: 20,
    height: 20,
    marginLeft: 10
  },
  img_grande: {
    width: 50,
    height: 50,
    marginLeft: 10
  },
  text_view: {
    color: "#000000FF",
    fontWeight: "bold"
  },
  text_temp: {
    color: "#9244A7FF",
    fontWeight: "bold",
    fontSize: 22
  },
  view: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: "#FFFFFFFF",
    padding: 12,
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 12,
    justifyContent: "space-around",
    width: "85%",
    flexDirection: 'row'
  },
  button: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row'
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
  cards: {
    padding: 24,
    flex: 4
  },
  cards_deitados: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container_um: {
    width: "100%",
    padding: 24,
    backgroundColor: "#9244A7FF",
  },
  container_dois: {
    flex: 8,
    alignItems: 'center',
    width: "100%"
  },
  container_principal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: "white",
  },
  greeting1: {
    fontSize: 12,
    fontWeight: 'bold',
    color: "white",
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginVertical: 10,
    width: 200,
  },
  roomInfo: {
    marginTop: 20,
    fontSize: 18,
    color: '#ffffff',
    width: "100%",
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 12
  },
  infos: {
    width: "100%",
    flex: 4,
    backgroundColor: "#9244A7AE",
  },
  device: {
    width: "100%",
    display: 'flex',
    alignItems: 'center'
  },
  device_text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#9244A7FF",
    marginTop: 24
  },
  botao_porta: {
    backgroundColor: "#9244A7FF",
    padding: 6,
    borderRadius: 6
  },
  text_porta: {
    color: "white",
    fontWeight: "bold",
    textAlign: 'center',
    fontSize: 16
  }
});
