import { MongoClient } from "mongodb";
import functions from "./tokens.js"

async function getMessagesModel(bearer, token, details) {
    try {
        const data = functions.validateToken(bearer, token);
        if (data === null) {
            return 401;
        }
        const client = new MongoClient("mongodb://127.0.0.1:27017");
        client.connect();
        const db = client.db('InvAgent');
        const chats = db.collection('Chats');
        return await chats.find({$or: [{user1: details.params.user}, {user2: details.params.user}]}).toArray();
    } finally {
        client.close();
    }
}

async function sendMessageModel(bearer, token, details) {
    try {
        const data = functions.validateToken(bearer, token);
        if (data == null) {
            return 401;
        }
        const client = new MongoClient("mongodb://127.0.0.1:27017");
        client.connect();
        const db = client.db('InvAgent');
        const chats = db.collection('Chats');
        let res = await chats.find({ $or: [{ user1: details.user1, user2: details.user2 }, {user1: details.user2, user2:details.user1}]}).toArray()[0];
        const date = new Date();
        res.messages.push({message: details.message, time: date.getHours() + ":" + date.getMinutes()})
        res.date = date.getDay() + "-" + (date.getMonth() + 1) + '-' + date.getFullYear();
        await chats.updateOne({$or: [{ user1: details.user1, user2: details.user2 }, { user1: details.user2, user2: details.user2 }]}, {$set: res})
        /*send with socket io to*/
    } finally {
        client.close();
    }
}

async function createChatModel(bearer, token, details, username) {
    try {
        const data = functions.validateToken(bearer, token);
        if (data == null) {
            return 401;
        }
        const client = new MongoClient("mongodb://127.0.0.1:27017");
        client.connect();
        const db = client.db('InvAgent');
        const users = db.collection('Users');
        let res = await users.find({username: details.friend}).toArray();
        if (res.length == 0) {
            return 401
        }
        const chats = db.collection('Chats');
        const date = new Date();
        chats.insertOne({user1: username, user2: details.friend, messages: [], date: ate.getDay() + "-" + (date.getMonth() + 1) + '-' + date.getFullYear()});
        client.close();
    } finally {
        client.close();
    }
}

export default {sendMessageModel, getMessagesModel, createChatModel}