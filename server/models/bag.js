import { MongoClient } from "mongodb";
import functions from "./tokens.js"

const key = "my secret key";

async function addBagModel(bearer, token, bag) {
    try {
        const data = functions.validateToken(bearer, token);
        if (data === null) {
            return 401;
        }
        const client = new MongoClient("mongodb://127.0.0.1:27017");
        client.connect();
        const db = client.db('InvAgent');
        const bags = db.collection('Bags');
        let res = await bags.find({ username: data.username, name: bag }).toArray();
        if (res.length > 0) {
            return 409;
        } else {
            const ret = { username: details.username, name: bag, stocks: [] };
            await bags.insertOne(ret);
            return ret;
        }
    } catch (err) {
        return 401;
    } finally {
    }
}

async function addStockToBagModel(bearer, token, bag) {
    try {
        const data = functions.validateToken(bearer, token);
        if (data === null) {
            return 401;
        }
        const client = new MongoClient("mongodb://127.0.0.1:27017");
        client.connect();
        const db = client.db('InvAgent');
        const bags = db.collection('Bags');
        let res = await bags.find({ username: data.username, name: bag }).toArray();
        if (res.length > 0) {
            
        } else {
            
        }
    } catch (err) {
        return 401;
    } finally {
    }
}

async function getBagModel(bearer, token, bag) {
    try {
        const data = functions.validateToken(bearer, token);
        if (data === null) {
            return 401;
        }
        const client = new MongoClient("mongodb://127.0.0.1:27017");
        client.connect();
        const db = client.db('InvAgent');
        const bags = db.collection('Bags');
        let res = await bags.find({ username: data.username, name: bag }).toArray();
        return res[0];
    } catch (err) {
        return 401;
    } finally {
    }
}

async function getBagsNamesModel(bearer, token, bag) {
    try {
        const data = functions.validateToken(bearer, token);
        if (data === null) {
            return 401;
        }
        const client = new MongoClient("mongodb://127.0.0.1:27017");
        client.connect();
        const db = client.db('InvAgent');
        const bags = db.collection('Bags');
        let res = await bags.find({ username: data.username }).toArray();
        let ret = [];
        for (let i = 0; i < res.length; i++) {
            ret.push(res[i].name);
        }
        return {names: ret};
    } catch (err) {
        return 401;
    } finally {
    }
}

async function deleteBagModel(bearer, token, bag) {
    try {
        const data = functions.validateToken(bearer, token);
        if (data === null) {
            return 401;
        }
        const client = new MongoClient("mongodb://127.0.0.1:27017");
        client.connect();
        const db = client.db('InvAgent');
        const bags = db.collection('Bags');
        let res = await bags.deleteOne({ username: data.username, name: bag });
        return 200;
    } catch (err) {
        return 401;
    } finally {
    }
}



export default { getBagModel, getBagsNamesModel, addStockToBagModel, addBagModel, updateStockFromBagModel, deleteBagModel }