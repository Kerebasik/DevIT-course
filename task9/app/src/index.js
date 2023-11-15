import express from "express"
import {gameRouter} from "./routes/gameRouter.js";
import {MongoClient} from "mongodb";
import * as path from "path"
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import cors from 'cors'

dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT;
const DB_URL = String(process.env.DB_URL);

const app = express();
const mongoDB = new MongoClient(DB_URL)

app.use(cors())
app.use(express.static(path.resolve( __dirname, '..', 'public', 'static')));
app.use(express.json())

app.use('/api', gameRouter)

app.get('/ping',(req, res)=>{
    res.json({message:"pong"})
})

app.get("*", (req, res) => {
    try {
        res.sendFile(path.resolve( __dirname, '..', 'public', 'static', 'index.html'));
    } catch (e) {
        console.log(e)
    }
});

const start = async () => {
    try {
        await mongoDB.connect()
        app.locals.games = mongoDB.db("blackJack").collection("games");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.error(e)
    }
}

start()