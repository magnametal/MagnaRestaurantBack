/* 

Ruta: /api/login

*/

const {Router} = require('express');
const {getCountries, getCitysByCountries} = require('../controllers/countries');

const router = Router();

router.get('/all', getCountries);

router.get('/city/:code', getCitysByCountries)
module.exports = router;