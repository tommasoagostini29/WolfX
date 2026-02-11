// src/components/MarketTable.jsx
import React from "react";

// Ora riceve 'coins' e 'loading' dal padre (Dashboard)
export default function MarketTable({ coins, loading, onBuyClick }) {
  
  if (loading) return <p>Caricamento prezzi...</p>;

  return (
    <div style={{ marginTop: "20px", overflowX: "auto" }}>
      <h3>Mercato Crypto (Live)</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #444", textAlign: "left" }}>
            <th style={{ padding: "10px" }}>Asset</th>
            <th style={{ padding: "10px" }}>Prezzo</th>
            <th style={{ padding: "10px" }}>24h %</th>
            <th style={{ padding: "10px" }}>Azione</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr key={coin.id} style={{ borderBottom: "1px solid #333" }}>
              <td style={{ padding: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                <img src={coin.image} alt={coin.name} style={{ width: "25px", height: "25px" }} />
                <span>{coin.name}</span>
                <span style={{ color: "#888", fontSize: "0.8em" }}>{coin.symbol.toUpperCase()}</span>
              </td>
              <td style={{ padding: "10px" }}>${coin.current_price.toLocaleString()}</td>
              <td style={{ 
                padding: "10px", 
                color: coin.price_change_percentage_24h > 0 ? "#00d1b2" : "#ff3860" 
              }}>
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td style={{ padding: "10px" }}>
                <button 
                  onClick={() => onBuyClick(coin)} 
                  style={{ padding: "5px 10px", background: "#00d1b2", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                  Compra
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}