/**
 * Created by md on 14-9-7.
 */

var dao = require('../dao/messageDao');
var db = require('../util/db');
var dbEx = require('../util/dbEx');
var logger = require('../util/logger').logger;
var privilegeBiz = require('./privilegeBiz');
var C = require('../util/const');
var ObjectUtil = require('../util/object');
var source_name = 'message';

//获取个人级别消息列表
exports.getMyListFE = function(req,res) {
    var sql = "SELECT m.*,u.realname as from_name,u2.realname as to_name" +
        " FROM message m " +
        " left join user u on m.from_uid=u.id " +
        " left join user u2 on m.to_uid=u2.id" +
        " left join urgency_level ul on m.urgency_level=ul.id" +
        " where m.to_uid=?";
    var params=[], i=0;
    params[i++] = req.session.uid;
    if(req.query.is_read) {
        sql += " and m.is_read=?";
        params[i++] = req.query.is_read;
    }
    sql += " order by createon desc;";
    return dbEx.selectBySql(sql,params,req,res);
};
//获取公司级别消息列表
exports.getMyCompanyMsgListFE = function(req,res) {
    var sql = "SELECT m.*,u.realname as from_name,u2.realname as to_name" +
        " FROM message m " +
        " left join user u on m.from_uid=u.id " +
        " left join user u2 on m.to_uid=u2.id" +
        " left join urgency_level ul on m.urgency_level=ul.id" +
        " where m.cid=? and m.gid=0 and m.to_uid=0";
    var params=[], i=0;
    params[i++] = req.session.cid;
    if(req.query.is_read) {
        sql += " and m.is_read=?";
        params[i++] = req.query.is_read;
    }
    sql += " order by createon desc;";
    return dbEx.selectBySql(sql,params,req,res);
};
//获取组级别消息列表
exports.getMyGroupMsgListFE = function(req,res) {
    var sql = "SELECT m.*,u.realname as from_name,u2.realname as to_name" +
        " FROM message m " +
        " left join user u on m.from_uid=u.id " +
        " left join user u2 on m.to_uid=u2.id" +
        " left join urgency_level ul on m.urgency_level=ul.id" +
        " where m.cid=? and m.gid=? and m.to_uid=0";
    var params=[], i=0;
    params[i++] = req.session.cid;
    params[i++] = req.session.gid;
    if(req.query.is_read) {
        sql += " and m.is_read=?";
        params[i++] = req.query.is_read;
    }
    sql += " order by createon desc;";
    return dbEx.selectBySql(sql,params,req,res);
};
//获取系统级别消息列表
exports.getSysMsgListFE = function(req,res) {
    var sql = "SELECT m.*,u.realname as from_name,u2.realname as to_name" +
    " FROM message m " +
    " left join user u on m.from_uid=u.id " +
    " left join user u2 on m.to_uid=u2.id" +
    " left join urgency_level ul on m.urgency_level=ul.id" +
    " where m.cid=0 and m.gid=0 and m.to_uid=0";
    var params=[], i=0;
    if(req.query.is_read) {
        sql += " and m.is_read=?";
        params[i++] = req.query.is_read;
    }
    sql += " order by createon desc;";
    return dbEx.selectBySql(sql,params,req,res);
};
exports.getById = function(req,res) {
    return dbEx.getOne(dao.tableName,{to_uid:req.session.uid,del:0},null,req,res);
};
exports.add = function(req,res,next) {
};
exports.delete = function(req,res) {
    //加入了UID,所以只能本人做此操作
    return dbEx.update(dao.tableName,{del:1},{id:req.params.id,to_uid:req.session.uid},req,res);
};
//设置为已读
exports.setAsRead = function(req,res) {
    //加入了UID,所以只能本人做此操作
    return dbEx.update(dao.tableName,{is_read:1},{id:req.params.id,to_uid:req.session.uid},req,res);
};
