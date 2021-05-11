const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },

    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },

    img: {
        type: String,
    },

    rol: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE']
    },

    estado: {
        type: Boolean,
        default: true
    },
    
    google: {
        type: Boolean,
        default: false
    },
})

// Tiene que ser una función normal y no de flecha para que mantenga la referencia a la instancia del objeto creada
// Esto hace que cuando se llame el toJson, ejecuta esta función
// Esta funcion saca el __v y la password de la response cuando se crea el usuario
UsuarioSchema.methods.toJSON = function() {
    // desestructuramos la instancia del objeto
    // Y de esa instancia sacamos la __v y la password
    // y aparte el ...usuario tiene el resto de propiedades
    // estas propiedades de ...usuario son las que se van a retornar
    const { __v, password, ...usuario } = this.toObject();

    return usuario;
}

// El primer parametro es el nombre que se le va asignar
// a la colección de mongo, por defecto le agrega una 's'
// Esto crearía el modelo en la base de datos
module.exports = model( 'Usuario', UsuarioSchema);