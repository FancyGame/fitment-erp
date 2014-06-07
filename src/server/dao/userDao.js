/**
 * Created by md on 14-6-3.
 */
var db = require('../util/db');

exports.getUserList = function(id,callback) {
    var query = 'select * from test where true';
    var params = [],i=0;
    if(id) {
        query += ' and id=?';
        params[i++] = id;
    }
    db.getCon(function(error,con){
        con.query(query,params,function(error,rows, fields){
            con.release();
            return callback(error,rows);
        });
    });
};

exports.getUser = function(name,pwd,callback) {
    var query = 'select * from user where name=? and pwd=?';
    var params = [],i=0;
    params[i++] = name;
    params[i++] = pwd;
    db.getCon(function(error,con){
        con.query(query,params,function(error,rows, fields){
            con.release();
            return callback(error,rows);
        });
    });
};
