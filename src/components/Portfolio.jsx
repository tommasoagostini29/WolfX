import "./Portfolio.css";

const Portfolio = ({ portfolio, coins, onSellClick }) => {
  if (!portfolio || !coins) return null;

  const assetPersonali = Object.entries(portfolio)
    .map(([id, quantita]) => {
      const datiMoneta = coins.find((c) => c.id === id);
      return {
        id,
        amount: quantita,
        value: datiMoneta ? quantita * datiMoneta.current_price : 0,
        name: datiMoneta ? datiMoneta.name : id,
        symbol: datiMoneta ? datiMoneta.symbol : "",
        image: datiMoneta ? datiMoneta.image : "",
        currentPrice: datiMoneta ? datiMoneta.current_price : 0
      };
    })
    .filter((asset) => asset.amount > 0);

  const valoreTotale = assetPersonali.reduce((somma, asset) => somma + asset.value, 0);

  return (
    <div className="container-portfolio">
      <h3>Il tuo Portafoglio</h3>
      
      {assetPersonali.length === 0 ? (
        <div className="portfolio-empty">
          <p>Portafoglio vuoto.</p>
        </div>
      ) : (
        <>
          <div className="portfolio-summary">
            Valore Asset: <strong>$ {valoreTotale.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </div>

          <table className="portfolio-table">
            <tbody>
              {assetPersonali.map((asset) => (
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
};

export default Portfolio;