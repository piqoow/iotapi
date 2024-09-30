const database = require("../configs/databaseeb");
const mysql = require('mysql');
const pool = mysql.createPool(database)

pool.on('error', (err) => {
    console.log(err)
})

module.exports = {

    //GET Data Floor By ID
    getValueByID(req, res) {
        let id = req.params.id;
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(
                `SELECT SUM(processing_value) AS total_active FROM temp_processing;`
                , [id],
                function (error, results) {
                    if (error) throw error;
                    if (results.length > 0) { // Pastikan ada hasil
                        // Mengirimkan hasil query langsung sebagai respons tanpa kurung siku []
                        res.json(results);
                    } else {
                        // Jika tidak ada hasil, kirim respons kosong
                        res.json({}); // Jika tidak ada data, kirimkan objek kosong
                    }
                    connection.release();
                });
        });
    },
}
