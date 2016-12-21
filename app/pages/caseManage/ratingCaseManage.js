(function ($) {
    var activity ={
        curr:1
    };
    var layer = require('app/assets/libs/layer/layer');
    var laypage = require('app/assets/libs/laypage/index');
    require('app/assets/libs/showloading/loading');
    var deleteUsl = reqConfig.getInterface('caseDelete');
    var tpl = require('view/tpl');
   
    activity.list= function(page){
        var self = this;
        var url = reqConfig.getInterface('caseManageList');
        $('.public-main').showLoading();
        $.ajax({
            url:url,
            type:'get',
            data:{
               pageNumber:(page || self.curr),
               keyword:$('#search').val()
            }
        }).done(function (data) {
            var html = tpl.caseList(data.data.activityList);
            $('.caseTable').html(html);  
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
    activity.search = function(){
    var self = this; 
    self.list(1);
    }
    activity.del = function(id){
        var self = this;
         // <span class="public-button2" onclick="activity.del({{=value.caseId}})">删除</a></span>
        layer.confirm('确定删除本条热点案件？',function(){
            $.ajax({
                url:deleteUsl,
                type:'post',
                dataType:'json',
                data:{caseId:id}
            }).done(function (data) {
            if(data.code == 0){
                layer.alert('删除成功');
                self.list();    
            }else{
                layer.alert('删除失败');
            }               
            });
        });
    }
    module.exports = activity;
})($);