import "./Offline.css";

const Offline = () => {
  const ricaricaPagina = () => {
    window.location.reload();
  };

  return (
    <div className="container-offline">
      <div className="offline-icon">📡</div>
      <h2>Sei Offline</h2>
      <p className="offline-text">
        Sembra che tu sia senza internet. WolfX ha bisogno della rete per i dati di mercato in tempo reale.
      </p>
      <button onClick={ricaricaPagina} className="offline-button">
        Riprova
      </button>
    </div>
  );
};

export default Offline;