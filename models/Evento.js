const { Schema, model} = require('mongoose');

// const UsuarioSchema = Schema({

//     name: {
//         type: String,
//         require: true
//     },
//     email: {
//         type: String,
//         require: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         require: true
//     }
// });

const EventoSchema = Schema({

    title: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        required: false
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }

});

EventoSchema.method('toJSON', function(){
    //Traduccion: Declaramos las constantes __v y _id y mandamos lo que resta del objeto con el operador spread
    // luego declaramos que object.id sera igual a _id
    //luego devolvemos el nuevo objeto
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;

})

module.exports = model('Evento', EventoSchema );