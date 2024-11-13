import React, { useState } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './RootLayout'; // ou o arquivo onde você definiu RootStackParamList

export default function BiometricAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleBiometricAuth = async () => {
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
      promptMessage: "Autentique-se para acessar o app",
      fallbackLabel: "Use sua senha",
    });

    if (result.success) {
      setIsAuthenticated(true);
      // Navega para a tela de abas após autenticação
      navigation.navigate("(tabs)");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isAuthenticated ? (
        <Text>Bem-vindo(a)!</Text>
      ) : (
        <Button title="Autenticar com Face ID/Impressão Digital" onPress={handleBiometricAuth} />
      )}
    </View>
  );
}
