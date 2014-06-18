/**
 * Created by md on 14-6-3.
 */

var dao = require('../dao/workTaskDao');
var db = require('../util/db');
var logger = require('../util/logger').logger;

exports.getMyWorkTaskListFE = function(req,res) {
    db.select(dao.tableName,{uid:req.session.userId}).then(function(rows){
        if(rows.length>0) {
            res.send(rows);
        }
        else {
            res.send("false");
        }
    },function(error){
        res.status(500);
        res.end();
    });
};

exports.getMyWorkTaskCountFE = function(req,res) {
    dao.getCount({uid:req.session.userId}).then(function(rows){
        var count = rows.length>0 ? rows[0].count : 0;
        logger.debug("getMyWorkTaskCountFE",count);
        res.send({count:count});
    },function(error){
        res.status(500);
        res.end();
    });
};