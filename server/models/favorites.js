import { MongoClient } from "mongodb";
import functions from "./tokens.js"
import stocks from "./stocks.js";

const key = "my secret key";
const mostPopularUniverse = {"S&P500": "^GSPC", "NASDAQ": "^NDX", "DOW": "^DJI", "DAX": "^GDAXI"};

async function getFavoritesModels(bearer, token) {
    try {
        const data = functions.validateToken(bearer, token);
        if (data === null) {
            return 401;
        }
        const client = new MongoClient("mongodb://127.0.0.1:27017");
        client.connect();
        const db = client.db('InvAgent');
        const users = db.collection('Favorites');
        let res = await users.find({ username: data.username }).toArray();
        return res == [] ? {stocks: []} : {stocks: res[0].stocks};
    } catch (err) {
        return 401;
    } finally {
    }
}

async function addToFavoritesModels(bearer, token, stock, symbol) {
    try {
        const data = functions.validateToken(bearer, token);
        if (data === null) {
            return 401;
        }
        const client = new MongoClient("mongodb://127.0.0.1:27017");
        client.connect();
        const db = client.db('InvAgent');
        const users = db.collection('Favorites');
        if (symbol === "--") {
            symbol = mostPopularUniverse[stock];
        }
        await users.updateOne({ username: data.username }, {$addToSet: {stocks: {stock: stock, symbol: symbol}}}, { upsert: true } );
        return 200;
    } catch (err) {
        return 401;
    } finally {
    }
}

async function deleteFromFavoritesModels(bearer, token, stock, symbol) {
    try {
        const data = functions.validateToken(bearer, token);
        if (data === null) {
            return 401;
        }
        const client = new MongoClient("mongodb://127.0.0.1:27017");
        client.connect();
        const db = client.db('InvAgent');
        const users = db.collection('Favorites');
        if (symbol === "--") {
            symbol = mostPopularUniverse[stock];
        }
        await users.updateOne({ username: data.username }, {$pull: {stocks: {stock: stock, symbol: symbol}}});
        return 200;
    } catch (err) {
        return 401;
    } finally {
    }
}

export default { getFavoritesModels, addToFavoritesModels, deleteFromFavoritesModels}