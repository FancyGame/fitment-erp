/**
 * Created by md on 14-8-17.
 */

app.filter('int',function(){
    return function(value){
        return parseInt(value);
    };
});

