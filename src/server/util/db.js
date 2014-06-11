
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
    logger.debug('db.query, sql=%s',sql);
    pool.query(sql,params,function(error,rows){
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
 * @Author Ken
 * @description 获取表的所有字段属性 [暂弃用, 被tableFields代替]
 * @LastUpdateDate 2014-06-10
 * @parameter tableName
 * @return promise
 *
 [key] - [value]
 catalog = "def"
 charsetNr = 63
 db = "fitment-erp"
 decimals = 0
 default = undefined
 filler1 = Object
 filler2 = Object
 flags = 16931
 length = 11
 name = "id"
 orgName = "id"
 orgTable = "user"
 protocol41 = true
 table = "user"
 type = 3
 zeroFill = false
 * */
//var getFields = function(tableName) {
//    var deferred = Q.defer();
//    if(!tableName)
//        deferred.reject('db.getFields wrong parameter');
//    var sql = 'select * from `'+tableName+'` where false';
//    logger.debug(sql);
//    pool.query(sql,function(error,rows,fields){
//        if(error) {
//            logger.error('Sql error, code='+error.code+',sqlState='+error.sqlState+',msg='+error.message);
//            deferred.reject(error);
//        }
//        else
//            deferred.resolve(fields);
//    });
//    return deferred.promise;
//};
//exports.getFields = getFields;

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
 * @description list,update,delete 通用方法
 * @LastUpdateDate 2014-06-11
 * @parameter tableName
 * @parameter obj 根据此参数的属性组合sql
 * @parameter sql list,update,delete对应的sql
 * @parameter type 类型,list/update/delete中的一种
 * @return promise
 * */
function commonRUD(tableName,obj,sql,type) {
    var deferred = Q.defer();

    if(!isValidTableName(tableName)) {
        var errorMsg = 'db.'+type+', no table, tableName='+tableName;
        logger.error(errorMsg);
        deferred.reject(errorMsg);
        return deferred.promise;
    }

    var params = [],i=0;
    if(obj) {
        for(var key in obj) {
            if(isValidField(tableName,key)) {
                sql += ' and '+key+'=?';
                params[i++] = obj[key];
                break;
            }
        }
    } else {
        var errorMsg = 'db.'+type+', obj is undefined or null';
        logger.error(errorMsg);
        deferred.reject(errorMsg);
        return deferred.promise;
    }

    return query(sql,params);
};

/**
 * @Author Ken
 * @description create 通用方法
 * @LastUpdateDate 2014-06-11
 * @parameter tableName
 * @parameter obj 根据此参数的属性组合sql
 * @return promise
 * */
function commonCreate(tableName,obj) {
    var deferred = Q.defer();

    if(!isValidTableName(tableName)) {
        var errorMsg = 'db.create, no table, tableName='+tableName;
        logger.error(errorMsg);
        deferred.reject(errorMsg);
    }
    //INSERT INTO tbl_name (col1,col2) VALUES(15,col1*2);
    var sql = "insert into `"+tableName+"` (";
    var columnsSql = '';
    var valuesSql = '';
    if(obj) {
        for(var key in obj) {
            var field = getField(tableName,key);
            if(field) {
                if(columnsSql!='') {
                    columnsSql += ',';
                    valuesSql += ',';
                }
                columnsSql += '`'+key+'`';
                switch(field.data_type.toLowerCase()) {
                    case 'int':
                    case 'tinyint':
                    case 'smallint':
                    case 'mediumint':
                    case 'bigint':
                        valuesSql += parseInt(obj[key]);
                        break;
                    case 'float':
                    case 'double':
                    case 'double precision':
                    case 'real':
                    case 'decimal':
                        valuesSql += parseFloat(obj[key]);
                        break;
                    case 'bool':
                    case 'boolean':
                        valuesSql += obj[key];
                        break;
                    case 'char':
                    case 'varchar':
                    case 'text':
                    case 'date':
                    case 'datetime':
                    case 'timestamp':
                        valuesSql += '"'+obj[key]+'"';
                        break;
                    default:
                        logger.error('db.commonCreate, 未拦截的field类型,type=%s',field.data_type);
                        break;
                }
            }
        }//end for
        sql = sql + columnsSql + ') values('+valuesSql+')';
    } else {
        var errorMsg = 'db.create, obj is undefined or null';
        logger.error(errorMsg);
        deferred.reject(errorMsg);
        return deferred.promise;
    }
    return query(sql);
};
/**
 * @Author Ken
 * @description CRUD 操作
 * @LastUpdateDate 2014-06-11
 * @parameter tableName
 * @parameter obj 根据此参数的属性组合sql
 * @return promise
 * */
exports.list = function(tableName,obj) {
    var sql = "select * from `"+tableName+"` where true";
    var type = 'list';
    return commonRUD(tableName,obj,sql,type);
};
exports.update = function(tableName,obj) {
    var sql = "update `"+tableName+"` where true";
    var type = 'list';
    return commonRUD(tableName,obj,sql,type);
};
exports.delete = function(tableName,obj) {
    var sql = "delete from `"+tableName+"` where true";
    var type = 'delete';
    return commonRUD(tableName,obj,sql,type);
};
exports.create = function(tableName,obj) {
    return commonCreate(tableName,obj);
};