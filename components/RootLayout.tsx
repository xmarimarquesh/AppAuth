import { createStackNavigator } from '@react-navigation/stack';

export type RootStackParamList = {
  index: undefined;
  "(tabs)": undefined;
  "+not-found": undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
