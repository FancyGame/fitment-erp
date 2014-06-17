
var mysql = require('mysql');
var logger = require('./logger').logger;
var Q = require('q');

var dbUser = 'root';
var dbPwd  = '';
var dbName = 'fitment-erp';
var dbHost = '127.0.0.1';

var pool = mysql.createPool({
    user: dbUser,
   	password: dbPwd,
   	database:dbName,
   	host: dbHost
});

//-------------
//var tmp = {};
//console.log(pool.escape(tmp).replace(/,/g,' and'));
//var userid = "1 or 1=1";
//var sql = "update test set ? where ?";
//sql = mysql.format(sql,[{name:'Ken11'},{id:3}]);
//console.log(sql);
//var ret = pool.query(sql,function(error,rows){
//    console.log('rows',rows);
//});
//console.log("pool.query ret=",ret);
//=============

/**
 * @Author Ken
 * @description 查询sql结果
 * @LastUpdateDate 2014-06-10
 * @parameter sql
 * @parameter params sql中?对应的数据,数组类型
 * @return promise
 * */
var query = function(sql,params) {
    var deferred = Q.defer();
    var formatSQL = params ? mysql.format(sql,params) : sql;
    logger.debug('db.query, sql = %s',formatSQL);
    pool.query(formatSQL,params,function(error,rows){
        if(error) {
            logger.error('Sql error, code='+error.code+',sqlState='+error.sqlState+',msg='+error.message);
            deferred.reject(error);
        }
        else
            deferred.resolve(rows);
    });
    return deferred.promise;
};
exports.query = query;

/**
 * 开始初始化db的数据
 * 目的: 给所有的表提供基础的CRUD操作
 * */
var tableFields = {};
/**
 * @Author Ken
 * @description 执行语句,初始化tableFields
 * @LastUpdateDate 2014-06-11
 * @parameter tableName
 * @return promise
 * */
var descSQL = "select table_name,column_name,data_type,character_maximum_length,column_key,extra from information_schema.columns where table_schema='"+dbName+"' order by table_name";
query(descSQL).then(function(rows){
    var tableCount = 0;
    for(var i in rows) {
        var row = rows[i];
        if(!tableFields[row.table_name]) {
            tableFields[row.table_name] = [];
            tableCount++;
        }
        tableFields[row.table_name].push(row);
    }
    logger.info("初始化表信息完成, 共有%d个表",tableCount);
});
exports.tableFields = tableFields;
/**
 * @Author Ken
 * @description 是否有此表的fields
 * @LastUpdateDate 2014-06-11
 * @parameter tableName
 * @return boolean
 * */
function isValidTableName(tableName) {
    return (tableFields[tableName] ? true:false);
}
/**
 * @Author Ken
 * @description 在某表中是否有此field
 * @LastUpdateDate 2014-06-11
 * @parameter tableName,fieldName
 * @return boolean
 * */
function isValidField(tableName,fieldName) {
    if(isValidTableName(tableName)) {
        for(var i in tableFields[tableName]) {
            var column = tableFields[tableName][i];
            if(column.column_name==fieldName)
                return true;
        }
    }
    return false;
}
/**
 * @Author Ken
 * @description 获取某表的某个field
 * @LastUpdateDate 2014-06-11
 * @parameter tableName,fieldName
 * @return field object / null
 * */
function getField(tableName,fieldName) {
    if(isValidTableName(tableName)) {
        for(var i in tableFields[tableName]) {
            var column = tableFields[tableName][i];
            if(column.column_name==fieldName)
                return column;
        }
    }
    return null;
}


/**
 * @Author Ken
 * @description CRUD 操作 只提供对单表的CRUD基本操作,如需高级功能还需要调用query方法
 * @LastUpdateDate 2014-06-17
 * @parameter tableName
 * @parameter objWhere 根据此参数的属性组合sql
 * @parameter objSet 为update,insert语句使用
 * @parameter sqlOrder 为select语句使用
 * @return promise
 * */
exports.select = function(tableName,objWhere,sqlOrder) {
    var sql = "select * from `"+tableName+"`";
    var sqlWhere = pool.escape(objWhere).replace(/,/g,' and');
    if(sqlWhere && sqlWhere.length>0)
        sql = sql + " where " + sqlWhere;
    if(sqlOrder)
        sql += sqlOrder;
    return query(sql);
};
exports.update = function(tableName,objSet,objWhere) {
    var sql = "update `"+tableName+"` set ?";
    var sqlWhere = pool.escape(objWhere).replace(/,/g,' and');
    if(sqlWhere && sqlWhere.length>0)
        sql = sql + " where " + sqlWhere;
    return query(sql,objSet);
};
exports.delete = function(tableName,objWhere) {
    var sql = "delete from `"+tableName+"`";
    var sqlWhere = pool.escape(objWhere).replace(/,/g,' and');
    if(sqlWhere && sqlWhere.length>0)
        sql = sql + " where " + sqlWhere;
    return query(sql);
};
/**
 * @description
 *      rows.insertId will be the inserted id under 'auto_increment' config
 * */
exports.insert = function(tableName,objSet) {
    var sql = "insert into "+tableName+" set ?";
    return query(sql,objSet);
};