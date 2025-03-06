const Contato = require('../models/contatomodel')
exports.index = async (req, res, next) => {
  const contatos = await Contato.BuscaC()
  res.render('index', { contatos })
};
