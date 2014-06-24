/**
 * Created by md on 14-6-3.
 */

var dao = require('../dao/workTaskDao');
var db = require('../util/db');
var logger = require('../util/logger').logger;

exports.getMyListFE = function(req,res) {
    return db.getList(dao.tableName,{uid:req.session.userId,del:0},req,res);
};

exports.getMyCountFE = function(req,res) {
    return db.getCount(dao.tableName,{uid:req.session.userId,del:0},req,res);
};