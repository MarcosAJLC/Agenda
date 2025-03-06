const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const cadastroSchema = new mongoose.Schema({
    email: {type: String, require: true },
    password: {type: String, require: true }
})
const cadastroModel = mongoose.model('cadastro', cadastroSchema)

class cadastro {
    constructor(body){
        this.body = body
        this.errors = []
        this.user = null
    }
    async register(){
        this.valida()
        if(this.errors.length > 0) return
        await this.exists()
        if(this.errors.length > 0) return
        const salt = bcrypt.genSaltSync()
        this.body.password = bcrypt.hashSync(this.body.password, salt)
        try {
            this.user = await cadastroModel.create(this.body)
        }  catch(e) {
            console.log(e)
        }
    }
    async exists(){
        const user = await cadastroModel.findOne({email: this.body.email})
        if(user) this.errors.push('Usúario já existe')
    }
    valida(){
        this.cleanUp()
        if(!validator.isEmail(this.body.email)) this.errors.push('email inválido')
        if(this.body.password.length < 3 || this.body.password.length > 20){
            this.errors.push('a senha precisar ter entre 3 a 20 caracteres')
        }

    }
    cleanUp(){
        for(const key in  this.body) {
            if(typeof this.body[key] !== 'string'){
                this.body[key] = ''
            }
        }
        this.body = {
            email: this.body.email,
            password: this.body.password
        }
    }
}

module.exports = {
    cadastro,
    cadastroModel
}