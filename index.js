import express from 'express';
import catRouter from "./catRouter.js";
import './helpers.js';

const app = express();
app.use(express.static('public'))

app.set('view engine', 'hbs');

app.use('/cats', catRouter);

app.get('/', (req, res) => {
    res.send('Hello world');
})



app.listen(3000, () => {
    console.log('Server up on 3000 port');
})