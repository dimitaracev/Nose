const Nose = require('../src/nose');
const Route = require('../src/route');

const app = new Nose();

const home = new Route();


home.ChildGet('/hello', (req, res) => {
    res.end('Child World!');
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