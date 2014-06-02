/**
 * Created by Ken on 2014-4-18.
 */

app.controller("menuTypeController", ['$rootScope','$scope','$routeParams','$mp_ajax','$location','$mp_json','$cookieStore',function($rootScope,$scope,$routeParams,$mp_ajax,$location,$mp_json,$cookieStore) {

    console.log("menu_type_controller.js");

    $mp_ajax.get('/biz/'+$rootScope.bizId+'/prodType',function(data){
        $scope.menuTypes = data;
        //menuTypeInputs is for menu type updating
        //set it as copy of menuTypes, this way will not change text when we change value of input then click cancel,
        $scope.menuTypeInputs = [];
        angular.copy(data,$scope.menuTypeInputs);
    });

    $scope.onMenuTypeSave = function(menuType,menuTypeInput) {
        console.log(menuTypeInput);
        if(menuType.name!=menuTypeInput.name || menuType.name_lang!=menuTypeInput.name_lang) {
            $mp_ajax.put('/biz/' + $rootScope.bizId + '/prodType/' + menuTypeInput.type_id, menuTypeInput,function (data) {
                menuType.name = menuTypeInput.name;
                menuType.name_lang = menuTypeInput.name_lang;
                menuType.isEdit = false;
            },function (data) {
                console.error(data);
            });
        }else {
            menuType.isEdit = false;
            console.log("no changes");
        };
    };
    $scope.onMenuTypeAdd = function(menuTypeNew) {
        if(menuTypeNew.name!='') {
            $mp_ajax.post('/biz/' + $rootScope.bizId + '/prodType', menuTypeNew,function(data){
                console.log(data);
                //for menuTypes
                var newMenuTypeObj = {};
                angular.copy(menuTypeNew,newMenuTypeObj);
                newMenuTypeObj.type_id = data.prodTypeId;
                newMenuTypeObj.isNew = true;
                $scope.menuTypes.unshift(newMenuTypeObj);
                //for menuTypeInputs
                var newMenuTypeInputObj = {};
                angular.copy(newMenuTypeObj,newMenuTypeInputObj);
                $scope.menuTypeInputs.unshift(newMenuTypeInputObj);
            });

//            $mp_ajax.post('/biz/' + $rootScope.bizId + '/prodType', menuTypeNew).success(function (data) {
//                console.log(data);
//                //for menuTypes
//                var newMenuTypeObj = {};
//                angular.copy(menuTypeNew,newMenuTypeObj);
//                newMenuTypeObj.type_id = data.prodTypeId;
//                newMenuTypeObj.isNew = true;
//                $scope.menuTypes.unshift(newMenuTypeObj);
//                //for menuTypeInputs
//                var newMenuTypeInputObj = {};
//                angular.copy(newMenuTypeObj,newMenuTypeInputObj);
//                $scope.menuTypeInputs.unshift(newMenuTypeInputObj);
//            }).error(function (data) {
//                console.error(data);
//            });
        }
        else {
            ;
        }
    };
    $scope.onMenuTypeDelete = function(menuType,index) {
        $( "#dialog-confirm" ).removeClass('hide').dialog({
            resizable: false,
            modal: true,
            buttons: [
                {
                    html: "<i class='icon-trash bigger-110'></i>&nbsp; Delete",
                    "class" : "btn btn-danger btn-xs",
                    click: function() {
                        var confirmDlg = $( this );
                        $mp_ajax.delete('/biz/' + $rootScope.bizId + '/prodType/' + menuType.type_id,function (data) {
                            console.log(data);
                            $scope.menuTypes.splice(index,1);
                            $scope.menuTypeInputs.splice(index,1);
                            confirmDlg.dialog( "close" );
                        },function (data) {
                            console.error(data);
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

