import React from "react";
import "./Portfolio.css";

export default function Portfolio({ portfolio, coins, onSellClick }) {
  if (!portfolio || !coins) return null;

  const assets = Object.entries(portfolio)
    .map(([id, amount]) => {
      const coinData = coins.find((c) => c.id === id);
      return {
        id,
        amount,
        value: coinData ? amount * coinData.current_price : 0,
        name: coinData ? coinData.name : id,
        symbol: coinData ? coinData.symbol : "",
        image: coinData ? coinData.image : "",
        currentPrice: coinData ? coinData.current_price : 0
      };
    })
    .filter((asset) => asset.amount > 0);

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  return (
    <div className="portfolio-container">
      <h3>Il tuo Portafoglio</h3>
      
      {assets.length === 0 ? (
        <div className="portfolio-empty">
          <p>Portafoglio vuoto.</p>
        </div>
      ) : (
        <>
          <div className="portfolio-summary">
            Valore Asset: <strong>$ {totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </div>

          <table className="portfolio-table">
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id}>
                  <td className="portfolio-cell-info">
                    {asset.image && <img src={asset.image} alt={asset.name} className="portfolio-icon" />}
                    <div>
                      <div className="portfolio-name">{asset.name}</div>
                      <div className="portfolio-amount">
                        {asset.amount.toFixed(8).replace(/\.?0+$/, "")} {asset.symbol.toUpperCase()}
                      </div>
                    </div>
                  </td>
                  
                  <td className="portfolio-cell-value">
                    <div>${asset.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  </td>
                  
                  <td className="portfolio-cell-action">
                    <button 
                      onClick={() => onSellClick(asset)}
                      className="sell-button">
                      Vendi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}