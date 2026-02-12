// src/components/Chart.jsx
import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';

export default function Chart({ symbol }) {
  const chartContainerRef = useRef();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 1. Convertiamo il simbolo per Binance (es. da "btc" a "BTCUSDT")
  const binanceSymbol = `${symbol.toUpperCase()}USDT`;

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    // Resetta il contenuto se cambia simbolo
    container.innerHTML = '';
    setLoading(true);
    setError(false);

    // Configurazione Grafico (Colori scuri)
    const chart = createChart(container, {
      width: container.clientWidth,
      height: 300,
      layout: {
        background: { color: '#222' },
        textColor: '#DDD',
      },
      grid: {
        vertLines: { color: '#333' },
        horzLines: { color: '#333' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#00d1b2',    // Verde WolfX
      downColor: '#ff3860',  // Rosso WolfX
      borderUpColor: '#00d1b2',
      borderDownColor: '#ff3860',
      wickUpColor: '#00d1b2',
      wickDownColor: '#ff3860',
    });

    // 2. Funzione per scaricare i dati da Binance
    const fetchData = async () => {
      try {
        // Scarichiamo le candele giornaliere (interval=1d) degli ultimi 100 giorni
        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=1d&limit=100`
        );
        
        if (!response.ok) throw new Error('Dati non disponibili');
        
        const data = await response.json();

        // Formattiamo i dati per la libreria
        const chartData = data.map(c => ({
          time: c[0] / 1000, // Timestamp in secondi
          open: parseFloat(c[1]),
          high: parseFloat(c[2]),
          low: parseFloat(c[3]),
          close: parseFloat(c[4]),
        }));

        candlestickSeries.setData(chartData);
        setLoading(false);
      } catch (err) {
        console.error("Errore grafico:", err);
        setLoading(false);
        setError(true);
      }
    };

    fetchData();

    // Gestione ridimensionamento finestra
    const handleResize = () => {
      chart.applyOptions({ width: container.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    // Pulizia quando il componente viene smontato
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [binanceSymbol]);

  return (
    <div style={{ position: 'relative', marginBottom: '20px' }}>
      {loading && <p style={{ textAlign: 'center', fontSize: '0.8em', color: '#888' }}>Caricamento grafico...</p>}
      {error && <p style={{ textAlign: 'center', fontSize: '0.8em', color: '#ff3860' }}>Grafico non disponibile per {binanceSymbol}</p>}
      
      {/* Il container dove verrà disegnato il grafico */}
      <div ref={chartContainerRef} style={{ width: '100%', height: '300px', borderRadius: '8px', overflow: 'hidden' }} />
    </div>
  );
}