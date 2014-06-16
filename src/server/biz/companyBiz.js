/**
 * Created by md on 14-6-3.
 */

var dao = require('../dao/companyDao');
var db = require('../util/db');
var logger = require('../util/logger').logger;

exports.getCompanyFE = function(req,res) {
    var company = {};
    company.id = req.params.id;
    db.select(dao.tableName,company).then(function(rows){
        if(rows.length>0) {
            company.id = rows[0].id;
            company.name = rows[0].name;
            company.address = rows[0].address;
            company.telphone = rows[0].telphone;
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