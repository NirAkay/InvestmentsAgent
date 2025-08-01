import { Heap } from 'heap-js';
import { MongoClient } from "mongodb";
import functions from "./tokens.js"

const key = "my secret key";


async function insrtUser(details) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        client.connect();
        const db = client.db('InvAgent');
        const users = db.collection('Users');
        let res = await users.find({ username: details.username }).toArray();
        if (res.length > 0) {
            return 409;
        } else {
            const ret = { username: details.username, password: details.password };
            await users.insertOne(ret);
            return ret;
        }
    } finally {
        client.close();
    }
}

async function getUserInfo(bearer, token) {
    try {
        const data = functions.validateToken(bearer, token);
        if (data === null) {
            return 401;
        }
        const client = new MongoClient("mongodb://127.0.0.1:27017");
        client.connect();
        const db = client.db('InvAgent');
        const users = db.collection('Users');
        let res = await users.find({ username: data.username }).toArray();
        return res[0];
    } catch (err) {
        return 401;
    } finally {
    }
}

async function delUser(bearer, token) {
    try {
        const data = functions.validateToken(bearer, token);
        if (data === null) {
            return 401;
        }
        const client = new MongoClient("mongodb://127.0.0.1:27017");
        client.connect();
        const db = client.db('InvAgent');
        const users = db.collection('Users');
        let res = await users.deleteOne({ username: data.username });
        return 200;
    } catch (err) {
        return 401;
    } finally {
    }
}

async function resetUserModels(bearer, token) {
    /*try {
        const data = functions.validateToken(bearer, token);
        if (data === null) {
            return 401;
        }
        const client = new MongoClient("mongodb://127.0.0.1:27017");
        client.connect();
        const db = client.db('InvAgent');
        const users = db.collection('Users');
        await users.updateOne({ username: data.username },
            { $set: { world: "Forest", task: "Swing", state: 0, score: 0 } });
        return 200;
    } catch (err) {
        return 401;
    } finally {
    }*/
}



export default { insrtUser, getUserInfo, delUser, resetUserModels}