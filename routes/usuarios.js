/* 

Ruta: /api/usuarios

*/

const {Router} = require('express');

// Para validaciones
const {check} = require('express-validator');

// Middleware personalizado
const { validarCampos } = require('../middlewares/validar-campos')
 
const { actualizarPerfilUsuario, getUsuarioProfile, getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario, getSearchUsuarios } = require('../controllers/usuarios');
const { validarJWT, validarADMIN_ROLE, validarADMIN_ROLE_o_MismoUsuario } = require('../middlewares/validar-jwt');

const router = Router();
getSearchUsuarios

// buscar usuarios por query
router.get('/search/:query', getSearchUsuarios);

// obtener todos los usuarios
router.get('/', validarJWT, getUsuarios);

// obtener perfil usuario
router.post('/perfil',[
    validarJWT,
    check('email', 'El email es Obligatorio').isEmail(),
],getUsuarioProfile);

// crear usuario
router.post('/',[
    check('name', 'El nombre es Obligatorio').not().isEmpty(),
    check('password', 'El password es Obligatorio').not().isEmpty(),
    check('email', 'El email es Obligatorio').isEmail(),
    check('city', 'La ciudad es Obligatoria').not().isEmpty(),
    check('country', 'El pais es Obligatorio').not().isEmpty(),
    check('code', 'El codigo es Obligatorio').not().isEmpty(),
    check('phone', 'El telefono es Obligatorio').not().isEmpty(),
    validarCampos
],crearUsuario);

// actualizar usuario
router.put('/admin/:id',[
    validarJWT,
    validarADMIN_ROLE,
    check('name', 'El nombre es Obligatorio').not().isEmpty(),
    check('password', 'El password es Obligatorio').not().isEmpty(),
    check('email', 'El email es Obligatorio').isEmail(),
    check('city', 'La ciudad es Obligatoria').not().isEmpty(),
    check('country', 'El pais es Obligatorio').not().isEmpty(),
    check('code', 'El codigo es Obligatorio').not().isEmpty(),
    check('phone', 'El telefono es Obligatorio').not().isEmpty(),
],actualizarUsuario);

// actualizar usuario
router.put('/perfil/:id',[
    validarJWT,
    validarADMIN_ROLE_o_MismoUsuario,
    check('name', 'El nombre es Obligatorio').not().isEmpty(),
    check('email', 'El email es Obligatorio').isEmail(),
    check('city', 'La ciudad es Obligatoria').not().isEmpty(),
    check('country', 'El pais es Obligatorio').not().isEmpty(),
    check('code', 'El codigo es Obligatorio').not().isEmpty(),
    check('phone', 'El telefono es Obligatorio').not().isEmpty(),
    check('language', 'El lenguaje es Obligatorio').not().isEmpty(),
],actualizarPerfilUsuario);

// eliminar usuario
router.delete('/:id', [validarJWT, validarADMIN_ROLE], borrarUsuario);
module.exports = router;
