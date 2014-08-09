/**
 * @Author Ken
 * @LastUpdateDate 2014-6-26
 * @Description load table into memory as cache
 */

var db = require('../util/db');
var logger = require('../util/logger').logger;

/**
 * Please put all table names that you want to cache in memory into this array.
 * */
var stableTableNames = ['client_status','hx','province','city','khly','project_status','zxfg'];

/**
 * @Description Load data
 * @Example
 * For 'client_status' table, it would generate 'client_statusList' array for all rows of it.
 * */
for(var i in stableTableNames) {
    (function(tableName){
        db.select(tableName).then(function(rows){
            exports[tableName+'List'] = rows;
        });
    })(stableTableNames[i]);
}
logger.info("All stable tables (%d) are cached",stableTableNames.length);

exports.getClientStatusList = function(req,res) {
    res.send(exports.client_statusList);
};
exports.getHXStatusList = function(req,res) {
    res.send(exports.hxList);
};
exports.getProvinceList = function(req,res) {
    res.send(exports.provinceList);
};
exports.getCityList = function(req,res) {
    res.send(exports.cityList);
};
exports.getKHLYList = function(req,res) {
    res.send(exports.khlyList);
};
exports.getProjectStatusList = function(req,res) {
    res.send(exports.project_statusList);
};
exports.getZXFGList = function(req,res) {
    res.send(exports.zxfgList);
};