(function ($) {

	var app={
        curr:1
    };   
    var layer = require('app/assets/libs/layer/layer');
    var laypage = require('app/assets/libs/laypage/index');
    var caseInformationUrl = reqConfig.getInterface('viewComment');
    var scareStateUrl = reqConfig.getInterface('scoreState');
    var commentStateUrl = reqConfig.getInterface('commentState');
    var examineUrl = reqConfig.getInterface('examine');
    require('app/assets/libs/showloading/loading');
    var tpl = require('view/tpl');

    //获取id
    app.getQueryString = function (field, url) {
        var href = url ? url : window.location.href;
        var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
        var string = reg.exec(href);
        return string ? string[1] : null;
    };

	var caseId = app.getQueryString('id');        
    app.closeBox=function(){
     $(document).on("click","#_close_box",function(){
 	$(".public-mask").hide();
 	$(".public-box").hide();
 	});
 	 $(document).on("click","#_close_button",function(){
 	$(".public-mask").hide();
 	$(".public-box").hide();
 	});
	}
    app.closeBox2=function(){
     $(document).on("click","#_close_box2",function(){
    $(".public-mask").hide();
    $("#scoreReasonbox").hide();
    });
    }

    app.caseInformation = function(){
        var self = this;  
        $('.public-main').showLoading();
         $.ajax({
            url:caseInformationUrl,
            type:'post',
            dataType:'json',
            data:{
                caseId:caseId
            }
        }).done(function (data){
            var html = tpl.viewComment(data.data);
            $('.view-comment-case').html(html);
            $('.public-main').hideLoading();
        });     
    }

    app.scareState = function(){
        var self = this; 
        $('.public-main').showLoading();
         $.ajax({
            url:scareStateUrl,
            type:'post',
            dataType:'json',
            data:{
              caseId: caseId 
            }
        }).done(function (data){
            var html = tpl.scoreState(data.data);
            $('#scareState').html(html);  
            $('.public-main').hideLoading();   
        });  

            $(document).on('click', '.past-score', function(){

            $('.public-box').css({'display':'block'});
            $('.public-mask').css({'display':'block'});
            $('#scoreReason').html($(this).attr("temp"));
           
        })      
    }

    app.commentState = function(){
        var self = this;
        $('.public-main').showLoading();
         $.ajax({
            url:commentStateUrl,
            type:'post',
            dataType:'json',
            data:{
              caseId:caseId 
            }
        }).done(function (data){
            var html = tpl.commentState(data.data);
            $('#commentState').html(html);
            $('.public-main').hideLoading();
            $('.scoreReasonT').on('click',function(){
                $('#scoreReasonbox').css({'display':'block'});
                $('.public-mask').css({'display':'block'});
                $('#scoreReason').html($(this).attr("temp"));
            })
            $('.scoreReasonT a').on('click',function(event){
                event.stopPropagation();
            })
        }); 

        $(document).on('click', '.state', function(){

            $('.public-box').css({'display':'block'});
            $('.public-mask').css({'display':'block'});
            $('#comments').html($(this).attr("temp"));
            $('#examine').attr('attr',$(this).attr('id'));
           
        }) 
 
    };


       app.examine  = function(){
            $(document).on("click",".comment-past",function(){
                var self = this;
                var currentStatus = $(self).data("status"); 
                var id = $(self).parents('tr').data('id'); 

                if(currentStatus == 2){
                    layer.confirm("确定撤销这条数据？",function(){
                        $.ajax({
                            url:examineUrl,
                            type:'post',
                            dataType:'json',
                            data:{
                                id:id,
                                approveStatus:1
                            }
                        }).done(function (data) {
                            $(self).text('审核通过');
                            $(self).data("status","1");
                            $(self).parent('td').siblings('td.status').children('span').text('待审核');
                            $('.layui-layer-shade').hide();
                            $('.layui-layer').hide();     
                        });
                    });
                }else{
                    $.ajax({
                        url:examineUrl,
                        type:'post',
                        dataType:'json',
                        data:{
                            id:id,
                            approveStatus:2
                        }
                    }).done(function (data) {
                        layer.alert("审核通过....");
                        $(self).text('取消审核');
                        $(self).parent('td').siblings('td.status').children('span').text('审核通过');
                        $(self).data("status","2");   
                    });
                }
             });
        }
        //不知道这段代码是干嘛的    11/28 litao
        app.examineqx = function(id){
             $.ajax({
                url:examineUrl,
                type:'post',
                dataType:'json',
                data:{
                    id:id,
                    approveStatus:1
                }
               }).done(function(data){
                if(data.code == 0){
                    layer.alert("操作成功");
                    $(".public-mask").hide();
                    $(".public-box").hide();
                }else{
                    layer.alert("操作失败");
                }
               }) 

        }
        $('#examine').on('click',function(){
            var id = $(this).attr('attr');
               $.ajax({
                url:examineUrl,
                type:'post',
                dataType:'json',
                data:{
                    id:id,
                    approveStatus:2
                }
               }).done(function(data){
                if(data.code == 0){
                    layer.alert("操作成功");
                    $(".public-mask").hide();
                    $(".public-box").hide();
                }else{
                    layer.alert("操作失败");
                }
               }) 

        })



    module.exports=app;

})($);