const express = require('express');
const route = express.Router();
const home = require('./src/controllers/homeController');
const login = require('./src/controllers/loginController');
const cadastro = require('./src/controllers/cadastroController')
const contato = require('./src/controllers/contatoController')
const { LoginRequired } = require('./src/middleware/middleware')

function middleware(req, res, next) {
    console.log()
    next()
}

route.get('/', home.index);
route.get('/login/index', login.index)
route.get('/cadastro/index', cadastro.index)
route.get('/contato/index', LoginRequired, contato.index)
route.get('/login/logout', login.logout)


route.post('/cadastro/register', cadastro.register)
route.post('/login/login', login.login)

route.post('/contato/register', LoginRequired, contato.register)
route.post('/contato/edit/:id', LoginRequired,  contato.editCont)
route.get('/contato/index/:id', LoginRequired, contato.edit)
route.get('/contato/delete/:id', LoginRequired, contato.delete)


module.exports = route;