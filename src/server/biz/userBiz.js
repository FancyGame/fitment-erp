/**
 * Created by md on 14-6-3.
 */

var userDao = require('../dao/userDao');

function getUserList(req,res) {
    var id = req.query.id;
    return userDao.getUserList(id,function(error,rows){
        if(error) {
            console.log('userBiz getUserList, error=',error);
        }
        else {
            res.send(rows);
        }
    });
}

exports.getUserList = getUserList;