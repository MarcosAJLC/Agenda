const ContatoM = require('../models/contatomodel');
const mongoose = require('mongoose');

exports.index = (req, res) => {
  res.render('contato', {
    contato: {}
  });
};

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
    req.session.save(() => res.redirect(`/contato/index/${contat.contato._id}`));
    return;
  } catch (e) {
    console.error(e);
    return res.render('404');
  }
};

exports.edit = async function (req, res) {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    console.error("ID inválido:", id);
    return res.render('404');
  }

  try {
    const contato = await ContatoM.Busca(id);
    if (!contato) return res.render('404');

    res.render('contato', { contato });
  } catch (error) {
    console.error(error);
    return res.render('404');
  }
};

exports.editCont = async function (req, res) {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.render('404');
    }

    const contato = new ContatoM(req.body);
    await contato.editCont(id);

    if (contato.errors.length > 0) {
      req.flash('errors', contato.errors);
      req.session.save(() => res.redirect(`/`));
      return;
    }

    req.flash('success', 'Contato editado com sucesso.');
    req.session.save(() => res.redirect(`/`));
    return;
  } catch (e) {
    console.error(e);
    res.render('404');
  }
};

exports.delete = async function (req, res) {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.render('404');
  }

  const contato = await ContatoM.delete(id);
  if (!contato) return res.render('404');

  req.flash('success', 'Contato apagado com sucesso.');
  req.session.save(() => res.redirect('/'));
  return;
};
