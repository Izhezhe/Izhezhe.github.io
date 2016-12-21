(function ($) {
    var caseRating ={
        curr:1
    };
    var layer = require('app/assets/libs/layer/layer');
    var laypage = require('app/assets/libs/laypage/index');
    var url = reqConfig.getInterface('caseRating');
    require('app/assets/libs/showloading/loading');
    var tpl = require('view/tpl');
    var keywords = '';
    caseRating.list= function(page){
        var self = this;
        if (!page) {
            page = 1;
        }
        if (!keywords) {
            keywords = '';
        }
        if (assignState == undefined){
            assignState = '';
        }
        if (!assessmentState) {
            assessmentState = 0;
        }      
        var beginTime = $('#beginTime').val();
        var endTime = $('#endTime').val();

        $('.public-main').showLoading();
         $.ajax({
            url:url,
            type:'post',
            dataType:'json',
            data:{
                pageNumber:(page || self.curr),
                keyword:keywords,
                appointFlag:assignState,
                activityState:assessmentState,
                start:beginTime,
                end:endTime
            }
        }).done(function (data){
            var html = tpl.caseList(data.data.activityList);
            $('.tableCalss').html(html);
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
    }

        var assignState = '';
        var assessmentState = '';
    // 头部选项卡
        $("#assignState li").each(function(index){
        $(this).click(function(){
                $(this).addClass('on').siblings("li").removeClass('on');
                assignState = $(this).data('state');
                keywords = $('#search').val();
                caseRating.list(1);     
        })
        });

        $("#assessmentState li").each(function(index){
        $(this).click(function(){
                $(this).addClass('on').siblings("li").removeClass('on');
                assessmentState = $(this).data('state');
                keywords = $('#search').val();
                caseRating.list(1);     
        })
        });



    caseRating.search = function(){
    	var self = this;
    	keywords = $('#search').val();
    	self.list(1);
    }

    $("#beginTime").datetimepicker();
    $("#endTime").datetimepicker();
    module.exports = caseRating;
})($);
