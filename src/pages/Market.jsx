// src/pages/Market.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useMarketData } from "../hooks/useMarketData";

import MarketTable from "../components/MarketTable";
import TradeModal from "../components/TradeModal";

export default function Market() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const { coins, loading } = useMarketData();
  
  // Gestione Modale per COMPRARE
  const [selectedCoin, setSelectedCoin] = useState(null);

  // Ci serve caricare i dati utente anche qui, perché il TradeModal 
  // ha bisogno di conoscere il saldo per permetterti di comprare.
  useEffect(() => {
    if (currentUser) {
      const unsubscribe = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
        if (doc.exists()) setUserData(doc.data());
      });
      return unsubscribe;
    }
  }, [currentUser]);

  // Quando clicchi "Compra" nella tabella
  const handleBuyClick = (coin) => {
    setSelectedCoin(coin);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", paddingBottom: "80px" }}>
      <header style={{ marginBottom: "30px", borderBottom: "1px solid #333", paddingBottom: "20px" }}>
        <h2 style={{ letterSpacing: "1px", margin: 0 }}>
          Mercato <span style={{ color: "#00d1b2", fontSize: "0.6em" }}>LIVE</span>
        </h2>
      </header>

      {/* TABELLA PREZZI */}
      <MarketTable 
        coins={coins} 
        loading={loading} 
        onBuyClick={handleBuyClick} 
      />

      {/* MODALE (Standard, si apre in modalità COMPRA) */}
      {selectedCoin && (
        <TradeModal 
          coin={selectedCoin} 
          userData={userData} 
          currentUser={currentUser} 
          initialMode="buy"
          onClose={() => setSelectedCoin(null)} 
        />
      )}
    </div>
  );
}