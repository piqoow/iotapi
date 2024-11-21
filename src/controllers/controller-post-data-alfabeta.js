const database = require("../configs/databasealfabeta");
const mysql = require('mysql');
const pool = mysql.createPool(database);

pool.on('error', (err) => {
    console.log(err);
});

module.exports = {

    postData(req, res) {
        let { id, visitor_numbers, car_numbers, total_price } = req.body;

        if (!id) {
            return res.status(400).send({ error: 'id field are required' });
        }

        pool.getConnection(function (err, connection) {
            if (err) {
                console.error("Error on database connection:", err);
                return res.status(500).send({ error: 'Database connection error' });
            }

            connection.query(
                `SELECT id, display_status, visitor_numbers, car_numbers, total_price
                FROM transaction_data WHERE id = ?`,
                [id],
                function (selectError, selectResults) {
                    if (selectError) {
                        connection.release();
                        console.error("Select query error: ", selectError);
                        return res.status(500).send({ error: 'Select query error' });
                    }

                    if (selectResults.length > 0) {
                        console.log("Data retrieved successfully: ", selectResults[0]);

                        connection.query(
                            `UPDATE transaction_data SET display_status = 1, visitor_numbers = ?, car_numbers = ?, total_price = ? WHERE id = ?`,
                            [visitor_numbers, car_numbers, total_price, id],
                            function (updateError, updateResults) {
                                connection.release();

                                if (updateError) {
                                    console.error("Update query error: ", updateError);
                                    return res.status(500).send({ error: 'Update query error' });
                                }

                                console.log("Data updated successfully");

                                return res.send({
                                    message: 'Data updated successfully',
                                    // data: selectResults[0], // Data yang diambil sebelumnya
                                    // updateResults: updateResults // Hasil update
                                });
                            }
                        );
                    } else {
                        connection.release();
                        return res.status(404).send({ error: 'Data not found for the given id' });
                    }
                }
            );
        });
    },
};
