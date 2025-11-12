import { useState } from 'react';
import MapaAsientos from './components/MapaAsientos';
import UserProfileCard from './components/UserProfileCard';
import './components/UserProfileCard.css';
import profileData from './data/profileData.json';

// Helper: create a list of seats with random occupied/free status but guarantee at least minFree free seats
function generateInitialSeats(rows = ['A','B','C','D'], seatsPerRow = 6, minFree = 4) {
  const total = rows.length * seatsPerRow;
  // Start by creating all seats as 'libre'
  const seats = [];
  rows.forEach(row => {
    for (let i = 1; i <= seatsPerRow; i++) {
      seats.push({
        id: `${row}${i}`,
        fila: row,
        numero: i,
        estado: 'libre'
      });
    }
  });

  // Decide how many should be occupied: random between 0 and total - minFree
  const maxOccupied = Math.max(0, total - minFree);
  const occupiedCount = Math.floor(Math.random() * (maxOccupied + 1));

  // Randomly pick occupiedCount indices to mark as ocupado
  const indices = Array.from({ length: total }, (_, i) => i);
  for (let k = 0; k < occupiedCount; k++) {
    const pickIndex = Math.floor(Math.random() * indices.length);
    const seatIndex = indices.splice(pickIndex, 1)[0];
    seats[seatIndex].estado = 'ocupado';
  }

  return seats;
}

export default function App() {
  const [asientos, setAsientos] = useState(() => generateInitialSeats());

  const handleRegenerate = () => setAsientos(generateInitialSeats());

  const alClicAsiento = (idAsiento) => {
    setAsientos(asientosActuales => 
      asientosActuales.map(asiento => {
        if (asiento.id === idAsiento && asiento.estado !== 'ocupado') {
          return {
            ...asiento,
            estado: asiento.estado === 'libre' ? 'seleccionado' : 'libre'
          };
        }
        return asiento;
      })
    );
  };

  const counts = asientos.reduce((acc, s) => {
    acc[s.estado] = (acc[s.estado] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="App" style={{ padding: 24 }}>
      <h1>Ejercicios para Frontend</h1>
      <div style={{ marginBottom: 16 }}>
        <button onClick={handleRegenerate}>Regenerar mapa</button>
        <div style={{ marginTop: 8 }}>
          <strong>Resumen:</strong> Libre: {counts.libre || 0} — Ocupado: {counts.ocupado || 0} — Seleccionado: {counts.seleccionado || 0}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
        <UserProfileCard profileData={profileData} />
        {/* Agrupar asientos por fila */}
        <MapaAsientos
          asientosPorFila={asientos.reduce((acc, s) => {
            if (!acc[s.fila]) acc[s.fila] = [];
            acc[s.fila].push(s);
            return acc;
          }, {})}
          alClicAsiento={alClicAsiento}
        />
      </div>
    </div>
  );
}
