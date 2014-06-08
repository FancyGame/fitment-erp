/**
 * Created by md on 14-6-3.
 */

var dao = require('../dao/userDao');

exports.getUserList = function(req,res) {
    var id = req.query.id;
    return dao.getUserList(id,function(error,rows){
        if(error) {
            console.log('userBiz getUserList, error=',error);
        }
        else {
            res.send(rows);
        }
    });
};

exports.getCurUserFE = function(req,res) {
    var user = {};
    user.id = req.body.id;
    dao.getUser(user).then(function(rows){
        if(rows.length>0) {
            user.id = rows[0].id;
            user.name = rows[0].name;
            user.gid = rows[0].gid;
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

exports.login = function(req,res) {
    console.log(req.body);
    var user = {};
    user.name = req.body.username;
    user.pwd = req.body.password;

    dao.getUser(user).then(function(rows){
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
