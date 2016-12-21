// (function($){
 
    var addSet = {};
    var $=require('jquery');
    var layer = require('app/assets/libs/layer/layer');
    var laypage = require('app/assets/libs/laypage/index');
    var datePicker = require('app/assets/libs/datePicker/timer');
    require('app/assets/libs/showloading/loading');
    var caseActivityCaseListUrl = reqConfig.getInterface('caseActivityCaseList');
    var recommendSaveUrl = reqConfig.getInterface('recommendSave');
    var recommendList=reqConfig.getInterface('recommendSet');

    var tpl = require('view/selectDot_tpl');
/*
*如果推荐页面点击编辑按钮跳转过来
*/
    addSet.init = function(page,keyword){
        $("#case-set-time").datetimepicker();
        $('#startTime').datetimepicker();
        $('#endTime').datetimepicker();
        var that=this;
        if((window.location.href).indexOf("releaseTime")!=-1){
            var releaseTimeUrl=that.getT2();
            $.ajax({
                url: recommendList,
                type: 'post',
                dataType: 'json',
                data: {releaseTime: releaseTimeUrl},
            })
            .done(function(data) {
                if(data.code==0){
                    $("#case-set-time").val(releaseTimeUrl);
                    $.each(data.data,function(i,vue){
                        if(vue.seq==1){
                            $(".select-result:eq(0)").show();
                            $(".select-result:eq(0)").find(".case_id").attr('dataid',vue.caseId);
                            $(".select-result:eq(0)").find(".case_name").text(vue.wsCase.title);
                            $(".select-result:eq(0)").find(".case_no").text(vue.wsCase.caseNo); 
                        }
                        if(vue.seq==2){
                            $(".select-result:eq(1)").show();
                            $(".select-result:eq(1)").find(".case_id").attr('dataid',vue.caseId);
                            $(".select-result:eq(1)").find(".case_name").text(vue.wsCase.title);
                            $(".select-result:eq(1)").find(".case_no").text(vue.wsCase.caseNo); 
                        }
                        if(vue.seq==3){
                            $(".select-result:eq(2)").show();
                            $(".select-result:eq(2)").find(".case_id").attr('dataid',vue.caseId);
                            $(".select-result:eq(2)").find(".case_name").text(vue.wsCase.title);
                            $(".select-result:eq(2)").find(".case_no").text(vue.wsCase.caseNo); 
                        }
                        if(vue.seq==4){
                            $(".select-result:eq(3)").show();
                            $(".select-result:eq(3)").find(".case_id").attr('dataid',vue.caseId);
                            $(".select-result:eq(3)").find(".case_name").text(vue.wsCase.title);
                            $(".select-result:eq(3)").find(".case_no").text(vue.wsCase.caseNo); 
                        }
                        if(vue.seq==5){
                            $(".select-result:eq(4)").show();
                            $(".select-result:eq(4)").find(".case_id").attr('dataid',vue.caseId);
                            $(".select-result:eq(4)").find(".case_name").text(vue.wsCase.title);
                            $(".select-result:eq(4)").find(".case_no").text(vue.wsCase.caseNo); 
                        }
                    });
                }
            })
            .fail(function(){
                console.log("从推荐设置页面，编辑按钮跳转过来获取数据失败");
            })
            
        }
        // 弹层关闭
         $('span.close').on("click",function(){
             $('#startTime').val('');
             $('#endTime').val('');
             $('.inputkeys').val('');
             $('.public-mask').hide();
             $('.public-box').hide();
         });
         //点击数据
         // $("#case-search").on("click",function(){
         //    that.ajaxData(1);
         // });

    }
