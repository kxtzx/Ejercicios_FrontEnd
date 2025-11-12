
import './Asiento.css';

const Asiento = ({ asiento, onClick }) => {
  const { estado, id } = asiento;
  const cls = estado === 'ocupado' ? 'asiento-btn asiento-ocupado' : estado === 'seleccionado' ? 'asiento-btn asiento-seleccionado' : 'asiento-btn asiento-libre';

  return (
    <button onClick={onClick} disabled={estado === 'ocupado'} className={cls}>
      {id}
    </button>
  );
};

export default Asiento;
