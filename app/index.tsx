import BiometricAuth from '@/components/BiometricAuth';
import { Button, Text, Image, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.view_principal}>
      <View style={styles.view_um}>
        <Image
          source={require('../assets/images/casa.png')}
          style={styles.imagem}
        />
      </View>
      <View style={styles.view_dois}>
        <BiometricAuth />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imagem: {
    width: 350,
    height: 350,
    padding: 12,
    position: 'absolute',
    bottom: -80, 
    zIndex: 1,
  },
  view_principal: {
    flex: 1,
  },
  view_um: {
    margin: 12,
    flex: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  view_dois: {
    flex: 5,
    backgroundColor: '#9F01C6FF',
    paddingTop: 60,
  },
});

