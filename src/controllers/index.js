const floor = require('./controller-floor')
const ddsparkee = require('./controller-ddsparkee')
const floorpgscu = require('./controller-floor-pgscu')
const sensor = require('./controller-sensor')
const floortds = require('./controller-floor-tds')
const sensortds = require('./controller-sensor-tds')
const valueeb = require('./controller-value-eb')

module.exports ={
	floor, //pgs controller
	ddsparkee, //dds parkee controller
	floorpgscu, //pgs lot sensor
	sensor, 
	floortds, //tds controller
	sensortds,
	valueeb //emergency button CRO
}