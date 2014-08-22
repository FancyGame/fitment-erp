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
//Operation End

//Error Message Start
exports.MSG_NO_PRIVILEGE = {message:'无权执行操作'};
exports.MSG_NO_USER_OR_PWD = {message:'无此用户或密码不正确'};
//Error Message End
