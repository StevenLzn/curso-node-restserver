const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async(req, res = response) => {

    // req.query sirve para obtener parametros de la url
    // por ejemplo en este caso: /usuarios?q=hola&limit=10
    // Podemos extraer q y limit de la url 
    // const { q, limit, name = 'No name', page = 1 } = req.query;
    
    // Obtenemos el limite y el desde que llega por parametro en la url
    const { limit = 5, desde = 0 } = req.query;
    const query = { estado: true };

    // .limit sirve para poner un limite a la cantidad de datos que queremos consultar
    // .skip sirve para inidicar desde que dato se quiere consultar
    // como parametro del find podemos pasar condiciones para la consulta
    // En este caso solo queremos los usuarios que estado sea true (usuarios activos)
    
    // Obtenemos el total de registros de un documento con countDocuments
    // Y para consultar con una condición lo pasamos como parametro
    // En este caso solo contaría los registros que tengan estado en true ( usuarios activos )
    
    // Promise.all nos sirve para mandar un arreglo con todas las promesas que se quieren ejecutar
    // Como una promesa no depende de la otra, entonces se pueden ejecutar ambas al mismo tiempo
    // Si se hiciera un await en ambas consultas, tendríamos mucho mas tiempo de espera
    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limit))
    ])


    // Así se demora el doble que con el arreglo de promesas
    /*
    const usuarios = await Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limit));

    const total = await Usuario.countDocuments(query);*/

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async(req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar la contraseña
    // el salt es un string random, por defecto genSaltSync, da 10 vueltas para generarlo
    // entre mas vueltas mas segura es la contraseña, por defecto al llamar el metodo, hace 10 vueltas
    const salt = bcryptjs.genSaltSync();

    // Antes de guardar el usuario, cambiamos el valor de la password del objeto usuario por la password encriptada
    // Se pasa como parametro primero el password y luego el salt para encriptarla
    usuario.password = bcryptjs.hashSync( password, salt)

    // Guardar DB
    await usuario.save();

    res.status(201).json({
        usuario
    });
}

const usuariosPut = async(req, res = response) => {

    // Obtener parametros de una ruta
    // Primero se le establece en las rutas con /:parametro
    // Y así como se le llama en las rutas se llama en el controlador con req.params.
    const { id } = req.params;
    // Separamos lo que no vamos actualizar (password y login con google), del resto
    
    const { _id, password, google, correo, ...resto} = req.body;

    // En caso de que si llegue la password significa que se va actualizar
    // En ese caso se vuelve a encriptar
    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt)
    }

    // Buscamos por id y actualizamos, el primer dato es el id y el segundo los campos que se actualizan
    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json( usuario );
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    });
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;

    // Borrar fisicamente - NO RECOMENDADO
    // const usuario = await Usuario.findByIdAndDelete( id );

    // Borrar inactivando usuario - RECOMENDADO
    // Se actualiza el estado a false para inactivar
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false })

    res.json({
        usuario
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}