/**
 * Created by md on 14-8-21.
 */

var dao = require('../dao/projectDao');
var db = require('../util/db');
var logger = require('../util/logger').logger;
var C = require('../util/const');
var Q = require('q');

/**
 * @Author Ken
 * @LastUpdateDate 2014-08-24
 * @description 权限更新版本库(按公司记录)
 *      此数据只在项目一直运行时有用, 如果项目重启, 所有数据reload, 则无影响
 *      (此情况下有影响:库更新了, 而用户没有动作, 项目重启, 此时库更新数据丢掉, 用户再有动作时, 则不会使用新的权限)
 * @example:
 *      [{cid:1,ver:1},{cid:2,ver:4}]
 */
var privilege_version_lib = [];

//var getPrivilegeValue = function(uid,gid,cid,source_name) {
//    var deferred = Q.defer();
//    var sql = "select min(value) as value from privilege where (gid=? or uid=?) and sname=? and (cid=0 or cid=?) group by sid";
//    var params = [],i=0;
//    params[i++] = gid;
//    params[i++] = uid;
//    params[i++] = source_name;
//    params[i++] = cid;
//    db.query(sql,params).then(function(rows){
//        if(rows && rows.length>0) {
//            deferred.resolve(rows[0].value);
//        }
//        else
//            deferred.resolve(0);
//    }).fail(function(error){
//        logger.error(error);
//        deferred.reject(-1);
//    });
//    return deferred.promise;
//};
//exports.getPrivilegeValue = getPrivilegeValue;

/**
 * @Author Ken
 * @description 查询某用户对资源的访问权限
 * @LastUpdateDate 2014-08-24
 * @parameter cid: company id
 * @parameter gid: group id
 * @parameter uid: user id
 * @return promise
 * */
var getAllPrivilegesOfUser = function(cid,gid,uid) {
    var deferred = Q.defer();
    var company_level_priv_promise = null;
    var user_level_priv_promise = null;
    {
        var sql = "select sid,sname,min(value) as value from privilege where gid=? and cid=? group by sid";
        var params = [],i=0;
        params[i++] = gid;
        params[i++] = cid;
        company_level_priv_promise = db.query(sql,params);
    }
    {
        var sql = "select sid,sname,min(value) as value from privilege where uid=? and cid=? group by sid";
        var params = [],i=0;
        params[i++] = uid;
        params[i++] = cid;
        user_level_priv_promise = db.query(sql,params);
    }
    Q.all([company_level_priv_promise,user_level_priv_promise]).then(function(dataArr){
        var company_level_privs = dataArr[0];
        var user_level_privs = dataArr[1];
        var privs = {};
        for(var i in company_level_privs) {
            var priv = company_level_privs[i];
            privs[priv.sname] = {
                sid:          priv.sid,
                opt_retrieve: (priv.value & C.OPT_RETRIEVE) > 0,
                opt_create:   (priv.value & C.OPT_CREATE)   > 0,
                opt_update:   (priv.value & C.OPT_UPDATE)   > 0,
                opt_delete:   (priv.value & C.OPT_DELETE)   > 0,
                value:        priv.value
            };
        }
        //user的权限优先,会替换group的权限
        for(var i in user_level_privs) {
            var priv = user_level_privs[i];
            privs[priv.sname] = {
                sid:          priv.sid,
                opt_retrieve: (priv.value & C.OPT_RETRIEVE) > 0,
                opt_create:   (priv.value & C.OPT_CREATE)   > 0,
                opt_update:   (priv.value & C.OPT_UPDATE)   > 0,
                opt_delete:   (priv.value & C.OPT_DELETE)   > 0,
                value:        priv.value
            };
        }
        //设置最新的version
        for(var i in privilege_version_lib) {
            var priv_ver = privilege_version_lib[i];
            if(priv_ver.cid==cid) {
                privs.ver = priv_ver.ver;
                break;
            }
        }
        //没找到公司, 则给个默认值
        if(!privs.ver)
            privs.ver = 0;
        deferred.resolve(privs);
    }).fail(function(error){
        logger.error(error);
        deferred.reject({});
    });
    return deferred.promise;
};
exports.getAllPrivilegesOfUser = getAllPrivilegesOfUser;

/**
 * @Author Ken
 * @description 查询某用户对资源的访问权限,如果数据过时了,则自动更新
 * @LastUpdateDate 2014-08-24
 * @parameter sesssion: 从session中取出privileges, 并判断[更新版本号]
 * @parameter source_name: like: 'client', 'project' 一般以数据库的表名为数据名
 * @return promise
 * */
var getPrivilege = function(session,source_name) {
    var deferred = Q.defer();
    var privileges = null;
    //先查privs是否过期, 过期则更新后,并放回session
    (function(){
        var deferred = Q.defer();
        var bFound = false;
        for(var i in privilege_version_lib) {
            var priv_ver = privilege_version_lib[i];
            if(priv_ver.cid==session.cid) {
                if(session.privileges.ver<priv_ver.ver) {
                    //reload
                    getAllPrivilegesOfUser(session.cid,session.gid,session.uid).then(function(data) {
                        privileges = data;
                        //保存回session
                        session.privileges = privileges;
                        session.save();
                        logger.debug('checkPrivilege reload privileges,cid=%d,ver=%d,%d',session.cid,session.privileges.ver,priv_ver.ver);
                        deferred.resolve();
                    });
                }
                else {
                    privileges = session.privileges;
                    logger.debug('checkPrivilege ,privs not updated, use privileges of session');
                    deferred.resolve();
                }
                bFound = true;
                break;
            }
        }
        if(!bFound) {
            privileges = session.privileges;
            logger.debug('checkPrivilege ,no company privs version,use privileges of session');
            deferred.resolve();
        }
        return deferred.promise;
    })().then(function(){
        //找到后返回
        if(privileges && privileges[source_name]) {
            deferred.resolve(privileges[source_name]);
        }
        else {
            deferred.resolve({});
        }
    });
    return deferred.promise;
};
exports.getPrivilege = getPrivilege;

//exports.checkPrivilege = function(privs,source_name,privilegeToCheck) {
//    var deferred = Q.defer();
//    getPrivilegeValue(uid,gid,cid,source_name).then(function(value){
//        if((value & privilegeToCheck) > 0) {
//            deferred.resolve(true);
//        }
//        else
//            deferred.resolve(false);
//    }).fail(function(error){
//        logger.error(error);
//        deferred.resolve(false);
//    });
//    return deferred.promise;
//};
//exports.checkCreate = function() {
//    var deferred = Q.defer();
//    getPrivilege(req.session,source_name).then(function(priv){
//        if(priv.opt_create) {
//            deferred.resolve();
//        }
//        else {
//            res.status(500);
//            res.send(C.MSG_NO_PRIVILEGE);
//            deferred.reject();
//        }
//    });
//    return deferred.promise;
//};
//exports.checkUpdate = function() {
//    var deferred = Q.defer();
//    getPrivilege(req.session,source_name).then(function(priv){
//        if(priv.opt_update) {
//            deferred.resolve();
//        }
//        else {
//            res.status(500);
//            res.send(C.MSG_NO_PRIVILEGE);
//            deferred.reject();
//        }
//    });
//    return deferred.promise;
//};
