import TarjetaProducto from '@/components/TarjetaProducto';
import { Text, View } from '@/components/Themed';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import productosData from '../../src/data/productos.json';

interface Producto {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  precioBase: number;
  descuentoPorcentaje: number;
  rating: number;
  stock: boolean;
  categoria: string;
}

export default function TabThreeScreen() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarProductos = () => {
      try {
        setProductos(productosData as Producto[]);
        setCargando(false);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setCargando(false);
      }
    };

    setTimeout(cargarProductos, 300);
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>🛍️ Catálogo de Productos</Text>
        <Text style={styles.subtitle}>Ejercicio 3 - Tarjetas de Producto</Text>
      </View>

      <View
        style={styles.separator}
        lightColor="#E5E7EB"
        darkColor="rgba(255,255,255,0.1)"
      />

      {cargando ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando productos...</Text>
        </View>
      ) : (
        <>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              {productos.length} productos disponibles
            </Text>
          </View>

          {productos.map((producto) => (
            <TarjetaProducto key={producto.id} producto={producto} />
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    paddingVertical: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '85%',
    alignSelf: 'center',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
});
