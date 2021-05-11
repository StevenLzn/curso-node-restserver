const { Router } = require('express');
const { check } = require('express-validator');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const { usuariosGet, 
        usuariosPost,
        usuariosPut,
        usuariosPatch,
        usuariosDelete} = require('../controllers/usuarios');

const router = Router();

router.get( '/', usuariosGet );

// Si se pasan 3 parametros, el segundo es el o los middlewares
// Se puede pasar un arreglo con varios middlewares
// Estos middlewares se ejecutan antes de ejercutar el controlador
// check va acumulando las validaciones y estas se reciben en el controlador
router.post('/', [
        // check va acumulando los errores(en caso de que haya) en la request
        check('nombre', 'El nombre es obligatorio').not().isEmpty(), // Validamos que no esté vacío
        check('password', 'El password debe ser de más de 6 caracteres').isLength({ min: 6 }), // Validamos el tamaño del campo que sea minimo 6
        check('correo', 'El correo no es válido').isEmail(), // Validamos que el campo sea un email
        // isIn comprueba que el valor que llegue de la petición, esté dentro del arreglo que pasamos como parametro
        //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']), 
        check('correo').custom( emailExiste ),
        // Hacemos una validación personalizada, donde buscamos si el rol que viene en la petición
        // concuerda con un rol que tengamos en la base de datos
        check('rol').custom( esRoleValido ),
        // Este es nuestro middleware personalizado, que se ejecuta al final cuando ya se han hecho todas las validaciones
        validarCampos 
], usuariosPost);

router.put('/:id', [
        check('id', 'No es un id válido').isMongoId(), // Comprueba si el id tiene formato de un id de mongo
        check('id').custom( existeUsuarioPorId ),
        check('rol').custom( esRoleValido ),
        validarCampos
], usuariosPut);

router.patch('/', usuariosPatch);

router.delete('/:id', [
        check('id', 'No es un id válido').isMongoId(), // Comprueba si el id tiene formato de un id de mongo
        check('id').custom( existeUsuarioPorId ),
        validarCampos
], usuariosDelete);


module.exports = router;