(function ($) {
    var assignJudges ={
        curr:1
    };
    var layer = require('app/assets/libs/layer/layer');
    var laypage = require('app/assets/libs/laypage/index');
    var url = reqConfig.getInterface('assignJudges');
    var assignJudgesUrl = reqConfig.getInterface('setAppoint');
    require('app/assets/libs/showloading/loading');
    var tpl = require('view/tpl');
    //获取id
    assignJudges.getQueryString = function (field, url) {
        var href = url ? url : window.location.href;
        var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
        var string = reg.exec(href);
        return string ? string[1] : null;
    };
    var caseId = assignJudges.getQueryString('caseId');
    var keywords = '';
    assignJudges.list= function(page){
        $('.public-main').showLoading();
        var self = this;
          if(!keywords){
            keywords = '';
        }

        $.ajax({
            url:url,
            type:'post',
            dataType:'json',
            data:{
              keyword:keywords, 
              caseId:caseId,
              pageNumber:(page || self.curr)
            }
        }).done(function (data){
            var html = tpl.assignJudges(data.data.userList);
            $('.judgesTable').html(html); 
            $('.check span').on('click',function(){
                $(this).toggleClass('on');
                $(this).parents('tr').siblings('tr').find('.check span').removeClass('on');
            })
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

            $('#assigngo').on('click',function(){
                // var arr = [];
                var strId = '';
                $('.check').each(function(){
                    if($(this).children('span').hasClass('on')){
                        strId  = $(this).parent().attr('id');
                    }
                })

               if(strId != null && strId != ''){
               $.ajax({
                url:assignJudgesUrl,
                type:'get',
                dataType:'json',
                data:{
                    caseId:caseId,
                    userIds:strId
                }
               }).done(function(data){
                if(data.code == 0){
                    window.location.href = "./caseRating";
                }else{
                    layer.alert("指派失败");
                }
               }) 
                }else{
                    layer.alert("请选择要指派的人员在提交！");
            }

            })    

    assignJudges.search = function(){
    	var self = this;
    	keywords = $('#keywords').val();
    	self.list(1);
    }
    module.exports = assignJudges;
})($);
