import { WifiOff } from "lucide-react";
import "./Offline.css";

const Offline = () => {
  const ricaricaPagina = () => {
    window.location.reload(); /* ricarica la pagina */
  };

  return (
    <div className="container-offline">
      <WifiOff size={64} color="#ff3860" className="offline-icon" />
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