/**
 * Created by Ken on 2014-4-18.
 */

app.controller("menuController", ['$rootScope','$scope','$routeParams','$mp_ajax','$location','$mp_json','$cookieStore',
    function($rootScope,$scope,$routeParams,$mp_ajax,$location,$mp_json,$cookieStore) {

    console.log("menu_controller.js");

    $scope.menuTypes = [];
    $scope.totalMenuTypes = [];
    $mp_ajax.get('/biz/'+$rootScope.bizId+'/prodType',function(data){
        $scope.totalMenuTypes = data;
        $scope.menuTypes = data;
//        $scope.menuTypes.push(data[0]);
//        $scope.menuTypes.push(data[1]);
    });

    $mp_ajax.get('/biz/'+$rootScope.bizId+'/prodBase',function(data){
        for(var i=0;i<data.length;++i) {
//            $mp_json.translateInteger2Boolean(data[i],['active']);
            data[i].active = data[i].active==0 ? false : true; // this code will be quicker than above
        }
        //filter duplicate item
//        var tmpData = []; //hold data after filter
//        for(var i in data) {
//            var bIsInTmpData = false;
//            for(var j in tmpData) {
//                if(data[i].prod_id == tmpData[j].prod_id) {
//                    bIsInTmpData = true;
//                    tmpData[j].promotionCount = tmpData[j].promotionCount+1;
////                    tmpData[j].promotions.push(data[i]);
//                    //if this promotion discount is bigger then previous, then use this one
//                    var curPriceAfterDiscount = data[i].price*(1-data[i].discount_pct*0.01);
//                    if(tmpData[j].priceAfterDiscount>curPriceAfterDiscount)
//                        tmpData[j].priceAfterDiscount = curPriceAfterDiscount;
//                    break;
//                }
//            }
//            if(!bIsInTmpData) {
//                if(!angular.isUndefined(data[i].discount_pct) && data[i].discount_pct>0) {
//                    data[i].priceAfterDiscount = data[i].price*(1-data[i].discount_pct*0.01);
//                    data[i].promotionCount = 1;
//                }
//                else {
//                    data[i].priceAfterDiscount = data[i].price;
//                    data[i].promotionCount = 0;
//                }
////                data[i].promotions = [];
////                data[i].promotions.push(data[i]);
//                tmpData.push(data[i]);
//            }
//        }
//        $scope.menuItems = tmpData;

        //load promotions
        $mp_ajax.get('/biz/'+$rootScope.bizId+'/promo',function(data){
            $scope.promotions = data;
            for(var i in $scope.menuItems) {
                var item = $scope.menuItems[i];
                //for _menu.html
                item.promoClass = 'menu-promotion-btn';
                item.promoHref = '#/promotion/'+item.prod_id;
                item.promoIcon = 'icon-plus-sign';

                for(var j in data) {
                    var promo = data[j];

                    if(promo.prod_id==item.prod_id) {
                        item.promoClass = 'menu-promotion-add-btn';
                        item.promoHref = '#/promotion_add/'+item.prod_id;
                        item.promoIcon = 'icon-arrow-right';

                        //calculate price with discount
                        if(angular.isUndefined(item.promotions)) {
                            item.promotions = [];
                            item.priceAfterDiscount = $scope.calcPriceAfterDiscount(item,promo);
                        }
                        else {
                            item.priceAfterDiscount = MathUtil.min(
                                                                $scope.calcPriceAfterDiscount(item,promo),
                                                                item.priceAfterDiscount
                                                                );
                        }
                        item.promotions.push(promo);
                        break;
                    }
                }
            }
        },function(data){
            console.error(data);
        });
        $scope.menuItems = data;
    });
    //function
    $scope.calcPriceAfterDiscount = function(item,promo) {
        var retVal = 0;
        if(promo.discount_pct>0) {
            retVal = MathUtil.max(item.price*(1-promo.discount_pct*0.01),0);
        }
        else if(promo.discount_amount>0) {
            retVal = MathUtil.max(item.price - promo.discount_amount,0);
        }
        else
            retVal = item.price;
        return retVal;
    }
    $scope.addMenuItem = function(type_id) {
        console.log(wc($scope));
//        $location.path("/menu_add/"+type_id);
    };
    $scope.updateMenuItem = function(item) {
        $location.path("/menu_update/"+item.prod_id);
        //Ken : if we use below code, it will call $watch of $location too many times
//        window.location.href = "#/menu_update/"+item.prod_id;
    };
    $scope.onActiveChange = function(item) {
        item.disabled_for_page = true;
        var tmpObj = {};
        angular.copy(item,tmpObj);
        tmpObj.active = item.active==true ? 0 : 1; //angular will change module first then go ng-click, so we need the reverse logic here
        $mp_ajax.put('/biz/'+item.biz_id+'/prodActive/'+item.prod_id,tmpObj,function(data){
            if(data.success) {
                item.disabled_for_page = false;
            }
        },function(data){
            item.disabled_for_page = false;
            item.active = !item.active;
            alert("operation failed");
        });
    };
    //view style [get/set this configuration in cookie]
    $scope.menu_view_style = $cookieStore.get('menu_view_style');
    if(angular.isUndefined($scope.menu_view_style)) {
        $scope.menu_view_style = 'gallery';
        $cookieStore.put('menu_view_style','gallery');
    }

    $scope.menu_view_loaded_array = {};
    $scope.menu_view_loaded_array[$scope.menu_view_style] = true;

    $scope.onMenuViewChange = function(view_style) {
        $scope.menu_view_style = view_style;
        $scope.menu_view_loaded_array[view_style] = true;
        $cookieStore.put('menu_view_style',view_style);
    };
    $scope.menuItemEditMenuType = function() {
        $location.path("/menu_type");
    };
    $scope.appendMenuType = function() {
        if($scope.menuTypes.length<$scope.totalMenuTypes.length) {
            $scope.menuTypes.push($scope.totalMenuTypes[$scope.menuTypes.length]);
        }
        console.log('appendMenuType');
    };
    function wc(s){
        if(!s) return 0;
        var watchers = (s.$$watchers) ? s.$$watchers.length : 0;
        var child = s.$$childHead;
        while (child) {
            watchers += (child.$$watchers) ? child.$$watchers.length : 0;
//            console.log('next child',watchers);
            watchers += wc(child);
            child = child.$$nextSibling;
        }
//        console.log('watchers',watchers);
        return watchers;
    }

//        setTimeout(function(){
//            console.log(wc());
//        },5000);
//    setTimeout(function(){
//        console.log(wc($scope));
//    },5000);
    //move page-content a little bit down in case of tabs cover part of it
    OnViewLoad();
}] );

