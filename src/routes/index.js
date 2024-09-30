const router = require('express').Router()
const { floor, floorpgscu, sensor, floortds, sensortds, valueeb, ddsparkee } = require('../controllers')

router.get('/floor/:id', floor.getFloorByID)
router.get('/dds-parkee/:id', ddsparkee.getFloorByIDParkee)
router.get('/floor-pgscu/:id', floorpgscu.getFloorPGSCUByID)
router.get('/floor-tds/:id', floortds.getFloorTDSByID)
router.get('/value', valueeb.getValueByID)


router.get('/log', sensor.inputLog)
router.post('/log', sensor.addLog)

router.get('/logtds', sensortds.inputLog)
router.post('/logtds', sensortds.addLog)

module.exports = router