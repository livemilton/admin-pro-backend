const mongoose = require('mongoose');
require ('dotenv').config();

const dbConnection = async ()=> {

    try{
        await mongoose.connect('mongodb+srv://livemilton:xGirlxqN8mB3L2kq@clusterangularbbdd.f9rqtou.mongodb.net/hospitaldb',{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });

        console.log('DB online');

    } catch(error){
        console.log(error);
        throw new Error('Error a la hora de iniciar la BD ver logs');
    }

}

module.exports ={
    dbConnection
}