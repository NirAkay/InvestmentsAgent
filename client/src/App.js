import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import GraphPage from './GraphPage';
import Search from './Search';
import backgroundImage from './assets/background.png';

function App() {
  const [token, setToken] = useState();
  const [socket, setSocket] = useState(null);
  const [favoritesStockList, setFavoritesStockList] = useState([]);

  return (
    <div className="App" style={{
        height: '100vh',
        width: '100vw',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
      }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login token={token} setToken={setToken} socket={socket} setSocket={setSocket} setFavoritesStockList={setFavoritesStockList}/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home socket={socket} setSocket={setSocket} favoritesStockList={favoritesStockList}/>}/>
          <Route path="/graph" element={<GraphPage favoritesStockList={favoritesStockList} setFavoritesStockList={setFavoritesStockList}/>}/>
          <Route path="/search" element={<Search/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
