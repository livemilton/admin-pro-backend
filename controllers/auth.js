const { response } = require('express');

const bcrypt = require ('bcryptjs');

const Usuario = require ('../models/usuario');

const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async( req, res = response) =>{

   
    const { email, password } = req.body;
    
    try {
         //Verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        //verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if( !validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            });
        }

        //Generar el TOKEN -JWT
        const token = await generarJWT (usuarioDB.id);        

        res.json({
            ok:true,
            token
        })



    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}


//controlador para el login googleSignIn

const googleSignIn = async( req, res = response)=>{

    try {
        const {email, name, picture} = await googleVerify ( req.body.token);

        //guardar usuario con token en la DDBB
        const usuarioDB = await Usuario.findOne ({ email});
        let usuario;

        if (!usuarioDB){
            usuario = new Usuario({
                nombre: name,
                email: email,
                password :'@@@',
                img: 'picture',
                google: true
            })
        } else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        //guardar el usuario en la BBDD
        await usuario.save();

        //Generar el TOKEN - JWT
        const token = await generarJWT (usuario.id);


        res.json({
            ok:true,
            email, name, picture,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok:false,
            msg: 'Token de Google no es correcto'
        });
    }


}


module.exports ={
    login,
    googleSignIn
}