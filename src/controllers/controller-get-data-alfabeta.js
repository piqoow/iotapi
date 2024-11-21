const database = require("../configs/databasealfabeta");
const mysql = require('mysql');
const pool = mysql.createPool(database);

pool.on('error', (err) => {
    console.log(err);
});

module.exports = {

    getData(req, res) {
        let id = req.params.id;
        pool.getConnection(function (err, connection) {
            if (err) {
                console.error(err);
                res.status(500).send({ error: 'Database connection error' });
                return;
            }

            connection.query(
                `SELECT 
                id,
                display_status,
                visitor_numbers,
                car_numbers,
                total_price/1000 as total_price
                FROM 
                transaction_data td WHERE id = ?`, 
                [id],
                // CONCAT(ROUND(total_price / 1000), 'K') AS 
                function (error, results) {
                    connection.release();
                    if (error) {
                        console.error(error);
                        res.status(500).send({ error: 'Query error' });
                        return;
                    }

                    if (results.length > 0) {
                        res.send(results[0]);
                    } else {
                        res.status(404).send({ error: 'Data not found' });
                    }
                }
            );

            // connection.query(
            //     `UPDATE transaction_data SET display_status = 0, visitor_numbers = 0, car_numbers = 0, total_price = 0 WHERE id = ?`, 
            //     [id],
            //     function (updateError, updateResults) {
            //         if (updateError) {
            //             console.error("Update error: ", updateError);
            //             return res.status(500).send({ error: 'Update error' });
            //         }

            //         // Kirimkan hasil update dan data yang diambil
            //         console.log("Data updated successfully");
            //         return res.send({
            //             message: 'Data updated successfully',
            //             updatedData: data,
            //             updateResults: updateResults
            //         });
            //     }
            // );
        });
    },
};
