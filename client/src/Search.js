import React, { useEffect, useState, useRef } from 'react';
import './Search.css';
import "./Home.css";
import { useNavigate, useLocation } from 'react-router-dom';

function Search(props) {
  const nav = useNavigate();
  const location = useLocation();
  const [searchList, setSearchList] = useState([]);

  function backClick() {
        nav("/home?date=" + Date.now());
    }

  async function searchStockReq() {
    const params = new URLSearchParams(location.search);
    const res = await fetch("http://localhost:5000/api/Stocks/Search/" + encodeURIComponent(params.get("name")), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': "Bearer " + localStorage.getItem("token")
        }
      });
      if (res.status == 200) {
        const data = await res.json();
        let tmp = [];
        for (let i = 0; i < data.stocks.length; i++) {
          tmp.push({symbol: data.stocks[i].symbol, name: data.stocks[i].shortname, type: data.stocks[i].quoteType});
        }
        setSearchList(tmp);
      }
  }

  useEffect(() => {
     searchStockReq();
    }, []);

    function clickItemListSearch(name, symbol) {
        localStorage.setItem("stockTitle", name);
        localStorage.setItem("stockSymbol", symbol);
        nav("/graph");
    }

  return (
    <div className="stock-list-container">
    <button type="button" className="btn btn-danger logout" onClick={backClick}>Back</button>
      <ul className="stock-list">
        {searchList.map((stock, index) => (
          <li key={index} className="stock-item" onClick={()=>{clickItemListSearch(stock.name, stock.symbol)}}>
            <div className="stock-row">
              <div className="stock-name">{stock.name}</div>
              <div className="stock-symbol">{stock.symbol}</div>
              <div className="stock-sector">{stock.type}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Search;