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

// app.get('cats/red:id', (req, res) => {
//     const id = req.params.id;
//     connection.query('SELECT * FROM cats WHERE id=?', [id], function(err, data) {
//         if (err) {
//             return console.log(err)
//         }
//         res.render('cats/redactorCats', {
//             cats: data[0],
//             layout: 'layout',
//             title: 'Redactor cat'
//         });
//     })
// })                   


// app.post('cats/red', (req, res) => {
//     if (!req.body) return res.sendStatus(400);
//     const name = req.body.name;
//     const birthdate = req.body.age;
//     const color = req.body.color;
//     const gender = req.body.gender;
//     const length = req.body.length;
//     const weight = req.body.weight;
//     const height = req.body.height;
//     const price = req.body.price;
//     const id = req.body.id;

//     connection.query("UPDATE cats SET name=?, birthdate=?, color=?, gender=?, length=?, weight=?, height=?, price=? WHERE id=? ", [name, birthdate, gender, color, length, weight, height, price, id],
//         function(err, data) {
//             if (err) return console.log(err);

//             res.redirect("/cats");
//         });
// })

app.listen(3000, () => {
    console.log('Server up on 3000 port');
})