/**
 * Created by md on 14-8-10.
 */

//For ajax call
app.factory('Ajax',function($http,$location,$q){
    var Ajax = {};
    Ajax.AUTH_NAME = "Auth-Token";

    Ajax.setHeader = function(name,value) {
        $http.defaults.headers.common[name] = value;
    };

    Ajax.setHeader('Content-Type','application/json');

    //构造Ajax方法
    var fnArray = ['get','post','delete','put','head'];
    for(var key in fnArray) {
        (function(fn) {
            Ajax[fn] = function(url,param) {
                var deferred = $q.defer();
                $http[fn](url,param).success(function(data){
                    deferred.resolve(data);
                }).error(function(data){
                    checkAuthorizedStatus(data);
                    deferred.reject(data);
                });
                return deferred.promise;
            };
        })(fnArray[key]); //Ken 2014-06-23 Comments:通过使用匿名函数来实现变量的隔离
    }

    Ajax.formPost = function(dom,url) {
        var deferred = $q.defer();
        var options = {
            url: url,
            type:'post',
//            beforeSend: function(xhr) {xhr.setRequestHeader(Ajax.AUTH_NAME,$cookieStore.get(Ajax.AUTH_NAME));},
            success: function(data) {deferred.resolve(data);},
            error: function(data) {checkAuthorizedStatus(data);deferred.reject(data);}
        };
        $(dom).ajaxSubmit(options);
        return deferred.promise;
    };

    function checkAuthorizedStatus(data) {
        if(!angular.isUndefined(data) && data.message=="NoAuthorization") {
//            $location.url('../login.html');
            window.location.href='/login.html';
        }
    }
    return Ajax;
});

app.factory('Json',function(){
    var Json = {};
    /**
     * @param obj the obj you want to translate (required)
     * @param keyArray the keys you want to translate (optional)
     * */
    Json.translateBoolean2Integer = function(obj,keyArray) {
        if(angular.isUndefined(keyArray) || keyArray==null) {
            for (var key in obj) {
                if (typeof obj[key] === 'boolean') {
                    obj[key] = obj[key] == false ? 0 : 1;
                }
            }
        }
        else {
            for(var i in keyArray) {
                obj[keyArray[i]] = obj[keyArray[i]] == false ? 0 : 1;
            }
        }
        return obj;
    };
    /**
     * @param obj the obj you want to translate (required)
     * @param keyArray the keys you want to translate (required)
     * */
    Json.translateInteger2Boolean = function(obj,keyArray) {
        for(var i in keyArray) {
            obj[keyArray[i]] = obj[keyArray[i]] == 0 ? false : true;
        }
        return obj;
    };
    return Json;
});
