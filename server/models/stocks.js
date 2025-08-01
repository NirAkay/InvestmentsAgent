import { MongoClient } from "mongodb";
import functions from "./tokens.js";
import { searchStockByName, sleep } from "../app.js";

async function getDotsModels(symbol, time, interval) {
    try {
        const res = await fetch(
            "https://query1.finance.yahoo.com/v8/finance/chart/" + encodeURIComponent(symbol) + "?interval=" + encodeURIComponent(interval) + "&range=" + encodeURIComponent(time)
        );
        const data = await res.json();
        if (data.chart.result == null) {
            return undefined;
        }
        const candles = data.chart.result[0];
        return {dots: candles.indicators.quote[0].close, change: (((candles.indicators.quote[0].close[candles.indicators.quote[0].close.length - 1] - candles.indicators.quote[0].open[0]) / candles.indicators.quote[0].open[0]) * 100)};
    } catch (err) {
        console.log("try again");
        await sleep(1000);
        return getDotsModels(symbol, time, interval);
    }
}

async function returnStockModels(bearer, token, stock, timeLine, interval, symbol) {
    const data = functions.validateToken(bearer, token);
    if (data === null) {
        return 401;
    }
    if (symbol === "--") {
        symbol = await searchStockByName(stock);
    }
    return await getDotsModels(symbol, timeLine, interval);
}

export async function searchAllSymbols(stockName) {
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
    return results.quotes;
    } catch (err) {
        console.log("try again");
        await sleep(1000);
        return searchAllSymbols(stockName);
    }
}

async function searchStockModels(bearer, token, stock) {
    const data = functions.validateToken(bearer, token);
    if (data === null) {
        return 401;
    }
    let res = await searchAllSymbols(stock);
    return {stocks: res};
}

export default { returnStockModels, searchStockModels };