//definir tipo de response
const { response } = require('express');
//para encriptar pass
const bcrypt = require ('bcryptjs');

//importar express-validator validationResult
//const { validationResult } = require('express-validator');

//importacion del usuario para crear el modelo
const Usuario = require ('../models/usuario');

const { generarJWT } = require('../helpers/jwt');


const getUsuarios = async(req, res) =>{

    //usando promise.all del ecma script 6 
    //desestructurar el usuario y total para que se ejecuten a la vez
    //usar PAGINACION con metodo skip y limit y declarando la constante

    const desde = Number (req.query.desde) || 0;

    const [ usuarios, total ]= await Promise.all([
        Usuario 
            .find({}, 'nombre email role google img')
            .skip ( desde )
            .limit ( 5 ),
        Usuario.countDocuments()
    ])
    

    res.json({
        ok:true,
        usuarios: usuarios,
        total: total
    });

}

const crearUsuarios = async(req, res = response) =>{
    
    //console.log(req);
    //declaracion de las constantes
    const { email, password } = req.body;
    
    
    try {

        const existeEmail = await Usuario.findOne ({ email });

        //validacion campos en el backend para correo repetido
        if (existeEmail){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }


        const usuario = new Usuario( req.body);

        //Encriptar Contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);



        //guardar usuario con valores
        await usuario.save();

        //Generar el TOKEN -JWT
        const token = await generarJWT (usuario.id);    

        res.json({
            ok:true,
            usuario,
            token: token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }

}

const actualizarUsuario = async(req, res = response) =>{

    //TODO validar token y comprobar si es usuario correcto

    //traer el id o uid de la BD del usuario
    const uid = req.params.id;


    try {
        const usuarioDB = await Usuario.findById( uid);

        if( !usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }



        //Actualizaciones
        const {password, google, email, ...campos }= req.body;

        if (usuarioDB.email !== email){
         
            const existeEmail = await Usuario.findOne({ email: email});
            if (existeEmail){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }

        }

        if( !usuarioDB.google){
           campos.email = email; 
        } else if (usuarioDB.email !== email){
            return res.status(400).json({
                ok: false,
                msg: 'Usuario de google no pueden cambiar su correo'
            });
        }
        
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado'
        })
    }

}

const borrarUsuario = async( req,res = response)=>{

    //traer el id o uid de la BD del usuario
    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid);

        if( !usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete( uid);

        res.json({
            ok:true,
            msg: 'Usuario eliminado'
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
        
    }
}



module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario,
}