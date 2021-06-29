import connection from "./db.js";
import Cat from "./Cat.js";
import express from 'express';
import bodyParser from "body-parser";
import { body, query, validationResult } from 'express-validator';
import multer from 'multer';
const upload = multer({ dest: 'public/upload' });
const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false });


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))

// router.get('/shop', async(req, res) => {
//     try {
//         const query = {
//             priceFrom: req.query.priceFrom ? ? '',
//             priceTo: req.query.priceTo ? ? '',
//             age: req.query.age ? ? '',
//             gender: req.query.gender ? ? 2
//         };
//         const cats = await Cat.getByShop(connection, req.query)
//         res.render('cats/shop', { query: query, cats: cats, layout: 'layout', title: 'Buy super cats' })
//     } catch (e) {
//         console.log(e);
//     }
// })

router.get('/', async(req, res) => {
    const page = req.query.page || 1;
    const data = await Cat.getPage(connection, page)
    res.render(
        'cats/index', {
            cats: data[0],
            total: Math.ceil(data[1] / 10),
            page: page,
            layout: 'layout',
            title: 'List all cats'
        }
    )

});
router.get('/red:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM cats WHERE id=?', [id], function(err, data) {
        if (err) {
            return console.log(err)
        }
        res.render('cats/redactorCats', {
            cats: data[0],
            layout: 'layout',
            title: 'Redactor cat'
        });
    })
})

router.post('/red:id', urlencodedParser, function(req, res) {
    if (!req.body) return res.sendStatus(400);
    const name = req.body.name;
    const birthdate = req.body.age;
    const color = req.body.color;
    const gender = req.body.gender;
    const length = req.body.length;
    const weight = req.body.weight;
    const height = req.body.height;
    const price = req.body.price;
    const id = req.body.id;

    // cat.save(connection)
    //     .then(cat => {
    //         res.redirect(`/cats/${cat.id}`)
    //     })
    connection.query("UPDATE cats SET name=?, birthdate=?, color=?, gender=?, length=?, weight=?, height=?, price=? WHERE id=? ", [name, birthdate, gender, color, length, weight, height, price, id],
        function(err, data) {
            if (err) return console.log(err);

            res.redirect("/cats");
        });
})
router.post('/', (req, res) => {
    if (req.body._method === 'DELETE') {
        Cat.remove(connection, req.body.id)
            .then(() => {
                res.redirect('/cats');
            })
            .catch(() => {
                res.status(404).send();
            })
    }
})

router.get('/create', (req, res) => {
    res.render('cats/create', { colors: Cat.colors, layout: 'layout', title: 'Add new cat' })
})

router.post(
    '/create',
    // body('name')
    //     .trim()
    //     .escape()
    //     .isLength({ min: 5 })
    //     .withMessage('must be at least 5 chars long'),
    // body('weight').isFloat({min:1, max: 10}),
    upload.single('photo'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('cats/create', { errors: errors.array(), colors: Cat.colors, layout: 'layout', title: 'Add new cat' })
        }
        const cat = new Cat(
            req.body.name,
            req.body.age,
            req.body.color,
            `/upload/${req.file.filename}`,
            req.body.gender,
            req.body.length,
            req.body.weight,
            req.body.height,
            req.body.price
        )
        cat.save(connection)
            .then(cat => {
                res.redirect(`/cats/${cat.id}`)
            })
            // res.json(req.body);
    })








router.get('/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);
    Cat.getById(connection, id)
        .then(cat => {
            res.render('cats/view', { cat: cat, layout: 'layout', title: `View: ${cat.name}` })
        })
        .catch(() => {
            res.status(404).send();
        })
})

export default router