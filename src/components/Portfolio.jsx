// src/components/Portfolio.jsx
import React from "react";

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
    // Mostriamo l'asset se è maggiore di 0.000000001 (praticamente zero)
    .filter((asset) => asset.amount > 0);

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  return (
    <div style={{ padding: "20px", background: "#222", borderRadius: "12px", marginBottom: "30px", border: "1px solid #444" }}>
      <h3 style={{ marginBottom: "15px" }}>Il tuo Portafoglio</h3>
      
      {assets.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px", color: "#888" }}>
          <p>Portafoglio vuoto.</p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: "15px", fontSize: "1.2em" }}>
            Valore Asset: <strong style={{ color: "#00d1b2" }}>$ {totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id} style={{ borderTop: "1px solid #333" }}>
                  <td style={{ padding: "15px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                    {asset.image && <img src={asset.image} alt={asset.name} style={{ width: "24px", borderRadius: "50%" }} />}
                    <div>
                      <div style={{ fontWeight: "bold" }}>{asset.name}</div>
                      {/* QUI: Mostriamo fino a 8 decimali per precisione assoluta */}
                      <div style={{ fontSize: "0.8em", color: "#888" }}>
                        {asset.amount.toFixed(8).replace(/\.?0+$/, "")} {asset.symbol.toUpperCase()}
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: "right", paddingRight: "15px" }}>
                    <div style={{ fontWeight: "bold" }}>${asset.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  </td>
                  <td style={{ width: "80px", textAlign: "right" }}>
                    <button 
                      onClick={() => onSellClick(asset)}
                      style={{ padding: "6px 12px", background: "#ff3860", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.8em" }}
                    >
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