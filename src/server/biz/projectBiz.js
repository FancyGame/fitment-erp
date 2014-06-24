/**
 * Created by md on 14-6-24.
 */

var dao = require('../dao/projectDao');
var db = require('../util/db');
var logger = require('../util/logger').logger;

exports.getMyListFE = function(req,res) {
    return db.getList(dao.tableName,{oid:req.session.userId,del:0},req,res);
};

exports.getMyCountFE = function(req,res) {
    return db.getCount(dao.tableName,{oid:req.session.userId,del:0},req,res);
};
