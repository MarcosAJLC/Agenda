require('dotenv').config()
const express = require('express');
const app = express();
const moongoose = require('mongoose')
const connetionString = process.env.MONGODB_URI;
moongoose.connect(connetionString)
  .then(() => {
    app.emit('pronto')
  })
  .catch(e => console.log(e))
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const helmet = require('helmet')
const routes = require('./routes');
const path = require('path');
const csfr = require('csurf')
const { middlewareGlobal, checkCSRF404, csrfMiddleware } = require('./src/middleware/middleware');
app.use(helmet())
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, 'public')));
const sessionsopt = session({
  secret: 'Bem vindo!',
  store: MongoStore.create({ mongoUrl: 'mongodb+srv://MarcosAlexandre:emigam2008@cluster0.9ww0n.mongodb.net/Database' }),
  

  // mongodb+srv://MarcosAlexandre:emigam2008@cluster0.9ww0n.mongodb.net/Database?retryWrites=true&w=majority&appName=Cluster0
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
})
app.use(sessionsopt)
app.use(flash())
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');
app.use(csfr())
app.use(middlewareGlobal);
app.use(checkCSRF404);
app.use(csrfMiddleware)
app.use(routes);
app.on('pronto', () => {
  app.listen(3000, () => {
    console.log(`Servidor rodando na porta`);
});
})
