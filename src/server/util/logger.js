/**
 * Created by md on 14-6-8.
 */

var log4js = require('log4js');
//console log is loaded by default, so you won't normally need to do this
//log4js.loadAppender('console');
log4js.loadAppender('file');
//log4js.addAppender(log4js.appenders.console());
log4js.addAppender(log4js.appenders.file('logs/fitment.log'), 'fitment');

var logger = log4js.getLogger('fitment');
logger.setLevel('DEBUG');  //DEBUG < INFO < WARN < ERROR < FATAL

logger.info("Fitment is started");

exports.info = function(){
    logger.info(arguments);
};
exports.debug = function(){
    logger.debug(arguments);
};
exports.error = function(){
    logger.error(arguments);
};
exports.log = function(){
    logger.log(arguments);
};
exports.warn = function(){
    logger.warn(arguments);
};