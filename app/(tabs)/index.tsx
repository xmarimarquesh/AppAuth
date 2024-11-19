import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
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
import { listenToData } from '@/firebase/firebaseDatabase'

export default function HomeScreen() {
  const [name, setName] = useState('');
  const [isNameStored, setIsNameStored] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [selectedRoomInfo, setSelectedRoomInfo] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Estados para armazenar dados do Firebase (temperatura, umidade, etc.)
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [light, setLight] = useState<number | null>(null);

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

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Autentique-se para realizar a atualização",
      fallbackLabel: "Use sua senha",
    });

    if (result.success) {
      Alert.alert("Sucesso", "Porta principal aberta");
    } else {
      Alert.alert("Erro", "Não foi possível abrir a porta principal");
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
    listenToData('home/light', (data) => setLight(data));
    
  }, []);

  useEffect(() => {
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

  const handleSaveName = async () => {
    try {
      await AsyncStorage.setItem('userName', name);
      setIsNameStored(true);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCardPress = (room: string) => {
    setSelectedRoomInfo(`${room}`);
  };

  // Escutar os dados do Firebase para atualizar a interface
  useEffect(() => {
    listenToData('sensors/temperature', (data) => setTemperature(data));
    listenToData('sensors/humidity', (data) => setHumidity(data));
    listenToData('sensors/light', (data) => setLight(data));
  }, []);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
      <SafeAreaView style={styles.container_principal}>
        <View style={styles.container_um}>
          {isNameStored ? (
            <>
              <Text style={styles.greeting}>Welcome home, </Text>
              <Text style={styles.greeting}>{name}</Text>
              <Text style={styles.greeting1}>{currentDate}</Text>
            </>
          ) : (
            <View style={styles.container_dois}>
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
            <Text>Temperature: {temperature}°C</Text>
            <Text>Humidity: {humidity}%</Text>
            <Text>Light: {light} lux</Text>
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
          <View>
            <Text>Device</Text>
            <Button title="Abrir porta principal" onPress={handleAuthForUpdate} />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView> 
  );
}

const styles = StyleSheet.create({
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
    fontSize: 22,
    color: '#ffffff',
    width: "100%",
    textAlign: "center",
    fontWeight: "bold"
  },
  infos: {
    width: "100%",
    flex: 4,
    backgroundColor: "#9244A7AE",
  }
});
