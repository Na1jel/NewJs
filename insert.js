import faker from 'faker';
import Cat from './Cat.js';
import connection from "./db.js";
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const promises = [];
const images = fs.readdirSync(`${__dirname}/public/cats`);

for (let i = 1; i < 1500; i++) {
    const cat = new Cat(
        faker.animal.cat(),
        faker.date.past().toISOString().slice(0,10),
        faker.random.arrayElement(Cat.colors),
        `/cats/${faker.random.arrayElement(images)}`,
        faker.random.arrayElement([0, 1]),
        faker.datatype.number({max : 60, min: 20}),
        faker.datatype.float({max : 10, min: 1}),
        faker.datatype.number({max : 30, min: 10}),
        faker.datatype.number({max : 1000, min: 100}),
    )
    promises.push(cat.save(connection)
        .then(c => {
            console.log(`${c.name} - ${c.color}`);
        }));
}

Promise.all(promises)
    .then(() => {
        connection.end();
    })
