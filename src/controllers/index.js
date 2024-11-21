const allfloor = require('./controller-all-floor')
const floor = require('./controller-floor')
const ddsparkee = require('./controller-ddsparkee')
const floorpgscu = require('./controller-floor-pgscu')
const sensor = require('./controller-sensor')
const floortds = require('./controller-floor-tds')
const sensortds = require('./controller-sensor-tds')
const valueeb = require('./controller-value-eb')
const plusminus = require('./controller-plus-minus')
const reduceplus = require('./controller-reduce-plus')
const reduceminus = require('./controller-reduce-minus')
const addplus = require('./controller-add-plus')
const addminus = require('./controller-add-minus')
const temperature = require('./controller-temperature')
const tempdata = require('./controller-sensor-temperature')
const getdataalfabeta = require('./controller-get-data-alfabeta')
const postdataalfabeta = require('./controller-post-data-alfabeta')

module.exports ={
	allfloor, //pgs controller
	floor, //pgs controller
	ddsparkee, //dds parkee controller
	floorpgscu, //pgs lot sensor
	sensor, 
	floortds, //tds controller
	sensortds,
	valueeb, //emergency button CRO
	plusminus, //data plus/minus
	reduceplus, //mengurangi angka tabel plus untuk controller dds
	reduceminus, //mengurangi angka tabel minus untuk controller dds
	addplus, //menambah angka tabel plus untuk controller dds
	addminus, //menambah angka tabel minus untuk controller dds
	temperature,
	tempdata,
	getdataalfabeta,
	postdataalfabeta
}