var mysql = require('mysql');
var logger = require('./logger');
var Q = require('q');

var pool  = mysql.createPool({
    user: 'root',
   	password: '',
   	database:'fitment-erp',
   	host: '127.0.0.1'
});

exports.query = function(sql,params) {
    var deferred = Q.defer();
    pool.query(sql,params,function(error,rows,fields){
        if(error) {
            logger.error('Sql error, code='+error.code+',sqlState='+error.sqlState+',msg='+error.message);
            deferred.reject(error);
        }
        else
            deferred.resolve(rows);
    });
    return deferred.promise;
};

exports.getCon = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};