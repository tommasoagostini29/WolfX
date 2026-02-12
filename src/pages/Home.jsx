// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useMarketData } from "../hooks/useMarketData";

import Portfolio from "../components/Portfolio";
import TradeModal from "../components/TradeModal";

export default function Home() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const { coins } = useMarketData(); // Ci servono i prezzi per calcolare il valore del portafoglio
  
  // Gestione Modale per la VENDITA
  const [selectedCoin, setSelectedCoin] = useState(null);

  // Ascolta i dati dell'utente (Saldo e Portafoglio)
  useEffect(() => {
    if (currentUser) {
      const unsubscribe = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
        if (doc.exists()) setUserData(doc.data());
      });
      return unsubscribe;
    }
  }, [currentUser]);

  // Quando clicchi "Vendi" nel portafoglio
  const handleSellClick = (coin) => {
    // Cerchiamo i dati completi della moneta (prezzo, immagine)
    const fullCoinData = coins.find(c => c.id === coin.id) || coin;
    setSelectedCoin(fullCoinData);
  };

  // Calcolo del valore totale (Saldo Cash + Valore Crypto)
  const portfolioValue = userData?.portfolio && coins.length > 0
    ? Object.entries(userData.portfolio).reduce((total, [id, amount]) => {
        const coin = coins.find(c => c.id === id);
        return total + (coin ? amount * coin.current_price : 0);
      }, 0)
    : 0;

  const totalBalance = (userData?.balance || 0) + portfolioValue;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", paddingBottom: "80px" }}>
      <header style={{ marginBottom: "30px", borderBottom: "1px solid #333", paddingBottom: "20px" }}>
        <h2 style={{ letterSpacing: "1px", margin: 0 }}>
          WolfX <span style={{ color: "#00d1b2", fontSize: "0.6em" }}>HOME</span>
        </h2>
      </header>

      {/* RIEPILOGO PATRIMONIO */}
      <div style={{ padding: "25px", background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)", borderRadius: "16px", marginBottom: "30px", color: "white", boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}>
        <p style={{ margin: 0, opacity: 0.7, fontSize: "0.9em", textTransform: "uppercase" }}>Patrimonio Totale</p>
        <h1 style={{ margin: "10px 0", fontSize: "42px", fontWeight: "300" }}>
          $ {totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h1>
        <div style={{ display: "flex", gap: "20px", marginTop: "15px", fontSize: "0.9em", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "15px" }}>
          <span>Cash: <strong style={{ color: "#00d1b2" }}>${userData?.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></span>
          <span>Asset: <strong>${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></span>
        </div>
      </div>

      {/* IL TUO PORTAFOGLIO */}
      <Portfolio 
        portfolio={userData?.portfolio} 
        coins={coins} 
        onSellClick={handleSellClick} 
      />

      {/* MODALE (Solo per vendere, si apre se selectedCoin non è null) */}
      {selectedCoin && (
        <TradeModal 
          coin={selectedCoin} 
          userData={userData} 
          currentUser={currentUser} 
          initialMode="sell" // Apre direttamente in modalità VENDI
          onClose={() => setSelectedCoin(null)} 
        />
      )}
    </div>
  );
}