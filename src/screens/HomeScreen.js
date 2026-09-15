/**
 * src/screens/HomeScreen.js
 * ---------------------------------------------------------------------------
 * Tela exibida quando existe um usuário autenticado.
 *
 * O objeto recebido é o User do Firebase, e não o perfil bruto do Google.
 * Campos disponíveis: uid, displayName, email, photoURL, emailVerified.
 *
 * O uid é o identificador que deve ser usado como chave dos dados do usuário
 * no Firestore -- ele não muda, mesmo que a pessoa troque o e-mail.
 * ---------------------------------------------------------------------------
 */
import { useState } from "react";
import { View, Text, Image, Button, StyleSheet, ImageBackground, Pressable } from "react-native";

import { sair } from "../services/autenticacao";

const HomeScreen = ({ usuario }) => {
  const [saindo, setSaindo] = useState(false);

  const aoSair = async () => {
    setSaindo(true);
    try {
      await sair();
    } catch (e) {
      console.log("Falha ao sair:", e);
      setSaindo(false);
    }
    // Não desligamos o estado no caso de sucesso porque o componente será
    // desmontado pelo observador -- atualizar o estado depois disso gera aviso.
  };

  return (
    <View style={styles.container}>
      {usuario.photoURL ? (
        <Pressable style={styles.botaoSair} onPress={aoSair}>
          <Image style={styles.foto} source={{ uri: usuario.photoURL }} />
        </Pressable>
      ) : (
        <View style={[styles.foto, styles.fotoVazia]}>
          <Text style={styles.inicial}>
            {(usuario.displayName ?? "?").charAt(0).toUpperCase()}
          </Text>
        </View>
      )}


      <ImageBackground source={require('../../assets/Sincronize.png')} style={{ flex: 1 }} resizeMode="contain" />
      {/*
        photoURL pode ser null (contas sem foto). O operador ternário evita
        passar { uri: null } para o Image, que resulta em um quadro em branco.
      */}
      {/* ?? cobre o caso de displayName ser null, não apenas undefined. */}

    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    // backgroundColor: "#fff",
    padding: 8,
  },
  botaoSair: {
    position: 'absolute',
    right: 9,
    top: 107,
    zIndex:1,
    width: 40,
    height: 40,
    borderRadius: 70,
    marginBottom: 24,
  },
  foto: {
    width: 40,
    height: 40,
    borderRadius: 70,
    marginBottom: 24,
  },
  fotoVazia: {
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  inicial: {
    fontSize: 56,
    color: "#555",
  },
  nome: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  uid: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
  },
  botao: {
    marginTop: 32,
    width: 200,
  },
});
