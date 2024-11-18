import { Tabs } from 'expo-router';
import React from 'react';

export default function MainLayout() {
  return (
    <Tabs>
      <Tabs.Screen name='index' options={{headerShown: false}}></Tabs.Screen>
      <Tabs.Screen name='naosei' options={{headerShown: false}}></Tabs.Screen>
    </Tabs>
  );
}
