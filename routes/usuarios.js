/*
    Ruta: /api/usuarios

*/
const { Router } = require ('express');

//importar express-validator
const { check } = require('express-validator');
//importar archivo para validar campos en la ruta

const { validarCampos } = require('../middlewares/validar-campos')

const { getUsuarios, crearUsuarios,actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


router.get( '/', validarJWT, getUsuarios );
//implementando varios middlewares

router.post( '/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],
    crearUsuarios 
);

router.put('/:id',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        //check('password', 'El password es obligatorio').not().isEmpty(),
        check('role', 'El role es obligatorio').not().isEmpty(),
        validarCampos,
        
    ],
    actualizarUsuario
    );


router.delete('/:id',
    validarJWT,
    borrarUsuario
    );

module.exports = router;