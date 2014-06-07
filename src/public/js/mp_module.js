/**
 * Created by Ken on 14-4-16.
 */

var app = angular.module("mp_main", ['ngRoute','ngCookies','localytics.directives','infinite-scroll','pasvaz.bindonce']);

app.config(function($httpProvider) {
    $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
});

//For ajax call
app.factory('$mp_ajax',function($http,$cookieStore,$location){
    var $mp_ajax = {};
    $mp_ajax.AUTH_NAME = "Auth-Token";

    $mp_ajax.setHeader = function(name,value) {
        $http.defaults.headers.common[name] = value;
    };

    $mp_ajax.setHeader('Content-Type','application/json');

    $mp_ajax.get = function(url,success,error) {
        $mp_ajax.setHeader($mp_ajax.AUTH_NAME,$cookieStore.get($mp_ajax.AUTH_NAME));
        var ajax = $http.get(url).success(function(data){
//            console.log('mp get', data);
            onSuccess(data,success);
        }).error(function(data){
            onError(data,error);
        });
        return ajax;
    };

    $mp_ajax.post = function(url,data,success,error) {
        $mp_ajax.setHeader($mp_ajax.AUTH_NAME,$cookieStore.get($mp_ajax.AUTH_NAME));
        var ajax = $http.post(url,data).success(function(data){
            onSuccess(data,success);
        }).error(function(data){
            onError(data,error);
        });
        return ajax;
    };

    $mp_ajax.formPost = function(dom,url,success,error) {
        var options = {
            url: url,
            type:'post',
            beforeSend: function(xhr) {xhr.setRequestHeader($mp_ajax.AUTH_NAME,$cookieStore.get($mp_ajax.AUTH_NAME));},
            success: function(data) {onSuccess(data,success)},
            error: function(data) {onError(data,error)}
        };
        $(dom).ajaxSubmit(options);
    };

    $mp_ajax.delete = function(url,success,error) {

        $mp_ajax.setHeader($mp_ajax.AUTH_NAME,$cookieStore.get($mp_ajax.AUTH_NAME));
        var ajax = $http.delete(url).success(function(data){
            onSuccess(data,success);
        }).error(function(data){
            onError(data,error);
        });
        return ajax;
    };

    $mp_ajax.put = function(url,data,success,error) {
        $mp_ajax.setHeader($mp_ajax.AUTH_NAME,$cookieStore.get($mp_ajax.AUTH_NAME));
        var ajax = $http.put(url,data).success(function(data){
            onSuccess(data,success);
        }).error(function(data){
            onError(data,error);
        });
        return ajax;
    };
    function onSuccess(data,success) {
        if(!angular.isUndefined(success) && success!=null) {
            success(data);
        }
    }
    function onError(data,error) {
        checkAuthorizedStatus(data);
        if(!angular.isUndefined(error) && error!=null) {
            error(data);
        }
    }
    function checkAuthorizedStatus(data) {
        if(!angular.isUndefined(data) && data=="NoAuthorization") {
//            $location.url('../login.html');
            window.location.href='/login.html';
        }
    }
    return $mp_ajax;
});

app.factory('$mp_json',function(){
    var $mp_json = {};
    /**
     * @param obj the obj you want to translate (required)
     * @param keyArray the keys you want to translate (optional)
     * */
    $mp_json.translateBoolean2Integer = function(obj,keyArray) {
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
    $mp_json.translateInteger2Boolean = function(obj,keyArray) {
        for(var i in keyArray) {
            obj[keyArray[i]] = obj[keyArray[i]] == 0 ? false : true;
        }
        return obj;
    };
    return $mp_json;
});

/**
 * @Author : Ken
 * @Date : 2014-05-19
 * @directive name : anchor
 * @attributes:
 *   target: id of target dom / id array of target dom, if first target is hidden then go to second target
 *          use '|' to separate items
 * @example
 * [example 1]
 *   <anchor target="targetDomId">Click me to jump to target dom</anchor>
 *   ....
 *   <div id="targetDomId"></div>
 * [example 2] if targetDomId1 is hidden(display==none), then jump to targetDomId2, otherwise jump to targetDomId1.
 *              Priority is reduced from left to right.
 *   <anchor target="targetDomId1|targetDomId2">Click me to jump to target dom</anchor>
 *   ....
 *   <div id="targetDomId1"></div>
 *   <div id="targetDomId2"></div>
 * */
app.directive('anchor', function () {
    return {
        restrict: "EA",
        scope: false,
        link: function ($scope, element, attrs ) {
            element.css("cursor","pointer"); //default css
            element.bind('click',function(e){
                e.stopPropagation();
                var target = attrs.target;
                var targetArray = attrs.target.split("|");
                var scrollToElement = null;
                if(targetArray.length>0) {
                    var bFound = false;
                    //allow user to define a target array, if the first target is hidden, then go the second one..
                    for(var i in targetArray) {
                        scrollToElement = $('#'+targetArray[i]);
                        //if the target dom exist and be showed normally
                        if(scrollToElement && scrollToElement.length>0 && scrollToElement.css("display")!='none') {
                            var bIsHidden = false;
                            //make sure no parent doms are hidden, otherwise don't jump to this target
                            var parents = scrollToElement.parents();
                            for(var j=0;j<parents.length;++j) {
                                if($(parents[j]).css("display")=='none') {
                                    bIsHidden = true;
                                    break;
                                }
                            }
                            if(!bIsHidden) {
                                bFound = true;
                                break;
                            }
                        }
                    }
                    if(!bFound)
                        scrollToElement = null;
                }
                else {
                    scrollToElement = $('#'+target);
                }
                if(scrollToElement &&scrollToElement.length>0)
                    window.scrollTo(0,scrollToElement.offset().top);
            });
        }
    };
});

