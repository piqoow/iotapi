const database = require("../configs/databasealfabeta");
const mysql = require('mysql');
const pool = mysql.createPool(database);

pool.on('error', (err) => {
    console.log(err);
});

module.exports = {

    postData(req, res) {
        // Mengambil data dari body request
        let { id, visitor_numbers, car_numbers, total_price } = req.body;

        // Validasi jika data yang diperlukan ada
        if (!id || !visitor_numbers || !car_numbers || !total_price) {
            return res.status(400).send({ error: 'All fields (id, visitor_numbers, car_numbers, total_price) are required' });
        }

        pool.getConnection(function (err, connection) {
            if (err) {
                console.error("Error on database connection:", err);
                return res.status(500).send({ error: 'Database connection error' });
            }

            // Pertama, kita ambil data berdasarkan id yang ada di body request
            connection.query(
                `SELECT id, display_status, visitor_numbers, car_numbers, total_price
                FROM transaction_data WHERE id = ?`,
                [id], // Menyisipkan id yang diterima dari body request
                function (selectError, selectResults) {
                    if (selectError) {
                        connection.release();
                        console.error("Select query error: ", selectError);
                        return res.status(500).send({ error: 'Select query error' });
                    }

                    // Jika data ditemukan
                    if (selectResults.length > 0) {
                        // Menampilkan data yang ditemukan
                        console.log("Data retrieved successfully: ", selectResults[0]);

                        // Selanjutnya update data dengan display_status = 1
                        connection.query(
                            `UPDATE transaction_data SET display_status = 1, visitor_numbers = ?, car_numbers = ?, total_price = ? WHERE id = ?`,
                            [visitor_numbers, car_numbers, total_price, id], // Data yang ingin diupdate
                            function (updateError, updateResults) {
                                connection.release(); // Pastikan koneksi dilepaskan setelah query

                                if (updateError) {
                                    console.error("Update query error: ", updateError);
                                    return res.status(500).send({ error: 'Update query error' });
                                }

                                // Jika update berhasil, kembalikan data yang telah diupdate
                                console.log("Data updated successfully");

                                return res.send({
                                    message: 'Data updated successfully',
                                    // data: selectResults[0], // Data yang diambil sebelumnya
                                    // updateResults: updateResults // Hasil update
                                });
                            }
                        );
                    } else {
                        // Jika data tidak ditemukan, kirimkan pesan error
                        connection.release();
                        return res.status(404).send({ error: 'Data not found for the given id' });
                    }
                }
            );
        });
    },
};
