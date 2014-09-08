/**
 * dbEx.js 是对db.js的拓展,db.js只处理db相关的请求, 而dbEx.js封装了db.js的一些方法,并可处理带request,response的请求
 * 使上层调用起来更加的方便
 * @type {exports}
 */

var db = require('./db');
var logger = require('./logger').logger;
var Q = require('q');

/**
 * @description 拓展insert/delete/update/select,使其能处理基本的web业务
 * @LastUpdateDate 2014-08-27
 * @param tableName
 * @param objSet
 * @param req
 * @param res
 */
exports.update = function(tableName,objSet,objWhere,req,res) {
    db.update(tableName,objSet,objWhere).then(function(rows){
        res.send(true);
    }).fail(function(error){
        logger.error('Update '+tableName+' error, errorMsg =',error);
        res.status(500);
        res.end();
    });
};
exports.delete = function(tableName,objWhere,req,res) {
    db.delete(tableName,objWhere).then(function(rows){
        res.send(true);
    }).fail(function(error){
        logger.error('Delete '+tableName+' error, errorMsg =',error);
        res.status(500);
        res.end();
    });
};
exports.insert = function(tableName,objSet,req,res) {
    db.insert(tableName,objSet).then(function(rows){
        res.send(rows);
    }).fail(function(error){
        logger.error('Insert '+tableName+' error, errorMsg =',error);
        res.status(500);
        res.end();
    });
};
/**
 * @Author Ken
 * @description 带网络的处理
 * @LastUpdateDate 2014-08-27
 * @parameter sql
 * @parameter params
 * */
exports.selectBySql = function(sql,params,req,res) {
    db.query(sql,params).then(function(rows){
        if(rows.length>0) {
            res.send(rows);
        }
        else {
            res.send([]);
        }
    }).fail(function(error) {
        logger.error('dbEx.js selectByBase, error=',error);
        res.status(500);
        res.end();
    });
};

/**
 * @Author Ken
 * @description 通用的count方法,获取数据的条数
 * @LastUpdateDate 2014-08-09
 * @parameter tableName
 * @parameter objWhere 根据此参数的属性组合sqlWhere [optional]
 * @parameter params 参数 [optional]
 * @parameter req request
 * @parameter res response
 * */
exports.getList = function(tableName,objWhere,params,req,res) {
    if(arguments.length<3 || arguments.length>5) {
        logger.error("Error: params length is wrong [db.getList]");
    }
    else if(arguments.length==3) {
        req = objWhere;
        res = params;
        objWhere = null;
        params = null;
    }
    else if(arguments.length==4) {
        res = req;
        req = params;
        params = null;
    }
    if(req.query.pageNo || req.query.pageCount) {
        if(!params) {
            params = {page:[]};
        }
        if(!params.page) {
            params.page = [];
        }
        if(req.query.pageNo)
            params.page.push(req.query.pageNo);
        else
            params.page.push(1);
        if(req.query.pageCount)
            params.page.push(req.query.pageCount);
        else
            params.page.push(10);
    }
    db.select(tableName,objWhere,params).then(function(rows){
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

/**
 * @Author Ken
 * @description 通用的count方法,获取数据的条数
 * @LastUpdateDate 2014-06-24
 * @parameter tableName
 * @parameter obj 根据此参数的属性组合sql
 * @parameter req request
 * @parameter res response
 * */
exports.getCount = function(tableName,obj,req,res) {
    db.count(tableName,obj).then(function(rows){
        var count = rows.length>0 ? rows[0].count : 0;
        res.send({count:count});
    },function(error){
        res.status(500);
        res.end();
    });
};

/**
 * @Author Ken
 * @description 通用的get一条记录方法, 获取某表中的某一条记录
 * @LastUpdateDate 2014-09-08
 * @parameter tableName
 * @parameter objWhere 根据此参数的属性组合sql
 * @parameter req request
 * @parameter res response
 * @return promise
 * */
exports.getOne= function(tableName,objWhere,params,req,res) {
    if(arguments.length<3 || arguments.length>5) {
        logger.error("Error: params length is wrong [db.getList]");
    }
    else if(arguments.length==3) {
        req = objWhere;
        res = params;
        objWhere = null;
        params = null;
    }
    else if(arguments.length==4) {
        res = req;
        req = params;
        params = null;
    }
    db.select(tableName,objWhere,params).then(function(rows){
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
