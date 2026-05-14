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
    
    /* onSnapshot è in attesa di modifiche */
    const unsub = onSnapshot(doc(db, "users", currentUser.uid), (documento) => {
      if (documento.exists()) setDatiUtente(documento.data());
    });
    
    return () => unsub();
  }, [currentUser]);

  /* prende la moneta che si vuole comprare e la salva nello stato. qui react fa apparire il modale */
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

      {/* dobbiamo passare le proprietà perchè MarketTable non sa nulla di coingecko o di firebase*/}
      <MarketTable 
        coins={coins} 
        loading={loading} 
        onBuyClick={apriAcquisto} 
      />

      {/* stesso codice della home ma con buy. stesso codice che fa due cose diverse. */}
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