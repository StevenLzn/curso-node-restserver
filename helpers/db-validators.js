const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });

    if(!existeRol){
            throw new Error(`El rol ${rol} no está registrado en la BD`)
    }
}

const emailExiste = async(correo = '') => {
    // Verificar si el correo existe
    // Buscamos si existe un correo igual, con findOne de mongoose
    const existeEmail = await Usuario.findOne({ correo });

    // Si el correo existe entonces devolvemos como respuesta
    // Un status 400 con el mensaje de error
    if(existeEmail){
        throw new Error(`El correo ${correo} ya está registrado`)
    }
}

const existeUsuarioPorId = async( id ) => {
    
    const existeUsuario = await Usuario.findById(id);

    if(!existeUsuario){
        throw new Error(`El id no existe ${id}`)
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}