/**
 * Created by Ken on 2014-4-18.
 */

var profileController = app.controller("profileController", ['$rootScope','$scope','$mp_ajax','$location',function($rootScope,$scope,$mp_ajax ,$location) {
    $scope.testText = "testText_Profile";
    $scope.edit = {};
    $scope.edit.phone = true;
    $scope.edit.category = true;
    $scope.edit.service = true;
    $scope.edit.about = true;
    $scope.edit.hours = false;

    $scope.timeArray =['00:00','00:30','01:00','01:30','02:00','02:30','03:00','03:30','04:00','04:30',
        '05:00','05:30','06:00','06:30','07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
        '12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30',
        '19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30'];

    //initTime();
    $scope.dayArray = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
    $scope.bandArray = ['0','1','2','3','4','5','6','7','8','9','10','11','12',
        '13','14','15','16','17','18','19','20','21','22','23'];
    $scope.daySel = $scope.dayArray[0];
    $scope.startSel = $scope.timeArray[0];
    $scope.endSel = $scope.timeArray[$scope.timeArray.length-1];
    $scope.editPhone = function(){
        var divDom = angular.element('#editPhoneDiv');
        if(divDom && divDom[0].className.indexOf('ui-icon-pencil')>0){
            divDom.removeClass('ui-icon-pencil');
            divDom.addClass('ui-icon-disk');
            $scope.edit.phone = false;
        }else{
            divDom.removeClass('ui-icon-disk');
            divDom.addClass('ui-icon-pencil');
            $scope.edit.phone = true;
            updateBizBaseInfo();
        }

    }

    $scope.editCategory = function(){
        var divDom = angular.element('#editCategoryDiv');
        if(divDom && divDom[0].className.indexOf('ui-icon-pencil')>0){
            divDom.removeClass('ui-icon-pencil');
            divDom.addClass('ui-icon-disk');
            $scope.edit.category = false;
        }else{
            divDom.removeClass('ui-icon-disk');
            divDom.addClass('ui-icon-pencil');
            $scope.edit.category = true;
            updateBizBaseInfo()
        }

    }

    $scope.editAbout = function(){
        var divDom = angular.element('#editAboutDiv');
        if(divDom && divDom[0].className.indexOf('ui-icon-pencil')>0){
            divDom.removeClass('ui-icon-pencil');
            divDom.addClass('ui-icon-disk');
            $scope.edit.about = false;
        }else{
            divDom.removeClass('ui-icon-disk');
            divDom.addClass('ui-icon-pencil');
            $scope.edit.about = true;
            updateBizBaseInfo();
        }

    }

    $scope.editService = function(){
        var divDom = angular.element('#editServiceDiv');
        if(divDom && divDom[0].className.indexOf('ui-icon-pencil')>0){
            divDom.removeClass('ui-icon-pencil');
            divDom.addClass('ui-icon-disk');
            $scope.edit.service = false;
        }else{
            divDom.removeClass('ui-icon-disk');
            divDom.addClass('ui-icon-pencil');
            $scope.edit.service = true;
            updateBizBaseInfo();
        }

    }

    $scope.editHours = function(){
        //$location.path("/editHours");
        var divDom = angular.element('#editHoursDiv');
        if(divDom && divDom[0].className.indexOf('ui-icon-pencil')>0){
            divDom.removeClass('ui-icon-pencil');
            divDom.addClass('ui-icon-disk');
            $scope.edit.hours = true;
        }else{
            divDom.removeClass('ui-icon-disk');
            divDom.addClass('ui-icon-pencil');
            $scope.edit.hours = false;
            updateBizBaseInfo();
        }

    }

    $scope.removeHours = function(dayItem ,hoursItem,index){
        var nowHoursArray = $scope.bizInfo.showHours;
        for(var i=0; i<nowHoursArray.length; i++){
            if(nowHoursArray[i] == dayItem){
                nowHoursArray[i].hoursArray.splice(index,1);
                if(nowHoursArray[i].hoursArray == null || nowHoursArray[i].hoursArray.length == 0){
                    nowHoursArray[i].opened = false;
                }
            }
        }

    }

    $scope.addHours = function(daySel ,startSel ,endSel){
        //console.log(daySel +"--"+ startSel +"----"+endSel);
        var nowHoursArray = $scope.bizInfo.showHours;
        for(var i=0; i<nowHoursArray.length; i++){
            if(nowHoursArray[i].day == daySel){
                var hourBand =[startSel , endSel] ;
                nowHoursArray[i].opened = true ;
                nowHoursArray[i].hoursArray.push(hourBand);
                break;
            }
        }
        convertHoursToJson(nowHoursArray);
    }


    //console.log("bizid = "+$rootScope.bizId);
    $mp_ajax.get('/biz/'+$rootScope.bizId,function(data){
        if(!data.img_url){
            data.img_url = "/web/image/restaurant_icon.jpg";
        }else{
            data.img_url = "../image/"+data.img_url+"/m";
        }
        if(data.services){
            data.services = data.services.split(',');
        }
        data.wifi = data.wifi==1?true:false;
        data.payment_cashonly = data.payment_cashonly==1?true:false;
        data.reservations = data.reservations==1?true:false;
        data.parking = data.parking==1?true:false;
        //data.hours = data.hours==1?true:false;
        data.seating_outdoor = data.seating_outdoor==1?true:false;
        data.room_private = data.room_private==1?true:false;
        data.showHours = convertJsonHours(data.hours);
        $scope.bizInfo = data;
    });

    function updateBizBaseInfo(){
        var param ={
            "phoneNo": $scope.bizInfo.phone_no,
            "category": $scope.bizInfo.category,
            "cashOnly": $scope.bizInfo.payment_cashonly?1:0,
            "reservations": $scope.bizInfo.reservations?1:0,
            "wifi": $scope.bizInfo.wifi?1:0,
            "hours": convertHoursToJson($scope.bizInfo.showHours),
            "parking": $scope.bizInfo.parking?1:0,
            "seatOutDoor": $scope.bizInfo.seating_outdoor?1:0,
            "privateRoom": $scope.bizInfo.room_private?1:0,
            "desc": $scope.bizInfo.desc,
            "bizId": $rootScope.bizId
        };
        //console.log(param);

        $mp_ajax.put('/biz/',param,function(data){

        },function(data){
            alert(data.message);
        });
    }

    function convertHoursToJson(hours){
        var jsonObj = {};

        for(var i=0;i<hours.length;i++){
            if(hours[i].hoursArray != null && hours[i].hoursArray.length >0){
               jsonObj[hours[i].day] = hours[i].hoursArray;
            }
        }
        return JSON.stringify(jsonObj);

    }

    function convertJsonHours (hourString){
        var hourJson = {} ;
        if(hourString != null && hourString.length>0){
            hourJson =  eval("(" + hourString + ")");
        }

        /*if(hourJson == null){
            return defaultOpHours();
        }*/
        var result = [];

        result.push(convertDayHours(hourJson,'monday'));
        result.push(convertDayHours(hourJson,'tuesday'));
        result.push(convertDayHours(hourJson,'wednesday'));
        result.push(convertDayHours(hourJson,'thursday'));
        result.push(convertDayHours(hourJson,'friday'));
        result.push(convertDayHours(hourJson,'saturday'));
        result.push(convertDayHours(hourJson,'sunday'));

        return result;
    }
    function convertDayHours(hourJson ,day){
        var res = {};
        res.day = day;
        if(hourJson[day] == null || hourJson[day].length<1 || hourJson[day][0].length<1){
            res.opened = false;
            res.hoursArray = [];

        }else{
            res.opened= true;
            res.hoursArray = hourJson[day];
        }
        return res;
    }

    function defaultOpHours(){
        var result = {};
        var dayState = {};
        dayState.opened = true;
        dayState.start = "10:00";
        dayState.end = "22:00";
        result.sunday = dayState;
        result.monday = dayState;
        result.tuesday = dayState;
        result.wednesday = dayState;
        result.thursday = dayState;
        result.friday = dayState;
        result.saturday = dayState;
        return result;
    }


    /*function initSlider(dom ,start , end){
        var startIndex = start === undefined ? 20: timeArray.indexOf(start);
        var endIndex = end === undefined ? 40: timeArray.indexOf(end);
        dom.slider({
            values:[startIndex,endIndex],
            range: true,
            min: 0,
            max: 48,
            step: 1,
            slide: function( event, ui ) {
                var startValue = timeArray[parseInt(ui.values[0])];
                var endValue = timeArray[parseInt(ui.values[1])];
                var targetId = event.target.id;
                if(targetId.indexOf('7')){
                    $scope.bizInfo.hours.sunday.start = startValue;
                    $scope.bizInfo.hours.sunday.end = endValue;
                }else if(targetId.indexOf('1')){
                    $scope.bizInfo.hours.monday.start = startValue;
                    $scope.bizInfo.hours.monday.end = endValue;
                }else if(targetId.indexOf('2')){
                    $scope.bizInfo.hours.tuesday.start = startValue;
                    $scope.bizInfo.hours.tuesday.end = endValue;
                }else if(targetId.indexOf('3')){
                    $scope.bizInfo.hours.wednesday.start = startValue;
                    $scope.bizInfo.hours.wednesday.end = endValue;
                }else if(targetId.indexOf('4')){
                    $scope.bizInfo.hours.thursday.start = startValue;
                    $scope.bizInfo.hours.thursday.end = endValue;
                }else if(targetId.indexOf('5')){
                    $scope.bizInfo.hours.friday.start = startValue;
                    $scope.bizInfo.hours.friday.end = endValue;
                }else if(targetId.indexOf('6')){
                    $scope.bizInfo.hours.saturday.start = startValue;
                    $scope.bizInfo.hours.saturday.end = endValue;
                }
                console.log($scope.bizInfo.hours);
                var uiValue = parseInt(ui.value);
                var val = timeArray[uiValue];
                if(! ui.handle.firstChild ) {
                    $(ui.handle).append("<div class='tooltip top in' style='left:-17px;top:-36px;'>" +
                        "<div class='tooltip-arrow'></div>" +
                        "<div class='tooltip-inner'></div></div>"
                    );
                }
                $(ui.handle.firstChild).show().children().eq(1).text(val);
                //$('#form-field-5').attr('class', 'col-xs-'+val).val('.col-xs-'+val);
            }
        });
    }*/

    uploadImage($scope,$mp_ajax,$rootScope);
    //move page-content a little bit down in case of tabs cover part of it
    OnViewLoad();
}] );

