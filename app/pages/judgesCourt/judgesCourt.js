(function ($) {
    var judgesManage ={
        curr: 1
    };
    var layer = require('app/assets/libs/layer/layer');
    var laypage = require('app/assets/libs/laypage/index');
    var tpl = require('view/tpl');
    judgesManage.list= function(page,keywords){
        var self = this;
        var url = reqConfig.getInterface('judCourt');
        $.ajax({
            url:url,
            type:'get',
            dataType:'json',
            data:{pageNumber:(page || self.curr),
                name:keywords
            }
        }).done(function (data) {
            var html = tpl.actCourt(data.data.activityCourt);
            $('.public-table-area').html(html);  
            var page = data.data.page;
            $('#ourtNum').html(page.totalCount);
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

        $(document).on('click','span.search',function(){
            self.search();
        })
    }

    judgesManage.search = function(){
        var self = this;
        var keywords = $('#in_search').val();
        self.list(1,keywords);
    };

    module.exports = judgesManage;
})($);
      