// src/hooks/useMarketData.js
import { useState, useEffect } from "react";

export function useMarketData() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // URL dell'API di CoinGecko (prende le prime 10 crypto per capitalizzazione)
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
        );

        if (!response.ok) {
          throw new Error("Errore nel caricamento dei dati");
        }

        const data = await response.json();
        setCoins(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    // Chiama la funzione subito
    fetchMarketData();

    // Opzionale: Aggiorna i dati ogni 60 secondi
    const interval = setInterval(fetchMarketData, 60000);

    // Pulizia quando il componente viene smontato
    return () => clearInterval(interval);
  }, []);

  return { coins, loading, error };
}