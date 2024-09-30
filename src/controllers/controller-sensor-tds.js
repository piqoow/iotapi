const database = require("../configs/databasetds");
const mysql = require('mysql');
const pool = mysql.createPool(database)
require('dotenv').config();

pool.on('error', (err) => {
    console.log(err)
})

function inputLog(req, res) {
    let data = {
        ip_address: req.query.ip_address,
        sensor_type: req.query.sensor_type,
        status: req.query.status,
        sensor_number: req.query.sensor_number
    }
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        try {
            let  sensorCode;
            if(data.status == 1){
                data.status = "Y";
            }else{
                data.status = "N";
            }           
            // statusSensor
            connection.query(
               // `UPDATE parking_data SET status_queue = ${statusSensor} WHERE parking_data.sensor_code = '${sensorCode}'`
                 
               `UPDATE mst_sensor set queue_status = ? WHERE ip_address=? and sensor_number=?;`
                ,[data.status, req.query.ip_address, parseInt(req.query.sensor_number)],
                function (error, results) {
                    if (error) throw error;
                    // let logData = {
                    //     pin_sensor: sensorCode,
                    //     status: data.status,
                    // }

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
                    console.log(`Insert log ${data.sensor_type} || Status : ${data.status} ||  Number : ` + data.sensor_number)
                });
        } catch (error) {
            console.log(error)
        }
    })
}

function addLog(req, res) {
    // users.find({}).toArray(function (err, results) {
    //     res.header("Content-Type", 'application/json');
    //     res.send(JSON.stringify(results, null, 4));
    // });
    // console.log(req.body)
    // let data = {
    //     ip_address: req.body.ip_address,
    //     sensor_type: req.body.sensor_type,
    //     status: req.query.status,
    //     sensor_number: req.query.sensor_number
    // }
    // pool.getConnection(function (err, connection) {
    //     if (err) throw err;
    //     connection.query(
    //         `
    //         INSERT INTO log_sensor SET ?;
    //         `
    //         , [data],
    //         function (error, results) {
    //             if (error) throw error;
    //             res.send({
    //                 success: true,
    //                 message: 'Success input log!',
    //             });
    //         });
    //     connection.release();
    //     console.log('inserted 1 row POST')
    // })
}

module.exports = {
    inputLog, addLog
}