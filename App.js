import { View, Text, Button, StyleSheet } from 'react-native'; // 1. Importou o StyleSheet
import { NavigationContainer } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack'; 

function Home({ navigation }) { 
  return ( 
    // 2. Aplicou os estilos da folha de estilos
    <View style={styles.container}> 
      <Text style={styles.textHome}>Home screen</Text> 
      <Button title="Go to Profile" onPress={() => navigation.navigate('Profile')} /> 
    </View> 
  ); 
} 

function Profile() { 
  return ( 
    // 2. Aplicou os estilos da folha de estilos
    <View style={styles.container}> 
      <Text style={styles.textProfile}>Profile screen</Text> 
      {/* Exemplo de View apenas para espaçamento do botão se necessário */}
    </View> 
  ); 
} 

const Stack = createStackNavigator(); 

function App() { 
  return ( 
    <NavigationContainer> 
      <Stack.Navigator> 
        <Stack.Screen name="Home" component={Home} /> 
        <Stack.Screen name="Profile" component={Profile} /> 
      </Stack.Navigator> 
    </NavigationContainer> 
  ); 
} 

// 3. Criação da folha de estilos (StyleSheet)
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Adicionado uma cor de fundo leve
  },
  textHome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20, // Espaçamento entre o texto e o botão
  },
  textProfile: {
    fontSize: 22,
    fontStyle: 'italic',
    color: '#0066cc',
  }
});

export default App;