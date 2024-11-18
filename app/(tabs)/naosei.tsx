import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import database, { FirebaseDatabaseTypes } from '@react-native-firebase/database';

// Tipagem para o nó "home" no banco de dados
type HomeData = {
  lights?: {
    kitchen?: boolean;
    living_room?: boolean;
  };
  temperature?: number;
  door_locked?: boolean;
};

export default function Naosei() {
  const homeRef = database().ref('/home');

  // Função para buscar dados
  const fetchData = async (): Promise<void> => {
    try {
      const snapshot: FirebaseDatabaseTypes.DataSnapshot = await homeRef.once('value');
      if (snapshot.exists()) {
        const data: HomeData = snapshot.val();
        console.log('Dados atuais:', data);
      } else {
        console.log('Nenhum dado encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  // Função para atualizar dados
  const updateData = async (): Promise<void> => {
    try {
      await homeRef.update({
        'lights/living_room': true,
        temperature: 24,
      });
      console.log('Dados atualizados!');
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    }
  };

  // Listener para dados em tempo real
  useEffect(() => {
    const listener = homeRef.on('value', (snapshot: FirebaseDatabaseTypes.DataSnapshot) => {
      const data: HomeData = snapshot.val();
      console.log('Novos dados recebidos:', data);
    });

    // Remover listener ao desmontar o componente
    return () => homeRef.off('value', listener);
  }, []);

  return (
    <View>
      <Text>Controle de Casa Inteligente</Text>
      <Button title="Buscar Dados" onPress={fetchData} />
      <Button title="Atualizar Dados" onPress={updateData} />
    </View>
  );
};
