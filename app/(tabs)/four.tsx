import { Text, View } from '@/components/Themed';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import mockImagesData from '../../src/data/mock-images.json';

interface MockImage {
  id: string;
  url: string;
  titulo: string;
  autor: string;
  autorAvatar: string;
  tags: string[];
  likes: number;
  descripcion: string;
}

export default function TabFourScreen() {
  const [imágenesIniciales, setImágenesIniciales] = useState<MockImage[]>([]);
  const [imágenesMostradas, setImágenesMostradas] = useState<MockImage[]>([]);
  const [imágenesFiltradas, setImágenesFiltradas] = useState<MockImage[]>([]);
  const [términoDeBúsqueda, setTerminoDeBúsqueda] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [cargando, setCargando] = useState(false);
  const [modalAbierta, setModalAbierta] = useState(false);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<MockImage | null>(null);
  const [índiceActual, setÍndiceActual] = useState(10);

  const scrollViewRef = useRef<ScrollView>(null);

  const IMAGENES_POR_CARGA = 10;

  useEffect(() => {
    const cargarDatosIniciales = () => {
      const imagenesDelMock = mockImagesData as MockImage[];
      setImágenesIniciales(imagenesDelMock);
      setImágenesFiltradas(imagenesDelMock);
      setImágenesMostradas(imagenesDelMock.slice(0, IMAGENES_POR_CARGA));
    };

    cargarDatosIniciales();
  }, []);

  const filtrarImágenes = useCallback((término: string) => {
    if (término.trim() === '') {
      setImágenesFiltradas(imágenesIniciales);
      setImágenesMostradas(imágenesIniciales.slice(0, IMAGENES_POR_CARGA));
      setÍndiceActual(IMAGENES_POR_CARGA);
    } else {
      const términoLower = término.toLowerCase();
      const filtradas = imágenesIniciales.filter((imagen) => {
        const coincideTitulo = imagen.titulo.toLowerCase().includes(términoLower);
        const coincideAutor = imagen.autor.toLowerCase().includes(términoLower);
        const coincideTags = imagen.tags.some(tag => tag.toLowerCase().includes(términoLower));
        
        return coincideTitulo || coincideAutor || coincideTags;
      });

      setImágenesFiltradas(filtradas);
      setImágenesMostradas(filtradas.slice(0, IMAGENES_POR_CARGA));
      setÍndiceActual(IMAGENES_POR_CARGA);
    }
  }, [imágenesIniciales]);

  const handleSearch = () => {
    setTerminoDeBúsqueda(inputValue);
    filtrarImágenes(inputValue);
  };

  const limpiarBúsqueda = () => {
    setInputValue('');
    setTerminoDeBúsqueda('');
    filtrarImágenes('');
  };

  const cargarMásImágenes = useCallback(() => {
    if (cargando || índiceActual >= imágenesFiltradas.length) return;

    setCargando(true);

    setTimeout(() => {
      const nuevoÍndice = índiceActual + IMAGENES_POR_CARGA;
      const nuevasImágenes = imágenesFiltradas.slice(índiceActual, nuevoÍndice);
      
      setImágenesMostradas(prev => [...prev, ...nuevasImágenes]);
      setÍndiceActual(nuevoÍndice);
      setCargando(false);
    }, 800);
  }, [cargando, índiceActual, imágenesFiltradas]);

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    
    if (isCloseToBottom && !cargando && índiceActual < imágenesFiltradas.length) {
      cargarMásImágenes();
    }
  };

  const abrirModal = (imagen: MockImage) => {
    setImagenSeleccionada(imagen);
    setModalAbierta(true);
  };

  const cerrarModal = () => {
    setModalAbierta(false);
    setImagenSeleccionada(null);
  };

  const calcularAlturaImagen = (índice: number, anchoColumna: number): number => {
    const alturas = [200, 250, 180, 300, 220, 270, 190, 240, 210, 260];
    return alturas[índice % alturas.length];
  };

  const windowWidth = Dimensions.get('window').width;
  const anchoColumna = (windowWidth - 48) / 2;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📷 Explorador de Imágenes</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="travel, food, design, naturaleza..."
            placeholderTextColor="#9CA3AF"
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            activeOpacity={0.7}
          >
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
          {términoDeBúsqueda && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={limpiarBúsqueda}
              activeOpacity={0.7}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {términoDeBúsqueda && (
          <View style={styles.searchInfo}>
            <Text style={styles.searchInfoText}>
              🔎 Buscando: "{términoDeBúsqueda}" - {imágenesFiltradas.length} resultados
            </Text>
          </View>
        )}
      </View>

      {imágenesFiltradas.length === 0 && términoDeBúsqueda && (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsEmoji}>😕</Text>
          <Text style={styles.noResultsText}>
            No se encontraron imágenes para "{términoDeBúsqueda}"
          </Text>
          <TouchableOpacity style={styles.resetButton} onPress={limpiarBúsqueda}>
            <Text style={styles.resetButtonText}>Ver todas las imágenes</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        <View style={styles.masonryContainer}>
          <View style={styles.column}>
            {imágenesMostradas
              .filter((_, index) => index % 2 === 0)
              .map((imagen, idx) => (
                <TouchableOpacity
                  key={imagen.id}
                  style={[
                    styles.imageCard,
                    { height: calcularAlturaImagen(idx, anchoColumna) }
                  ]}
                  onPress={() => abrirModal(imagen)}
                  activeOpacity={0.9}
                >
                  <img
                    src={imagen.url}
                    alt={imagen.titulo}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 12,
                    }}
                  />
                  <View style={styles.imageOverlay}>
                    <Text style={styles.imageTitle} numberOfLines={1}>
                      {imagen.titulo}
                    </Text>
                    <Text style={styles.imageAuthor}>
                      📸 {imagen.autor}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
          </View>

          <View style={styles.column}>
            {imágenesMostradas
              .filter((_, index) => index % 2 === 1)
              .map((imagen, idx) => (
                <TouchableOpacity
                  key={imagen.id}
                  style={[
                    styles.imageCard,
                    { height: calcularAlturaImagen(idx, anchoColumna) }
                  ]}
                  onPress={() => abrirModal(imagen)}
                  activeOpacity={0.9}
                >
                  <img
                    src={imagen.url}
                    alt={imagen.titulo}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 12,
                    }}
                  />
                  <View style={styles.imageOverlay}>
                    <Text style={styles.imageTitle} numberOfLines={1}>
                      {imagen.titulo}
                    </Text>
                    <Text style={styles.imageAuthor}>
                      📸 {imagen.autor}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        </View>

        {cargando && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Cargando más imágenes...</Text>
          </View>
        )}

        {!cargando && índiceActual >= imágenesFiltradas.length && imágenesMostradas.length > 0 && (
          <View style={styles.endMessage}>
            <Text style={styles.endMessageText}>
              ✓ Has visto todas las imágenes {términoDeBúsqueda ? `de "${términoDeBúsqueda}"` : ''}
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={modalAbierta}
        transparent={true}
        animationType="fade"
        onRequestClose={cerrarModal}
      >
        <Pressable style={styles.modalOverlay} onPress={cerrarModal}>
          <View style={styles.modalContent}>
            {imagenSeleccionada && (
              <>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={cerrarModal}
                  activeOpacity={0.7}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>

                <Text style={styles.modalTitle}>{imagenSeleccionada.titulo}</Text>

                <View style={styles.modalImageContainer}>
                  <img
                    src={imagenSeleccionada.url}
                    alt={imagenSeleccionada.titulo}
                    style={{
                      width: '100%',
                      maxHeight: '60vh',
                      objectFit: 'contain',
                      borderRadius: 12,
                    }}
                  />
                </View>

                <View style={styles.modalInfo}>
                  <View style={styles.authorInfo}>
                    <img
                      src={imagenSeleccionada.autorAvatar}
                      alt={imagenSeleccionada.autor}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        marginRight: 12,
                      }}
                    />
                    <View>
                      <Text style={styles.authorName}>
                        {imagenSeleccionada.autor}
                      </Text>
                      <Text style={styles.authorUsername}>
                        Fotógrafo profesional
                      </Text>
                    </View>
                  </View>
                  
                  {imagenSeleccionada.descripcion && (
                    <Text style={styles.imageDescription}>
                      {imagenSeleccionada.descripcion}
                    </Text>
                  )}

                  <View style={styles.tagsContainer}>
                    {imagenSeleccionada.tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>#{tag}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.imageStats}>
                    <Text style={styles.statText}>
                      ❤️ {imagenSeleccionada.likes} likes
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  searchButton: {
    width: 48,
    height: 48,
    backgroundColor: '#3B82F6',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  searchButtonText: {
    fontSize: 20,
  },
  clearButton: {
    width: 48,
    height: 48,
    backgroundColor: '#EF4444',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  searchInfo: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
  searchInfoText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  noResultsEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  resetButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  masonryContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  column: {
    flex: 1,
    gap: 16,
  },
  imageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  imageTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  imageAuthor: {
    color: '#E5E7EB',
    fontSize: 11,
    fontWeight: '500',
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  endMessage: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  endMessageText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 800,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    backgroundColor: '#EF4444',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    paddingRight: 50,
  },
  modalImageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  modalInfo: {
    gap: 16,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  authorUsername: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  imageDescription: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#1E40AF',
    fontSize: 12,
    fontWeight: '600',
  },
  imageStats: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  statText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});
