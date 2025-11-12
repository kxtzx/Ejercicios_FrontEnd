import { Text, View } from '@/components/Themed';
import React, { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import MapaAsientos from '../../src/components/MapaAsientos';

type Asiento = {
  id: string;
  fila: string;
  numero: number;
  estado: 'libre' | 'ocupado' | 'seleccionado';
};

// Genera asientos asegurando que quede entre 1 y maxFree asientos libres
function generateInitialSeats(rows: string[] = ['A','B','C','D'], seatsPerRow = 6, maxFree = 6): Asiento[] {
  const total = rows.length * seatsPerRow;
  const maxAllowedFree = Math.max(1, Math.min(maxFree, total));
  // Elegir un número aleatorio de asientos libres entre 1 y maxAllowedFree
  const freeCount = Math.floor(Math.random() * maxAllowedFree) + 1; // [1, maxAllowedFree]

  // Crear todos los asientos
  const seats: Asiento[] = [];
  rows.forEach(row => {
    for (let i = 1; i <= seatsPerRow; i++) {
      seats.push({ id: `${row}${i}`, fila: row, numero: i, estado: 'ocupado' });
    }
  });

  // Elegir freeCount índices al azar para marcar como 'libre'
  const indices = Array.from({ length: total }, (_, i) => i);
  for (let k = 0; k < freeCount; k++) {
    const pick = Math.floor(Math.random() * indices.length);
    const idx = indices.splice(pick, 1)[0];
    seats[idx].estado = 'libre';
  }

  return seats;
}

export default function TabOneScreen() {
  // Ejecutar la generación solo una vez al montar
  const [asientos, setAsientos] = useState(() => generateInitialSeats());

  const alClicAsiento = (idAsiento: string) => {
    setAsientos(prev => prev.map(a => {
      if (a.id === idAsiento && a.estado !== 'ocupado') {
        return { ...a, estado: a.estado === 'libre' ? 'seleccionado' : 'libre' };
      }
      return a;
    }));
  };

  // Agrupar por fila para MapaAsientos
  const asientosPorFila = useMemo(() => {
    return asientos.reduce((acc, s) => {
      if (!acc[s.fila]) acc[s.fila] = [];
      acc[s.fila].push(s);
      return acc;
    }, {} as Record<string, Asiento[]>);
  }, [asientos]);

  const counts = asientos.reduce((acc, s) => {
    acc[s.estado] = (acc[s.estado] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ejercicios para Frontend</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <View style={{ marginTop: 20, width: '90%' }}>
        <Text style={{ fontWeight: '700', marginBottom: 8 }}>Mapa de Asientos (Interactivo)</Text>
        <MapaAsientos asientosPorFila={asientosPorFila} alClicAsiento={alClicAsiento} />
        <Text style={{ marginTop: 12 }}><strong>Resumen:</strong> Libre: {counts.libre || 0} — Ocupado: {counts.ocupado || 0} — Seleccionado: {counts.seleccionado || 0}</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
