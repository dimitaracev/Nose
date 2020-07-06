# Nose
Nose is a simple NodeJS router
* Under early development, changes may occur

## Installing
npm
```
npm install nosejs
```

## Engines
* Currently supported engines: ejs, mustache, handlebars.

## Usage
A simple http server would look like this:
```js
const Nose = require('nosejs');
const Route = require('nosejs').Route;
const path = require('path');
const ejs = require('ejs');

const app = new Nose({
    port: 8079,
    static: path.join(__dirname, 'static'),
    engine_name: 'ejs',
    engine: ejs
});

const home = new Route();

home.Get((req, res) => {
    res.end('Hello World!');
})

home.ChildGet('/user/:id', (req, res) => {
    res.render('index.ejs', { user : req.params['id'] });
})

app.Use((req, res, next) => {
    console.log(new Date());
    next();
})

app.SetNotFound((req, res) => {
    res.render('404.html');
})

app.SetRoute('/', home);
app.Listen();
```