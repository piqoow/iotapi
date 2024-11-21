const router = require('express').Router()
const { 
    allfloor, 
    floor, 
    floorpgscu, 
    sensor, 
    floortds, 
    sensortds, 
    valueeb, 
    temperature, 
    tempdata, 
    ddsparkee, 
    plusminus, 
    reduceplus, 
    reduceminus, 
    addplus, 
    addminus,
    getdataalfabeta,
    postdataalfabeta 
} = require('../controllers')

router.get('/all-floor', allfloor.getAllFloor)
router.get('/floor/:id', floor.getFloorByID)
router.get('/dds-parkee/:id', ddsparkee.getFloorByIDParkee)
router.get('/floor-pgscu/:id', floorpgscu.getFloorPGSCUByID)
router.get('/floor-tds/:id', floortds.getFloorTDSByID)
router.get('/value', valueeb.getValueByID)
router.get('/temperature/:id', temperature.getTemperatureByID) // get data temperature by id
router.get('/temperature-data/:id', tempdata.getValueByID) // insert&update log temperatur

//PGS&DDS RGB x HUIDU
router.get('/plus-minus/:id', plusminus.getPlusMinusByID)
router.get('/reduce-plus/:id', reduceplus.getReducePlusByID)
router.get('/reduce-minus/:id', reduceminus.getReduceMinusByID)
router.get('/add-plus/:id', addplus.getAddPlusByID)
router.get('/add-minus/:id', addminus.getAddMinusByID)


router.get('/log', sensor.inputLog)
router.post('/log', sensor.addLog)

router.get('/logtds', sensortds.inputLog)
router.post('/logtds', sensortds.addLog)

router.get('/getdatatransaction/:id', getdataalfabeta.getData)
router.post('/postdatatransaction', postdataalfabeta.postData)

module.exports = router