const Cadastro = require('../models/cadastromodel')
const Login = require('../models/loginmodel')
exports.index = (req, res) =>{
    res.render('cadastro')
}
exports.register = async (req, res) => {
    try{
        const cadastro = new Cadastro.cadastro(req.body)
        await cadastro.register()
        const login = new Login(req.body)
        await login.login();
        if(cadastro.errors.length > 0){
            req.flash('errors', cadastro.errors)
            req.session.save(function(){
                return res.redirect('/cadastro/index')
            })
            return
        }
        req.flash('success', 'Seu usuário foi criado com sucesso.');
        req.session.user = login.user
        req.session.save(function(){
            return res.redirect('/')
        })
        return
        }catch(e){
        console.log(e)
        return res.render('404')}}