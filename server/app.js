import express from 'express';
import bodyParser from 'body-parser';
import usersRouter from './routes/users.js';
import tokensRouter from './routes/tokens.js';
import stocksRouter from './routes/stocks.js';
import favoritesRouter from './routes/favorites.js';
import aiRouter from './routes/AI.js';
import bagRouter from './routes/bag.js';
import cors from 'cors';
const app = express();

import axios from 'axios';
/*import * as cheerio from 'cheerio';

import yahooFinance from 'yahoo-finance2';*/

import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const TWELVEDATA_API_KEY = process.env.TWELVEDATA_API_KEY;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

import http from 'http';
const server = http.createServer(app);
import { Server } from "socket.io";
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI({apiKey: process.env.GEMINI_API_KEY});
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const mostPopularUniverse = ["^GSPC", "^NDX", "^DJI", "^GDAXI"]; //"S&P500", "NASDAQ", "DOW", "DAX"
const mostPopularIsrael = ["TA35.TA", "^TA125.TA", "TA90.TA", "TA-BANKS.TA"];//"תל אביב 35", "תל אביב 125", "תל אביב 90", "תל אביב בנקים - 5"
var socketArr = new Map();
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    }
});

export const myIo = io;
export const arrSoc = socketArr;

const symbols = ["^TA35", "^TA90", "^TA125", "TBNK5.TA"]
const start = '2024-07-01';
const end = '2025-07-01';

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*async function fetchIndexData(symbol) {
  const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&start_date=${start}&end_date=${end}&apikey=${TWELVEDATA_API_KEY}`;
  try {
    const res = await axios.get(url);
    console.log(res.data);
    console.log(`--- ${symbol} ---`);
    console.log(res.data.values.slice(0, 5));
  } catch (err) {
    console.error(`Error fetching ${symbol}:`, err.response?.data || err.message);
  }
}

(async () => {
  for (const symbol of symbols) {
    await fetchIndexData(symbol);
  }
})();*/

export async function searchStockByName(stockName) {
    try {
        const res = await fetch(
            "https://query2.finance.yahoo.com/v1/finance/search?q=" + encodeURIComponent(stockName),
            {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'application/json',
            },
            }
        );    
        const results = await res.json();
        //***more options*****
        /*for (const item of results.quotes.slice(0, (10 > results.quotes.length) ? results.quotes.length : 5)) { 
            console.log(`* ${item.shortname} (${item.symbol}) - ${item.quoteType}`);
        }*/
        return results.quotes.length !== 0 ? results.quotes[0].symbol : undefined;
    } catch (e) {
        console.log("try again");
        await sleep(1000);
        return searchStockByName(stockName);
    }
    
}

io.on('connection', (socket) => {
    //console.log(FINNHUB_API_KEY);

    /*async function sendValues(stock) {
        const { data } = await axios.get('https://www.investing.com/indices/us-spx-500', {
            headers: {
            "User-Agent": "Mozilla/5.0",
            },
        });

        const $ = cheerio.load(data);
        const price = $('div[data-test="instrument-price-last"]').text();

        console.log("Price:", price);
    }*/

    /*async function getStockChange(symbol, time = "1d") {
        const res = await fetch(
            "https://query1.finance.yahoo.com/v8/finance/chart/" + encodeURIComponent(symbol) + "?interval=1d&range=" + encodeURIComponent(time)
        );
        const data = await res.json();
        if (data.chart.result == null) {
            return undefined;
        }
        const candles = data.chart.result[0];
        const lastClose = candles.indicators.quote[0].close.pop();
        console.log(symbol, " - ", lastClose);
        return lastClose;
    }*/

    async function sendConnect(socket, symbols, channel) {
        let arr = ["", "", "", ""];
        for (let i = 0; i < symbols.length; i++) {
            arr[i] = getStockPrice(symbols[i], "2d");
        }
        const send = await Promise.all(arr);
        socket.emit(channel, send);
    }

    socket.on('username', (username) => {
        socketArr.set(username, socket);
        /*searchStockByName("s&p 500").then(result => {
            console.log(result);
            if (result != undefined) {
                getStockPrice(result);
            }
        });*/
        sendConnect(socket, mostPopularUniverse, "updateCommonUni");
        sendConnect(socket, mostPopularIsrael, "updateCommonIsr");
    })

    socket.on('leave', (username) => {
        socketArr.delete(username);
    });

    /*socket.on('cord', (username, x, y, z, speed) => {
        socketArr.get(username).emit('cord', x, y, z, speed);
    });*/

});

export async function getStockPrice(symbol, time) {
    try {
        const res = await fetch(
            "https://query1.finance.yahoo.com/v8/finance/chart/" + encodeURIComponent(symbol) + "?interval=1d&range=" + encodeURIComponent(time)
        );
        const data = await res.json();
        if (data.chart.result == null) {
            return undefined;
        }
        const candles = data.chart.result[0];
        //console.log(candles.indicators.quote[0].close);
        const lastClose = candles.indicators.quote[0].close[0];
        return {close: candles.indicators.quote[0].close[candles.indicators.quote[0].close.length - 1], open: candles.indicators.quote[0].close[0]};
    } catch (e) {
        console.log("try again");
        await sleep(1000);
        return getStockPrice(symbol, time);
    }
}

async function sendArrayValues(symbols, channel) {
    if (socketArr.size === 0) {
        return;
    }
    let arr = ["", "", "", ""];
    for (let i = 0; i < symbols.length; i++) {
        arr[i] = getStockPrice(symbols[i], "2d");
    }
    const send = await Promise.all(arr);
    socketArr.forEach((value, key) => {
        value.emit(channel, send);
    });
}

function repeatCommonUni() {
    sendArrayValues(mostPopularUniverse, "updateCommonUni");
    sendArrayValues(mostPopularIsrael, "updateCommonIsr");
}

const myIntervalId = setInterval(repeatCommonUni, 60 * 1000);

/*async function generateContentWithGeminiPro(promptText) {
    try {
        const result = await model.generateContent(promptText);
        const response = await result.response;
        console.log(response.text());
    } catch (error) {
        console.log("Error generating content with Gemini 2.5 Pro:", error);
        throw error;
    }
}*/

app.use(cors());
app.use(bodyParser());
app.use(express.static('public'));
app.use('/api/Users', usersRouter);
app.use('/api/Tokens', tokensRouter);
app.use('/api/Stocks', stocksRouter);
app.use('/api/Favorites', favoritesRouter);
app.use('/api/AI', aiRouter);
app.use('/api/Bag', bagRouter);
/*app.use((req, res, next) => {
    console.log(`Unhandled route: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: "Not Found" });
});*/
server.listen(5000);