/**
 * Created by md on 14-6-3.
 */

var userDao = require('../dao/userDao');

exports.getUserList = function(req,res) {
    var id = req.query.id;
    return userDao.getUserList(id,function(error,rows){
        if(error) {
            console.log('userBiz getUserList, error=',error);
        }
        else {
            res.send(rows);
        }
    });
};

exports.login = function(req,res) {
    console.log(req.body);
    userDao.getUser(req.body.username,req.body.password,function(error,rows){
        if(rows.length>0) {
            res.send("true");
            var sess = req.session;
            sess.userId = rows[0].id;
        }
        else {
            res.send("false");
        }
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
