require('dotenv').config();  // Carregar variáveis de ambiente

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const helmet = require('helmet');
const routes = require('./routes');
const csfr = require('csurf');
const { middlewareGlobal, checkCSRF404, csrfMiddleware } = require('./src/middleware/middleware');

// Conectar ao MongoDB
const connectionString = process.env.MONGODB_URI;

mongoose.connect(connectionString)
  .then(() => {
    console.log("Conectado ao MongoDB");
    app.emit('pronto');
  })
  .catch((err) => {
    console.error("Erro de conexão ao MongoDB:", err);
  });

// Configurações do Express
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET || 'segredoPadrao',
  store: MongoStore.create({ mongoUrl: connectionString }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true }
}));

// Configuração de EJS
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// Middleware de CSRF
app.use(csfr());
app.use(middlewareGlobal);
app.use(checkCSRF404);
app.use(csrfMiddleware);

// Definindo as rotas
app.use(routes);

// Rota principal
app.get('/', (req, res) => {
  res.render('index'); // Renderiza a view 'index.ejs' na pasta 'src/views'
});

// Quando o MongoDB estiver pronto, inicie o servidor
app.on('pronto', () => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
});
