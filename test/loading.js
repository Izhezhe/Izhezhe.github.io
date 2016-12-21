/*var $loadingHtml = $('<div class="ui-loading"><div class="ui-loading-mask"></div><i></i></div>'),
$LoadingCss = $('<style>.ui-loading{position:absolute;left:0;top:0;z-index:9999;width: 100%;height: 100%;}.ui-loading .ui-loading-mask{position:absolute;top:0;left:0;background-color:#000;opacity:.2;z-index:1}.ui-loading i{height:90px;width:90px;display:block;background:#000 url(loading.gif) center center no-repeat;background-size:100% 100%;position:absolute;z-index:2;left: 50%;top: 50%; margin-top: -45px; margin-left: -45px;}</style>');

$("head").append($LoadingCss);
$("body").append($loadingHtml);

function removerLoad(){
    $('.ui-loading').hide();
}
function loading(){
    $('.ui-loading').show();
}*/
(function($){
    var timer = require('app/assets/libs/datePicker/timer');
    var layer = require('app/assets/libs/layer/layer');
    var tpl = require('views/tpl');
    require('app/assets/libs/showloading/showLoading');
    var test = {};
    test.init() =function(){
    $(document).ready(function(){
    $('body').showLoading();
    });
    }

    //$('.password').hideLoading();
    
    module.exports = test;
})($);