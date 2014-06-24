/**
 * Created by md on 14-6-24.
 */

var crypto = require('crypto');

var md5Key = "ken_fitment".toString('ascii');

exports.MD5 = function(clearText){
    var md5 = crypto.createHmac('md5',md5Key);
    return md5.update(clearText).digest('hex').toUpperCase();
};