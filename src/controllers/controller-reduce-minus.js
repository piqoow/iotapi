const database = require("../configs/database");
const mysql = require('mysql');
const pool = mysql.createPool(database);

pool.on('error', (err) => {
    console.log(err);
});

module.exports = {

    getReduceMinusByID(req, res) {
        let id = req.params.id;

        pool.getConnection(function (err, connection) {
            if (err) {
                console.error(err);
                res.status(500).send({ error: 'Database connection error' });
                return;
            }

            connection.query(
                `SELECT minus FROM mst_floor WHERE id = ?`, 
                [id],
                function (selectError, selectResults) {
                    if (selectError) {
                        console.error(selectError);
                        connection.release();
                        res.status(500).send({ error: 'Query error during SELECT' });
                        return;
                    }

                    if (selectResults.length === 0) {
                        connection.release();
                        return res.status(404).send({ error: 'Data not found' });
                    }

                    let currentMinus = selectResults[0].minus;

                    if (currentMinus > 0) {
                        connection.query(
                            `UPDATE mst_floor SET minus = minus - 1 WHERE id = ?`,
                            [id],
                            function (updateError, updateResults) {
                                connection.release();
                                if (updateError) {
                                    console.error(updateError);
                                    res.status(500).send({ error: 'Query error during UPDATE' });
                                    return;
                                }

                                res.send({ message: 'Data updated successfully' });
                            }
                        );
                    } else {
                        connection.release();
                        res.status(400).send({ message: '0' });
                    }
                }
            );
        });
    },
};