/**
 * src/screens/HomeScreen.js
 * ---------------------------------------------------------------------------
 * Tela exibida quando existe um usuário autenticado.
 *
 * O objeto recebido é o User do Firebase, e não o perfil bruto do Google.
 * Campos disponíveis: uid, displayName, email, photoURL, emailVerified.
 *
 * O ícone de perfil no cabeçalho funciona como botão de logout: mostra a
 * foto do usuário (ou a inicial do nome, se não houver foto) e dispara
 * sair() ao ser tocado.
 * ---------------------------------------------------------------------------
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { sair } from '../services/autenticacao';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_HEIGHT = 200;
const GRID_GAP = 12;
const GRID_CARD_WIDTH = (SCREEN_WIDTH - 16 * 2 - GRID_GAP) / 2;
const CAROUSEL_ITEM_WIDTH = SCREEN_WIDTH - 32;

/* ------------------------------------------------------------------ */
/* MOCK DATA — substitua depois por dados vindos de API/estado real   */
/* ------------------------------------------------------------------ */

const MES_ATUAL = {
  nome: 'Maio',
  diasSemana: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  // grid de 6 semanas x 7 dias, null = célula vazia
  dias: [
    [null, null, null, 1, 2, 3, 4],
    [5, 6, 7, 8, 9, 10, 11],
    [12, 13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24, 25],
    [26, 27, 28, 29, 30, 31, null],
    [null, null, null, null, null, null, null],
  ],
  diaSelecionado: 15,
};

const FAVORITOS = [
  'Festival de Inverno',
  'Show Acústico no Parque',
  'Feira Gastronômica',
  'Exposição de Arte Moderna',
  'Maratona Cultural',
  'Noite de Jazz',
  'Encontro de Cinema',
  'Workshop de Fotografia',
];

