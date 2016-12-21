(function ($) {
    var judgesManage ={
        curr: 1
    };
    var layer = require('app/assets/libs/layer/layer');
    var laypage = require('app/assets/libs/laypage/index');
    var tpl = require('view/tpl');
    judgesManage.list= function(page,keywords){
        var self = this;
        var url = reqConfig.getInterface('judManage');
        $.ajax({
            url:url,
            type:'get',
            dataType:'json',
            data:{pageNumber:(page || self.curr),
                keyword:$('#in_search').val()}
        }).done(function (data) {
            var html = tpl.judgeList(data.data.judgeList);
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
        });
    }
		judgesManage.dele=function(id){
	    	var self = this;
            // <a onclick="judgesManage.dele({{=value.id}})"  class="public-button2">删除</a>
            layer.confirm('确定删除？',function(){
            var deleteUsl = reqConfig.getInterface('deljudge');
	            $.ajax({
	                url:deleteUsl,
	                type:'post',
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
	judgesManage.addJud=function(){
		$(document).on("click",".add",function(){
            // window.location.href=jumpAddJudes;
			window.location.href="./addJudges";
		});
	}
    module.exports = judgesManage;
})($);
      