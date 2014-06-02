/**
 * Created by Ken on 2014-4-21.
 */

app.controller("insightController", ['$rootScope','$scope','$mp_ajax',function($rootScope,$scope ,$mp_ajax) {


    $mp_ajax.get('/biz/'+$rootScope.bizId+"/productTypeCount",function(data){
        $scope.productTypeCount = data.productTypeCount;
    });

    $mp_ajax.get('/biz/'+$rootScope.bizId+"/productCount",function(data){
        $scope.productCount = data.productCount;
    });

    $mp_ajax.get('/biz/'+$rootScope.bizId+"/customerCount",function(data){
        $scope.customerCount = data.customerCount;
    });

    $scope.topProductItem = [{productName:"Item 1",count:"400"} ,{productName:"Item 2" , count:"321"}];
    $scope.topCustomerPoint = [{customerName:"customer 1",custId:"1",point:"400"} ,{customerName:"customer 2" ,custId:"2", point:"321"}];

    $scope.menuDateSel = 1;



    $scope.customerDateSel = 3;

    var monthCustomerChartData = {};
    monthCustomerChartData.xCategory = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] ;
    monthCustomerChartData.yTitle = 'Active customer number (person)' ;
    monthCustomerChartData.seriesArray = [{
        name: 'Customers',
        data: [49, 71, 106, 129, 144, 176, 135,148, 216, 194, 95, 54]

    }];
    var monthProductChartData = {};
    monthProductChartData.xCategory = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] ;
    monthProductChartData.yTitle = 'Menu item click (times)' ;
    monthProductChartData.seriesArray = [{
        name: 'Click',
        data: [490, 2160, 1943, 951, 544, 711, 1067, 1295, 1444, 1762, 1355,1489]

    }];

    var dayCustomerChartData = {};
    dayCustomerChartData.xCategory = ['Mon', 'Tus', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] ;
    dayCustomerChartData.yTitle = 'Active customer number (person)' ;
    dayCustomerChartData.seriesArray = [{
        name: 'Customers',
        data: [7, 10, 20, 8, 30, 1, 3 ]

    }];

    var dayProductChartData = {};
    dayProductChartData.xCategory = ['Mon', 'Tus', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] ;
    dayProductChartData.yTitle = 'Active customer number (person)' ;
    dayProductChartData.seriesArray = [{
        name: 'Customers',
        data: [73, 302, 21, 93,107, 220, 88  ]

    }];

    initChart();
    function initChart(){
        if($scope.customerDateSel == 1){
            showChart($("#monthChart"),"Monthly active customers" ,monthCustomerChartData);
        }else if($scope.customerDateSel == 2){
            showChart($("#weekChart"),"Weekly active customers" ,monthCustomerChartData);
        }else{
            showChart($("#dayChart"),"Daily active customers" ,dayCustomerChartData);
        }

        if($scope.menuDateSel == 1){
            showChart($("#monthMenuChart"),"Monthly menu click" ,monthProductChartData);
        }else if($scope.menuDateSel == 2){
            showChart($("#weekMenuChart"),"Weekly menu click" ,monthProductChartData);
        }else{
            showChart($("#dayMenuChart"),"Daily menu click" ,dayProductChartData);
        }
    }

    $scope.customerStateSel = function(){
        //console.log($scope.customerDateSel);
        if($scope.customerDateSel == 1){
            showChart($("#monthChart"),"Monthly active customers" ,monthCustomerChartData);
        }else if($scope.customerDateSel == 2){
            showChart($("#weekChart"),"Weekly active customers" ,monthCustomerChartData);
        }else{
            showChart($("#dayChart"),"Daily active customers" ,dayCustomerChartData);
        }

    }

    $scope.menuStateSel = function(){

        if($scope.menuDateSel == 1){
            showChart($("#monthMenuChart"),"Monthly menu click" ,monthProductChartData);
        }else if($scope.menuDateSel == 2){
            showChart($("#weekMenuChart"),"Weekly menu click" ,monthProductChartData);
        }else{
            showChart($("#dayMenuChart"),"Daily menu click" ,dayProductChartData);
        }
    }


    function showChart(dom ,title ,options){
        dom.highcharts({
            chart: {
                type: 'column'
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            title: {
                text: title
            },
            xAxis: {
                categories:options.xCategory
            },
            yAxis: {
                min: 0,
                title: {
                    text: options.yTitle
                }
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series:options.seriesArray
        });

    }

    OnViewLoad();
}] );
