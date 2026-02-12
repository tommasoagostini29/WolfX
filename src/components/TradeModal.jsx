// src/components/TradeModal.jsx
import React, { useState } from "react";
import { db } from "../firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

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
  
  // Calcoli per l'anteprima
  const cryptoAmount = isBuying ? (val / price) : val;
  const usdValue = isBuying ? val : (val * price);

  // Funzione per impostare il massimo disponibile
  const handleSetMax = () => {
    if (isBuying) {
      // Se compro, il max è tutto il mio saldo in dollari
      setAmountInput(userBalance.toString());
    } else {
      // Se vendo, il max è tutta la crypto che possiedo
      setAmountInput(ownedAmount.toString());
    }
  };

  async function handleTransaction(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

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

      // Se stiamo vendendo TUTTO (o quasi), assicuriamoci di pulire eventuali residui decimali
      // Nota: Firestore gestisce bene i numeri, ma per sicurezza usiamo increment
      await updateDoc(userRef, {
        balance: increment(isBuying ? -val : usdValue),
        [`portfolio.${coin.id}`]: increment(isBuying ? cryptoAmount : -val)
      });

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
        
        {/* Toggle Buy/Sell */}
        <div style={{ display: "flex", marginBottom: "20px", borderBottom: "1px solid #444" }}>
          <button onClick={() => { setMode("buy"); setAmountInput(""); }} style={{ flex: 1, padding: "10px", background: "none", border: "none", color: isBuying ? "#00d1b2" : "#888", borderBottom: isBuying ? "2px solid #00d1b2" : "none", cursor: "pointer", fontWeight: "bold" }}>
            COMPRA
          </button>
          <button onClick={() => { setMode("sell"); setAmountInput(""); }} style={{ flex: 1, padding: "10px", background: "none", border: "none", color: !isBuying ? "#ff3860" : "#888", borderBottom: !isBuying ? "2px solid #ff3860" : "none", cursor: "pointer", fontWeight: "bold" }}>
            VENDI
          </button>
        </div>

        <h3 style={{ textAlign: "center", marginBottom: "5px" }}>{coin.name}</h3>
        <p style={{ textAlign: "center", color: "#888", fontSize: "0.9em" }}>1 {coin.symbol.toUpperCase()} = ${price.toLocaleString()}</p>
        
        <div style={{ background: "#333", padding: "10px", borderRadius: "8px", margin: "15px 0", fontSize: "0.9em" }}>
          <p>Disponibile: <strong>${userBalance.toLocaleString()}</strong></p>
          <p>Possiedi: <strong>{ownedAmount.toFixed(8)} {coin.symbol.toUpperCase()}</strong></p>
        </div>

        {error && <p style={{ color: "#ff3860", fontSize: "0.9em", textAlign: "center" }}>{error}</p>}

        <form onSubmit={handleTransaction}>
          <label style={{ fontSize: "0.8em", color: "#aaa" }}>
            {isBuying ? "Importo in USD ($)" : `Quantità ${coin.symbol.toUpperCase()} da vendere`}
          </label>
          
          {/* Container Input + Tasto MAX */}
          <div style={{ position: "relative", marginBottom: "15px", marginTop: "5px" }}>
            <input 
              type="number" 
              step="any"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              placeholder="0.00"
              style={{ width: "100%", padding: "12px", paddingRight: "50px", background: "#1a1a1a", border: "1px solid #555", color: "white", borderRadius: "6px", fontSize: "16px" }}
            />
            <button 
              type="button"
              onClick={handleSetMax}
              style={{ 
                position: "absolute", 
                right: "5px", 
                top: "5px", 
                bottom: "5px", 
                background: "#333", 
                color: "#00d1b2", 
                border: "none", 
                borderRadius: "4px", 
                padding: "0 10px", 
                cursor: "pointer", 
                fontSize: "0.8em",
                fontWeight: "bold"
              }}
            >
              MAX
            </button>
          </div>
          
          <div style={{ textAlign: "center", marginBottom: "20px", fontSize: "0.9em", color: isBuying ? "#00d1b2" : "#ff3860" }}>
            {isBuying 
              ? `Riceverai ≈ ${(val > 0 ? (val / price).toFixed(6) : 0)} ${coin.symbol.toUpperCase()}`
              : `Incasserai ≈ $${(val > 0 ? (val * price).toFixed(2) : 0)}`
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