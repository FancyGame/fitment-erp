/**
 * Created by md on 14-6-24.
 */

var dao = require('../dao/clientDao');
var db = require('../util/db');
var dbEx = require('../util/dbEx');
var logger = require('../util/logger').logger;
var privilegeBiz = require('./privilegeBiz');
var C = require('../util/const');
var ObjectUtil = require('../util/object');
var source_name = 'client';

exports.getMyListFE = function(req,res) {
    var whereParam = {oid:req.session.uid,cid:req.session.cid,del:0};
    if(req.query.keyword) {
        whereParam = "oid="+req.session.uid+" and del=0";
        //需要在下列字段中模糊查找
        var arr = ['name','address','phone','comment'];
        var searchSql = 'false';
        var keyword = db.formatString(req.query.keyword);
        for(var i in arr) {
            searchSql += " or "+arr[i]+" like '%"+keyword+"%'";
        }
        whereParam += ' and ('+searchSql+')';
    }
    return dbEx.getList(dao.tableName,whereParam,{order:'createon desc'},req,res);
};

exports.getMyCountFE = function(req,res) {
    var whereParam = {oid:req.session.uid,cid:req.session.cid,del:0};
    if(req.query.keyword) {
        whereParam = "oid="+req.session.uid+" and del=0";
        //需要在下列字段中模糊查找
        var arr = ['name','address','phone','comment'];
        var searchSql = 'false';
        var keyword = db.formatString(req.query.keyword);
        for(var i in arr) {
            searchSql += " or "+arr[i]+" like '%"+keyword+"%'";
        }
        whereParam += ' and ('+searchSql+')';
    }
    return dbEx.getCount(dao.tableName,whereParam,req,res);
};

exports.getById = function(req,res) {
    dbEx.getOne(dao.tableName,{oid:req.session.uid,del:0,id:req.params.id},null,req,res);
};

exports.add = function(req,res,next) {
    privilegeBiz.getPrivilege(req.session,source_name).then(function(priv){
        if(priv.opt_create) {
            var params = {};
            ObjectUtil.copy(req.body,params,[]);
            //不能让用户在前端篡改company id
            params.cid = req.session.cid;
            dbEx.insert(dao.tableName,params,req,res);
        }
        else {
            res.status(500);
            res.send(C.MSG_NO_PRIVILEGE);
        }
    });
};

exports.update = function(req,res) {
    privilegeBiz.getPrivilege(req.session,source_name).then(function(priv){
        if(priv.opt_update) {
            dbEx.update(dao.tableName,req.body,{id:req.body.id,oid:req.session.uid},req,res);
        }
        else {
            res.status(500);
            res.send(C.MSG_NO_PRIVILEGE);
        }
    });
};

exports.delete = function(req,res) {
    privilegeBiz.getPrivilege(req.session,source_name).then(function(priv){
        if(priv.opt_delete) {
            dbEx.update(dao.tableName,{del:1},{id:req.params.id,oid:req.session.uid},req,res);
        }
        else {
            res.status(500);
            res.send(C.MSG_NO_PRIVILEGE);
        }
    });
};