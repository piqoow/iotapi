const database = require("../configs/database");
const mysql = require('mysql');
const pool = mysql.createPool(database)

pool.on('error', (err) => {
    console.log(err)
})

function inputLog(req, res) {
    let data = {
        ip_address: req.query.ip_address,
        sensor_type: req.query.sensor_type,
        value: req.query.value,
        sensor_number: req.query.sensor_number
    }
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        try {
            connection.query(
                `SELECT  
	                mf.id,
                    mf.used,
                    mf.capacity,
                    mss.sensor_type
                FROM mst_floor mf
                JOIN mst_sensor mss ON mss.floor_id = mf.id
                WHERE mss.ip_address = ?
                AND mss.sensor_number = ?;`
                , [req.query.ip_address, parseInt(req.query.sensor_number)],
                function (error, results) {
                    // //Just Debug
                    // console.log("results :"+results[0]+"||"+"length :"+results.length+"||"+"sensor_number :"+req.query.sensor_number+"||"+"ip_address :"+req.query.ip_address)
                    if (results.length > 0) {

                        if (error) throw error;

                        for (let i=0;i<results.length;i++) {
                            //CHECK SENSOR TYPE IN / OUT
                            let sensorType
                            sensorType = results[i].sensor_type === 'IN' ? sensorType = 'IN' : 'OUT'

                            //IF sensor type IN then used + 1
                            let newUsed
                            
                            if (results[i].sensor_type === 'IN') {
                            // if (results[i].sensor_type === 'IN' && results[i].sensor_type === 'OUT') {
                                // Lakukan sesuatu ketika sensor IN pertama aktif dan sensor OUT kedua aktif
                                if(results[i].used < results[i].capacity){
                                    newUsed = results[i].used + 1
                                }
                            } else {
                                if(results[i].used > 0){
                                    newUsed = results[i].used - 1
                                }
                            }
                            //newUsed = results[0].sensor_type === 'IN' ? (results[0].used + 1) = 'IN' : (results[0].used - 1)

                            //UPDATE DATA SENSOR
                            //console.log(results[0].id);
                            if (newUsed > 0){
                            connection.query(
                                `UPDATE mst_floor set used = ? WHERE id=?;`
                                , [newUsed, results[i].id],
                                function (error, results) {
                                    if (error) throw error;
                                    connection.query(
                                        `
                                    INSERT INTO log_sensor SET ?;
                                    `
                                        , [data],
                                        function (error, results) {
                                            if (error) throw error;
                                            console.log(`Insert data ${data.sensor_type} || Value : ${data.value} || ip : ${data.ip_address} || Number : ` + data.sensor_number)
                                            res.send({
                                                success: true,
                                                message: 'Success input log!',
                                            });
                                        });
                                });
                            }else{
                                connection.query(
                                    `
                                INSERT INTO log_sensor SET ?;
                                `
                                    , [data],
                                    function (error, results) {
                                        if (error) throw error;
                                        console.log(`Insert data ${data.sensor_type} || Value : ${data.value} || ip : ${data.ip_address} || Number : ` + data.sensor_number)
                                        res.send({
                                            success: true,
                                            message: 'Success input log!',
                                        });
                                    }); 
                            }
                        }
                    }
                });
            connection.release();
        } catch (error) {
            console.log(error)
        }
    })
}

function addLog(req, res) {
    users.find({}).toArray(function (err, results) {
        res.header("Content-Type", 'application/json');
        res.send(JSON.stringify(results, null, 4));
    });
    console.log(req.body)
    let data = {
        ip_address: req.body.ip_address,
        sensor_type: req.body.sensor_type,
        value: req.body.value,
        sensor_number: req.query.sensor_number
    }
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(
            `
            INSERT INTO log_sensor SET ?;
            `
            , [data],
            function (error, results) {
                if (error) throw error;
                res.send({
                    success: true,
                    message: 'Success input log!',
                });
            });
        connection.release();
        console.log('inserted 1 row POST')
    })
}

module.exports = {
    inputLog, addLog
}