/*
*编辑页面选择按钮事件以及弹框相关绑定事件
*/
addSet.selectList = function(page,keyword){
        var self = this;
        $(document).on('click','.case-set-button',function(){
            var that = this;
            $('.public-mask').show();
            $('.public-box').show();
            self.ajaxData(page);
            $(document).off('click','.selectDot');    // 对同一类元素绑定后，一定要解绑
            $(document).on('click','.selectDot',function(event){
          
                var parentNode = $(this).parents('tr');
                var caseName = $(parentNode).find('.case_nameDot').text();
                var caseNo = $(parentNode).find('.case_noDot').text();
                var caseId = $(parentNode).attr('dataid');
                var returnMark=0;
                $('.case_id').each(function(){
                    if($(this).attr('dataid')==caseId){
                        returnMark=1;
                        console.log($(this).attr('dataid'));

                        layer.confirm('该案件已经被选取了', {
                          btn: ['确定','取消'] //按钮
                        }, function(){
                            layer.msg('请重新操作', {time:100,icon: 1});
                            return false;
                        }, function(){
                        });
                        return false;
                    }
                    else{
                        // $(that).siblings('.select-result').show();
                        // $(that).siblings('.select-result').find('.case_name').text(caseName);
                        // $(that).siblings('.select-result').find('.case_no').text(caseNo);
                        // $(that).siblings('.select-result').find('.case_id').attr("dataid",caseId);
                    }
                });
                if(returnMark==1){
                    return ;
                }
                $(that).siblings('.select-result').show();
                $(that).siblings('.select-result').find('.case_name').text(caseName);
                $(that).siblings('.select-result').find('.case_no').text(caseNo);
                $(that).siblings('.select-result').find('.case_id').attr("dataid",caseId);
                $('.public-mask').hide();
                $('.public-box').hide();
            })   
           
        })

    } 

/*
页面删除操作
*/
addSet.deleteControl=function(){
    $(document).off().on('click','.delete',function(event){
        $(this).parents('.select-result').find('.case_name').text('');
        $(this).parents('.select-result').find('.case_no').text('');
        $(this).parents('.select-result').hide();
        $(this).parent('.case_id').attr("dataid","");   
    });
}

/*
*对页面进行保存
*/
    addSet.save = function(){
       $(document).on('click','#commit',function(){
        var oneId = $('.first').attr('dataid');
        var twoId = $('.second').attr('dataid');
        var thirdId = $('.third').attr('dataid');
        var fouthId = $('.fourth').attr('dataid');
        var fifthId = $('.fifth').attr('dataid');
        var releaseTime = $('#case-set-time').val();
        if((oneId||twoId||thirdId||fouthId||fifthId)==""||(oneId||twoId||thirdId||fouthId||fifthId)==" "){
            layer.confirm('没有选择案件', {
              btn: ['确定','取消'] 
            }, function(){
              layer.msg('请选择案件', {time:2000,icon: 1});
            }, function(){
            });
            return ;
        }
        if(releaseTime==""||releaseTime==" "){
            layer.confirm('没有选择时间', {
              btn: ['确定','取消'] 
            }, function(){
              layer.msg('请选择时间', {time: 2000,icon: 1});
            }, function(){

            });
            return ;
        }
        $.ajax({
            url:recommendSaveUrl,
            type:'post',
            dataType:'json',
            data:{
                oneSeq:oneId,
                twoSeq:twoId,
                threeSeq:thirdId,
                fiveSeq:fouthId,
                fourSeq:fifthId,
                releaseTime:releaseTime
            }
        }).done(function (data) {
              if(data.code == 0)  {
                window.location.href = './recommendSet';
              }   
        }); 
       }) 

    }      

/*弹框向后台提交数据*/
addSet.ajaxData=function(page,keyword){
        var self=this; 
        var startDate = $('#startTime').val();
        var endDate = $('#endTime').val();
        var keywords=$(".inputkeys").val();
        $('.public-main').showLoading();

        $.ajax({
            url:caseActivityCaseListUrl,
            type:'post',
            dataType:'json',
            data:{
                pageNumber:(page || self.curr),
                keyword:keyword,
                startDate:startDate,
                endDate:endDate
            }
        }).done(function (data) {
            var html = tpl.selectDot(data.data.caseList);
            $('#container').html(html);  
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
                        self.ajaxData(self.curr);
                    }
                }
            }); 
             $('.public-main').hideLoading();
            //点击搜索查询数据
            $(document).off('click','#case-search');    // 对同一类元素绑定后，一定要解绑
            $(document).on('click', '#case-search', function () {
                keyword = $(".inputkeys").val();
                console.log('++++'+keyword);
                self.ajaxData(1,keyword);
            });
           
        });
    }

/*获取参数中的数据*/
addSet.getT2=function(){
     var webHref=window.location.href;
     var re=/releaseTime=\w+[-]\w+[-]\w+/;
     var re2=/=\w+[-]\w+[-]\w+/;
     var re3=/[^=]+/;
     var result=webHref.match(re);
     var result2=result[0].match(re2);
     var result3=result2[0].match(re3);
  return result3[0];
}
    module.exports = addSet;
 // })($);





