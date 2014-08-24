/**
 * Created by md on 14-6-24.
 */

var dao = require('../dao/projectDao');
var db = require('../util/db');
var dbEx = require('../util/dbEx');
var logger = require('../util/logger').logger;
var privilegeBiz = require('./privilegeBiz');
var C = require('../util/const');
var source_name = 'project';

exports.getMyListFE = function(req,res) {
    privilegeBiz.getPrivilege(req.session,source_name).then(function(priv){
        if(priv.opt_retrieve)
            return dbEx.getList(dao.tableName,{oid:req.session.uid,cid:req.session.cid,del:0},req,res);
        else {
            res.status(500);
            res.send(C.MSG_NO_PRIVILEGE);
        }
    });
};

exports.getMyCountFE = function(req,res) {
    return dbEx.getCount(dao.tableName,{oid:req.session.uid,del:0},req,res);
};
