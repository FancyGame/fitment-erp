/**
 * Created by md on 14-8-10.
 */

(function(){

    function CallFunction(scope,callbackFunName) {
        if(callbackFunName) {
            if(callbackFunName.indexOf('()')>0)
                callbackFunName = callbackFunName.replace(/\(\)/g,'');
            var callbackFunc = scope[callbackFunName];
            if(typeof callbackFunc == 'function') {
                callbackFunc();
            }
        }
    }

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
     * @lastUpdateDate : 2014-09-15
     * @directive name : mpToggle
     * @attributes:
     * @example
     * [example 1]
     *        <a href="javascript:;" mp-toggle="targetId" data-show-text="See more" data-hide-text="See less"
     *              data-show-callback="showCallback()" data-hide-callback="hideCallback()">See more</a>
     *        <div id="targetId">
     *            abc,def
     *        </div>
     *
     *        //when click <a>, the 'targetId' dom will toggle display to show or hide, at same time changing text itself base on data-show-text/data-hide-text.
     *        //the callback function will be invoked correctly.
     * */
    app.directive("mpToggle", function(){
        return {
            link:function(scope,element,attrs) {
                if(!attrs.mpToggle)
                    return;

//                scope.show = attrs.show ? true:false;
                var targetObj = angular.element("#"+attrs.mpToggle);

                if(!attrs.show)
                    targetObj.css("display","none");

                element.on('click',function(){
                    if(targetObj.css("display")!="none") {
                        targetObj.css("display","none");
                        if(attrs.showText)
                            element.html(attrs.showText);
                        if(attrs.hideCallback) {
                            CallFunction(scope,attrs.hideCallback);
                        }
                    }
                    else {
                        targetObj.css("display","inherit");
                        if(attrs.hideText)
                            element.html(attrs.hideText);
                        if(attrs.showCallback) {
                            CallFunction(scope,attrs.showCallback);
                        }
                    }
//                    scope.show = !scope.show;
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

    /**
     * Please refer to :
     * http://templarian.com/2014/03/29/angularjs_context_menu
     * http://jsfiddle.net/Z2CB5/
     * */
    app.directive('ngContextMenu', function ($parse) {
        var renderContextMenu = function ($scope, event, options) {
            if (!$) { var $ = angular.element; }
            $(event.currentTarget).addClass('context');
            var $contextMenu = $('<div>');
            $contextMenu.addClass('dropdown clearfix');
            var $ul = $('<ul>');
            $ul.addClass('dropdown-menu');
            $ul.attr({ 'role': 'menu' });
            $ul.css({
                display: 'block',
                position: 'absolute',
                left: event.pageX + 'px',
                top: event.pageY + 'px'
            });
            angular.forEach(options, function (item, i) {
                var $li = $('<li>');
                if (item === null) {
                    $li.addClass('divider');
                } else {
                    var $a = $('<a>');
                    $a.attr({ tabindex: '-1', href: 'javascript:;' });
                    //Ken 改良, 增加icon
                    var aHtml = item[1];
                    if(item[0].class) {
                        var $iconSpan = $('<span>');
                        $iconSpan.addClass(item[0].class);
                        $iconSpan.css({
                            'font-size':'12pt',
                            'display':'inline-block',
                            'width':'30px',
                            'text-align':'center'
                        });
                        if(item[0].css)
                            $iconSpan.css(item[0].css);
                        aHtml = $iconSpan[0].outerHTML + "&nbsp;" + item[1];
                    }
                    $a.html(aHtml);
                    $li.append($a);
                    $li.on('click', function () {
                        $scope.$apply(function() {
                            item[2].call($scope, $scope);
                        });
                    });
                }
                $ul.append($li);
            });
            $contextMenu.append($ul);
            $contextMenu.css({
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 9999
            });
            $(document).find('body').append($contextMenu);
            $contextMenu.on("click", function (e) {
                $(event.currentTarget).removeClass('context');
                $contextMenu.remove();
            }).on('contextmenu', function (event) {
                $(event.currentTarget).removeClass('context');
                event.preventDefault();
                $contextMenu.remove();
            });
        };
        return function ($scope, element, attrs) {
            element.on('contextmenu', function (event) {
                $scope.$apply(function () {
                    event.preventDefault();
                    var options = $scope.$eval(attrs.ngContextMenu);
                    if (options instanceof Array) {
                        renderContextMenu($scope, event, options);
                    } else {
                        throw '"' + attrs.ngContextMenu + '" not an array';
                    }
                });
            });
        };
    });


    /**
     * @Author : Ken
     * @Date : 2014-09-20
     * @directive name : mpNumberOnly
     * @attributes:
     *   mp-number-only  :  只能输入数字
     * @example
     * [example 1]
     *          <input mp-number-only >
     * */
    app.directive("mpNumberOnly", function () {
        return {
            restrict: 'A',
            link:function(scope,element,attrs) {
                element.bind('keydown',function(event) {
                    var code = event.keyCode;
                    switch(code) {
                        case 8: //backspace
                        case 37://left
                        case 39://right
                        //case...
                            return true;
                    }
                    if(code==13 && attrs.mpOnEnter) {
                        CallFunction(scope,attrs.mpOnEnter);
                    }
                    if(code>57 || code<48)
                        return false;
                });
                //去除右键
                element.bind('contextmenu',function(event){
                    return false;
                });

            }
        };
    });

})();
