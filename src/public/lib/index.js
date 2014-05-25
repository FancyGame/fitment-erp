/**
 * Created by md on 14-5-22.
 */


$('.ratio-slider').slider({
    slide: function(event,ui) {
        showImg(image,ui.value/100);
    }
});
//    $('.slider').slider('option','value',30);

function p() {
    var str = '';
    for(var i in arguments) {
        str += arguments[i]+' ';
    }
    console.log(str);
}

var image = new Image();
image.src='image/test.png';
image.onload=function(){
    showImg(image);
};
var canvas = $("#canvas");
canvas.data('left',0);
canvas.data('top',0);

console.log(canvas.data('left'),canvas.data('top'));

$("#file").change(function(){
    var reader = new FileReader();
    reader.onload = function () {
//        console.log(this.result);
        var base64Data = this.result.replace(/^data:image\/\w+;base64,/, "");
//        $('#image').val(base64Data);
//        $('#img_show').attr('src',this.result);
        image.src=this.result;
        image.onload = function(){
            showImg(image);
        };
    };
    reader.onerror = function() {
        console.log("onerror");
    };
    reader.readAsDataURL(document.getElementById("file").files[0]);
});

function showImg(img,ratio,left,top) {
    var dataURL = null;
    try {

        var tmpCanvas = canvas.get(0);
//        var img = document.getElementById("img_show");
//        if(image) img = image;
        var context = tmpCanvas.getContext('2d');
        context.fillStyle = 'gray';
        context.fillRect(0,0,tmpCanvas.width,tmpCanvas.height);
        var x1,y1,w1,h1,x2,y2,w2,h2;

        var widthRatio = tmpCanvas.width / img.width;
        var heightRatio = tmpCanvas.height / img.height;
        if(typeof ratio=='undefined') {
            ratio = widthRatio<1 || heightRatio<1 ? (widthRatio<heightRatio ? widthRatio : heightRatio) : 1;
        }
        $('.ratio-slider').slider('option','value',ratio*100);
        $('#ratio').val(ratio);

        //if ratio < 1 then need to make it fixed, otherwise make it show in center of canvas
        if(ratio<1) {
            x1 = y1 = 0;
            w1 = img.width;
            h1 = img.height;
            w2 = img.width*ratio;
            h2 = img.height*ratio;
            x2 = (tmpCanvas.width-w2)/2;
            y2 = (tmpCanvas.height-h2)/2;
        } else {
            x1 = y1 = 0;
            w1 = img.width;
            h1 = img.height;
            w2 = img.width;
            h2 = img.height;
            x2 = (tmpCanvas.width-w2)/2;
            y2 = (tmpCanvas.height-h2)/2;
        }
        x2 += canvas.data('left');
        y2 += canvas.data('top');
        x2 = typeof left=='undefined' ? x2 : x2 + left;
        y2 = typeof top=='undefined' ? y2 : y2 + top;

        context.drawImage(img, x1, y1, w1, h1, x2, y2, w2, h2);

        var dataTranslated = tmpCanvas.toDataURL('image/jpeg', 1).replace(/^data:image\/\w+;base64,/, "");
//            console.log('canvas',dataTranslated);
//        $('#image').val(dataTranslated);
    } catch (e) {
        console.log('Ken Error ',e);
    }
}

$('#canvas').mousedown(function(e){
    $(this).data('mousemove',true);
    var obj = $('#canvas');
    $(this).data('mouse-x',e.pageX - obj.offset().left);
    $(this).data('mouse-y',e.pageY - obj.offset().top);
});
$('#canvas').mousemove(function(e){
    if($(this).data('mousemove')) {
        var oldX = $(this).data('mouse-x');
        var oldY = $(this).data('mouse-y');
        var left = e.pageX - canvas.offset().left-oldX;
        var top = e.pageY - canvas.offset().top-oldY;
        showImg(image,$('#ratio').val(),left,top);
    }
});
$('#canvas').mouseup(function(e){
    $(this).data('mousemove',false);
    var oldX = $(this).data('mouse-x');
    var oldY = $(this).data('mouse-y');
    var left = e.pageX - canvas.offset().left-oldX;
    var top = e.pageY - canvas.offset().top-oldY;
    canvas.data('left',canvas.data('left')+left);
    canvas.data('top',canvas.data('top')+top);
});
$('#canvas').bind('mousewheel',function(e,delta){
    e.preventDefault();
    var ratio = (e.originalEvent.wheelDelta/120)*0.01;
    showImg(image,parseFloat($('#ratio').val())+ratio);
});

$("#submit").click(function(){
    var success = function(data) {
        console.log(data);
    };
    var error = function() {
        console.log("error");
    };
    var options = {
        url: '/upload',
        type:'post',
        success: success,
        error: error
    };
    $('#form').ajaxSubmit(options);
});