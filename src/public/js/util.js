/**
 * Created by Ken on 2014-5-21.
 * @description
 *      this util.js will include all util class, like DateUtil, StringUtil, MathUtil
 */

DateUtil = {};
//StringUtil = {};
MathUtil = {};
//
/**
 * @Author Ken
 * @description
 *      format date to string
 * @parameter
 *      param1 : date [could be string or date]
 *      param2 : mask
 * @return
 *      string of date
 * @example
 *      DateUtil.format(new Date('2013-01-02'),'MM/dd/yyyy') = '02/01/2013';
 *      DateUtil.format('2013-01-02','MM/dd/yyyy') = '02/01/2013';
 * */
DateUtil.format = function(date,mask) {
    var d = date;
    var type = Object.prototype.toString.call(d);
    if(type==="[object Date]") {
        ;
    } else if(type==="[object String]") {
        d = new Date(d);
    } else {
        throw new TypeError("Unsupported data type of parameter, param1's type="+type);
    }
    var zeroize = function (value, length) {
        if (!length) length = 2;
        value = String(value);
        for (var i = 0, zeros = ''; i < (length - value.length); i++) {
            zeros += '0';
        }
        return zeros + value;
    };
    return mask.replace(/(dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|hh|h|HH|H|mm|m|ss|s|l|L|tt|TT|Z|)/g, function($0) {
        switch($0) {
            case 'd':   	return d.getDate();
            case 'dd':  	return zeroize(d.getDate());
            case 'ddd': 	return ['Sun','Mon','Tue','Wed','Thr','Fri','Sat'][d.getDay()];
            case 'dddd':	return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d.getDay()];
            case 'M':   	return d.getMonth() + 1;
            case 'MM':  	return zeroize(d.getMonth() + 1);
            case 'MMM': 	return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];
            case 'MMMM':	return ['January','February','March','April','May','June','July','August','September','October','November','December'][d.getMonth()];
            case 'yy':	    return String(d.getFullYear()).substr(2);
            case 'yyyy':	return d.getFullYear();
            case 'h':	    return d.getHours() % 12 || 12;
            case 'hh':	    return zeroize(d.getHours() % 12 || 12);
            case 'H':   	return d.getHours();
            case 'HH':  	return zeroize(d.getHours());
            case 'm':   	return d.getMinutes();
            case 'mm':  	return zeroize(d.getMinutes());
            case 's':   	return d.getSeconds();
            case 'ss':  	return zeroize(d.getSeconds());
            case 'l':   	return zeroize(d.getMilliseconds(), 3);
            case 'L':   	var m = d.getMilliseconds(); if (m > 99) m = Math.round(m / 10); return zeroize(m);
            case 'tt':  	return d.getHours() < 12 ? 'am' : 'pm';
            case 'TT':  	return d.getHours() < 12 ? 'AM' : 'PM';
            case 'Z':   	return d.toUTCString().match(/[A-Z]+$/);
            // Return quoted strings with the surrounding quotes removed
            default:        return $0.substr(1, $0.length - 2);
        }
    });
};

/**
 * @Author Ken
 * @description
 *      parse string to date
 * @parameter
 *      param1 : string of date
 *      param2 : mask. [For now, param just accept yyyy,MM,dd]
 * @return
 *      Date
 * @example
 *      DateUtil.parseDate('24/03/2013','dd/MM/yyyy') = new Date('2013/03/24');
 * */
DateUtil.parseDate = function(strDate,mask) {
    switch(mask) {
        case 'yyyy-MM-dd':
        case 'MM/dd/yyyy':
        case 'yyyy/MM/dd':
            return new Date(strDate);
    }
    var dIndex = mask.indexof('dd');
    var MIndex = mask.indexof('MM');
    var yIndex = mask.indexof('yyyy');
    if(dIndex==-1 || MIndex==-1 || yIndex==-1) {
        throw new Error('Unsupported mask, mask='+mask);
    }
    var day   = parseInt(strDate.substring(dIndex,2));
    var month = parseInt(strDate.substring(MIndex,2))-1;
    var year  = parseInt(strDate.substring(yIndex,4));
    return new Date(year,month,day);
};

/**
 * @Author Ken
 * @description
 *      return max value of parameters, support mutil-params
 * @parameter
 *      params : can be integer , float and string(all number characters)
 * @return
 *      max
 * @example
 *      MathUtil.max('24',8,23) = 24;
 * */
MathUtil.max = function(){
    var max = -99999999999999;
    for(var i in arguments){
        if(parseInt(arguments[i])>max)
            max = parseInt(arguments[i]);
    }
    return max;
};
/**
 * @reference
 *      MathUtil.max
 * */
MathUtil.min = function(){
    var mix = 99999999999999;
    for(var i in arguments){
        if(parseInt(arguments[i])<mix)
            mix = parseInt(arguments[i]);
    }
    return mix;
};


/**
 * @Author Ken
 * @date 2014-08-14
 * @description
 * @parameter
 *      src, [object]
 *      desc,[object]
 *      attrs, array of attr name [string]
 * @example
 *      var src = {id:1,name:'Ken',age:28};
 *      var desc = {};
 *      Object.copy(src,desc,['id','name']);
 *      //desc = {id:1,name:'Ken'};
 * */
Object.copy = function(src,dest,attrs) {
    if(attrs && attrs.length>0) {
        for(var i in attrs) {
            var attr = attrs[i];
            dest[attr] = src[attr];
        }
    }
    else {
        for(var key in dest) {
            dest[key] = src[key];
        }
    }
};
