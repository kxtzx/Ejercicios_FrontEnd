import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MapaAsientos = ({ asientosPorFila, alClicAsiento }) => {
  const filas = Object.keys(asientosPorFila).sort();
  
  // Obtener el color según el estado del asiento
  const getAsientoStyle = (estado) => {
    switch (estado) {
      case 'libre':
        return styles.asientoLibre;
      case 'ocupado':
        return styles.asientoOcupado;
      case 'seleccionado':
        return styles.asientoSeleccionado;
      default:
        return styles.asientoLibre;
    }
  };

  return (
    <View style={styles.container}>
      {/* Pantalla/Escenario con gradiente */}
      <View style={styles.escenarioContainer}>
        <View style={styles.escenarioGradiente} />
        <Text style={styles.escenarioTexto}>🎬 PANTALLA / ESCENARIO 🎬</Text>
      </View>

      {/* Leyenda visual */}
      <View style={styles.leyendaContainer}>
        <View style={styles.leyendaItem}>
          <View style={[styles.leyendaCuadro, styles.asientoLibre]} />
          <Text style={styles.leyendaTexto}>Libre</Text>
        </View>
        <View style={styles.leyendaItem}>
          <View style={[styles.leyendaCuadro, styles.asientoOcupado]} />
          <Text style={styles.leyendaTexto}>Ocupado</Text>
        </View>
        <View style={styles.leyendaItem}>
          <View style={[styles.leyendaCuadro, styles.asientoSeleccionado]} />
          <Text style={styles.leyendaTexto}>Seleccionado</Text>
        </View>
      </View>

      {/* Mapa de asientos con pasillo central */}
      <View style={styles.mapaContainer}>
        {filas.map((fila) => {
          const asientosDeFila = asientosPorFila[fila];
          const mitad = Math.ceil(asientosDeFila.length / 2);
          const ladoIzquierdo = asientosDeFila.slice(0, mitad);
          const ladoDerecho = asientosDeFila.slice(mitad);

          return (
            <View key={fila} style={styles.filaContainer}>
              {/* Label izquierdo */}
              <Text style={styles.filaLabel}>{fila}</Text>

              {/* Asientos lado izquierdo */}
              <View style={styles.ladoAsientos}>
                {ladoIzquierdo.map((asiento) => (
                  <TouchableOpacity
                    key={asiento.id}
                    style={styles.asientoWrapper}
                    onPress={() => alClicAsiento(asiento.id)}
                    disabled={asiento.estado === 'ocupado'}
                    activeOpacity={0.7}
                  >
                    {/* Respaldo de la butaca */}
                    <View style={[
                      styles.asientoRespaldo,
                      getAsientoStyle(asiento.estado),
                    ]}>
                      <Text style={[
                        styles.asientoTexto,
                        asiento.estado === 'seleccionado' && styles.asientoTextoSeleccionado,
                        asiento.estado === 'ocupado' && styles.asientoTextoOcupado,
                      ]}>
                        {asiento.numero}
                      </Text>
                    </View>
                    {/* Base/asiento de la butaca */}
                    <View style={[
                      styles.asientoBase,
                      getAsientoStyle(asiento.estado),
                    ]} />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Pasillo central */}
              <View style={styles.pasillo} />

              {/* Asientos lado derecho */}
              <View style={styles.ladoAsientos}>
                {ladoDerecho.map((asiento) => (
                  <TouchableOpacity
                    key={asiento.id}
                    style={styles.asientoWrapper}
                    onPress={() => alClicAsiento(asiento.id)}
                    disabled={asiento.estado === 'ocupado'}
                    activeOpacity={0.7}
                  >
                    {/* Respaldo de la butaca */}
                    <View style={[
                      styles.asientoRespaldo,
                      getAsientoStyle(asiento.estado),
                    ]}>
                      <Text style={[
                        styles.asientoTexto,
                        asiento.estado === 'seleccionado' && styles.asientoTextoSeleccionado,
                        asiento.estado === 'ocupado' && styles.asientoTextoOcupado,
                      ]}>
                        {asiento.numero}
                      </Text>
                    </View>
                    {/* Base/asiento de la butaca */}
                    <View style={[
                      styles.asientoBase,
                      getAsientoStyle(asiento.estado),
                    ]} />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Label derecho */}
              <Text style={styles.filaLabel}>{fila}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 20,
  },
  
  // Estilos del Escenario (estilo cine real)
  escenarioContainer: {
    marginBottom: 35,
    alignItems: 'center',
    width: '100%',
  },
  escenarioGradiente: {
    width: '95%',
    height: 12,
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 12,
    borderWidth: 2,
    borderColor: '#374151',
    borderBottomWidth: 0,
  },
  escenarioTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // Estilos de la Leyenda (estilo cine)
  leyendaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 28,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  leyendaItem: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  leyendaCuadro: {
    width: 36,
    height: 38,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderWidth: 2.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  leyendaTexto: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
    textTransform: 'uppercase',
  },

  // Estilos del Mapa (perspectiva de cine)
  mapaContainer: {
    gap: 10,
    paddingHorizontal: 8,
  },
  filaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 2,
  },
  filaLabel: {
    width: 32,
    height: 32,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    backgroundColor: '#374151',
    borderRadius: 16,
    lineHeight: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  ladoAsientos: {
    flexDirection: 'row',
    gap: 8,
  },
  pasillo: {
    width: 32,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },

  // Estilos de Asientos (forma de butaca real)
  asientoWrapper: {
    alignItems: 'center',
    gap: 2,
  },
  asientoRespaldo: {
    width: 40,
    height: 42,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
  },
  asientoBase: {
    width: 44,
    height: 12,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderWidth: 2.5,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  asientoLibre: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  asientoOcupado: {
    backgroundColor: '#6B7280',
    borderColor: '#4B5563',
    opacity: 0.5,
  },
  asientoSeleccionado: {
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
  },
  
  // Estilos de texto de asientos (números más visibles)
  asientoTexto: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  asientoTextoOcupado: {
    color: '#E5E7EB',
    opacity: 0.7,
  },
  asientoTextoSeleccionado: {
    color: '#FFFFFF',
  },
});

export default MapaAsientos;
