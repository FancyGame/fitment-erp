/**
 * Created by md on 14-6-3.
 */
var db = require('../util/db');
var logger = require('../util/logger').logger;

var tableName = 'work_task';
exports.tableName = tableName;

exports.getCount = function(obj) {
    var sql = "select count(*) as count from `"+tableName+"`";
    return db.query(sql);
};

