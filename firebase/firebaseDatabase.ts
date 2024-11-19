// firebase/firebaseDatabase.ts

import { ref, onValue, set, update, off } from 'firebase/database';
import { database } from '@/firebase/firebaseConfig';  // Importa a referência do banco de dados

// Função para escutar dados de um caminho específico no banco de dados
export const listenToData = (path: string, callback: (data: any) => void) => {
  const dbRef = ref(database, path); // Cria a referência para o caminho passado

  const listener = onValue(dbRef, (snapshot) => {
    const data = snapshot.val(); // Obtém os dados
    callback(data); // Chama o callback com os dados recebidos
  });

  // Retorna uma função para remover o listener
  return () => {
    off(dbRef, 'value', listener);
  };
};

// Função para salvar a temperatura no Firebase
export const saveTemperature = (temperature: number) => {
  const temperatureRef = ref(database, 'sensors/temperature');  // Caminho para salvar a temperatura
  set(temperatureRef, temperature);  // Grava o valor de temperatura
};

// Função genérica para atualizar dados no Firebase
export const updateData = async (path: string, value: any): Promise<void> => {
  try {
    const dbRef = ref(database, path); // Cria uma referência ao caminho especificado
    await set(dbRef, value); // Atualiza o valor no banco de dados
    console.log(`Dados atualizados em ${path}:`, value);
  } catch (error) {
    console.error('Erro ao atualizar os dados:', error);
  }
};


// Função para atualizar os dados de sensores (temperatura e umidade)
export const updateSensorData = (temperature: number, humidity: number) => {
  const updates: Record<string, any> = {};  // Cria um objeto para armazenar as atualizações
  updates['sensors/temperature'] = temperature;  // Define o novo valor para a temperatura
  updates['sensors/humidity'] = humidity;  // Define o novo valor para a umidade
  
  const sensorsRef = ref(database, 'sensors');  // Caminho para o nó de sensores
  update(sensorsRef, updates);  // Atualiza os dados dos sensores no Firebase
};
