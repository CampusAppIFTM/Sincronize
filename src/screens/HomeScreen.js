/**
 * src/screens/HomeScreen.js
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
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { sair } from '../services/autenticacao';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HORIZONTAL_PADDING = 16;
const AVAILABLE_WIDTH = SCREEN_WIDTH - (HORIZONTAL_PADDING * 2);

const CAROUSEL_HEIGHT = 180;
const GRID_GAP = 12;
const GRID_CARD_WIDTH = (AVAILABLE_WIDTH - GRID_GAP) / 2;
const CAROUSEL_ITEM_WIDTH = AVAILABLE_WIDTH;

const CAROUSEL_IMAGES = [
  { id: 'c1', uri: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200' },
  { id: 'c2', uri: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200' },
  { id: 'c3', uri: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1200' },
];

const EVENTOS = [
  {
    id: '1',
    nome: 'Festival de Inverno',
    data: '12/05',
    hora: '19:00',
    descricao: 'Um grande festival com atrações musicais de inverno, comidas típicas e muita diversão para toda a família.',
    imagem: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=600',
  },
  {
    id: '2',
    nome: 'Show Acústico no Parque',
    data: '14/05',
    hora: '20:30',
    descricao: 'Curta uma noite mágica com música acústica ao vivo ao ar livre no parque principal da cidade.',
    imagem: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=600',
  },
  {
    id: '3',
    nome: 'Feira Gastronômica',
    data: '18/05',
    hora: '18:00',
    descricao: 'Experimente os melhores pratos da culinária local e internacional reunidos em um só lugar.',
    imagem: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600',
  },
  {
    id: '4',
    nome: 'Exposição de Arte',
    data: '21/05',
    hora: '21:00',
    descricao: 'Obras de artistas contemporâneos renomados em uma exposição imersiva e interativa.',
    imagem: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
  },
];

function Header({ usuario, saindo, onSair }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons name="menu" size={26} color="#000" />
      </TouchableOpacity>

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

function InteractiveCalendar() {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDaysMap, setSelectedDaysMap] = useState({});
  const [escolhendoMes, setEscolhendoMes] = useState(false);
  const [escolhendoAno, setEscolhendoAno] = useState(false);
  const [inputAno, setInputAno] = useState('');

  const mesesNomes = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const ano = currentDate.getFullYear();
  const mesIndex = currentDate.getMonth();
  const nomeMes = mesesNomes[mesIndex];
  const chaveMesAnoAtual = `${ano}-${mesIndex}`;
  const diasSelecionadosAtuais = selectedDaysMap[chaveMesAnoAtual] || [];

  const alternarDia = (dia) => {
    if (dia === null) return;
    const jaSelecionado = diasSelecionadosAtuais.includes(dia);
    let novosDias = jaSelecionado
      ? diasSelecionadosAtuais.filter((d) => d !== dia)
      : [...diasSelecionadosAtuais, dia];

    setSelectedDaysMap({ ...selectedDaysMap, [chaveMesAnoAtual]: novosDias });
  };

  const mudarMes = (direcao) => {
    setCurrentDate(new Date(ano, mesIndex + direcao, 1));
  };

  const gerarDiasDoMes = () => {
    const primeiroDiaDaSemana = new Date(ano, mesIndex, 1).getDay();
    const ultimoDiaDoMes = new Date(ano, mesIndex + 1, 0).getDate();

    let diasArray = [];
    let semana = Array(7).fill(null);
    let diaContador = 1;

    for (let i = 0; i < 7; i++) {
      if (i >= primeiroDiaDaSemana) semana[i] = diaContador++;
    }
    diasArray.push(semana);

    while (diaContador <= ultimoDiaDoMes) {
      semana = Array(7).fill(null);
      for (let i = 0; i < 7 && diaContador <= ultimoDiaDoMes; i++) {
        semana[i] = diaContador++;
      }
      diasArray.push(semana);
    }
    return diasArray;
  };

  const matrizDias = gerarDiasDoMes();
  const diasSemana = ['Do', 'Se', 'Te', 'Qa', 'Qi', 'Se', 'Sa'];

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
        <Text style={styles.cardTitleSerif}>{nomeMes}</Text>
        <View style={styles.calendarWeekRow}>
          {diasSemana.map((d, index) => (
            <Text key={index} style={styles.calendarWeekDay}>{d}</Text>
          ))}
        </View>
        {matrizDias.slice(0, 5).map((semana, i) => (
          <View key={i} style={styles.calendarWeekRow}>
            {semana.map((dia, j) => {
              const selecionado = diasSelecionadosAtuais.includes(dia);
              return (
                <View key={j} style={[styles.calendarDayCell, selecionado && styles.calendarDayCellSelected]}>
                  {dia !== null && (
                    <Text style={[styles.calendarDayText, selecionado && styles.calendarDayTextSelected]}>
                      {dia}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            {/* Cabeçalho do Modal */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => mudarMes(-1)} style={styles.navButton}>
                <Ionicons name="chevron-back" size={22} color="#000" />
              </TouchableOpacity>
              
              <View style={styles.headerSelectorsContainer}>
                <TouchableOpacity onPress={() => { setEscolhendoMes(true); setEscolhendoAno(false); }}>
                  <Text style={styles.modalTitleClickable}>{nomeMes}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setInputAno(ano.toString()); setEscolhendoAno(true); setEscolhendoMes(false); }}>
                  <Text style={styles.modalTitleClickable}> {ano}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => mudarMes(1)} style={styles.navButton}>
                <Ionicons name="chevron-forward" size={22} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Telas Internas do Modal (Meses, Anos ou Dias) */}
            {escolhendoMes ? (
              <View style={styles.gridSelecaoContainer}>
                <Text style={styles.seletorTitulo}>Selecione o Mês</Text>
                <View style={styles.mesesGrid}>
                  {mesesNomes.map((m, idx) => (
                    <TouchableOpacity 
                      key={idx} 
                      style={[styles.mesItemButton, idx === mesIndex && styles.mesItemButtonActive]}
                      onPress={() => { setCurrentDate(new Date(ano, idx, 1)); setEscolhendoMes(false); }}
                    >
                      <Text style={[styles.mesItemText, idx === mesIndex && styles.mesItemTextActive]}>
                        {m.substring(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setEscolhendoMes(false)}>
                  <Text style={styles.cancelButtonText}>Voltar ao Calendário</Text>
                </TouchableOpacity>
              </View>
            ) : escolhendoAno ? (
              <View style={styles.gridSelecaoContainer}>
                <Text style={styles.seletorTitulo}>Digite o Ano</Text>
                <TextInput
                  style={styles.inputAnoStyle}
                  keyboardType="numeric"
                  maxLength={4}
                  value={inputAno}
                  onChangeText={setInputAno}
                />
                <View style={styles.anoBotoesRow}>
                  <TouchableOpacity style={styles.cancelButtonHalf} onPress={() => setEscolhendoAno(false)}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.confirmButtonHalf} onPress={() => {
                    const anoNum = parseInt(inputAno, 10);
                    if (!isNaN(anoNum)) setCurrentDate(new Date(anoNum, mesIndex, 1));
                    setEscolhendoAno(false);
                  }}>
                    <Text style={styles.confirmButtonText}>Confirmar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <View style={styles.modalWeekRow}>
                  {diasSemana.map((d, index) => (
                    <Text key={index} style={styles.modalWeekDayText}>{d}</Text>
                  ))}
                </View>

                {matrizDias.map((semana, i) => (
                  <View key={i} style={styles.modalWeekRow}>
                    {semana.map((dia, j) => {
                      const selecionado = diasSelecionadosAtuais.includes(dia);
                      return (
                        <TouchableOpacity
                          key={j}
                          disabled={dia === null}
                          onPress={() => alternarDia(dia)}
                          style={[styles.modalDayCell, selecionado && styles.modalDayCellSelected]}
                        >
                          {dia !== null && (
                            <Text style={[styles.modalDayText, selecionado && styles.modalDayTextSelected]}>
                              {dia}
                            </Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </>
            )}

            {!escolhendoMes && !escolhendoAno && (
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Concluído ({diasSelecionadosAtuais.length})</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

function FavoritosCard({ favoritos, onRemoverFavorito }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitleSerif}>Favoritos</Text>
      <View style={styles.favoritosList}>
        {favoritos.length === 0 ? (
          <Text style={styles.emptyFavoritosText}>Nenhum favorito.</Text>
        ) : (
          favoritos.map((item, index) => (
            <View key={index} style={styles.favoritoRow}>
              <Text style={styles.favoritoBullet}>•</Text>
              <View style={styles.favoritoLinePlaceholder}>
                <Text numberOfLines={1} style={styles.favoritoText}>{item}</Text>
              </View>
              <TouchableOpacity onPress={() => onRemoverFavorito(item)} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Ionicons name="close" size={14} color="#999" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

function ImageCarousel({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / CAROUSEL_ITEM_WIDTH);
    if (!isNaN(index) && index >= 0 && index < images.length) {
      setActiveIndex(index);
    }
  };

  return (
    <View style={styles.carouselWrapper}>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={handleScroll}
        snapToInterval={CAROUSEL_ITEM_WIDTH}
        decelerationRate="fast"
        renderItem={({ item }) => (
          <Image source={{ uri: item.uri }} style={[styles.carouselImage, { width: CAROUSEL_ITEM_WIDTH }]} resizeMode="cover" />
        )}
      />
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View key={index} style={[styles.dot, index === activeIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

export default function HomeScreen({ usuario }) {
  const [busca, setBusca] = useState('');
  const [saindo, setSaindo] = useState(false);
  const [favoritos, setFavoritos] = useState(['Festival de Inverno']);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  const aoSair = async () => {
    setSaindo(true);
    try {
      await sair();
    } catch (e) {
      console.log('Falha ao sair:', e);
      setSaindo(false);
    }
  };

  const alternarFavorito = (nomeEvento) => {
    if (favoritos.includes(nomeEvento)) {
      setFavoritos(favoritos.filter(item => item !== nomeEvento));
    } else {
      setFavoritos([...favoritos, nomeEvento]);
    }
  };

  const eventosFiltrados = EVENTOS.filter(ev => 
    ev.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <Header usuario={usuario} saindo={saindo} onSair={aoSair} />

        <View style={styles.dualCardsRow}>
          <View style={styles.dualCardWrapper}>
            <InteractiveCalendar />
          </View>
          <View style={styles.dualCardWrapper}>
            <FavoritosCard favoritos={favoritos} onRemoverFavorito={alternarFavorito} />
          </View>
        </View>

        <ImageCarousel images={CAROUSEL_IMAGES} />

        <Text style={styles.sectionTitle}>Eventos</Text>

        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Busque seu evento"
            placeholderTextColor="#999"
            value={busca}
            onChangeText={setBusca}
          />
          <Ionicons name="search" size={20} color="#000" style={{ marginRight: 4 }} />
        </View>

        {/* Grade de Eventos corrigida para ScrollView */}
        <View style={styles.eventsGridContainer}>
          {eventosFiltrados.map((item) => {
            const isFavorito = favoritos.includes(item.nome);
            return (
              <TouchableOpacity 
                key={item.id} 
                style={styles.eventCard} 
                onPress={() => setEventoSelecionado(item)} 
                activeOpacity={0.9}
              >
                <Image source={{ uri: item.imagem }} style={styles.eventImage} resizeMode="cover" />
                <View style={styles.eventBanner}>
                  <Text style={styles.eventBannerText} numberOfLines={1}>{item.nome}</Text>
                </View>
                <View style={styles.eventInfoRow}>
                  <View style={styles.eventInfoItem}>
                    <Ionicons name="calendar-outline" size={12} color="#333" />
                    <Text style={styles.eventInfoText}>{item.data}</Text>
                  </View>
                  <TouchableOpacity onPress={() => alternarFavorito(item.nome)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name={isFavorito ? "heart" : "heart-outline"} size={16} color={isFavorito ? "#e74c3c" : "#333"} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Modal Detalhes do Evento */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={eventoSelecionado !== null}
        onRequestClose={() => setEventoSelecionado(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.eventDetailContent}>
            {eventoSelecionado && (
              <>
                <Image source={{ uri: eventoSelecionado.imagem }} style={styles.detailImage} resizeMode="cover" />
                <Text style={styles.detailTitle}>{eventoSelecionado.nome}</Text>
                
                <View style={styles.detailInfoRow}>
                  <Ionicons name="calendar-outline" size={16} color="#555" />
                  <Text style={styles.detailInfoText}>Data: {eventoSelecionado.data}</Text>
                  <Ionicons name="time-outline" size={16} color="#555" style={{ marginLeft: 15 }} />
                  <Text style={styles.detailInfoText}>Hora: {eventoSelecionado.hora}</Text>
                </View>

                <Text style={styles.detailDescription}>{eventoSelecionado.descricao}</Text>

                <View style={styles.detailButtonsRow}>
                  <TouchableOpacity 
                    style={styles.favoritoToggleButton} 
                    onPress={() => alternarFavorito(eventoSelecionado.nome)}
                  >
                    <Ionicons 
                      name={favoritos.includes(eventoSelecionado.nome) ? "heart" : "heart-outline"} 
                      size={18} 
                      color={favoritos.includes(eventoSelecionado.nome) ? "#e74c3c" : "#000"} 
                    />
                    <Text style={styles.favoritoToggleText}>
                      {favoritos.includes(eventoSelecionado.nome) ? "Remover" : "Salvar"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.closeDetailButton} onPress={() => setEventoSelecionado(null)}>
                    <Text style={styles.closeDetailButtonText}>Fechar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 12 : 8,
    paddingBottom: 32,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginBottom: 4,
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
  profileImage: { width: '100%', height: '100%' },
  profileInitial: { fontSize: 16, fontWeight: '600', color: '#555' },
  
  // Cards Superiores
  dualCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  dualCardWrapper: { flex: 1 },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 14,
    padding: 10,
    backgroundColor: '#fff',
    minHeight: 140,
  },
  cardTitleSerif: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 8 },
  
  // Calendário Mini
  calendarWeekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  calendarWeekDay: { flex: 1, fontSize: 8, color: '#999', textAlign: 'center' },
  calendarDayCell: { flex: 1, height: 16, alignItems: 'center', justifyContent: 'center' },
  calendarDayCellSelected: { backgroundColor: '#000', borderRadius: 8 },
  calendarDayText: { fontSize: 8, color: '#333' },
  calendarDayTextSelected: { color: '#fff', fontWeight: '600' },
  
  // Favoritos
  favoritosList: { marginTop: 2 },
  favoritoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  favoritoBullet: { fontSize: 12, color: '#000', marginRight: 4 },
  favoritoLinePlaceholder: { flex: 1, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 2, marginRight: 8 },
  favoritoText: { fontSize: 10, color: '#555' },
  emptyFavoritosText: { fontSize: 11, color: '#999', fontStyle: 'italic', marginTop: 10 },
  
  // Carrossel
  carouselWrapper: { marginBottom: 20 },
  carouselImage: { height: CAROUSEL_HEIGHT, borderRadius: 16, backgroundColor: '#eee' },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#d0d0d0', marginHorizontal: 3 },
  dotActive: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#000' },
  
  // Busca e Título
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#000', textAlign: 'center', marginBottom: 16 },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  searchInput: { flex: 1, fontSize: 14, color: '#000', paddingVertical: 8 },
  
  // Grid de Eventos
  eventsGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: GRID_GAP,
  },
  eventCard: {
    width: GRID_CARD_WIDTH,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginBottom: GRID_GAP,
  },
  eventImage: { width: '100%', height: 90, backgroundColor: '#e8f0e6' },
  eventBanner: { backgroundColor: '#2f3d2f', paddingVertical: 6, paddingHorizontal: 8 },
  eventBannerText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  eventInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 10 },
  eventInfoItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  eventInfoText: { fontSize: 11, color: '#333', marginLeft: 2 },
  
  // Modais (Calendário e Detalhes)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: { width: '100%', backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerSelectorsContainer: { flexDirection: 'row', alignItems: 'center' },
  modalTitleClickable: { fontSize: 18, fontWeight: 'bold', color: '#000', textDecorationLine: 'underline' },
  navButton: { padding: 8 },
  
  // Dias Modal Calendário
  modalWeekRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  modalWeekDayText: { fontSize: 14, fontWeight: '600', color: '#999', width: 32, textAlign: 'center' },
  modalDayCell: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 18 },
  modalDayCellSelected: { backgroundColor: '#000' },
  modalDayText: { fontSize: 14, color: '#333' },
  modalDayTextSelected: { color: '#fff', fontWeight: 'bold' },
  
  // Seletor Mês/Ano
  gridSelecaoContainer: { paddingVertical: 10 },
  seletorTitulo: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, color: '#333' },
  mesesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  mesItemButton: { width: '30%', paddingVertical: 12, backgroundColor: '#f5f5f5', borderRadius: 8, alignItems: 'center', marginBottom: 5 },
  mesItemButtonActive: { backgroundColor: '#000' },
  mesItemText: { fontSize: 14, color: '#333', fontWeight: '600' },
  mesItemTextActive: { color: '#fff' },
  inputAnoStyle: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 18, textAlign: 'center', marginBottom: 15 },
  anoBotoesRow: { flexDirection: 'row', gap: 10 },
  cancelButton: { marginTop: 15, paddingVertical: 10, alignItems: 'center' },
  cancelButtonHalf: { flex: 1, backgroundColor: '#eee', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  confirmButtonHalf: { flex: 1, backgroundColor: '#000', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  cancelButtonText: { color: '#666', fontWeight: 'bold' },
  confirmButtonText: { color: '#fff', fontWeight: 'bold' },
  closeButton: { marginTop: 20, backgroundColor: '#000', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  closeButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
  // Detalhes do Evento (Modal)
  eventDetailContent: { width: '100%', backgroundColor: '#fff', borderRadius: 20, padding: 16 },
  detailImage: { width: '100%', height: 180, borderRadius: 12, marginBottom: 16, backgroundColor: '#eee' },
  detailTitle: { fontSize: 22, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  detailInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  detailInfoText: { fontSize: 14, color: '#555', marginLeft: 4 },
  detailDescription: { fontSize: 15, color: '#666', lineHeight: 22, marginBottom: 24 },
  detailButtonsRow: { flexDirection: 'row', gap: 10 },
  favoritoToggleButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#ccc', paddingVertical: 14, borderRadius: 10 },
  favoritoToggleText: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  closeDetailButton: { flex: 1, backgroundColor: '#000', paddingVertical: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  closeDetailButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});