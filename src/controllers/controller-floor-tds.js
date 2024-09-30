const database = require("../configs/databasetds");
const mysql = require('mysql');
const pool = mysql.createPool(database)

pool.on('error', (err) => {
    console.log(err)
})

module.exports = {

    //GET Data Floor By ID
    getFloorTDSByID(req, res) {
        let id = req.params.id;
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(
                `SELECT mf.floor_code as floor, mf.floor_name as name FROM mst_floor mf WHERE deleted = 0 AND mf.floor_id = ?`
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