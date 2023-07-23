const { modelNames } = require("mongoose");

//para validar si existe un filesystem viejo o no
const fs = require('fs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

//simplificar borrar imagen

const borrarImagen = ( path ) =>{


        if (fs.existsSync (path)){
            //borrar la imagen anterior
            fs.unlinkSync( path );
        }
}


const actualizarImagen = async(tipo, id, nombreArchivo) => {

    let pahtViejo='';
    //validacion para asignacion de imagen en bbdd si no existe, si existe en el path
    switch ( tipo ){
        case 'medicos':
            const medico= await Medico.findById(id);
            if (!medico){
                console.log ('No es un médico por id');
                return false;
            }

            pahtViejo = `./uploads/medicos/${medico.img}`;
            borrarImagen(pahtViejo);

            medico.img = nombreArchivo;
            await medico.save();
            return true;

        break;

        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if ( !hospital ){
                console.log ('No es un hospital por id');
                return false;
            }

            pahtViejo = `./uploads/hospitales/${ hospital.img }`;
            borrarImagen( pahtViejo );

            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
        
        break;

        case 'usuarios':
            const usuario= await Usuario.findById(id);
            if (!usuario){
                console.log ('No es un usuario por id');
                return false;
            }

            pahtViejo = `./uploads/usuarios/${usuario.img}`;
            borrarImagen(pahtViejo);

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
        
        break;
    }    

}

module.exports = {
    actualizarImagen
}