/**
 * Created by Ken on 14-4-16.
 */

app.config(function($httpProvider) {
    $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
});

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
        if(!angular.isUndefined(data) && data=="NoAuthorization") {
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

