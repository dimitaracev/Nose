# Nose
Nose is a simple NodeJS router

## Installing
npm
```
npm install nosejs
```

## Usage
A simple http server would look like this:
```js
const Nose = require('nosejs');
const Route = require('nosejs').Route;
const path = require('path');

const app = new Nose({
    port: 8079,
    static: path.join(__dirname, 'static')
});

const home = new Route();

home.ChildGet('/hello', (req, res) => {
    res.render('hello.html');
})

home.ChildGet('/user/:id', (req, res) => {
    res.end(req.params['id']);
})

home.Get((req, res) => {
    res.end('Hello World!');
})


app.Use((req, res, next) => {
    console.log(new Date());
    next();
})

app.SetNotFound((req, res) => {
    res.end('404 - Not Found');
})


app.SetRoute('/home', home);
app.Listen();
```