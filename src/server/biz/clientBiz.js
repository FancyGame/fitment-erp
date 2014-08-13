/**
 * Created by md on 14-6-24.
 */

var dao = require('../dao/clientDao');
var db = require('../util/db');
var logger = require('../util/logger').logger;

exports.getMyListFE = function(req,res) {
    var whereParam = {oid:req.session.userId,del:0};
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
    return db.getList(dao.tableName,whereParam,req,res);
};

exports.getMyCountFE = function(req,res) {
    var whereParam = {oid:req.session.userId,del:0};
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
exports.add = function(req,res) {
//    var obj = {};
//    obj.name = req.body.name;
//    obj.address = req.body.address;
    console.log(req.body);
    //TODO: 下面这两个回调, 可以简化为Common方法,以便通用
    db.insert(dao.tableName,req.body).then(function(rows){
        res.send(rows);
    }).fail(function(error){
        logger.error('Add client error [clientBiz.add], errorMsg =',error);
        res.status(500);
        res.end();
    });
};

exports.getById = function(req,res) {
    var whereParam = {oid:req.session.userId,del:0};
    whereParam.id = req.params.id;
    db.select(dao.tableName,whereParam).then(function(rows){
        if(rows.length>0) {
            res.send(rows);
        }
        else {
            res.send([]);
        }
    },function(error){
        res.status(500);
        res.end();
    });
};