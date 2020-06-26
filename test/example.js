const Nose = require('nosejs');
const Route = require('nosejs').Route;
const path = require('path');
const app = new Nose();

const home = new Route();

app.Static(path.join(__dirname, '..', 'static'));

home.ChildGet('/hello', (req, res) => {
    res.render('index.html');
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

app.SetRoute('/home', home);
app.Listen(8080);