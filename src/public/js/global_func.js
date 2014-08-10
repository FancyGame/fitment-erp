/**
 * Created by md on 14-8-10.
 */


//move page-content a little bit down in case of tabs cover part of it
function SetPositionOfPageContent() {
    if('block' == $("#menu-toggler").css("display")) {
        $("#ngViewDiv").css("paddingTop","50px");
    }
    else {
        $("#ngViewDiv").css("paddingTop","0px");
    }
}

window.onresize = function() {
    SetPositionOfPageContent();
};

function OnViewLoad() {
    SetPositionOfPageContent();
    //处理菜单事件
//    ace.handle_side_menu(jQuery);
    //limitation of input
    $('.input-mask-price').keypress(function(event){
        var key = event.keyCode;
        if(key>=48 && key<=57) //0-9
            return true;
        if(key==46) { //[.] for float
            var val = $(this).val();
            if(val.length>0 && val.indexOf('.')==-1)
                return true;
        }
        return false;
    });
}

function LoadingBarBegin(loadingBar) {
    loadingBar.start();
    loadingBar.set(0);
    loadingBar.inc();
}
function LoadingBarEnd(loadingBar) {
    loadingBar.complete();
}

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
