/**
 * Created by md on 14-6-3.
 */

var dao = require('../dao/userDao');
var db = require('../util/db');
var dbEx = require('../util/dbEx');
var logger = require('../util/logger').logger;
var encrypt = require('../util/encrypt');
var C = require('../util/const');
var object = require('../util/object');
var privilegeBiz = require('./privilegeBiz');


/**
 * @Author Ken
 * @description 获取当前用户的信息
 * @LastUpdateDate 2014-06-10
 * @type FE
 * */
exports.getCurUserFE = function(req,res) {
    var user = {};
    user.id = req.session.uid;
    user.del = 0;
    db.select(dao.tableName,user).then(function(rows){
        if(rows.length>0) {
            object.copy(rows[0],user,['id','name','gid','cid','age','realname']);
            //login 时已经存在session中了
            user.privileges = req.session.privileges;
            res.send(user);
        }
        else {
            res.send("false");
        }
    }).fail(function(error){
        res.status(500);
        res.end();
    });
};

/**
 * @Author Ken
 * @description 获取当前用户的信息
 * @LastUpdateDate 2014-06-10
 * @type BE
 * */
exports.getUserList = function(user) {
    user.del = 0;
    db.select(dao.tableName,user).then(function(rows){
        return rows;
    },function(){
        return [];
    });
};

/**
 * @Author Ken
 * @description 登陆,成功后把uid等信息存在session中
 * @LastUpdateDate 2014-06-24
 * @type FE
 * */
exports.login = function(req,res) {
    console.log(req.body);
    var user = {};
    user.name = req.body.username;
    user.pwd = encrypt.MD5(req.body.password);
    user.del = 0;

    db.select(dao.tableName,user).then(function(rows){
       if(rows && rows.length>0) {
           res.send("true");
           var sess = req.session;
           sess.uid = rows[0].id;
           sess.gid = rows[0].gid;
           sess.cid = rows[0].cid;
           //登陆时查询权限并保存在session中,以便动作的权限判断
           privilegeBiz.getAllPrivilegesOfUser(sess.cid,sess.gid,sess.uid).then(function(privileges){
               sess.privileges = privileges;
               sess.save();
           }).fail(function(error){
               res.status(500);
               res.send("查询用户权限出错");
           });
       }
       else {
           res.status(500);
           res.send(C.MSG_NO_USER_OR_PWD);
       }
    }).fail(function(error){
        res.status(500);
        res.end();
    });
};
//test
exports.session = function(req,res) {
    var sess = req.session
    if (sess.views) {
        sess.views++
        res.setHeader('Content-Type', 'text/html')
        res.write('<p>views: ' + sess.views + '</p>')
        res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>')
        res.end()
    } else {
        sess.views = 1
        res.end('welcome to the session demo. refresh!')
    }
};
