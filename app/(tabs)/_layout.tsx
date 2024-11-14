import { Stack } from 'expo-router';
import React from 'react';

export default function MainLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} // Define que o cabeçalho não será exibido
      />
    </Stack>
  );
}
