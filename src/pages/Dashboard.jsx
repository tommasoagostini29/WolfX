// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useMarketData } from "../hooks/useMarketData";

import MarketTable from "../components/MarketTable";
import TradeModal from "../components/TradeModal";
import Portfolio from "../components/Portfolio";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState(null);
  const { coins, loading } = useMarketData();
  
  // Gestione Modale
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [modalMode, setModalMode] = useState("buy"); // "buy" oppure "sell"

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
        if (doc.exists()) setUserData(doc.data());
      });
      return unsubscribe;
    }
  }, [currentUser]);

  // Funzioni per aprire il modale
  const handleBuyClick = (coin) => {
    setModalMode("buy");
    setSelectedCoin(coin);
  };

  const handleSellClick = (coin) => {
    // Cerchiamo i dati completi della moneta (prezzo, immagine) dalla lista coins
    // perché dal portafoglio potremmo avere dati parziali
    const fullCoinData = coins.find(c => c.id === coin.id) || coin;
    setModalMode("sell");
    setSelectedCoin(fullCoinData);
  };

  const portfolioValue = userData?.portfolio && coins.length > 0
    ? Object.entries(userData.portfolio).reduce((total, [id, amount]) => {
        const coin = coins.find(c => c.id === id);
        return total + (coin ? amount * coin.current_price : 0);
      }, 0)
    : 0;

  const totalBalance = (userData?.balance || 0) + portfolioValue;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", paddingBottom: "80px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ letterSpacing: "1px" }}>WolfX <span style={{ color: "#00d1b2", fontSize: "0.6em" }}>Live</span></h2>
        <button onClick={() => logout().then(() => navigate("/login"))} style={{ padding: "8px 16px", background: "#333", color: "white", border: "1px solid #555", borderRadius: "4px", cursor: "pointer" }}>
          Esci
        </button>
      </header>

      {/* RIEPILOGO */}
      <div style={{ padding: "25px", background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)", borderRadius: "16px", marginBottom: "30px", color: "white", boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}>
        <p style={{ margin: 0, opacity: 0.7, fontSize: "0.9em", textTransform: "uppercase" }}>Patrimonio Totale</p>
        <h1 style={{ margin: "10px 0", fontSize: "42px", fontWeight: "300" }}>
          $ {totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h1>
        <div style={{ display: "flex", gap: "20px", marginTop: "15px", fontSize: "0.9em", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "15px" }}>
          <span>Cash: <strong style={{ color: "#00d1b2" }}>${userData?.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></span>
          <span>Investimenti: <strong>${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></span>
        </div>
      </div>

      <Portfolio 
        portfolio={userData?.portfolio} 
        coins={coins} 
        onSellClick={handleSellClick} 
      />

      <MarketTable 
        coins={coins} 
        loading={loading} 
        onBuyClick={handleBuyClick} 
      />

      {selectedCoin && (
        <TradeModal 
          coin={selectedCoin} 
          userData={userData} 
          currentUser={currentUser} 
          initialMode={modalMode} // Passiamo la modalità iniziale
          onClose={() => setSelectedCoin(null)} 
        />
      )}
    </div>
  );
}