import React, { useEffect, useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import "./Home.css";
import "./GraphPage.css";
import { useNavigate } from 'react-router-dom';

function GraphPage(props) {
    const nav = useNavigate();
    const [bottonsColor, setButtonColor] = useState([false, false, false, true]);
    const [dots, setDots] = useState([]);
    const [change, setChange] = useState("0.00");
    const [starFavorites, setStarFevorites] = useState(false);
    const [aiAdvice, setAiAdvices] = useState("");

    function backClick() {
        nav("/home?date=" + Date.now());
    }

    async function getDots(timeLine) {
      const params = new URLSearchParams({
        timeLine: timeLine,
        interval: (timeLine === "1d" ? "15m" : (timeLine === "1wk" ? "90m" : "1d")),
        symbol: localStorage.getItem("stockSymbol")
      });
      const res = await fetch("http://localhost:5000/api/Stocks/" + localStorage.getItem("stockTitle") + "?" + params.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': "Bearer " + localStorage.getItem("token")
        }
      });
      if (res.status == 200) {
        const data = await res.json();
        let ret = [];
        for (let i = 0; i < data.dots.length; i++) {
          ret.push({date: i + 1, value: data.dots[i]});
        }
        setDots(ret);
        setChange(data.change);
      }
    }

    useEffect(()=>{
      getDots("1d");
      setStarFevorites(props.favoritesStockList.find((item) => item.stock === localStorage.getItem("stockTitle"))
    );
    }, []);

  function timeLineClick(timeLine, i) {
    let colors = [false, false, false, false];
    colors[i] = true;
    setButtonColor(colors);
    getDots(timeLine);
  }

  async function addRemoveFromFavoritesList() {
    const params = new URLSearchParams({
      symbol: localStorage.getItem("stockSymbol")
    });
    const res = await fetch("http://localhost:5000/api/Favorites/" + (!starFavorites? "Add/" : "Delete/") + encodeURIComponent(localStorage.getItem("stockTitle")) + "?" + params.toString(), {
      method: (!starFavorites? "POST" : "DELETE"),
      headers: {
        'Content-Type': 'application/json',
        'authorization': "Bearer " + localStorage.getItem("token")
      }
    });
    if (res.status === 200) {
      if (starFavorites) {
        props.setFavoritesStockList(props.favoritesStockList.filter(item => item.stock !== localStorage.getItem("stockTitle")));
      } else {
        props.favoritesStockList.push({stock: localStorage.getItem("stockTitle"), symbol: localStorage.getItem("stockSymbol")});
        props.setFavoritesStockList(props.favoritesStockList);
      }
    }
  }

  function clickStar() {
    setStarFevorites(!starFavorites);
    addRemoveFromFavoritesList();
  }

  async function adviceAIClick() {
    const res = await fetch("http://localhost:5000/api/AI/" + encodeURIComponent(localStorage.getItem("stockTitle")), {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'authorization': "Bearer " + localStorage.getItem("token")
      }
    });
    if (res.status === 200) {
      setAiAdvices((await res.json()).text);
    }
  }

  return (
    <div>
        <button type="button" className="btn btn-danger logout" onClick={backClick}>Back</button>
        <div className="d-flex stock-info-container justify-content-center align-items-center mt-5">
          <i className={"bi bi-star" + (starFavorites ? "-fill text-warning" : "") + " favorites"} onClick={clickStar}></i>
          <h3 className="stock-title mb-0 me-2">
            {localStorage.getItem("stockTitle").length > 10
              ? localStorage.getItem("stockTitle").substring(0, 7) + "..."
              : localStorage.getItem("stockTitle")}
          </h3>
          <span className={"stock-change " + (String(change)[0] === '-' ? "negative" : "positive")}>
            {String(change).length > 10 ? String(change).substring(0, 7) + "%" : change + "%"}
          </span>
          <button style={{ fontSize: '2rem' }} onClick={adviceAIClick}>🤖</button>
        </div>
        <div class="d-flex justify-content-center gap-2 mt-2">
          <button class={"btn btn-" + (bottonsColor[0]? "primary" : "secondary") + " btn-sm"} onClick={()=>{timeLineClick("1y", 0)}}>1y</button>
          <button class={"btn btn-" + (bottonsColor[1]? "primary" : "secondary") + " btn-sm"} onClick={()=>{timeLineClick("1mo", 1)}}>1m</button>
          <button class={"btn btn-" + (bottonsColor[2]? "primary" : "secondary") + " btn-sm"} onClick={()=>{timeLineClick("1wk", 2)}}>1w</button>
          <button class={"btn btn-" + (bottonsColor[3]? "primary" : "secondary") + " btn-sm"} onClick={()=>{timeLineClick("1d", 3)}}>1d</button>
        </div>
        <div className='center-graph'>
            <LineChart width={500} height={300} data={dots}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="date" stroke="black" style={{ fontWeight: 'bold', fontSize: '14px' }}/>
                <YAxis stroke="black" style={{ fontWeight: 'bold', fontSize: '14px' }} domain={[Math.min(...dots), Math.max(...dots)]} tickFormatter={(value) => value.toFixed(2)}/>
                <Tooltip />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
        </div>
        <h3>{aiAdvice}</h3>
    </div>
  );
}

export default GraphPage;