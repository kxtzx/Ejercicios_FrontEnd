import Asiento from './Asiento';

const FilaAsientos = ({ fila, asientos, alClicAsiento }) => {
  // opcional: insertar un pasillo en la mitad
  const mid = Math.ceil(asientos.length / 2);
  return (
    <div className="fila-asientos" style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
      <div style={{ width: 28, marginRight: 8, fontWeight: 700 }}>{fila}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {asientos.slice(0, mid).map(a => (
          <Asiento key={a.id} asiento={a} onClick={() => alClicAsiento(a.id)} />
        ))}
      </div>

      <div style={{ width: 40 }} /> {/* pasillo */}

      <div style={{ display: 'flex', gap: 8 }}>
        {asientos.slice(mid).map(a => (
          <Asiento key={a.id} asiento={a} onClick={() => alClicAsiento(a.id)} />
        ))}
      </div>
    </div>
  );
};

export default FilaAsientos;
