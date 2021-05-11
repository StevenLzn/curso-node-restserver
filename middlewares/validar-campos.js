const { validationResult } = require("express-validator");

const validarCampos = ( req, res, next ) => {
    // con validationResult se reciben los errores que haya acumulado las validaciones(en caso de que hayan)
    const errors = validationResult(req);

    // Comprobamos si errores no está vacio entonces significa que si hay errores
    // Entonces estos se muestran en la response
    if( !errors.isEmpty() ){
        return res.status(400).json(errors);
    }

    // next() sirve para indicar que se debe ejecutar el siguiente middleware
    // En este caso solo sucedería si no llegan errores en la request
    // En caso de que no haya mas middlewares, entonces pasaría a ejecutar el controlador  
    next();
}

module.exports = {
    validarCampos
};