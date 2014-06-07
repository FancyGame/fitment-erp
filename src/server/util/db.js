var mysql = require('mysql');

var pool  = mysql.createPool({
    user: 'root',
   	password: '',
   	database:'fitment-erp',
   	host: '127.0.0.1'
});

exports.getCon = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};
