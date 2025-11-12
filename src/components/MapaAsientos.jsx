import FilaAsientos from './FilaAsientos';

const MapaAsientos = ({ asientosPorFila, alClicAsiento }) => {
  return (
    <div className="mapa-asientos">
      {Object.entries(asientosPorFila).map(([fila, asientosDeFila]) => (
        <FilaAsientos key={fila} fila={fila} asientos={asientosDeFila} alClicAsiento={alClicAsiento} />
      ))}
    </div>
  );
};

export default MapaAsientos;