profileController.onload = function() {
    //alert('profile loaded')g
};

function uploadImage($scope,$mp_ajax,$rootScope){
    $.fn.editable.defaults.mode = 'inline';
    $.fn.editableform.loading = "<div class='editableform-loading'><i class='light-blue icon-2x icon-spinner icon-spin'></i></div>";
    $.fn.editableform.buttons = '<button type="submit"  class="btn btn-info editable-submit"><i class="icon-ok icon-white"></i></button>'+
        '<button type="button" class="btn editable-cancel"><i class="icon-remove"></i></button>';
    try {//ie8 throws some harmless exception, so let's catch it

        //it seems that editable plugin calls appendChild, and as Image doesn't have it, it causes errors on IE at unpredicted points
        //so let's have a fake appendChild for it!
        if( /msie\s*(8|7|6)/.test(navigator.userAgent.toLowerCase()) ) Image.prototype.appendChild = function(el){}

        var last_gritter
        $('#avatar').editable({
            type: 'image',
            name: 'image',
            value: null,
            image: {
                //specify ace file input plugin's options here
                btn_choose: 'Change Restaurant Picture',
                droppable: true,
                name: 'image',//put the field name here as well, will be used inside the custom plugin
                max_size: 4000000,//~4Mb
                on_error : function(code) {//on_error function will be called when the selected file has a problem
                    if(last_gritter) $.gritter.remove(last_gritter);
                    if(code == 1) {//file format error
                        last_gritter = $.gritter.add({
                            title: 'File is not an image!',
                            text: 'Please choose a jpg|gif|png image!',
                            class_name: 'gritter-error gritter-center'
                        });
                    } else if(code == 2) {//file size rror
                        last_gritter = $.gritter.add({
                            title: 'File too big!',
                            text: 'Image size should not exceed 4Mb !',
                            class_name: 'gritter-error gritter-center'
                        });
                    }
                    else {//other error
                    }
                },
                on_success : function() {
                    $.gritter.removeAll();
                }
            },
            url: function(params) {
                var deferred = new $.Deferred

                //if value is empty, means no valid files were selected
                //but it may still be submitted by the plugin, because "" (empty string) is different from previous non-empty value whatever it was
                //so we return just here to prevent problems
                var value = $('#avatar').next().find('input[type=hidden]:eq(0)').val();
                if(!value || value.length == 0) {
                    deferred.resolve();
                    return deferred.promise();
                }
                //normal upload
                $mp_ajax.formPost($('.form-inline'),'/biz/'+$rootScope.bizId+'/image',function(success){
                    $scope.bizInfo.img_url = "../image/"+success.path+"/m";;
                    angular.element("#avatar").attr("src",'../image/'+success+'/m');
                    deferred.resolve({'status':'OK'});

                    if(last_gritter) $.gritter.remove(last_gritter);
                    last_gritter = $.gritter.add({
                        title: 'Profile Picture Updated!',
                        text: '',
                        class_name: 'gritter-info gritter-center'
                    });
                    return deferred.promise();
                },function(error){
                    if(last_gritter) $.gritter.remove(last_gritter);
                    last_gritter = $.gritter.add({
                        title: 'Profile Picture Updated Failed !',
                        text: error.message,
                        class_name: 'gritter-info gritter-center'
                    });
                    return deferred.promise();
                });
                return deferred.promise();
            },

            success: function(response, newValue) {
            }
        })
    }catch(e) {}
}

