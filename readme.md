# install dependencies
```bash
npm install
```

# table
```sql
CREATE TABLE `cats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `birthdate` date NOT NULL,
  `color` int(11) DEFAULT NULL,
  `photo` text DEFAULT NULL,
  `gender` tinyint(1) DEFAULT NULL,
  `length` float DEFAULT NULL,
  `weight` float DEFAULT NULL,
  `height` float DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;


```
# insert data to table
```bash
node insert.js
```

# run server
```bash
npx nodemon
```
