// src/hooks/useMarketData.js
import { useState, useEffect } from "react";

// VARIABILI GLOBALI (Memoria Cache)
// Queste restano in memoria anche quando cambi pagina tra Home e Mercato
let memoryCache = null;
let lastFetchTime = 0;

export function useMarketData() {
  // Se abbiamo dati in memoria, partiamo già con quelli (niente caricamento infinito)
  const [coins, setCoins] = useState(memoryCache || []);
  const [loading, setLoading] = useState(!memoryCache);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      const now = Date.now();
      
      // 1. CONTROLLO CACHE: Sono passati meno di 2 minuti (120.000 millisecondi)?
      if (memoryCache && (now - lastFetchTime < 120000)) {
        setCoins(memoryCache);
        setLoading(false);
        return; // Interrompe qui, NON chiama CoinGecko!
      }

      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
        );

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error("Troppe richieste (Rate Limit). Uso i vecchi dati.");
          }
          throw new Error("Errore nel server dei prezzi.");
        }

        const data = await response.json();
        
        // 2. SALVATAGGIO IN CACHE
        memoryCache = data;
        lastFetchTime = Date.now();
        
        setCoins(data);
        setError(null);
        setLoading(false);
      } catch (err) {
        console.warn(err.message);
        // 3. SALVATAGGIO DI EMERGENZA (Se CoinGecko ci blocca, usiamo i vecchi dati)
        if (memoryCache) {
          setCoins(memoryCache);
        } else {
          setError("Impossibile caricare i prezzi. Riprova tra poco.");
        }
        setLoading(false);
      }
    };

    fetchMarketData();

    // Aggiorniamo i prezzi ogni 2 minuti (120.000 ms) per sicurezza
    const interval = setInterval(fetchMarketData, 120000);

    return () => clearInterval(interval);
  }, []);

  return { coins, loading, error };
}