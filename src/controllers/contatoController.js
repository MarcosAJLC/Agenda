const ContatoM = require('../models/contatomodel')
exports.index = (req, res) => {
  res.render('contato', {
    contato: {}
  });
}
exports.register = async (req, res) => {
  try {
    const contat = new ContatoM(req.body);
    await contat.register();

    if (contat.errors.length > 0) {
      req.flash('errors', contat.errors);
      req.session.save(() => res.redirect('/'));
      return;
    }

    req.flash('success', 'Contato registrado com sucesso.');
    req.session.save(() => res.redirect(`/contato/index/${req.params.id}`));
    return;
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
};
exports.edit = async function (req, res) {
  if (!req.params.id) return res.render('404');

  const contato = await ContatoM.Busca(req.params.id);
  if (!contato) return res.render('404');

  res.render('contato', { contato });
};

exports.editCont = async function (req, res) {
  try {
    if(!req.params.id) return res.render('404');
    const contato = new ContatoM(req.body);
    await contato.editCont(req.params.id);

    if(contato.errors.length > 0) {
      req.flash('errors', contato.errors);
      req.session.save(() => res.redirect(`/`));
      return;
    }

    req.flash('success', 'Contato editado com sucesso.');
    req.session.save(() => res.redirect(`/`));
    return;
  } catch(e) {
    console.log(e);
    res.render('404');
  }
}
exports.delete = async function(req, res) {
  if(!req.params.id) return res.render('404');

  const contato = await ContatoM.delete(req.params.id);
  if(!contato) return res.render('404');

  req.flash('success', 'Contato apagado com sucesso.');
  req.session.save(() => res.redirect('/'));
  return;
};