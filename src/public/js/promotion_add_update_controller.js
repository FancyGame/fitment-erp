/**
 * Created by Ken on 2014-4-18.
 */

app.controller("promotionAddAndUpdateController", ['$rootScope','$scope','$routeParams','$mp_ajax','$location','$mp_json','$window','$filter',
    function($rootScope,$scope,$routeParams,$mp_ajax,$location,$mp_json,$window,$filter) {

    console.log("promotion_add_update_controller.js");

    $scope.bizId = $rootScope.bizId;
    $scope.promotionId = $routeParams.promotionId;
    $scope.menuItemId = parseInt($routeParams.menuItemId);
    $scope.discountType = 'percent';
    //load menu items
    $mp_ajax.get('/biz/'+$rootScope.bizId+'/prodBase',function(data){
        data.unshift({name:'[ All Menu Items ]',prod_id:0});
        $scope.menuItems = data;
        console.log($scope.menuItemId);
    });
    $scope.menuItemSelectChange = function(){
        console.log ($scope.menuItemSelect);
    };

    if(angular.isUndefined($scope.promotionId)) {  //For create new promotion
        $scope.isAddPage = true;
        $scope.title = "Create new promotion";
        $scope.submitBtnTitle = "Submit";
        $scope.menuItemSelect = $scope.menuItemId>0 ? $scope.menuItemId : 0;
    }
    else {  //For Update promotion
        $scope.isUpdatePage = true;
        $scope.title = "Update promotion";
        $scope.submitBtnTitle = "Save";
        //load promotion
        $mp_ajax.get('/biz/'+$scope.bizId+'/promo/'+$scope.promotionId,function(data){
            var promo = data;
            try{
                promo.start_date = DateUtil.format(promo.start_date,'MM/dd/yyyy');
                promo.end_date = DateUtil.format(promo.end_date,'MM/dd/yyyy');
            } catch(e) {}
            if(promo.discount_pct>0) {
                $scope.discountType = 'percent';
                promo.discountValue = promo.discount_pct;
            }
            else if(promo.discount_amount>0) {
                $scope.discountType = 'amount';
                promo.discountValue = promo.discount_amount;
            }
            else $scope.discountType = 'percent';
            $scope.menuItemSelect = promo.prod_id>0 ? promo.prod_id : 0;
            $scope.promotion = promo;
        });
    }
    $scope.onPromotionSubmit = function(isFormValid, promo) {
        if(!isFormValid) {
            return false;
        }
        var tmpObj = {};
        angular.copy(promo,tmpObj);
        //translate date from one format to another
        tmpObj.start_date = DateUtil.format(DateUtil.parseDate(tmpObj.start_date,'MM/dd/yyyy'),'yyyy-MM-dd');
        tmpObj.end_date = DateUtil.format(DateUtil.parseDate(tmpObj.end_date,'MM/dd/yyyy'),'yyyy-MM-dd');
        if($scope.discountType=='percent') {
            tmpObj.discount_pct = tmpObj.discountValue;
            tmpObj.discount_amount = 0;
        }
        else {
            tmpObj.discount_pct = 0;
            tmpObj.discount_amount = tmpObj.discountValue;
        }
        console.log(tmpObj);
        if($scope.promotionId>0) { //update
            $mp_ajax.put('/biz/' + $rootScope.bizId + '/promo/' + $scope.promotionId, tmpObj,function (data) {
                console.log(data);
//                $location.path(backPath);
                window.history.back(-1);
            },function (data) {
                console.error(data);
            });
        }
        else { //save
            if($scope.menuItemSelect>0) tmpObj.prod_id = $scope.menuItemSelect;
            $mp_ajax.post('/biz/'+$rootScope.bizId+'/promo',tmpObj,function(data){
                console.log(data);
//                $location.path(backPath);
                window.history.back(-1);
            },function(data){
                console.error(data);
            });
        }
    }

    $scope.onBack = function() {
        window.history.back(-1);
//        $history.goBack();
//        $location.path("/promotion");
    };


    $scope.deletePromotion = function(item) {

        $( "#dialog-confirm" ).removeClass('hide').dialog({
            resizable: false,
            modal: true,
//            title: "",
//            title_html: true,
            buttons: [
                {
                    html: "<i class='icon-trash bigger-110'></i>&nbsp; Delete",
                    "class" : "btn btn-danger btn-xs",
                    click: function() {
                        var confirmDlg = $( this );
                        $mp_ajax.delete('/biz/'+$scope.bizId+'/promo/'+item.promotion_id,function(data){
                            if(data.succeed==true) {
                                confirmDlg.dialog( "close" );
                                window.history.back(-1);
                            }
                        });
                    }
                }
                ,
                {
                    html: "<i class='icon-remove bigger-110'></i>&nbsp; Cancel",
                    "class" : "btn btn-xs",
                    click: function() {
                        $( this ).dialog( "close" );
                    }
                }
            ]
        });

    };

    //move page-content a little bit down in case of tabs cover part of it
    OnViewLoad();
}] );

