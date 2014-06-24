/**
 * Created by md on 14-6-3.
 */

var dao = require('../dao/userDao');
var db = require('../util/db');
var logger = require('../util/logger').logger;
var encrypt = require('../util/encrypt');


/**
 * @Author Ken
 * @description 获取当前用户的信息
 * @LastUpdateDate 2014-06-10
 * @type FE
 * */
exports.getCurUserFE = function(req,res) {
    var user = {};
    user.id = req.session.userId;
    user.del = 0;
    db.select(dao.tableName,user).then(function(rows){
        if(rows.length>0) {
            //TODO: 2014-06-24 只取出需要给前台的列,防止敏感信息传递给前台. 应写个方法处理
            user.id = rows[0].id;
            user.name = rows[0].name;
            user.gid = rows[0].gid;
            user.cid = rows[0].cid;
            user.age = rows[0].age;
            user.realname = rows[0].realname;
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
 * @description 登陆,成功后把userId存在session中
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
           sess.userId = rows[0].id;
       }
       else {
           res.send("false");
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
