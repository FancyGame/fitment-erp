/**
 * Created by md on 14-6-3.
 */
var db = require('../util/db');
var logger = require('../util/logger');

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

exports.getUser = function(user) {
    var query = 'select * from user where true';
    var params = [],i=0;
    if(user.id) {
        query += ' and id=?';
        params[i++] = user.id;
    }
    if(user.name) {
        query += ' and name=?';
        params[i++] = user.name;
    }
    if(user.pwd) {
        query += ' and pwd=?';
        params[i++] = user.pwd;
    }
    if(user.gid) {
        query += ' and gid=?';
        params[i++] = user.gid;
    }
    if(user.realname) {
        query += ' and realname=?';
        params[i++] = user.realname;
    }
    return db.query(query,params);
};