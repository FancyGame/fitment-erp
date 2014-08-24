/**
 * Created by md on 14-8-20.
 */

//constant value

//Operation Start
//CRUD
exports.OPT_RETRIEVE    = 1<<0;
exports.OPT_CREATE      = 1<<1;
exports.OPT_UPDATE      = 1<<2;
exports.OPT_DELETE      = 1<<3;
exports.OPT_RETRIEVE_STR    = 'opt_retrieve';
exports.OPT_CREATE_STR      = 'opt_create';
exports.OPT_UPDATE_STR      = 'opt_update';
exports.OPT_DELETE_STR      = 'opt_delete';
//Operation End

//Error Message Start
exports.MSG_OPT_FAILED = {message:'操作失败'};
exports.MSG_NO_AUTH = {message:'NoAuthorization'};
exports.MSG_NO_PRIVILEGE = {message:'无权执行操作'};
exports.MSG_NO_USER_OR_PWD = {message:'无此用户或密码不正确'};
//Error Message End
