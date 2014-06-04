/**
 * Created by md on 14-6-3.
 */
var db = require('../util/db');

function getUserList(id,callback) {
    var query = 'select * from test where true';
    var params = [],i=0;
    if(id) {
        query += ' and id=?';
        params[i++] = id;
    }
    db.getCon(function(err,con){
        con.query(query,params,function(error,rows, fields){
            con.release();
            return callback(error,rows);
        });
    });
}

exports.getUserList = getUserList;