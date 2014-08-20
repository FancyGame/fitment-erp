/**
 * Created by md on 14-8-19.
 */

var dao = require('../dao/navigatorDao');
var db = require('../util/db');
var logger = require('../util/logger').logger;
var C = require('../util/const');

exports.getMyListFE = function(req,res) {
    //navigator 与 privilege 临时表 做内联
    var sql = 'select n.* from navigator n inner join ' +
        ' (select sid,min(value) as value from privilege where true and (gid=? or uid=?) group by sid) p on n.id=p.sid ' +
        ' where p.value & ? > 0 order by n.display_order,id';
    var params = [],i=0;
    params[i++] = req.query.gid;
    params[i++] = req.session.userId;
    params[i++] = C.OPT_RETRIEVE;

    db.query(sql,params).then(function(rows){
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
