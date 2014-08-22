/**
 * Created by md on 14-8-21.
 */

var dao = require('../dao/projectDao');
var db = require('../util/db');
var logger = require('../util/logger').logger;
var C = require('../util/const');
var Q = require('q');

exports.checkPrivilege = function(uid,gid,source_name,privilegeToCheck) {
    var deferred = Q.defer();

    var sql = "select min(value) as value from privilege where (gid=? or uid=?) and sname=? group by sid";
    var params = [],i=0;
    params[i++] = gid;
    params[i++] = uid;
    params[i++] = source_name;
    db.query(sql,params).then(function(rows){
        if(rows && rows.length>0 && (rows[0] & privilegeToCheck) > 0) {
            deferred.resolve(true);
        }
        deferred.resolve(false);
    }).fail(function(error){
        logger.error(error);
        deferred.resolve(false);
    });
    return deferred.promise;
};
