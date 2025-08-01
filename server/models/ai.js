import { MongoClient } from "mongodb";
import functions from "./tokens.js"
import { GEMINI_API_KEY } from "../app.js";

const key = "my secret key";

async function getStockAdviceModel(bearer, token, stock) {
    const data = functions.validateToken(bearer, token);
    if (data === null) {
        return 401;
    }
    const body = {
    contents: [{
        parts: [{ text: "I need an analize if it is worthing to invest" + stock + "?\n please give me a rank to this investment from 1 to 10. your answer needs to be up to 100 words!" }]
    }]};
    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        const result = await response.json();
        return {text: result.candidates[0].content.parts[0].text};
    } catch (error) {
        console.error("Error calling Gemini:", error);
    }
}

export default { getStockAdviceModel}