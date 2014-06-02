var mysql = require('mysql');

var pool  = mysql.createPool({
    user: 'root',
   	password: '',
   	database:'fitment-erp',
   	host: '127.0.0.1'
});

var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};

exports.getCon = getConnection;

module.exports = {
    getCon: getConnection
};
