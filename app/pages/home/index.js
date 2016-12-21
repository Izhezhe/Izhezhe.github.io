(function () {
    console.log('hanjianbangt est')


    var $ = require('jquery');
    var sb = require('views/tpl');

    var laypage = require('app/assets/libs/laypage/index');


    var layer = require('app/assets/libs/layer/layer');

    var moment=require('moment');
    laypage({
        cont: $('.page-list'), //容器。值支持id名、原生dom对象，jquery对象,
        pages: 100, //总页数
        skin: 'yahei', //加载内置皮肤，也可以直接赋值16进制颜色值，如:#c00
        groups: 7 //连续显示分页数
    });

    // var laydate=require('app/assets/libs/laydate/laydate');
    
    require('app/assets/libs/datePicker/timer')
    $('#test').datetimepicker();

    $.ajax({
        url: '/api/pagetest',
        type: 'get'
    }).done(function (data) {
        // alert(sb.test(data.data));
    });
    var test = function () {
        return {
            a: 111,
            b: 'sdsdsdsd'
        }
    };
    var test3 = {
        a: 111,
        b: "xsjhdjshdj"
    };


    module.exports = test3;

})();

