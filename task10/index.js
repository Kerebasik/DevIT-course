import express from 'express'
import {stringify} from 'querystring'
import axios from "axios";

const shopifyApiKey = '15a0b9de14b3ab5e27dc833f6e716b68';
const shopifyApiSecret = '30524066f5a20b8c22890089ad5bbf9e';
const shopifyScope = 'read_products';

const PORT = 80;
const app = express();
app.use(express.json())

const authUrl = `https://firststore228337.myshopify.com/admin/oauth/authorize?client_id=15a0b9de14b3ab5e27dc833f6e716b68&scope=read_products&redirect_uri=https://sharp-falcons-push.loca.lt/callback`;

app.get('/callback', async (req, res)=>{
    const { shop, code } = req.query;

    const accessTokenRequest = {
        client_id: '15a0b9de14b3ab5e27dc833f6e716b68',
        client_secret: '30524066f5a20b8c22890089ad5bbf9e',
        code,
    };
    try {
        const tokenResponse = await axios.post(`https://firststore228337.myshopify.com/admin/oauth/access_token`, stringify(accessTokenRequest), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        console.log(tokenResponse)
        // Вывести информацию о товарах
        res.json(tokenResponse.data.access_token);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка получения токена доступа');
    }
})


app.listen(PORT, ()=>{
    console.log('Server Listen')
})