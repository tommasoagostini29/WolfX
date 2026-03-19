import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useMarketData } from "../hooks/useMarketData";

import MarketTable from "../components/MarketTable";
import TradeModal from "../components/TradeModal";

import "./Market.css";

const Market = () => {
  const { currentUser } = useAuth();
  const { coins, loading } = useMarketData();
  
  const [datiUtente, setDatiUtente] = useState(null);
  const [monetaSelezionata, setMonetaSelezionata] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    
    const unsub = onSnapshot(doc(db, "users", currentUser.uid), (documento) => {
      if (documento.exists()) setDatiUtente(documento.data());
    });
    
    return () => unsub();
  }, [currentUser]);

  const apriAcquisto = (moneta) => {
    setMonetaSelezionata(moneta);
  };

  return (
    <div className="container-mercato">
      <header className="market-header">
        <h2>
          Mercato <span>LIVE</span>
        </h2>
      </header>

      <MarketTable 
        coins={coins} 
        loading={loading} 
        onBuyClick={apriAcquisto} 
      />

      {monetaSelezionata && (
        <TradeModal 
          coin={monetaSelezionata} 
          userData={datiUtente} 
          currentUser={currentUser} 
          initialMode="buy"
          onClose={() => setMonetaSelezionata(null)} 
        />
      )}
    </div>
  );
};

export default Market;