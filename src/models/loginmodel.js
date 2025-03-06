const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const cadastro = require('./cadastromodel.js')

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {
    this.valida();
    if(this.errors.length > 0) return;
    this.user = await cadastro.cadastroModel.findOne({ email: this.body.email });

    if(!this.user) {
      this.errors.push('Usuário não existe.');
      return;
    }

    if(!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha inválida');
      this.user = null;
      return;
    }
  }

  async register() {
    this.valida();
    if(this.errors.length > 0) return;

    await this.userExists();

    if(this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    this.user = await cadastro.cadastroModel.create(this.body);
  }

  async userExists() {
    this.user = await cadastro.cadastroModel.findOne({ email: this.body.email });
  }

  valida() {
    this.cleanUp();
  }

  cleanUp() {
    for(const key in this.body) {
      if(typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password
    };
  }
}

module.exports = Login;