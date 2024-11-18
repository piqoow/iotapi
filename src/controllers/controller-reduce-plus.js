const database = require("../configs/database");
const mysql = require('mysql');
const pool = mysql.createPool(database);

pool.on('error', (err) => {
    console.log(err);
});

module.exports = {

    getReducePlusByID(req, res) {
        let id = req.params.id;

        pool.getConnection(function (err, connection) {
            if (err) {
                console.error(err);
                res.status(500).send({ error: 'Database connection error' });
                return;
            }

            connection.query(
                `SELECT plus FROM mst_floor WHERE id = ?`, 
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

                    let currentPlus = selectResults[0].plus;

                    if (currentPlus > 0) {
                        connection.query(
                            `UPDATE mst_floor SET plus = plus - 1 WHERE id = ?`,
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