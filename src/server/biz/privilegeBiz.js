/**
 * Created by md on 14-8-21.
 */

var dao = require('../dao/projectDao');
var db = require('../util/db');
var logger = require('../util/logger').logger;
var C = require('../util/const');
var Q = require('q');

var getPrivilegeValue = function(uid,gid,cid,source_name) {
    var deferred = Q.defer();
    var sql = "select min(value) as value from privilege where (gid=? or uid=?) and sname=? and (cid=0 or cid=?) group by sid";
    var params = [],i=0;
    params[i++] = gid;
    params[i++] = uid;
    params[i++] = source_name;
    params[i++] = cid;
    db.query(sql,params).then(function(rows){
        if(rows && rows.length>0) {
            deferred.resolve(rows[0].value);
        }
        else
            deferred.resolve(0);
    }).fail(function(error){
        logger.error(error);
        deferred.reject(-1);
    });
    return deferred.promise;
};
exports.getPrivilegeValue = getPrivilegeValue;

var getAllPrivilegesOfUser = function(uid,gid,cid) {
    var deferred = Q.defer();
    var sql = "select sid,sname,min(value) as value from privilege where (gid=? or uid=?) and (cid=0 or cid=?) group by sid";
    var params = [],i=0;
    params[i++] = gid;
    params[i++] = uid;
    params[i++] = cid;
    db.query(sql,params).then(function(rows){
        if(rows && rows.length>0) {
            deferred.resolve(rows);
        }
        else
            deferred.resolve([]);
    }).fail(function(error){
        logger.error(error);
        deferred.reject(error);
    });
    return deferred.promise;
};
exports.getAllPrivilegesOfUser = getAllPrivilegesOfUser;

exports.checkPrivilege = function(uid,gid,cid,source_name,privilegeToCheck) {
    var deferred = Q.defer();
    getPrivilegeValue(uid,gid,cid,source_name).then(function(value){
        if((value & privilegeToCheck) > 0) {
            deferred.resolve(true);
        }
        else
            deferred.resolve(false);
    }).fail(function(error){
        logger.error(error);
        deferred.resolve(false);
    });
    return deferred.promise;
};