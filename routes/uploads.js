/*
ruta: api/uploads/


*/

const { Router } = require('express');
const expressFileUpload = require('express-fileupload'); //from example
const { validarJWT } = require('../middlewares/validar-jwt');

const { fileUpload, retornaImagen } = require('../controllers/uploads');

const router = Router();

// default options express upload from example (anterior app.use)
router.use(expressFileUpload());

router.put('/:tipo/:id', validarJWT, fileUpload);
//obtener imagenes desde el backend
router.get('/:tipo/:foto', retornaImagen);




module.exports = router;