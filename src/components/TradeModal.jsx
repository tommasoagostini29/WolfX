import { useState } from "react";
import { db } from "../firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import toast from "react-hot-toast";
import "./TradeModal.css";

const TradeModal = ({ coin, userData, currentUser, onClose, initialMode = "buy" }) => {
  /* stati per gestire cosa sta facendo l'utente dentro il modale */
  const [modalita, setModalita] = useState(initialMode);
  const [inputImporto, setInputImporto] = useState("");
  const [caricamento, setCaricamento] = useState(false);
  const [errore, setErrore] = useState("");

  const prezzoAttuale = coin.current_price || coin.currentPrice; /* coingecko usa entrambi */
  const quantitaPosseduta = userData?.portfolio?.[coin.id] || 0;
  const saldoUtente = userData?.balance || 0;
  const staComprando = modalita === "buy";
  
  const valoreNumerico = parseFloat(inputImporto);
  
  /* tasse di cambio dollari-crypto */
  const quantitaCrypto = staComprando ? (valoreNumerico / prezzoAttuale) : valoreNumerico;
  const valoreDollari = staComprando ? valoreNumerico : (valoreNumerico * prezzoAttuale);

  const impostaMassimo = () => {
    setInputImporto(staComprando ? saldoUtente.toString() : quantitaPosseduta.toString());
  };

  const gestisciTransazione = async (e) => {
    e.preventDefault();
    setErrore("");
    setCaricamento(true);

    /* importo maggiore di 0 */
    if (!valoreNumerico || valoreNumerico <= 0) {
      setErrore("Inserisci un importo valido.");
      setCaricamento(false); 
      return;
    }

    /* hai abbastanza soldi */
    if (staComprando && valoreNumerico > saldoUtente) {
      setErrore("Fondi insufficienti.");
      setCaricamento(false); 
      return;
    }

    /* hai abbastanza crypto */
    if (!staComprando && valoreNumerico > quantitaPosseduta) {
      setErrore(`Quantità di ${coin.symbol.toUpperCase()} insufficiente.`);
      setCaricamento(false); 
      return;
    }

    try {
      const riferimentoUtente = doc(db, "users", currentUser.uid);

      /* l'utilizzo di increment evita bug di click doppi avuti durante lo sviluppo */
      await updateDoc(riferimentoUtente, {
        balance: increment(staComprando ? -valoreNumerico : valoreDollari),
        [`portfolio.${coin.id}`]: increment(staComprando ? quantitaCrypto : -valoreNumerico)
      });

      toast.success(staComprando 
        ? `Acquistati ${quantitaCrypto.toFixed(6)} ${coin.symbol.toUpperCase()}`
        : `Venduti ${valoreNumerico} ${coin.symbol.toUpperCase()} per $${valoreDollari.toFixed(2)}`
      );
      
      onClose();
    } catch (err) {
      console.error("Problema con la transazione:", err);
      setErrore("Transazione fallita. Riprova più tardi.");
    } finally {
      setCaricamento(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        
        {/* due bottoni per compra o vendi */}
        <div className="modal-tabs">
          <button 
            className={`modal-tab ${staComprando ? "active-buy" : ""}`}
            onClick={() => { setModalita("buy"); setInputImporto(""); setErrore(""); }}
          >
            COMPRA
          </button>
          <button 
            className={`modal-tab ${!staComprando ? "active-sell" : ""}`}
            onClick={() => { setModalita("sell"); setInputImporto(""); setErrore(""); }}
          >
            VENDI
          </button>
        </div>

        <h3 className="modal-title">{coin.name}</h3>
        <p className="modal-price">1 {coin.symbol.toUpperCase()} = ${prezzoAttuale.toLocaleString()}</p>
        
        <div className="modal-balances">
          <p>Disponibile: <strong>${saldoUtente.toLocaleString()}</strong></p>
          <p>Possiedi: <strong>{quantitaPosseduta.toFixed(8)} {coin.symbol.toUpperCase()}</strong></p> {/* 8 decimali come tipico delle crypto */}
        </div>

        {errore && <p className="modal-error">{errore}</p>}

        <form onSubmit={gestisciTransazione}>
          <label className="modal-label">
            {staComprando ? "Importo in USD ($)" : `Quantità ${coin.symbol.toUpperCase()}`}
          </label>
          
          <div className="input-container">
            <input 
              type="number" 
              step="any"
              value={inputImporto}
              onChange={(e) => setInputImporto(e.target.value)}
              placeholder="0.00"
              className="modal-input"
            />
            <button 
              type="button"
              onClick={impostaMassimo}
              className="max-button"
            >
              MAX
            </button>
          </div>
          
          <div className={`modal-preview ${staComprando ? "text-buy" : "text-sell"}`}>
            {staComprando 
              ? `Riceverai ≈ ${(valoreNumerico > 0 ? (valoreNumerico / prezzoAttuale).toFixed(6) : 0)} ${coin.symbol.toUpperCase()}`
              : `Incasserai ≈ $${(valoreNumerico > 0 ? (valoreNumerico * prezzoAttuale).toFixed(2) : 0)}`
            }
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Annulla
            </button>
            <button 
              type="submit" 
              disabled={caricamento} 
              className={`btn-confirm ${staComprando ? "bg-buy" : "bg-sell"}`}
            >
              {caricamento ? "Elaborazione..." : (staComprando ? "CONFERMA" : "VENDI")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeModal;