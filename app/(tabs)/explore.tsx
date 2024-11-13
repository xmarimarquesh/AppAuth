import React, { useState } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

import * as Device from 'expo-device';

export default function TabsScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const deviceName = Device.deviceName;
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

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Nome do dispositivo: {deviceName}</Text>
      
      <Button title="Abrir porta principal" onPress={handleAuthForUpdate} />
    </View>
  );
}
