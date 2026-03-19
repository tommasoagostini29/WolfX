import { useState, useEffect, useRef } from "react";

let cacheGlobale = null;
let ultimoFetch = 0;
const DURATA_CACHE = 120000;

export const useMarketData = () => {
  const [monete, setMonete] = useState(cacheGlobale || []);
  const [caricamento, setCaricamento] = useState(!cacheGlobale);
  const [errore, setErrore] = useState(null);
  const montato = useRef(true);

  useEffect(() => {
    montato.current = true;

    const prendiPrezzi = async () => {
      const adesso = Date.now();
      
      if (cacheGlobale && (adesso - ultimoFetch < DURATA_CACHE)) {
        if (montato.current) {
          setMonete(cacheGlobale);
          setCaricamento(false);
        }
        return;
      }

      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
        );

        if (!res.ok) {
          if (res.status === 429) throw new Error("Rate limit superato");
          throw new Error(`Errore API: ${res.status}`);
        }

        const dati = await res.json();
        
        cacheGlobale = dati;
        ultimoFetch = Date.now();
        
        if (montato.current) {
          setMonete(dati);
          setErrore(null);
        }
      } catch (err) {
        console.warn("Problema col fetch dei prezzi:", err.message);
        
        if (montato.current) {
          if (cacheGlobale) {
            setMonete(cacheGlobale);
          } else {
            setErrore("Impossibile caricare i prezzi al momento.");
          }
        }
      } finally {
        if (montato.current) {
          setCaricamento(false);
        }
      }
    };

    prendiPrezzi();
    const intervallo = setInterval(prendiPrezzi, DURATA_CACHE);

    return () => {
      montato.current = false;
      clearInterval(intervallo);
    };
  }, []);

  return { 
    coins: monete, 
    loading: caricamento, 
    error: errore 
  };
};