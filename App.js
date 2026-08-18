import { StyleSheet, Text, View, Button, ActivityIndicator, Image } from "react-native";
import { useState } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

//funções de autenticação
export const onLogin = async () => {
  const user = await GoogleSignin.signIn();
  return user;
};

export const onLogout = async () => {
  return await GoogleSignin.signOut();
};

GoogleSignin.configure({
  webClientId: "78883926102-0cn22go4l07u6lfn6h47hcvn8c425vtc.apps.googleusercontent.com",
});

// Telas
const LoginScreen = ({ login, setUser }) => {
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);

  return (
    <View style={styles.layout}>
      {isSigninInProgress && <ActivityIndicator />}
      <Text style={styles.title}>Login</Text>
      <Button
        title="entrar"
        onPress={() => {
          setIsSigninInProgress(true);
          onLogin().then(dadosAuth => {
            console.log(dadosAuth);
            setUser(dadosAuth.data.user);
            login(true);
          });
        }}
      />
    </View>
  );
};

const HomeScreen = ({ login, user }) => (
  <View style={styles.layout}>
    <Text style={styles.title}>Home</Text>
    <Text style={styles.text}>Bem vindo {user.name}</Text>
    <Image
      source={{ uri: user.photo }}
      style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 16 }}
    />
    <Button title="Sair" onPress={() => onLogout().then(() => login(false))} />
  </View>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <View style={styles.container}>
      {isAuthenticated ? (
        <HomeScreen login={setIsAuthenticated} user={user} />
      ) : (
        <LoginScreen login={setIsAuthenticated} setUser={setUser} />
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  layout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    marginBottom: 16,
  },
  text: {
    fontSize: 14,
    marginBottom: 16,
  },
});