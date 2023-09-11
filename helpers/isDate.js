const moment = require('moment');

const isDate = ( value, { req, location, path } ) => {
    
    if ( !value ) {
        return false;
    }

    const fecha = moment ( value ); //moment validara si es una fecha correcta o no
    if ( fecha.isValid() ) {
        return true;
    } else {
        return false;
    }


}

module.exports = { isDate }