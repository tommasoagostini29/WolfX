// src/components/MarketTable.jsx
import React from "react";
import "./MarketTable.css"; // Importiamo gli stili

export default function MarketTable({ coins, loading, onBuyClick }) {
  
  if (loading) return <p className="market-loading">Caricamento prezzi...</p>;

  return (
    <div className="table-container">
      <h3>Mercato Crypto (Live)</h3>
      
      <div className="table-wrapper">
        <table className="market-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Prezzo</th>
              <th>24h %</th>
              <th>Azione</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <tr key={coin.id}>
                <td className="asset-cell">
                  <img src={coin.image} alt={coin.name} className="asset-icon" />
                  <span className="asset-name">{coin.name}</span>
                  <span className="asset-symbol">{coin.symbol.toUpperCase()}</span>
                </td>
                <td>${coin.current_price.toLocaleString()}</td>
                {/* Assegnazione classe dinamica basata sul valore positivo o negativo */}
                <td className={coin.price_change_percentage_24h > 0 ? "text-green" : "text-red"}>
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td>
                  <button 
                    onClick={() => onBuyClick(coin)} 
                    className="buy-button"
                  >
                    Compra
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}