const CAROUSEL_IMAGES = [
  { id: 'c1', uri: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200' },
  { id: 'c2', uri: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200' },
  { id: 'c3', uri: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1200' },
];

const EVENTOS = [
  {
    id: '1',
    nome: 'NOME DO EVENTO',
    data: '12/05',
    hora: '19:00',
    imagem: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=600',
  },
  {
    id: '2',
    nome: 'NOME DO EVENTO',
    data: '14/05',
    hora: '20:30',
    imagem: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=600',
  },
  {
    id: '3',
    nome: 'NOME DO EVENTO',
    data: '18/05',
    hora: '18:00',
    imagem: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600',
  },
  {
    id: '4',
    nome: 'NOME DO EVENTO',
    data: '21/05',
    hora: '21:00',
    imagem: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
  },
  {
    id: '5',
    nome: 'NOME DO EVENTO',
    data: '25/05',
    hora: '17:30',
    imagem: 'https://images.unsplash.com/photo-1500259571355-332da5cb07aa?w=600',
  },
  {
    id: '6',
    nome: 'NOME DO EVENTO',
    data: '29/05',
    hora: '19:45',
    imagem: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
  },
];

/* ------------------------------------------------------------------ */
/* SUBCOMPONENTES                                                      */
/* ------------------------------------------------------------------ */

function Header({ usuario, saindo, onSair }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons name="menu" size={26} color="#000" />
      </TouchableOpacity>

      {/*
        O círculo de perfil funciona como botão de logout: mostra a foto do
        usuário (ou a inicial do nome, quando não há foto) e dispara sair()
        ao ser tocado. `disabled` evita múltiplos toques durante o processo.
      */}
      <Pressable
        style={styles.profileIcon}
        onPress={onSair}
        disabled={saindo}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {usuario?.photoURL ? (
          <Image style={styles.profileImage} source={{ uri: usuario.photoURL }} />
        ) : (
          <Text style={styles.profileInitial}>
            {(usuario?.displayName ?? '?').charAt(0).toUpperCase()}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

function MiniCalendar({ mes }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitleSerif}>{mes.nome}</Text>
      <View style={styles.calendarWeekRow}>
        {mes.diasSemana.map((d) => (
          <Text key={d} style={styles.calendarWeekDay}>
            {d}
          </Text>
        ))}
      </View>
      {mes.dias.map((semana, i) => (
        <View key={i} style={styles.calendarWeekRow}>
          {semana.map((dia, j) => {
            const selecionado = dia === mes.diaSelecionado;
            return (
              <View
                key={j}
                style={[
                  styles.calendarDayCell,
                  selecionado && styles.calendarDayCellSelected,
                ]}
              >
                {dia !== null && (
                  <Text
                    style={[
                      styles.calendarDayText,
                      selecionado && styles.calendarDayTextSelected,
                    ]}
                  >
                    {dia}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

function FavoritosCard({ favoritos }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitleSerif}>Favoritos</Text>
      <View style={styles.favoritosList}>
        {favoritos.map((item, index) => (
          <View key={index} style={styles.favoritoRow}>
            <Text style={styles.favoritoBullet}>•</Text>
            <View style={styles.favoritoLinePlaceholder}>
              <Text numberOfLines={1} style={styles.favoritoText}>
                {item}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function ImageCarousel({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / CAROUSEL_ITEM_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={handleScroll}
        snapToInterval={CAROUSEL_ITEM_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.uri }}
            style={[styles.carouselImage, { width: CAROUSEL_ITEM_WIDTH }]}
            resizeMode="cover"
          />
        )}
      />
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

function SearchBar({ value, onChangeText }) {
  return (
    <View style={styles.searchBarContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Busque seu evento"
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
      />
      <Ionicons name="search" size={20} color="#000" style={{ marginRight: 4 }} />
    </View>
  );
}

function EventoCard({ evento }) {
  return (
    <View style={styles.eventCard}>
      <Image source={{ uri: evento.imagem }} style={styles.eventImage} resizeMode="cover" />
      <View style={styles.eventBanner}>
        <Text style={styles.eventBannerText} numberOfLines={1}>
          {evento.nome}
        </Text>
      </View>
      <View style={styles.eventInfoRow}>
        <View style={styles.eventInfoItem}>
          <Ionicons name="calendar-outline" size={14} color="#333" />
          <Text style={styles.eventInfoText}>{evento.data}</Text>
        </View>
        <View style={styles.eventInfoItem}>
          <Ionicons name="time-outline" size={14} color="#333" />
          <Text style={styles.eventInfoText}>{evento.hora}</Text>
        </View>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* TELA PRINCIPAL                                                      */
/* ------------------------------------------------------------------ */

const HomeScreen = ({ usuario }) => {
  const [busca, setBusca] = useState('');
  const [saindo, setSaindo] = useState(false);

  const aoSair = async () => {
    setSaindo(true);
    try {
      await sair();
    } catch (e) {
      console.log('Falha ao sair:', e);
      setSaindo(false);
    }
    // Não desligamos o estado no caso de sucesso porque o componente será
    // desmontado pelo observador -- atualizar o estado depois disso gera aviso.
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <Header usuario={usuario} saindo={saindo} onSair={aoSair} />

        {/* Seção de cards duplos */}
        <View style={styles.dualCardsRow}>
          <View style={styles.dualCardWrapper}>
            <MiniCalendar mes={MES_ATUAL} />
          </View>
          <View style={styles.dualCardWrapper}>
            <FavoritosCard favoritos={FAVORITOS} />
          </View>
        </View>

        {/* Carrossel */}
        <ImageCarousel images={CAROUSEL_IMAGES} />

        {/* Título de seção */}
        <Text style={styles.sectionTitle}>Eventos</Text>

        {/* Barra de busca */}
        <SearchBar value={busca} onChangeText={setBusca} />

        {/* Grid de eventos */}
        <FlatList
          data={EVENTOS}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.eventGridRow}
          contentContainerStyle={styles.eventGridContainer}
          renderItem={({ item }) => <EventoCard evento={item} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

/* ------------------------------------------------------------------ */
/* ESTILOS                                                             */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  profileIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },

  /* Cards duplos */
  dualCardsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 4,
    marginBottom: 20,
  },
  dualCardWrapper: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#fff',
  },
  cardTitleSerif: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    color: '#000',
    marginBottom: 8,
  },

  /* Mini calendário */
  calendarWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  calendarWeekDay: {
    width: 16,
    fontSize: 9,
    color: '#999',
    textAlign: 'center',
    fontFamily: 'System',
  },
  calendarDayCell: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayCellSelected: {
    backgroundColor: '#000',
    borderRadius: 8,
  },
  calendarDayText: {
    fontSize: 9,
    color: '#333',
    fontFamily: 'System',
  },
  calendarDayTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },

  /* Favoritos */
  favoritosList: {
    marginTop: 2,
  },
  favoritoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  favoritoBullet: {
    fontSize: 12,
    color: '#000',
    marginRight: 6,
  },
  favoritoLinePlaceholder: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 2,
  },
  favoritoText: {
    fontSize: 10,
    color: '#555',
    fontFamily: 'System',
  },

  /* Carrossel */
  carouselImage: {
    height: CAROUSEL_HEIGHT,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#d0d0d0',
    marginHorizontal: 3,
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },

  /* Título de seção */
  sectionTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    color: '#000',
    textAlign: 'center',
    marginBottom: 16,
  },

  /* Busca */
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    paddingVertical: 8,
    fontFamily: 'System',
  },

  /* Grid de eventos */
  eventGridContainer: {
    paddingHorizontal: 16,
  },
  eventGridRow: {
    justifyContent: 'space-between',
    marginBottom: GRID_GAP,
  },
  eventCard: {
    width: GRID_CARD_WIDTH,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#fff',
    overflow: 'hidden',
    // sombra leve (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    // sombra leve (Android)
    elevation: 2,
  },
  eventImage: {
    width: '100%',
    height: 90,
    backgroundColor: '#e8f0e6',
  },
  eventBanner: {
    backgroundColor: '#2f3d2f',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  eventBannerText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: 'System',
  },
  eventInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  eventInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventInfoText: {
    fontSize: 11,
    color: '#333',
    marginLeft: 4,
    fontFamily: 'System',
  },
});