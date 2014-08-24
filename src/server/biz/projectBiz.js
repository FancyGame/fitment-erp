/**
 * Created by md on 14-6-24.
 */

var dao = require('../dao/projectDao');
var db = require('../util/db');
var logger = require('../util/logger').logger;
var privilegeBiz = require('./privilegeBiz');
var C = require('../util/const');
var source_name = 'project';

exports.getMyListFE = function(req,res) {
    privilegeBiz.getPrivilege(req.session,source_name).then(function(priv){
        if(priv.opt_retrieve)
            return db.getList(dao.tableName,{oid:req.session.userId,cid:req.session.cid,del:0},req,res);
        else {
            res.status(500);
            res.send(C.MSG_NO_PRIVILEGE);
        }
    });
};

exports.getMyCountFE = function(req,res) {
    return db.getCount(dao.tableName,{oid:req.session.userId,del:0},req,res);
};
