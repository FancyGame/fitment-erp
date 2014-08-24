/**
 * Created by md on 14-6-3.
 */

var dao = require('../dao/companyDao');
var db = require('../util/db');
var dbEx = require('../util/dbEx');
var logger = require('../util/logger').logger;
var object = require('../util/object');

exports.getCompanyFE = function(req,res) {
    var company = {};
    company.id = req.params.id;
    db.select(dao.tableName,company).then(function(rows){
        if(rows.length>0) {
            object.copy(rows[0],company,['id','name','address','telephone']);
            res.send(company);
        }
        else {
            res.send("false");
        }
    },function(error){
        res.status(500);
        res.end();
    });
};
