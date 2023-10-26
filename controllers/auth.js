//No vuelve a cargar el express, carga el mismo que se cargo en el index.js
const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async(req, res = response ) => {
    //console.log(req.body);

    const {  email, password } = req.body;

    try {
        
        let usuario = await Usuario.findOne({ email });

        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            });
        }

        usuario = new Usuario( req.body );

        //Encriptar constrasenia
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        //Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );


        //Los res.json solo se pueden enviar una sola vez, de lo contrario mostrara un error en el server: "cannot set headers after they are sent to the client"
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });

    }
}

const loginUsuario = async (req, res = response ) => {

    const { email, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ email });

        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        //Confirmar los passwords
        const validPassword = bcrypt.compareSync( password, usuario.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok:false,
                msg:'Password incorrecto'
            });
        }
        
        //Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

}

const revalidarToken = async (req, res = response ) => {
    
    const { uid, name } = req;

    //Generar JWT
    const token = await generarJWT( uid, name );

    res.json({
        ok: true,
        uid,
        name,
        token
    });
}

module.exports = { 
    crearUsuario,
    loginUsuario,
    revalidarToken
 }