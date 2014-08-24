/**
 * Created by md on 14-6-3.
 */

var dao = require('../dao/workTaskDao');
var db = require('../util/db');
var dbEx = require('../util/dbEx');
var logger = require('../util/logger').logger;

exports.getMyListFE = function(req,res) {
    return dbEx.getList(dao.tableName,{uid:req.session.uid,del:0},req,res);
};

exports.getMyCountFE = function(req,res) {
    return dbEx.getCount(dao.tableName,{uid:req.session.uid,del:0},req,res);
};