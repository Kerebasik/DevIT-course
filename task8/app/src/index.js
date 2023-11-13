const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.use(express.static(path.resolve(__dirname, '..', 'public', 'static')));

app.get('/ping',(req, res)=>{
    res.json({message:"pong"})
})

app.get('*', (req, res) => {
    res.render(path.resolve(__dirname, '..', 'public', 'static', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});