const { response } = require('express');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');
const Evento = require('../models/Evento');
// {
//     ok: true,
//     msg: 'getEventos'
// }

// {
//     ok: true,
//     msg: 'crearEventos'
// }

// {
//     ok: true,
//     msg: 'crearEventos'
// }

const getEventos = async ( req, res = response ) => {

    const eventos = await Evento.find()
                                .populate('user', 'name');


    try {

            //Generar JWT
        //const token = await generarJWT( usuario.id, usuario.name );
        
        res.status(201).json({
            ok: true,
            eventos
        });
    
    } catch (error) {
        console.log(error);
        
    }

}

const crearEvento = async ( req, res = response ) => {

    //const { name, fecha_creacion, fecha_inicio, fecha_fin, usuario } = req.body;

    const evento = new Evento( req.body );

    console.log( req.body );

    try {

            //Generar JWT
        //const token = await generarJWT( usuario.id, usuario.name );
        
        evento.user =  req.uid;

        const eventoGuardado = await evento.save();

        res.status(201).json({
            ok: true,
            evento: eventoGuardado
        });



     
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })

    }

}

const actualizarEvento = async ( req, res = response ) => {

    const eventoId  = req.params.id;

    const uid = req.uid;

    // const evento = await Evento.find().populate('user', 'name');

    console.log();

    //Si el string del ID no tiene siquiera el formato de 12 bytes que mongo setea para cada registo entonces no se consultara el server
    //Directamente mostrara el error del catch, hable con el administrador
    try {

            //Generar JWT
        //const token = await generarJWT( usuario.id, usuario.name );
        
        const evento = await Evento.findById( eventoId );

        if( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            })
        }

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }

        const nuevoEvento = { 
            ...req.body,
            user: uid
        }
        
        //La opcion new: true es para regresar el nuevo documento actualizado en lugar de enviar el documento que se esta actualizando
        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );

        //Si no se devuelve ninguna respuesta el server se quedara pegado!!!!

        res.status(201).json({
            ok: true,
            evento: eventoActualizado
        });
    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}


const eliminarEvento = async ( req, res = response ) => {

    const eventoId  = req.params.id;

    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );

        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        if ( evento.user.toString() !== uid ) {

            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            });

        }
        
        const eventoEliminado = await Evento.findOneAndRemove( eventoId );

        res.status(201).json({
            ok: true,
            eventoEliminado
        });
    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:'Hable con el administrador'
        });
        
    }

}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}