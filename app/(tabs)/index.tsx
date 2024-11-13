
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [name, setName] = useState('');
  const [isNameStored, setIsNameStored] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', 
      day: '2-digit',
      month: 'long',
    };
    
    
    const formattedDate = now.toLocaleDateString('en-US', options);
    setCurrentDate(formattedDate);
  }, []);

  useEffect(() => {
    // Função para carregar o nome armazenado, se existir
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

  // Função para salvar o nome do usuário
  const handleSaveName = async () => {
    try {
      await AsyncStorage.setItem('userName', name);
      setIsNameStored(true);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      {isNameStored ? (
        <>
          <Text style={styles.greeting}>Welcome home, {name}</Text>
          <Text>{currentDate}</Text>
        </>
      ) : (
        <View>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginVertical: 10,
    width: 200,
  },
});

