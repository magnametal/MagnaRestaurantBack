const Country = require('country-state-city').Country;
const City = require('country-state-city').City;

const getCountries= async (request, response)=>{
    response.json({
        ok: true,
        countries: Country.getAllCountries(),
    })
}
const getCitysByCountries = async (request, response)=>{
    const code = request.params.code;
    response.json({
        ok: true,
        citys: City.getCitiesOfCountry(code),
    })
}

module.exports = {
    getCountries,
    getCitysByCountries
}