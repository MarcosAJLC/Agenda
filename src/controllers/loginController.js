const Login = require('../models/loginmodel')
exports.index = (req, res) =>{
    res.render('login')
}
exports.login = async function(req, res) {
    try {
      const login = new Login(req.body);
      await login.login();
  
      if(login.errors.length > 0) {
        req.flash('errors', login.errors);
        req.session.save(function() {
          return res.redirect('/login/index');
        });
        return;
      }
  
      req.flash('success', 'Você entrou no sistema.');
      req.session.user = login.user;
      req.session.save(() => {
        return res.redirect('/');
      });
    } catch(e) {
      console.log(e);
      return res.render('404');
    }
  };

exports.logout = function(req, res){
  req.session.destroy()
  res.redirect('/')
}