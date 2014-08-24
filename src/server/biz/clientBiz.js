/**
 * Created by md on 14-6-24.
 */

var dao = require('../dao/clientDao');
var db = require('../util/db');
var logger = require('../util/logger').logger;
var privilegeBiz = require('./privilegeBiz');
var C = require('../util/const');
var source_name = 'client';

exports.getMyListFE = function(req,res) {
    var whereParam = {oid:req.session.userId,cid:req.session.cid,del:0};
    if(req.query.keyword) {
        whereParam = "oid="+req.session.userId+" and del=0";
        var arr = ['name','address','phone','comment'];
        var searchSql = 'false';
        var keyword = db.formatString(req.query.keyword);
        for(var i in arr) {
            searchSql += " or "+arr[i]+" like '%"+keyword+"%'";
        }
        whereParam += ' and ('+searchSql+')';
    }
    return db.getList(dao.tableName,whereParam,{order:'createon desc'},req,res);
};

exports.getMyCountFE = function(req,res) {
    var whereParam = {oid:req.session.userId,cid:req.session.cid,del:0};
    if(req.query.keyword) {
        whereParam = "oid="+req.session.userId+" and del=0";
        var arr = ['name','address','phone','comment'];
        var searchSql = 'false';
        var keyword = db.formatString(req.query.keyword);
        for(var i in arr) {
            searchSql += " or "+arr[i]+" like '%"+keyword+"%'";
        }
        whereParam += ' and ('+searchSql+')';
    }
    return db.getCount(dao.tableName,whereParam,req,res);
};

exports.getById = function(req,res) {
    dao.getById(req.session.userId,req.params.id).then(function(rows){
        if(rows.length>0) {
            res.send(rows[0]);
        }
        else {
            res.send({});
        }
    },function(error){
        res.status(500);
        res.end();
    });
};

exports.add = function(req,res,next) {
    privilegeBiz.getPrivilege(req.session,source_name).then(function(priv){
        if(priv.opt_create) {
            //TODO: 下面这两个回调, 可以简化为Common方法,以便通用,主要是req.body数据向object数据的转换
            //不能让用户在前端篡改company id
            var params = req.body;
            params.cid = req.session.cid;
            db.insert(dao.tableName,params).then(function(rows){
                res.send(rows);
            }).fail(function(error){
                logger.error('Add client error [clientBiz.add], errorMsg =',error);
                res.status(500);
                res.end();
            });
        }
        else {
            res.status(500);
            res.send(C.MSG_NO_PRIVILEGE);
        }
    });
};

exports.update = function(req,res) {
    db.update(dao.tableName,req.body,{id:req.body.id}).then(function(data){
        res.send(true);
    }).fail(function(error){
        logger.error('Update client error [clientBiz.update], errorMsg =',error);
        res.status(500);
        res.end();
    });
};

exports.delete = function(req,res) {
    db.update(dao.tableName,{del:1},{id:req.params.id}).then(function(data){
        res.send(true);
    },function(error){
        logger.error('Delete client error [clientBiz.delete], errorMsg =',error);
        res.status(500);
        res.end();
    });
}