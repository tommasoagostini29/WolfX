// src/components/TradeModal.jsx
import React, { useState } from "react";
import { db } from "../firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import "./TradeModal.css";

export default function TradeModal({ coin, userData, currentUser, onClose, initialMode = "buy" }) {
  const [mode, setMode] = useState(initialMode);
  const [amountInput, setAmountInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const price = coin.current_price || coin.currentPrice;
  const ownedAmount = userData?.portfolio?.[coin.id] || 0;
  const userBalance = userData?.balance || 0;
  const isBuying = mode === "buy";
  
  const val = parseFloat(amountInput);
  
  const cryptoAmount = isBuying ? (val / price) : val;
  const usdValue = isBuying ? val : (val * price);

  const handleSetMax = () => {
    setAmountInput(isBuying ? userBalance.toString() : ownedAmount.toString());
  };

  async function handleTransaction(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!val || val <= 0) {
      setError("Inserisci un importo valido.");
      setLoading(false); 
      return;
    }

    if (isBuying && val > userBalance) {
      setError("Fondi insufficienti.");
      setLoading(false); 
      return;
    }

    if (!isBuying && val > ownedAmount) {
      setError(`Quantità di ${coin.symbol.toUpperCase()} insufficiente.`);
      setLoading(false); 
      return;
    }

    try {
      const userRef = doc(db, "users", currentUser.uid);

      await updateDoc(userRef, {
        balance: increment(isBuying ? -val : usdValue),
        [`portfolio.${coin.id}`]: increment(isBuying ? cryptoAmount : -val)
      });

      // Consider replacing this with a proper toast notification system later
      alert(isBuying 
        ? `Acquistati ${cryptoAmount.toFixed(6)} ${coin.symbol.toUpperCase()}`
        : `Venduti ${val} ${coin.symbol.toUpperCase()} per $${usdValue.toFixed(2)}`
      );
      
      onClose();
    } catch (err) {
      console.error("Transaction Error:", err);
      setError("Transazione fallita. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        
        <div className="modal-tabs">
          <button 
            className={`modal-tab ${isBuying ? "active-buy" : ""}`}
            onClick={() => { setMode("buy"); setAmountInput(""); setError(""); }}
          >
            COMPRA
          </button>
          <button 
            className={`modal-tab ${!isBuying ? "active-sell" : ""}`}
            onClick={() => { setMode("sell"); setAmountInput(""); setError(""); }}
          >
            VENDI
          </button>
        </div>

        <h3 className="modal-title">{coin.name}</h3>
        <p className="modal-price">1 {coin.symbol.toUpperCase()} = ${price.toLocaleString()}</p>
        
        <div className="modal-balances">
          <p>Disponibile: <strong>${userBalance.toLocaleString()}</strong></p>
          <p>Possiedi: <strong>{ownedAmount.toFixed(8)} {coin.symbol.toUpperCase()}</strong></p>
        </div>

        {error && <p className="modal-error">{error}</p>}

        <form onSubmit={handleTransaction}>
          <label className="modal-label">
            {isBuying ? "Importo in USD ($)" : `Quantità ${coin.symbol.toUpperCase()}`}
          </label>
          
          <div className="input-container">
            <input 
              type="number" 
              step="any"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              placeholder="0.00"
              className="modal-input"
            />
            <button 
              type="button"
              onClick={handleSetMax}
              className="max-button"
            >
              MAX
            </button>
          </div>
          
          <div className={`modal-preview ${isBuying ? "text-buy" : "text-sell"}`}>
            {isBuying 
              ? `Riceverai ≈ ${(val > 0 ? (val / price).toFixed(6) : 0)} ${coin.symbol.toUpperCase()}`
              : `Incasserai ≈ $${(val > 0 ? (val * price).toFixed(2) : 0)}`
            }
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Annulla
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className={`btn-confirm ${isBuying ? "bg-buy" : "bg-sell"}`}
            >
              {loading ? "Elaborazione..." : (isBuying ? "CONFERMA" : "VENDI")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}