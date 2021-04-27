const { response } = require('express');

const usuariosGet = (req, res = response) => {

    // req.query sirve para obtener parametros de la url
    // por ejemplo en este caso: /usuarios?q=hola&limit=10
    // Podemos extraer q y limit de la url 
    const { q, limit, name = 'No name', page = 1 } = req.query;

    res.json({
        msg: 'get API - controlador',
        q,
        limit,
        name,
        page
    });
}

const usuariosPost = (req, res = response) => {

    const { nombre, edad } = req.body;

    res.status(201).json({
        msg: 'post API - controlador',
        nombre,
        edad
    });
}

const usuariosPut = (req, res = response) => {

    // Obtener parametros de una ruta
    // Primero se le establece en las rutas con /:parametro
    // Y así como se le llama en las rutas se llama en el controlador con req.params.
    const { id } = req.params;

    res.json({
        msg: 'put API - controlador',
        id
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    });
}

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - controlador'
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}