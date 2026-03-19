import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useMarketData } from "../hooks/useMarketData";

import Portfolio from "../components/Portfolio";
import TradeModal from "../components/TradeModal";

import "./Home.css";

export default function Home() {
  const { currentUser } = useAuth();
  const { coins } = useMarketData();
  
  const [userData, setUserData] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    
    const unsubscribe = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
      if (doc.exists()) setUserData(doc.data());
    });
    
    return () => unsubscribe();
  }, [currentUser]);

  const handleSellClick = (coin) => {
    const fullCoinData = coins.find(c => c.id === coin.id) || coin;
    setSelectedCoin(fullCoinData);
  };

  const portfolioValue = useMemo(() => {
    if (!userData?.portfolio || coins.length === 0) return 0;
    
    return Object.entries(userData.portfolio).reduce((total, [id, amount]) => {
      const coin = coins.find(c => c.id === id);
      return total + (coin ? amount * coin.current_price : 0);
    }, 0);
  }, [userData?.portfolio, coins]);

  const totalBalance = (userData?.balance || 0) + portfolioValue;

  return (
    <div className="home-container">
      <header className="home-header">
        <h2>
          WolfX <span>HOME</span>
        </h2>
      </header>

      <div className="summary-card">
        <p className="summary-subtitle">Patrimonio Totale</p>
        <h1 className="summary-total">
          $ {totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h1>
        
        <div className="summary-details">
          <span>Cash: <strong>${(userData?.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></span>
          <span>Asset: <strong>${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></span>
        </div>
      </div>

      <Portfolio 
        portfolio={userData?.portfolio} 
        coins={coins} 
        onSellClick={handleSellClick} 
      />

      {selectedCoin && (
        <TradeModal 
          coin={selectedCoin} 
          userData={userData} 
          currentUser={currentUser} 
          initialMode="sell" 
          onClose={() => setSelectedCoin(null)} 
        />
      )}
    </div>
  );
}