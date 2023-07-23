//construir el path completo importar desde node.js
const path = require('path');

//validar no image en el fs
const fs = require ('fs');

const { response } = require("express");
//uuid unico para las imagenes del example uuid
const { v4: uuidv4 } = require('uuid');
//actualizar imagen en la bbdd
const {actualizarImagen} = require('../helpers/actualizar-imagen');

const fileUpload = ( req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    //validar tipo
    const tiposValidos = [ 'hospitales' , 'medicos', 'usuarios'];
    if( !tiposValidos.includes(tipo)){
        return res.status(400).json({
            ok: false,
            msg: 'No es un médico, usuario u hospital (tipo)'
        });
    }

    //validacion de example Express por si viene el archivo
    
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo'
        });
    }

    //Procesar la imagen...
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.'); // wolverine.1.3.jpg
    const extensionArchivo = nombreCortado[ nombreCortado.length -1];

    //Validar extensión
    const extensionesValidas = ['png','jpg','jpeg','gif'];
    if( !extensionesValidas.includes (extensionArchivo)){
        return res.status(400).json({
            ok: false,
            msg: 'No es una extensión permitida'
        });
    }

    //Generar el nombre del archivo ejemplo uuid
    const nombreArchivo = `${ uuidv4() }.${extensionArchivo}`;

    //path para guardar la imagen
    const path = `./uploads/${ tipo }/${ nombreArchivo}`;

    //mover la imagen from example upload express
    file.mv(path, (err) => {
        if (err) {
            console.log(err)
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });

        }
        
        //Actualizar base de datos
        actualizarImagen( tipo, id, nombreArchivo);

        res.json({
            ok:true,
            msg: 'Archivo subido',
            nombreArchivo
        });
    });
    


}

//controlador para mostrar una imagen

const retornaImagen = (req, res = response) =>{

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join( __dirname, `../uploads/${ tipo }/${ foto }`);

    //imagen por defecto
    if (fs.existsSync( pathImg )){
        res.sendFile ( pathImg );
    } else {
        const pathImg = path.join( __dirname, `../uploads/no-img.jpg`);
        res.sendFile ( pathImg );
    }

    
}

module.exports = {
    fileUpload,
    retornaImagen
}