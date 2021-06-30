import moment from "moment";

class Cat {
    id;
    name;
    birthdate;
    length;
    weight;
    height;
    price;
    color;
    photo;
    gender;

    static colors = ["абиссинский пойнт", "агути", "арлекин", "белый альбинос", "белый окрас", "биколор", "блю-пойнт", "ван", "ван биколор", "голубая шиншилла", "голубой", "голубой дымчатый", "голубой серебристый табби", "голубокремовый черепаховый", "доминирующий белый", "дымчатый", "дымчатый окрас", "затененный окрас", "затушеванный", "кpасный", "кpемовый", "калико", "камео", "классический табби, мраморный табби", "красный дымчатый", "крем-пойнт", "лиловый дымчатый", "линкс табби-пойнт", "меланина", "миттед ", "норка ", "окрасы кошек", "ослабленный окрас", "партиколор ", "пойнт ", "пятнистый табби ", "ред-пойнт", "с белым медальоном", "с белыми перчатками ", "с белыми пуговицами", "сепия", "серебристый окрас", "серебристый табби", "сил-пойнт ", "смокинг", "солиды", "сплошной ", "сплошные белые пятна", "сплошные окрасы", "табби", "табби ", "табби-макрель", "табби-пойнт", "тикинг", "тиккированный табби, абиссинский табби или агути табби", "типинг", "торби", "торбико", "торти-пойнт ", "триколор ", "феомеланин", "черепаховый окрас", "черепаховый пойнт", "черный", "черный дымчатый", "черный серебристый табби", "шиншилла", "шиншилла ", "шоколад-пойнт", "шоколадная затушеванная", "шоколадный", "шоколадный дым", "эумеланин"];

    get age() {
        moment.locale('ru');
        const m = moment(Number.parseInt(this.birthdate))
        return m.fromNow(true);
    }

    get colorName() {
        return Cat.colors[this.color];
    }

    constructor(name, birthdate, color, photo, gender, length, weight, height, price, id = undefined) {
        this.length = length;
        this.weight = weight;
        this.height = height;
        this.price = price;
        this.name = name;
        this.birthdate = birthdate;
        this.color = color;
        this.photo = photo;
        this.gender = gender;
        this.id = id;
    }

    static createCatFrom(obj) {
        return new Cat(
            obj.name,
            Date.parse(obj.birthdate),
            obj.color,
            obj.photo,
            obj.gender,
            obj.length,
            obj.weight,
            obj.height,
            obj.price,
            obj.id)
    }

    static remove(connection, id) {
        return connection.promise().query(
            'DELETE FROM `cats` WHERE `id`=?', [id]
        )
    }

    static getPage(connection, page = 1) {
        const offset = (page - 1) * 10
        return Promise.all([
            connection.promise().query(
                'SELECT * FROM `cats` LIMIT 10 OFFSET ?', [offset]
            )
            .then(res => {
                let cats = res.shift();
                cats = cats.map(Cat.createCatFrom)
                return cats;
            })
            .catch(error => {
                console.log(error);
            }),
            connection
            .promise()
            .query('SELECT COUNT(*) as count FROM `cats`')
            .then(data => {
                return data.shift().shift().count
            })
            .catch(error => {
                console.log(error);
            })
        ])
    }

    static getByShop(connection, filter) {
        let params = []
        let query = 'SELECT * FROM `cats` '

        if (Object.keys(filter).length) {
            if (filter.priceFrom.length) {
                query += 'WHERE `price` > ?'
                params.push(Number.parseInt(filter.priceFrom));
            }
            if (filter.priceTo.length) {
                if (params.length) {
                    query += ' AND ';
                } else {
                    query += ' WHERE ';
                }
                query += ' `price` < ?'
                params.push(Number.parseInt(filter.priceTo));
            }
            if (filter.gender.length && filter.gender !== '2') {
                if (params.length) {
                    query += ' AND ';
                } else {
                    query += ' WHERE ';
                }
                query += ' `gender` = ?';
                params.push(Number.parseInt(filter.gender));
            }
            if (filter.age.length) {
                if (params.length) {
                    query += ' AND ';
                } else {
                    query += ' WHERE ';
                }
                query += ' `birthdate` < ?'
                params.push(filter.age);
            }
        }
        query += ' LIMIT 20';
        return connection.promise().query(query, params)
            .then(rows => {
                let cats = rows.shift();
                cats = cats.map(Cat.createCatFrom)
                return Promise.resolve(cats);
            })
    }

    static getById(connection, id) {
        return connection.promise().query(
                'SELECT * FROM `cats` WHERE `id`=?', [id]
            )
            .then(rows => {
                const array = rows.shift();
                if (array.length) {
                    const cat = Cat.createCatFrom(array.shift());
                    return Promise.resolve(cat)
                } else {
                    return Promise.reject('Cat not found');
                }
            })
            .catch(() => {
                return Promise.reject('Cat not found');
            })
    }

    save(connection) {
        if (this.id === undefined) {
            return connection.promise().query(
                    'UPDATE INTO `cats` (`name`, `birthdate`, `color`,`photo`, `gender`, `length`, `weight`, `height`, `price`) VALUES (?,?,?,?,?,?,?,?,?)', [
                        this.name,
                        this.birthdate,
                        Cat.colors.indexOf(this.color),
                        this.photo,
                        this.gender,
                        this.length,
                        this.weight,
                        this.height,
                        this.price
                    ])
                .then((rows) => {
                    this.id = rows.shift().insertId;
                    return Promise.resolve(this);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }
}

export default Cat