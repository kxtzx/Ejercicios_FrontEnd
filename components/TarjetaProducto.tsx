import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

interface TarjetaProductoProps {
  producto: Producto;
}

const TarjetaProducto: React.FC<TarjetaProductoProps> = ({ producto }) => {
  /**
   * Formatea un número a moneda local
   */
  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(valor);
  };

  /**
   * Calcula el precio final con descuento aplicado
   */
  const calcularPrecioFinal = (): number => {
    if (producto.descuentoPorcentaje > 0) {
      const descuento = (producto.precioBase * producto.descuentoPorcentaje) / 100;
      return producto.precioBase - descuento;
    }
    return producto.precioBase;
  };

  /**
   * Renderiza las estrellas del rating
   */
  const renderizarEstrellas = () => {
    const estrellas = [];
    const ratingRedondeado = Math.round(producto.rating * 2) / 2; // Redondear a .5

    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(ratingRedondeado)) {
        // Estrella completa
        estrellas.push(
          <Text key={i} style={styles.estrella}>★</Text>
        );
      } else if (i === Math.ceil(ratingRedondeado) && ratingRedondeado % 1 !== 0) {
        // Media estrella
        estrellas.push(
          <Text key={i} style={styles.estrella}>☆</Text>
        );
      } else {
        // Estrella vacía
        estrellas.push(
          <Text key={i} style={styles.estrellaVacia}>☆</Text>
        );
      }
    }

    return estrellas;
  };

  const precioFinal = calcularPrecioFinal();
  const tieneDescuento = producto.descuentoPorcentaje > 0;

  return (
    <View style={styles.tarjeta}>
      {/* Badge de Oferta */}
      {tieneDescuento && (
        <View style={styles.badgeOferta}>
          <Text style={styles.badgeTexto}>
            ¡OFERTA! -{producto.descuentoPorcentaje}%
          </Text>
        </View>
      )}

      {/* Imagen del Producto */}
      <View style={styles.imagenContainer}>
        <img
          src={producto.imagen}
          alt={producto.titulo}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </View>

      {/* Contenido de la Tarjeta */}
      <View style={styles.contenido}>
        {/* Categoría */}
        <Text style={styles.categoria}>{producto.categoria}</Text>

        {/* Título */}
        <Text style={styles.titulo} numberOfLines={2}>
          {producto.titulo}
        </Text>

        {/* Descripción */}
        <Text style={styles.descripcion} numberOfLines={2}>
          {producto.descripcion}
        </Text>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <View style={styles.estrellas}>
            {renderizarEstrellas()}
          </View>
          <Text style={styles.ratingNumero}>({producto.rating})</Text>
        </View>

        {/* Precio */}
        <View style={styles.precioContainer}>
          {tieneDescuento ? (
            <View>
              <Text style={styles.precioTachado}>
                {formatearMoneda(producto.precioBase)}
              </Text>
              <Text style={styles.precioFinal}>
                {formatearMoneda(precioFinal)}
              </Text>
            </View>
          ) : (
            <Text style={styles.precioFinal}>
              {formatearMoneda(producto.precioBase)}
            </Text>
          )}
        </View>

        {/* Estado de Stock */}
        <View style={styles.stockContainer}>
          <View style={[
            styles.stockBadge,
            producto.stock ? styles.stockBadgeEnStock : styles.stockBadgeSinStock
          ]}>
            <Text style={[
              styles.stockTexto,
              producto.stock ? styles.stockTextoEnStock : styles.stockTextoSinStock
            ]}>
              {producto.stock ? '✓ En Stock' : '✕ Sin Stock'}
            </Text>
          </View>
        </View>

        {/* Botón Agregar */}
        <TouchableOpacity
          style={[
            styles.boton,
            !producto.stock && styles.botonDeshabilitado
          ]}
          disabled={!producto.stock}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.botonTexto,
            !producto.stock && styles.botonTextoDeshabilitado
          ]}>
            {producto.stock ? '🛒 Agregar al Carrito' : 'No Disponible'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  badgeOferta: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 10,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  badgeTexto: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  imagen: {
    width: '100%',
    height: 220,
    backgroundColor: '#F3F4F6',
  },
  imagenContainer: {
    width: '100%',
    height: 220,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
  },
  contenido: {
    padding: 16,
  },
  categoria: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 26,
  },
  descripcion: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  estrellas: {
    flexDirection: 'row',
    marginRight: 6,
  },
  estrella: {
    fontSize: 18,
    color: '#F59E0B',
    marginRight: 2,
  },
  estrellaVacia: {
    fontSize: 18,
    color: '#D1D5DB',
    marginRight: 2,
  },
  ratingNumero: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  precioContainer: {
    marginBottom: 12,
  },
  precioTachado: {
    fontSize: 16,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  precioFinal: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10B981',
  },
  stockContainer: {
    marginBottom: 16,
  },
  stockBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 2,
  },
  stockBadgeEnStock: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  stockBadgeSinStock: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  stockTexto: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  stockTextoEnStock: {
    color: '#059669',
  },
  stockTextoSinStock: {
    color: '#DC2626',
  },
  boton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  botonDeshabilitado: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
  },
  botonTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botonTextoDeshabilitado: {
    color: '#9CA3AF',
  },
});

export default TarjetaProducto;
