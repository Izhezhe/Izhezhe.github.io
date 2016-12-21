(function ($) {
    var activity ={
        curr: 1
    };
    var layer = require('app/assets/libs/layer/layer');
    var laypage = require('app/assets/libs/laypage/index');
    //var laypage = require('app/assets/libs/showLoading/showLoading');      
    require('app/assets/libs/showloading/loading');
    var tpl = require('view/tpl');
    activity.list = function(page,keywords){
        var self = this;
        var url = reqConfig.getInterface('judgesGroupList');
        $('.public-main').showLoading();
        $.ajax({
            url:url,
            type:'get',
            dataType:'json',
            data:{
                pageNumber: (page || self.curr),
                keywords: keywords
            }
        }).done(function (data) {
            var html = tpl.judgesGroupList(data.data.groupjudgeList);
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
    activity.search = function(){
        var self = this;
        var keywords = $('#search').val();
        self.list(1,keywords);
    }
    activity.del = function(id){
        var self = this;
        // <span class="public-button2" onclick="activity.del({{=value.id}})">删除</span>
        layer.confirm('确定下线本组？',function(){
            var deleteUrl = reqConfig.getInterface('groupDelete');
            $.ajax({
                url: deleteUrl,
                type: 'post',
                data:{
                    id:id
                }   
            }).done(function (data) {
                if(data.code == 0){
                    self.list();
                    layer.alert('删除成功');
                }else{
                    layer.alert('删除失败');
                }
            });
        });        
    }
    module.exports = activity;
})($);

