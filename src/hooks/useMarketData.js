import { useState, useEffect, useRef } from "react";

let globalCache = null;
let lastFetchTime = 0;
const CACHE_DURATION_MS = 120000;

export function useMarketData() {
  const [coins, setCoins] = useState(globalCache || []);
  const [loading, setLoading] = useState(!globalCache);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const fetchMarketData = async () => {
      const now = Date.now();
      
      if (globalCache && (now - lastFetchTime < CACHE_DURATION_MS)) {
        if (isMounted.current) {
          setCoins(globalCache);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
        );

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error("Rate limit exceeded. Using cached data.");
          }
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        globalCache = data;
        lastFetchTime = Date.now();
        
        if (isMounted.current) {
          setCoins(data);
          setError(null);
        }
      } catch (err) {
        console.warn("Market fetch failed:", err.message);
        
        if (isMounted.current) {
          if (globalCache) {
            setCoins(globalCache);
          } else {
            setError("Impossibile caricare i prezzi al momento.");
          }
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, CACHE_DURATION_MS);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, []);

  return { coins, loading, error };
}