// src/components/TradeModal.jsx
import React, { useState } from "react";
import { db } from "../firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

export default function TradeModal({ coin, userData, currentUser, onClose, initialMode = "buy" }) {
  const [mode, setMode] = useState(initialMode); // "buy" o "sell"
  const [amountInput, setAmountInput] = useState(""); // Input dell'utente
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Dati utili
  const price = coin.current_price || coin.currentPrice; // Gestiamo entrambi i formati
  const ownedAmount = userData?.portfolio?.[coin.id] || 0; // Quante ne possiedi
  const userBalance = userData?.balance || 0;

  // Calcoli dinamici
  const isBuying = mode === "buy";
  
  // Se compro: Input è USD -> Calcolo Crypto
  // Se vendo: Input è Crypto -> Calcolo USD (Guadagno)
  const cryptoAmount = isBuying ? (parseFloat(amountInput) / price) : parseFloat(amountInput);
  const usdValue = isBuying ? parseFloat(amountInput) : (parseFloat(amountInput) * price);

  async function handleTransaction(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const val = parseFloat(amountInput);

    // 1. Validazioni
    if (!val || val <= 0) {
      setError("Inserisci un importo valido.");
      setLoading(false); return;
    }

    if (isBuying && val > userBalance) {
      setError("Fondi insufficienti!");
      setLoading(false); return;
    }

    if (!isBuying && val > ownedAmount) {
      setError(`Non possiedi abbastanza ${coin.symbol.toUpperCase()}!`);
      setLoading(false); return;
    }

    try {
      const userRef = doc(db, "users", currentUser.uid);

      // 2. Logica Firestore (Inversa per Buy/Sell)
      // BUY:  Balance -USD, Portfolio +Crypto
      // SELL: Balance +USD, Portfolio -Crypto
      await updateDoc(userRef, {
        balance: increment(isBuying ? -val : usdValue),
        [`portfolio.${coin.id}`]: increment(isBuying ? cryptoAmount : -val)
      });

      alert(isBuying 
        ? `Hai comprato ${cryptoAmount.toFixed(6)} ${coin.symbol.toUpperCase()}` 
        : `Hai venduto e incassato $${usdValue.toFixed(2)}`
      );
      onClose();
    } catch (err) {
      console.error(err);
      setError("Transazione fallita.");
    }
    setLoading(false);
  }

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
    }}>
      <div style={{ background: "#222", padding: "25px", borderRadius: "12px", width: "320px", border: "1px solid #444", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
        
        {/* Intestazione con Toggle Buy/Sell */}
        <div style={{ display: "flex", marginBottom: "20px", borderBottom: "1px solid #444" }}>
          <button 
            onClick={() => setMode("buy")}
            style={{ flex: 1, padding: "10px", background: "none", border: "none", color: isBuying ? "#00d1b2" : "#888", borderBottom: isBuying ? "2px solid #00d1b2" : "none", cursor: "pointer", fontWeight: "bold" }}
          >
            COMPRA
          </button>
          <button 
            onClick={() => setMode("sell")}
            style={{ flex: 1, padding: "10px", background: "none", border: "none", color: !isBuying ? "#ff3860" : "#888", borderBottom: !isBuying ? "2px solid #ff3860" : "none", cursor: "pointer", fontWeight: "bold" }}
          >
            VENDI
          </button>
        </div>

        <h3 style={{ textAlign: "center", marginBottom: "5px" }}>{coin.name}</h3>
        <p style={{ textAlign: "center", color: "#888", fontSize: "0.9em" }}>1 {coin.symbol.toUpperCase()} = ${price.toLocaleString()}</p>
        
        <div style={{ background: "#333", padding: "10px", borderRadius: "8px", margin: "15px 0", fontSize: "0.9em" }}>
          <p>Disponibile: <strong>${userBalance.toLocaleString()}</strong></p>
          <p>Possiedi: <strong>{ownedAmount.toFixed(6)} {coin.symbol.toUpperCase()}</strong></p>
        </div>

        {error && <p style={{ color: "#ff3860", fontSize: "0.9em", textAlign: "center" }}>{error}</p>}

        <form onSubmit={handleTransaction}>
          <label style={{ fontSize: "0.8em", color: "#aaa" }}>
            {isBuying ? "Importo in USD ($)" : `Quantità ${coin.symbol.toUpperCase()} da vendere`}
          </label>
          <input 
            type="number" 
            step="any"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            placeholder={isBuying ? "Es. 100" : "Es. 0.5"}
            style={{ width: "100%", padding: "12px", marginTop: "5px", marginBottom: "15px", background: "#1a1a1a", border: "1px solid #555", color: "white", borderRadius: "6px", fontSize: "16px" }}
          />
          
          <div style={{ textAlign: "center", marginBottom: "20px", fontSize: "0.9em", color: isBuying ? "#00d1b2" : "#ff3860" }}>
            {isBuying 
              ? `Riceverai ≈ ${(val => val > 0 ? (val / price).toFixed(6) : 0)(parseFloat(amountInput))} ${coin.symbol}`
              : `Incasserai ≈ $${(val => val > 0 ? (val * price).toFixed(2) : 0)(parseFloat(amountInput))}`
            }
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: "12px", background: "#444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
              Annulla
            </button>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: "12px", background: isBuying ? "#00d1b2" : "#ff3860", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
              {loading ? "..." : (isBuying ? "CONFERMA" : "VENDI")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}