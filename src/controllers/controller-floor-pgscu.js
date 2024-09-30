const database = require("../configs/databasepgscu");
const mysql = require('mysql');
const pool = mysql.createPool(database);

pool.on('error', (err) => {
    console.log(err);
});

module.exports = {

    // GET Data Floor By ID
    getFloorPGSCUByID(req, res) {
        let id = req.params.id;
        pool.getConnection(function (err, connection) {
            if (err) {
                console.error(err);
                res.status(500).send({ error: 'Database connection error' });
                return;
            }

            connection.query(
                `SELECT used, available FROM tb_display WHERE id = ?`, 
                [id],
                function (error, results) {
                    connection.release(); // Make sure to release the connection back to the pool
                    if (error) {
                        console.error(error);
                        res.status(500).send({ error: 'Query error' });
                        return;
                    }

                    if (results.length > 0) {
                        res.send(results[0]); // Send only the first object in the results array
                    } else {
                        res.status(404).send({ error: 'Data not found' }); // Handle case when no data is found
                    }
                }
            );
        });
    },
};
