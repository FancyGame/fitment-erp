/**
 * Created by md on 14-6-3.
 */
var db = require('../util/db');

var tableName = 'company';
exports.tableName = tableName;
//
//exports.getCompanyList = function(id,callback) {
//    var query = 'select * from company where true';
//    var params = [],i=0;
//    if(id) {
//        query += ' and id=?';
//        params[i++] = id;
//    }
//    db.getCon(function(error,con){
//        con.query(query,params,function(error,rows, fields){
//            con.release();
//            return callback(error,rows);
//        });
//    });
//};
//
//exports.getCompany = function(company,callback) {
//    var query = 'select * from company where true';
//    var params = [],i=0;
//    if(company.id) {
//        query += ' and id=?';
//        params[i++] = company.id;
//    }
//    if(company.name) {
//        query += ' and name=?';
//        params[i++] = company.name;
//    }
//    if(company.address) {
//        query += ' and address=?';
//        params[i++] = company.address;
//    }
//    if(company.telephone) {
//        query += ' and telephone=?';
//        params[i++] = company.telephone;
//    }
//
//    return db.query(query,params);
//};

//exports.getUser = function(name,pwd,callback) {
//    var query = 'select * from user where name=? and pwd=?';
//    var params = [],i=0;
//    params[i++] = name;
//    params[i++] = pwd;
//    db.getCon(function(error,con){
//        con.query(query,params,function(error,rows, fields){
//            con.release();
//            return callback(error,rows);
//        });
//    });
//};
