import React, { useEffect, useState, useRef } from 'react';
import './Cube.css';
import { useNavigate } from 'react-router-dom';

function Cube(props) {
  const nav = useNavigate();

  function showGraph() {
    localStorage.setItem("stockTitle", props.title);
    localStorage.setItem("stockSymbol", "--");
    nav("/graph");
  }

  return (
    <div className='info-cube' onClick={showGraph}>
      <h3 className="cube-title">{String(props.title).length > 10 ? String(props.title).substring(0, 7) + "..." : props.title}</h3>
      <p className="cube-subtitle">{String(props.value).length > 10 ? String(props.value).substring(0, 7) + "..." : props.value}</p>
      <p className={"cube-subtitle " + (String(props.raise)[0] === '-' ? "negative" : "positive")}>{String(props.raise).length > 10 ? String(props.raise).substring(0, 7) + "%" : props.raise + "%"}</p>
    </div>
  );
}

export default Cube;