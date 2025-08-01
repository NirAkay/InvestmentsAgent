import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import RowCube from './RowCube'
import { useNavigate, useLocation } from 'react-router-dom';
import "./Home.css";

function Home(props) {
    //const mostPopularUniverse = ["^GSPC", "^NDX", "^DJI", "^GDAXI"]; //"S&P500", "NASDAQ", "DOW", "DAX"
    //const mostPopularUniverse = ["S&P500", "NASDAQ", "DOW", "DAX"];
    //const mostPopularIsrael = ["תל אביב 35", "תל אביב 125", "תל אביב 90", "תל אביב בנקים - 5"];
    const [valueUniverse, setValueUni] = useState([]);
    const [titleUniverse, setTitleUni] = useState(["S&P500", "NASDAQ", "DOW", "DAX"]);
    const [valueIsrael, setValueIsr] = useState([]);
    const [titleIsrael, setTitleIsr] = useState(["ת.א 35", "ת.א 125", "ת.א 90", "בנקים 5"]);
    const nav = useNavigate();
    const searchRef = useRef();
    const location = useLocation();

    useEffect(() => {
        props.socket.on("updateCommonUni", (data) => {
            setValueUni(data);
        });
        props.socket.on("updateCommonIsr", (data) => {
            setValueIsr(data);
        });
        //alert(props.favoritesStockList.length);
    }, [location.pathname]);

    function logoutClick() {
      props.socket.emit("leave", localStorage.getItem("username"), () => {});
      props.socket.disconnect();
      props.setSocket(null);
      nav("/");
    }
    
    function searchClick() {
      nav("/search?name=" + encodeURIComponent(searchRef.current.value));
    }

  function clickItemFavorites(item) {
    localStorage.setItem("stockTitle", item.stock);
    localStorage.setItem("stockSymbol", item.symbol);
    nav("/graph");
  }
  
  return (
    <div className="main-wrapper">
    <div className="top-section">
      <button type="button" className="btn btn-danger logout" onClick={logoutClick}>
        Logout
      </button>
      <div className="input-group mb-3 search_input">
        <span className="input-group-text" id="basic-addon1">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          ref={searchRef}
          className="form-control custom-width"
          placeholder="Search"
          aria-label="Search"
          aria-describedby="basic-addon1"
        />
        <button className="btn btn-primary" onClick={searchClick}>
          Search
        </button>
      </div>
      <RowCube titles={titleUniverse} stocks={valueUniverse} onChange={() => {}} />
      <RowCube titles={titleIsrael} stocks={valueIsrael} onChange={() => {}} />
    </div>

    <div className="favorites-container">
      <h2 className="favorites-title">Your Favorite Stocks</h2>
      <ul className="favorites-list">
        {props.favoritesStockList.map((item, index) => (
          <li key={index} className="favorites-item" onClick={() => {clickItemFavorites(item)}}>
            <div className="stock-name">{item.stock}</div>
          </li>
        ))}
      </ul>
    </div>
  </div>
  );
}

export default Home;
