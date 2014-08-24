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
        watchers += wc(child);
        child = child.$$nextSibling;
    }
    return watchers;
}

/**
 * @Author Ken
 * @description 获取元素居中时的left,top
 * @LastUpdateDate 2014-08-23
 */
function GetCenterPosition(dom) {
    return {
        left:($(window).width() - dom.outerWidth())/2,
        top:($(window).height() - dom.outerHeight())/2      // + $(document).scrollTop()
    };
}
/**
 * @Author Ken
 * @description 获取box显示时的left,top, (1/2,1/4)
 * @LastUpdateDate 2014-08-23
 */
function GetBoxPosition(dom) {
    return {
        left:($(window).width() - dom.outerWidth())/2,
        top:($(window).height() - dom.outerHeight())/4      // + $(document).scrollTop()
    };
}

/**
 * @Author Ken
 * @description 显示基本提示框,由调用者指定显示的样式与内容
 * @LastUpdateDate 2014-08-17
 */
function _BaseBox(boxClass,iconClass,msg) {
    var box = $('<div>');

    var content = '';
    content += '<button type="button" class="close" data-dismiss="alert"><i class="icon-remove"></i></button>';
    content += '<strong style="position: absolute;"><i class="'+iconClass+'"></i></strong>';
    content += '<span style="display:inline-block;max-width:500px;margin:0px 10px 0px 20px;">';
    content += msg;
    content += '</span>';

    box.html(content);
    $(document).find('body').append(box);

    box.addClass(boxClass);
    box.css({position:'fixed','z-index':9999,display:'none'});
    box.css(GetBoxPosition(box));
    box.fadeIn(500);

    setTimeout(function(){
        box.fadeOut(1000,function(){
            if(box)
                box.outerHTML = '';
            else
                console.log('box be deleted');
        });
    },5000);
}

/**
 * @Author Ken
 * @description 警告,信息,错误, 成功 提示框
 * @LastUpdateDate 2014-08-17
 */
function WarningBox(msg) {
    var boxClass = 'alert alert-warning';
    var iconClass = 'icon-warning-sign';
    _BaseBox(boxClass,iconClass,msg);
}
function ErrorBox(msg) {
    var boxClass = 'alert alert-danger';
    var iconClass = 'icon-remove';
    _BaseBox(boxClass,iconClass,msg);
}
function InfoBox(msg) {
    var boxClass = 'alert alert-info';
    var iconClass = 'icon-info-sign';
    _BaseBox(boxClass,iconClass,msg);
}
function SuccessBox(msg) {
    var boxClass = 'alert alert-success';
    var iconClass = 'icon-ok';
    _BaseBox(boxClass,iconClass,msg);
}

/**
 * @Author Ken
 * @description 显示基本对话框,由调用者指定显示的样式与内容
 * @LastUpdateDate 2014-08-17
 */
function _BaseDialog(msg,confirmCallback) {
    bootbox.dialog({
        message: msg,
        buttons:
        {
            "click" :
            {
                "label" : "确认",
                "className" : "btn-sm btn-primary",
                "callback": confirmCallback
            },
            "button" :
            {
                "label" : "取消",
                "className" : "btn-sm"
            }
        }
    });
}
/**
 * @Author Ken
 * @description confirm框
 * @LastUpdateDate 2014-08-17
 */
function DelConfirm(confirmCallback) {
    _BaseDialog("确认删除数据?",confirmCallback);
}
function Confirm(msg,confirmCallback) {
    _BaseDialog(msg,confirmCallback);
}
