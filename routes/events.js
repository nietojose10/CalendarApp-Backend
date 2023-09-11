const { Router } = require('express');//Desestructurando Router de express framework
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { validarJWT } = require('../middlewares/validar-jwt');
const { isDate } = require('../helpers/isDate');
//Event routes
// /api/events

//Para poner un middleware sobre todas las rutas se hace de la siguiente manera:
router.use( validarJWT );



//Todas tienen que pasar por la validacion del JWT
//Obtener eventos
router.get('/', getEventos);

//Creat un nuevo Evento
router.post('/', 
[
    check('title', 'El titulo es obligatorio').notEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
    check('end', 'Fecha de finalizacion es obligatoria').custom( isDate ),
    validarCampos //Este es el middle personalizado para el manejo de error, sin este no se mostrara ningun mensaje de error, este middleware se llamara despues de hacer todos los checks
],
crearEvento );

//Actualizar Evento
router.put('/:id', 
[
    check('title', 'El titulo es obligatorio').notEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
    check('end', 'Fecha de finalizacion es obligatoria').custom( isDate ),
],
actualizarEvento );

//Borrar Evento
router.delete('/:id', eliminarEvento );

module.exports = router