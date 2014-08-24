/**
 * Created by md on 14-8-19.
 */

var dao = require('../dao/navigatorDao');
var db = require('../util/db');
var dbEx = require('../util/dbEx');
var logger = require('../util/logger').logger;
var C = require('../util/const');
var Q = require('q');
var privilegeBiz = require('./privilegeBiz');

exports.getMyListFE = function(req,res) {
    //navigator 与 privilege, privilege的sid<1000的,全为navigator预留, 如果有新的数据源需要加,而且不是菜单的, 则sid从1001开始记录
    var sql = 'select * from navigator where del=0 order by display_order';
    Q.all([
        db.query(sql),
        privilegeBiz.getAllPrivilegesOfUser(req.session.cid,req.session.gid,req.session.uid)
    ]).then(function(dataArr){
        var navs = dataArr[0];
        var privs = dataArr[1];
        var retNavs = [];
        for(var i in navs) {
            for(var key in privs) {
                if(navs[i].id==privs[key].sid && privs[key].opt_retrieve) {
                    retNavs.push(navs[i]);
                    break;
                }
            }
        }
        res.send(retNavs);
    }).fail(function(error){
        res.status(500);
        res.end();
    });
};
