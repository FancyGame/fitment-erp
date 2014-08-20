/**
 * Created by md on 14-8-19.
 */
var db = require('../util/db');
var logger = require('../util/logger').logger;

var tableName = 'navigator';
exports.tableName = tableName;

exports.getById = function(curUid,id) {
    var whereParam = {oid:curUid,del:0,id:id};
    return db.select(tableName,whereParam);
};