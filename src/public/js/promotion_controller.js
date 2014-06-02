/**
 * Created by Ken on 2014-4-18.
 */

app.controller("promotionController", ['$rootScope','$scope','$routeParams','$mp_ajax','$location','$mp_json','$cookieStore','$q',function($rootScope,$scope,$routeParams,$mp_ajax,$location,$mp_json,$cookieStore,$q) {

    console.log("promotion_controller.js");
    $scope.menuItemId = $routeParams.menuItemId;
    var getPromoUrl = '';
    if($routeParams.menuItemId) {
        getPromoUrl = '/biz/' + $rootScope.bizId + '/prod/'+$routeParams.menuItemId+'/promo';
    } else {
        getPromoUrl = '/biz/' + $rootScope.bizId + '/promo';
    }

    function promiseLoadPromotions() {
        var deferred = $q.defer();
        $mp_ajax.get(getPromoUrl,function (data) {
            $scope.promotions = data;

            //translate discount text
            for(var i in $scope.promotions) {
                var promo = $scope.promotions[i];
                promo.discountText = promo.discount_pct>0 ? promo.discount_pct+'%' : '$'+promo.discount_amount;
            }
            return deferred.resolve(data);
        },function (data) {
            console.error(data);
            return deferred.reject("can't load promotions");
        });
        return deferred.promise;
    }

    function promiseLoadMenuItems() {
        var deferred = $q.defer();
        $mp_ajax.get('/biz/'+$rootScope.bizId+'/prodBase',function(data){
            for(var i in data) {
                if(parseInt($scope.menuItemId) == data[i].prod_id) {
                    $scope.title = "------ " + data[i].name + " | " + data[i].name_lang;
                    break;
                }
            }
            return deferred.resolve(data);
        },function (data) {
            console.error(data);
            return deferred.reject("can't load menu items");
        });
        return deferred.promise;
    }
    //set menu-item-name of promotion
    $q.all([promiseLoadMenuItems(),promiseLoadPromotions()]).then(function(datas){
        var items = datas[0];
        var promotions = datas[1];
        for(var i in promotions) {
            for(var j in items) {
                if(items[j].prod_id==promotions[i].prod_id) {
                    promotions[i].menuItemName = items[j].name + " | " + items[j].name_lang;
                    break;
                }
            }
        }
        $scope.promotions = promotions;
    });

    $scope.format = function(date,mask) {
        var ret = "";
        try {
            ret = DateUtil.format(date,mask);
        }catch(e){}
        return ret;
    };

    $scope.addPromotion = function() {
        var path = '/promotion_add';
        var prod_id = $scope.menuItemId;
        if(prod_id) path = path + '/' + prod_id;
        $location.path(path);
    }
    $scope.onBack = function() {
        window.history.back(-1);
    };
    //move page-content a little bit down in case of tabs cover part of it
    OnViewLoad();
}] );
