import "./MarketTable.css";

const MarketTable = ({ coins, loading, onBuyClick }) => {
  
  if (loading) return <p className="market-loading">Caricamento prezzi...</p>;

  return (
    <div className="container-tabella">
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
            {coins.map((moneta) => (
              <tr key={moneta.id}>
                <td className="asset-cell">
                  <img src={moneta.image} alt={moneta.name} className="asset-icon" />
                  <span className="asset-name">{moneta.name}</span>
                  <span className="asset-symbol">{moneta.symbol.toUpperCase()}</span>
                </td>
                <td>${moneta.current_price.toLocaleString()}</td>
                <td className={moneta.price_change_percentage_24h > 0 ? "text-green" : "text-red"}>
                  {moneta.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td>
                  <button 
                    onClick={() => onBuyClick(moneta)} 
                    className="buy-button">
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
};

export default MarketTable;