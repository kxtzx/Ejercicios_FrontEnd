import { Text, View } from '@/components/Themed';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import MapaAsientos from '../../src/components/MapaAsientos';

type EstadoAsiento = 'libre' | 'ocupado' | 'seleccionado';

type Asiento = {
  id: string;
  fila: string;
  numero: number;
  estado: EstadoAsiento;
};

interface AsientoStats {
  libre: number;
  ocupado: number;
  seleccionado: number;
}

// Configuración del mapa de asientos
const CONFIGURACION = {
  filas: ['A', 'B', 'C', 'D', 'E'],
  asientosPorFila: 8,
  maxAsientosLibres: 10,
};

/**
 * Genera asientos iniciales con estado aleatorio
 * Asegura que haya entre 1 y maxFree asientos libres
 */
function generateInitialSeats(
  rows: string[] = CONFIGURACION.filas,
  seatsPerRow: number = CONFIGURACION.asientosPorFila,
  maxFree: number = CONFIGURACION.maxAsientosLibres
): Asiento[] {
  const total = rows.length * seatsPerRow;
  const maxAllowedFree = Math.max(1, Math.min(maxFree, total));
  const freeCount = Math.floor(Math.random() * maxAllowedFree) + 1;

  // Crear todos los asientos con estado 'ocupado' por defecto
  const seats: Asiento[] = rows.flatMap((row) =>
    Array.from({ length: seatsPerRow }, (_, i) => ({
      id: `${row}${i + 1}`,
      fila: row,
      numero: i + 1,
      estado: 'ocupado' as EstadoAsiento,
    }))
  );

  // Seleccionar índices aleatorios para marcar como 'libre'
  const availableIndices = Array.from({ length: total }, (_, i) => i);
  
  for (let k = 0; k < freeCount; k++) {
    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    const seatIndex = availableIndices.splice(randomIndex, 1)[0];
    seats[seatIndex].estado = 'libre';
  }

  return seats;
}

export default function TabTwoScreen() {
  // Ejecutar la generación solo una vez al montar el componente
  const [asientos, setAsientos] = useState<Asiento[]>(() => generateInitialSeats());

  /**
   * Maneja el click en un asiento
   * Alterna entre 'libre' y 'seleccionado' (los asientos ocupados no se pueden modificar)
   */
  const alClicAsiento = useCallback((idAsiento: string) => {
    setAsientos((prevAsientos) =>
      prevAsientos.map((asiento) => {
        if (asiento.id === idAsiento && asiento.estado !== 'ocupado') {
          return {
            ...asiento,
            estado: asiento.estado === 'libre' ? 'seleccionado' : 'libre',
          };
        }
        return asiento;
      })
    );
  }, []);

  // Agrupar asientos por fila para el componente MapaAsientos
  const asientosPorFila = useMemo(() => {
    return asientos.reduce((acc, asiento) => {
      if (!acc[asiento.fila]) {
        acc[asiento.fila] = [];
      }
      acc[asiento.fila].push(asiento);
      return acc;
    }, {} as Record<string, Asiento[]>);
  }, [asientos]);

  // Calcular estadísticas de asientos
  const estadisticas = useMemo<AsientoStats>(() => {
    return asientos.reduce(
      (acc, asiento) => {
        acc[asiento.estado]++;
        return acc;
      },
      { libre: 0, ocupado: 0, seleccionado: 0 }
    );
  }, [asientos]);

  const totalAsientos = asientos.length;
  const porcentajeSeleccionado = Math.round((estadisticas.seleccionado / totalAsientos) * 100);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>MUCHO CINE</Text>
          <Text style={styles.titleSubtext}>Selecciona tus butacas</Text>
          <Text style={styles.movieInfo}>Sala 7 • 11:11 AM</Text>
        </View>
        
        <View
          style={styles.separator}
          lightColor="#E5E7EB"
          darkColor="rgba(255,255,255,0.1)"
        />

        <View style={styles.contentContainer}>
          <MapaAsientos 
            asientosPorFila={asientosPorFila} 
            alClicAsiento={alClicAsiento} 
          />

          {/* Panel de resumen estilo ticket de cine */}
          <View style={styles.ticketContainer}>
            <View style={styles.ticketHeader}>
              <Text style={styles.ticketTitle}>🎫 Tu Reserva</Text>
            </View>
            
            <View style={styles.ticketBody}>
              <View style={styles.ticketRow}>
                <Text style={styles.ticketLabel}>Asientos Disponibles:</Text>
                <View style={styles.ticketBadgeGreen}>
                  <Text style={styles.ticketBadgeText}>{estadisticas.libre}</Text>
                </View>
              </View>
              
              <View style={styles.ticketRow}>
                <Text style={styles.ticketLabel}>Asientos Ocupados:</Text>
                <View style={styles.ticketBadgeGray}>
                  <Text style={styles.ticketBadgeText}>{estadisticas.ocupado}</Text>
                </View>
              </View>
              
              <View style={styles.ticketDivider} />
              
              <View style={styles.ticketRow}>
                <Text style={styles.ticketLabelBold}>Tus Asientos:</Text>
                <View style={styles.ticketBadgeOrange}>
                  <Text style={styles.ticketBadgeTextBold}>{estadisticas.seleccionado}</Text>
                </View>
              </View>
              
              {estadisticas.seleccionado > 0 && (
                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>Total a Pagar:</Text>
                  <Text style={styles.priceValue}>
                    ${(estadisticas.seleccionado * 12.50).toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Botón de confirmación */}
          {estadisticas.seleccionado > 0 && (
            <TouchableOpacity 
              style={styles.confirmButton}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>
                ✓ Confirmar Reserva ({estadisticas.seleccionado} asiento{estadisticas.seleccionado > 1 ? 's' : ''})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F3F4F6',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 16,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
    marginBottom: 4,
    letterSpacing: 2,
    textShadowColor: 'rgba(245, 158, 11, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  titleSubtext: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000000',
    fontWeight: '600',
  },
  movieInfo: {
    fontSize: 13,
    textAlign: 'center',
    color: '#1F2937',
    marginTop: 4,
    fontWeight: '500',
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '85%',
    backgroundColor: '#D1D5DB',
  },
  contentContainer: {
    width: '100%',
    maxWidth: 700,
    alignItems: 'center',
  },
  
  // Estilos del ticket de cine
  ticketContainer: {
    marginTop: 30,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  ticketHeader: {
    backgroundColor: '#F59E0B',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#D97706',
    borderStyle: 'dashed',
  },
  ticketTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  ticketBody: {
    padding: 20,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  ticketLabel: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  ticketLabelBold: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
  ticketBadgeGreen: {
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 45,
    alignItems: 'center',
  },
  ticketBadgeGray: {
    backgroundColor: '#6B7280',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 45,
    alignItems: 'center',
  },
  ticketBadgeOrange: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 45,
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  ticketBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  ticketBadgeTextBold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  ticketDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  priceContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
    borderStyle: 'dashed',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 17,
    color: '#000000',
    fontWeight: 'bold',
  },
  priceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10B981',
    textShadowColor: 'rgba(16, 185, 129, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  
  // Botón de confirmación
  confirmButton: {
    marginTop: 24,
    paddingVertical: 18,
    paddingHorizontal: 32,
    backgroundColor: '#10B981',
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
});