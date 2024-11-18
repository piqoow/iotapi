const database = require("../configs/databasetemp");
const mysql = require('mysql');
const pool = mysql.createPool(database);

pool.on('error', (err) => {
    console.log(err);
});

module.exports = {
    getValueByID(req, res) {
        let id = req.params.id;
        let { ip_address, temperature, voltage, current, energy } = req.query; // Mengambil parameter GET dari query string

        const fieldsToUpdate = {};
        // if (ip_address) fieldsToUpdate.ip_address = ip_address;
        if (temperature) fieldsToUpdate.temperature = temperature;
        if (voltage) fieldsToUpdate.voltage = voltage;
        if (current) fieldsToUpdate.current = current;
        if (energy) fieldsToUpdate.energy = energy;

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({ message: 'No valid parameters provided for update' });
        }

        pool.getConnection(function (err, connection) {
            if (err) throw err;

            connection.beginTransaction(function (err) {
                if (err) {
                    connection.release();
                    return res.status(500).json({ message: 'Transaction start failed' });
                }

                let query = 'UPDATE temp_data SET ? WHERE id_temp = ?';
                connection.query(query, [fieldsToUpdate, id], function (error, results) {
                    if (error) {
                        return connection.rollback(function () {
                            connection.release();
                            return res.status(500).json({ message: 'Update failed', error });
                        });
                    }

                    if (results.affectedRows > 0) {
                        const logData = {
                            id_temp: id,
                            ip_address: ip_address || null,
                            temperature: temperature || null,
                            voltage: voltage || null,
                            current: current || null,
                            energy: energy || null,
                            created_at: new Date()
                        };

                        let insertLogQuery = 'INSERT INTO log_temp_data SET ?';
                        connection.query(insertLogQuery, logData, function (logError, logResults) {
                            if (logError) {
                                return connection.rollback(function () {
                                    connection.release();
                                    return res.status(500).json({ message: 'Insert to log_temp_data failed', error: logError });
                                });
                            }

                            connection.commit(function (commitError) {
                                if (commitError) {
                                    return connection.rollback(function () {
                                        connection.release();
                                        return res.status(500).json({ message: 'Transaction commit failed' });
                                    });
                                }

                                res.json({ message: 'Update and log insert successful', results, logResults });
                                connection.release();
                            });
                        });
                    } else {
                        res.json({ message: 'No rows affected, check if ID exists' });
                        connection.release();
                    }
                });
            });
        });
    }
};
