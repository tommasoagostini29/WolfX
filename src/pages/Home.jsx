import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useMarketData } from "../hooks/useMarketData";
import Portfolio from "../components/Portfolio";
import TradeModal from "../components/TradeModal";
import "./Home.css";

const Home = () => {
  const { currentUser } = useAuth();
  const { coins } = useMarketData();
  
  const [datiUtente, setDatiUtente] = useState(null);
  const [monetaSelezionata, setMonetaSelezionata] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    
    const unsub = onSnapshot(doc(db, "users", currentUser.uid), (documento) => {
      if (documento.exists()) setDatiUtente(documento.data());
    });
    
    return () => unsub();
  }, [currentUser]);

  const apriVendita = (moneta) => {
    const datiCompleti = coins.find(c => c.id === moneta.id) || moneta;
    setMonetaSelezionata(datiCompleti);
  };

  const valorePortafoglio = useMemo(() => {
    if (!datiUtente?.portfolio || coins.length === 0) return 0;
    
    return Object.entries(datiUtente.portfolio).reduce((totale, [id, quantita]) => {
      const coin = coins.find(c => c.id === id);
      return totale + (coin ? quantita * coin.current_price : 0);
    }, 0);
  }, [datiUtente?.portfolio, coins]);

  const saldoTotale = (datiUtente?.balance || 0) + valorePortafoglio;

  return (
    <div className="container-home">
      <header className="home-header">
        <h2>
          WolfX <span>HOME</span>
        </h2>
      </header>

      <div className="summary-card">
        <p className="summary-subtitle">Patrimonio Totale</p>
        <h1 className="summary-total">
          $ {saldoTotale.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h1>
        
        <div className="summary-details">
          <span>Cash: <strong>${(datiUtente?.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></span>
          <span>Asset: <strong>${valorePortafoglio.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></span>
        </div>
      </div>

      <Portfolio 
        portfolio={datiUtente?.portfolio} 
        coins={coins} 
        onSellClick={apriVendita} 
      />

      {monetaSelezionata && (
        <TradeModal 
          coin={monetaSelezionata} 
          userData={datiUtente} 
          currentUser={currentUser} 
          initialMode="sell" 
          onClose={() => setMonetaSelezionata(null)} 
        />
      )}
    </div>
  );
};

export default Home;