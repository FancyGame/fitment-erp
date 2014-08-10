/**
 * Created by md on 14-8-10.
 */

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

/**
 * @Author : Ken
 * @Date : 2014-07-14
 * @directive name : mpRepeat
 * @attributes:
 *   mp-repeat  : the repeat-count of template
 * @example
 * [example 1]
 *          <div mp-repeat="2">abc</div>
 * Result:
 *          <div mp-repeat="2">abc</div>
 *          <div mp-repeat="2">abc</div>
 * */
app.directive("mpRepeat", function () {
    return {
        restrict: 'A',
        link:function(scope,element,attrs) {
            attrs.$observe('mpRepeat',function(count) {
                for (var i = 0; i < count - 1; ++i) {
                    var newObj = element[0].cloneNode(true);
                    element[0].parentNode.insertBefore(newObj, element[0]);
                }
            });
        }
    };
});

/**
 * @Author : Ken
 * @Date : 2014-07-14
 * @directive name : mpToggle
 * @attributes:
 * @example
 * [example 1]
 *        <a href="javascript:;" mp-toggle="targetId" data-show-text="See more" data-hide-text="See less">See more</a>
 *        <div id="targetId">
 *            abc,def
 *        </div>
 *
 *        //when click <a>, the 'targetId' dom will toggle display to show or hide, at same time changing text itself base on data-show-text/data-hide-text.
 * */
app.directive("mpToggle", function(){
    return {
        link:function(scope,element,attrs) {
            if(!attrs.mpToggle)
                return;

            scope.show = attrs.show ? true:false;
            var targetObj = angular.element("#"+attrs.mpToggle);

            if(!scope.show)
                targetObj.css("display","none");

            element.on('click',function(){
                if(scope.show) {
                    targetObj.css("display","none");
                    if(attrs.showText)
                        element.html(attrs.showText);
                }
                else {
                    targetObj.css("display","");
                    if(attrs.hideText)
                        element.html(attrs.hideText);
                }
                scope.show = !scope.show;
            });
        }
    };
});

/**
 * @Author : Ken
 * @Date : 2014-08-05
 * @directive name : mpRepeatDirectiveFinish
 * @attributes:
 *          mp-repeat-directive-finish : [function] this specific function will be invoked after ng-repeat all be repeated.
 * @example
 * [example 1]
 *          //Step1 for html
 *          <div ng-repeat="item in items" mp-repeat-directive-finish="onRepeatFinish"> //!notice: not 'onRepeatFinish()'
 *              {{item.name}}
 *          </div>
 *
 *          //Step2 for controller(js)
 *          $scope.onRepeatFinish = function() {
 *              console.log("loaded");
 *          };
 *
 *          //description: onRepeatFinish will be called after ng-repeat is done.
 *
 * */
app.directive('mpRepeatDirectiveFinish', function() {
    return {
        link:function(scope, element, attrs) {
            if (scope.$last) {
                var finishFunc = scope.$parent[attrs.mpRepeatDirectiveFinish];
                if(finishFunc)
                    finishFunc();
            }
        }
    };
});
/*
 * 说明: 未完成, 中途被NG-UI代替
 <ul class="pagination">
 <li class="disabled">
 <a href="javascript:;">
 <i class="icon-double-angle-left"></i>
 </a>
 </li>
 <li class="active">
 <a href="javascript:;">1</a>
 </li>
 <li>
 <a href="javascript:;">2</a>
 </li>
 <li>
 <a href="javascript:;">3</a>
 </li>
 <li>
 <a href="javascript:;">4</a>
 </li>
 <li>
 <a href="javascript:;">5</a>
 </li>
 <li>
 <a href="javascript:;">
 <i class="icon-double-angle-right"></i>
 </a>
 </li>
 </ul>
 1. 点击页数跳转(执行一个自定义的函数)
 2. 上/下一页可用, disabled状态也可正常显示
 3. 支持参数: 最大页数, 当前第几页.
 * */
app.directive('mpPagination', function() {
    return {
        restrict: 'E',
        replace: false,
        template: '<ul class="pagination"></ul>',
        link:function(scope, element, attrs) {
            var finishFunc = scope.$parent[attrs.mpOnChangePage];
            console.log('finishFunc',finishFunc);
            if(finishFunc) {
                if(finishFunc.indexOf('()')>0)
                    finishFunc = finishFunc.replace(/\(\)/g,'');
            }
            else {
                finishFunc = function() {
                    console.error("[Directive:mpPagination] no mpOnChangePage function");
                }
            }

            attrs.$observe('mpMaxPage',function(value) {
                var ul = angular.element(element.children()[0]);
                var maxPage = value;
                var ulHtml = '';
                ulHtml += '<li>Total: 10</li>';
                ulHtml += '<li class="disabled"> <a href="javascript:;"> <i class="icon-double-angle-left"></i> </a> </li>';
                for(var i=0;i<maxPage;++i) {
                    ulHtml += '<li><a href="javascript:;">'+(i+1)+'</a></li>';
                }
                ulHtml += '<li> <a href="javascript:;"> <i class="icon-double-angle-right"></i> </a> </li>';
                ul.html(ulHtml);

                var liArray = ul.children();
                liArray.on('click',function(){
                    console.log('LI,innerHTML',this);
                    finishFunc();
                });
            });
        }
    };

});
