const database = require("../configs/database");
const mysql = require('mysql');
const pool = mysql.createPool(database);

pool.on('error', (err) => {
    console.log(err);
});

module.exports = {

    // GET Data Floor By ID
    getAllFloor(req, res) {
        let id = req.params.id; // Tidak digunakan saat ini, bisa dihapus jika tidak perlu
        pool.getConnection(function (err, connection) {
            if (err) {
                console.error(err);
                res.status(500).send({ error: 'Database connection error' });
                return;
            }

            connection.query(
                `SELECT mf.capacity - mf.used AS available, mf.capacity, mf.used FROM mst_floor mf LIMIT 3`, 
                // [id],
                function (error, results) {
                    connection.release(); // Pastikan untuk melepaskan koneksi kembali ke pool
                    if (error) {
                        console.error(error);
                        res.status(500).send({ error: 'Query error' });
                        return;
                    }

                    if (results.length > 0) {
                        res.send(results); // Kirim semua hasil sebagai array
                    } else {
                        res.status(404).send({ error: 'Data not found' }); // Tangani kasus ketika tidak ada data yang ditemukan
                    }
                }
            );
        });
    },
};
