// En vez de importar asi const mongoose = require('mongoose'); 
// usamos desestructuracion
const { Schema, model } = require('mongoose');
// La definicion de los registros de una coleccion de usuarios
// equivalente a una tabla de usuarios en mysql con sus campos
const UsuarioSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    code:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    countryisoCode:{
        type: String,
        required: true
    },
    language:{
        type: String,
        default: 'español'
    },
    country:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    img:{
        type: String,
    },
    role:{
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google:{
        type: Boolean,
        default: false
    },
    status:{
        type: Number,
        default: 1 // 1 = activo, 0 = inactivo, 2 = bloqueado
    },
    active:{
        type: Boolean,
        default: false
    },
    max_sessions:{
        type: Number,
        default: 1
    }
});
// Este metodo es opcional, es para modificar el objeto de salida
// cambia el identificador del id por uid de la response, y 
// hace que no retorne el password también 
UsuarioSchema.method('toJSON', function(){
    const { __v, _id, password, ...object} = this.toObject();
    object.uid=_id;
    return object;
})

UsuarioSchema.method('toCustomA', function(){
    const { __v, _id, ...object} = this.toObject();
    const exit = {
        uid: _id,
        img: object.img,
        name: object.name,
        email: object.email,
        code: object.code,
        phone: object.phone,
        country: object.country,
        countryisoCode: object.countryisoCode,
        city: object.city,
        language: object.language,
        role: object.role,
    }
    return exit;
})
module.exports = model('Usuario', UsuarioSchema);