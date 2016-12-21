
(function ($) {
    var activity ={
        curr:1
    };
    var layer = require('app/assets/libs/layer/layer');
    var laypage = require('app/assets/libs/laypage/index');
    var urltext = reqConfig.getInterface('assessmentenent');
    var activityListUrl = reqConfig.getInterface('activityList');
    require('app/assets/libs/showloading/loading');
    var tpl = require('view/tpl');
    var keywords = '';
    activity.init = function(){
         var self = this; 
         $.ajax({
            url:urltext,
            type:'get',
            dataType:'json',
            success:function(data){
                $("#caseTotal").text((data.data.caseTotal)?data.data.caseTotal:0);
                $("#courtTotal").text((data.data.courtTotal)?data.data.courtTotal:0);
                $("#raterTotal").text((data.data.raterTotal?data.data.raterTotal:0));
                $("#evaluatedTotal").text((data.data.evaluatedTotal)?data.data.evaluatedTotal:0);
                $("#pv").text((data.data.pv)?data.data.pv:0);
                $("#scoreTotal").text((data.data.scoreTotal)?data.data.scoreTotal:0);
            }          
        });


        $(document).on("change","#recomment-set-date",function(){

            var courtCodeIndex = getCookie('courtCode');
            var higDownload = reqConfig.getInterface('higDownload');
            var comDownload = reqConfig.getInterface('comDownload');
            if (courtCodeIndex == "0") {
                $('#index-download>a').attr('href',higDownload);
            }else{
                $('#index-download>a').attr('href',comDownload);
            }

             require(['./liveManage-video.js'], function(index) {
                index.init(); 
            }); 
            activity.list();
        })
        $(document).on('click','.export-botton',function(){
            window.location.href = '/daily/export';
        })

    };
    activity.list = function(page,releaseTime){
        var self = this;
        var selectDate = $("#recomment-set-date option:selected").val();
        $('.public-main').showLoading();
        $.ajax({
            url:activityListUrl,
            type:'post',
            dataType:'json',
            data:{
               pageNumber:(page || self.curr),
               releaseTime:selectDate
            }
        }).done(function (data) {
            var html = tpl.activityList(data.data.activityList);
            $('.public-table-area').html(html);  
            var page = data.data.page;
            laypage({
                cont: $('.public-fanye'), //容器。值支持id名、原生dom对象，jquery对象,
                pages: page.pageTotal, //总页数
                curr: page.pageNumber || 1,
                skin: 'yahei', //加载内置皮肤，也可以直接赋值16进制颜色值，如:#c00
                groups: 5, //连续显示分页数
                jump: function (obj, first) {
                    if (!first) {
                        self.curr = obj.curr;
                        self.list(self.curr);
                    }
                }
            }); 

            $('.public-main').hideLoading();        
        });

    };
    /*获取时间日期*/
    activity.setDate = function(){
        var that=this;
        var url=reqConfig.getInterface("activityGetDates");
        $.ajax({
            url:url,
            type: 'post',
            dataType: 'json',
        })
        .done(function(data) {
            if(data.code==0){
                var dateHtml=tpl.dateSet(data);
                $("#recomment-set-date").empty();
                $("#recomment-set-date").html(dateHtml);
                // that.list(1);
            }
        })
        .fail(function() {
            console.log("------error");
        })
        .always(function() {
            console.log("complete");
        }); 
    }
    activity.search = function(){
    var self = this;
    keywords = $('#search').val();
    self.list(1,keywords);
    }
    module.exports = activity;
    
})($);

