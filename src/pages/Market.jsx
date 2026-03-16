// src/pages/Market.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useMarketData } from "../hooks/useMarketData";

import MarketTable from "../components/MarketTable";
import TradeModal from "../components/TradeModal";

import "./Market.css"; // CSS esterno

export default function Market() {
  const { currentUser } = useAuth();
  const { coins, loading } = useMarketData();
  
  const [userData, setUserData] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);

  // Sync user data for balance validation in TradeModal
  useEffect(() => {
    if (!currentUser) return;
    
    const unsubscribe = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
      if (doc.exists()) setUserData(doc.data());
    });
    
    return () => unsubscribe();
  }, [currentUser]);

  const handleBuyClick = (coin) => {
    setSelectedCoin(coin);
  };

  return (
    <div className="market-container">
      <header className="market-header">
        <h2>
          Mercato <span>LIVE</span>
        </h2>
      </header>

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
          initialMode="buy"
          onClose={() => setSelectedCoin(null)} 
        />
      )}
    </div>
  );
}