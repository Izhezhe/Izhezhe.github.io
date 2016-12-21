(function ($) {
	var caseSet = {
		curr:1
	};
	var layer = require('app/assets/libs/layer/layer');
    var laypage = require('app/assets/libs/laypage/index');
    require('app/assets/libs/showloading/loading');
    var setCaseUrl = reqConfig.getInterface('setCase');
    var addCaseUrl = reqConfig.getInterface('addCase');

    //获取id
    caseSet.getQueryString = function (field, url) {
        var href = url ? url : window.location.href;
        var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
        var string = reg.exec(href);
        return string ? string[1] : null;
    };

    var id = caseSet.getQueryString('id');
    var tpl = require('view/tpl');
    var keywords = '';
    caseSet.getCase = function(){
    	if(id){
             $("#pic").show();
        	var self = this;
            var url = reqConfig.getInterface('getCase');
            
             $.ajax({
                url:url,
                type:'get',
                data:{
                    id:id
                }
            }).done(function (data){
                $("#activityId").val(data.data.id);
            	$("#caseId").val(data.data.wsCase.caseId);
            	$("#caseName").text(data.data.wsCase.title);
            	$("#caseTime").val(format(data.data.releaseTime));
                $("#picName").attr('src',data.data.coverPic);
                $("#coverPic").val(data.data.coverPic);
                
            });
   		}
   	}
    
    
    caseSet.list= function(page){
        var self = this;
        if(!page){
        	page = 1;
        }
        if(!keywords){
        	keywords = '';
        }
        if(!liveState){
        	liveState = '';
        }
        var startDate = $('#beginTime').val();
        var endDate = $('#endTime').val();
        var caseListUrl = reqConfig.getInterface('caseList');
        $('.public-main').showLoading();
        $.ajax({
            url:caseListUrl,
            type:'get',
            data:{
            	keyword: $('#keywords').val(),
            	pageNumber:(page || self.curr),
            	startDate:startDate,
            	endDate:endDate,
            	liveState:liveState
            }
        }).done(function (data) {
            var html = tpl.caseListDiv(data.data.caseList);
            $('.caseList').html(html);  
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
    var liveState='';
    	$(document).on('click', '.search', function(){
          var self = this;
          keywords = $('#keywords').val();
          caseSet.list(1); 
        }) 

    	// 头部选项卡
		$("#choseList li").each(function(index){
		var now = $(this);
		$(this).click(function(){
				$("li.on").removeClass('on');
				now.addClass('on');	
				liveState = $(this).data('state');
				keywords = $('#keywords').val();
				caseSet.list(1); 	
		})
		});



        $(document).on('click', '#getAllCase', function(){
        	var self = this;
        	$('.public-box').css({'display':'block'});
            $('.public-mask').css({'display':'block'});

          caseSet.list(self.curr); 
        }) 
        $(document).on('click', '.close', function(){
        	var self = this;
        	$('.public-box').css({'display':'none'});
            $('.public-mask').css({'display':'none'});          
        })  

        caseSet.checkCase = function(id,name){
        	var self = this;
        	$('.public-box').css({'display':'none'});
            $('.public-mask').css({'display':'none'});
            $("#caseName").html(name);
            $("#caseId").val(id);

        }
        $(document).on('click','.submit-button',function(){
        	 
        	var self = this;
            var id=$('#activityId').val();
        	var caseId = $('#caseId').val();
        	var releaseTime = $('#caseTime').val();
        	var coverPic = $("#coverPic").val();
             if($("#caseName").text()==''){
                layer.alert("选择案件为必填项！")
                return false; 
             }else if (releaseTime == ''){
                layer.alert("参赛时间为必填项！")
                return false;    
            }
            else{
                $.ajax({
                url:setCaseUrl,
                type:'get',
                dataType:'json',
                data:{
                    id:id,
                    caseId:caseId,
                    releaseTime:releaseTime,
                    coverPic:coverPic
                }
            }).done(function (data) {
                if(data.code == 0){
                    window.location.href ='./ratingCaseManage';
                }else{
                    layer.alert('设置失败');           
                }   
            });

           }
        })	
   //图片上传
     
        $(document).on('change', '#picUpLoad', function () {
            $("#pic").show();
            var $self = $(this);
            var uploadPicUrl =  reqConfig.getInterface('uploadPic')
            if (/(\.|\/)(gif|jpe?g|png)$/i.test($self.val())) {
                var formData = new FormData();
                formData.append('file', $self[0].files[0]);
                formData.append('picName', $self[0].files[0].name);
                $.ajax({
                    url: uploadPicUrl,
                    data: formData,
                    type: 'POST',
                    cache: false,
                    processData: false,
                    contentType: false
                }).done(function (data) {
                    if(data.code == 0){
                        $("#picName").attr('src',data.data);
                        $("#coverPic").val(data.data);
                    }
                    else{
                        layer.alert('上传失败!');
                         $("#pic").hide();
                    }
                }).fail(function (data) {
                    layer.alert('上传失败!');
                     $("#pic").hide();
                });
            }
        });

    $(document).on('click', '#dle', function () {
            $("#picName").attr('src','');
            $("#coverPic").val('');
            $("#pic").hide();
    });    




	$("#caseTime").datetimepicker();
	$("#beginTime").datetimepicker();
	$("#endTime").datetimepicker();
	module.exports = caseSet;
})($);