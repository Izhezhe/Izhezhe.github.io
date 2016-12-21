(function ($) {
	var addJud = {
        curr: 1
    };
	var layer = require('app/assets/libs/layer/layer');
    var laypage = require('app/assets/libs/laypage/index');
	var uplodePic = reqConfig.getInterface('uploadPic');
    require('app/assets/libs/showloading/loading');
    addJud.init = function () {
        var self = this;       
        //加载评委组
        var url = reqConfig.getInterface('grouping');        
            $.ajax({
            url: url,
            type: 'get',
            async: false,
            data: {}
        }).done(function(data) {
            var leade = data.data;
            var str1 = '';
            for(var i = 0;i<leade.length;i++){
                str1 += "<option value="+leade[i].id+">"+leade[i].name+"</option>";
            }
            $('#judGroup').append(str1);
        });
        //初始化评委信息        
        var query_id = self.getQueryString("id");       
        if(query_id){
            $('#judId').val(query_id);
            $('.select a').html("编辑评委");
            $("#judName").attr("disabled",true);
            $('#loginCont').attr("disabled",true);
            var editJudge = reqConfig.getInterface('editJudges');
            $('.public-main').showLoading();
            $.ajax({
                url: editJudge,
                type: 'get',
                async: false,
                data: {id:query_id}
            }).done(function(data) {
                var groupLen = data.data;
                $("#judName").val(groupLen.name);
                $("#judJob").val(groupLen.jobDesc);
                $("#loginCont").val(groupLen.loginname);
                $("#judContact").val(groupLen.phonenumber);
                $("#introduction").val(groupLen.describe);
                $("#judGroup").val(groupLen.groupId);
                $("#judIndustry").val(groupLen.trade);
                $("#picName").attr('src',groupLen.headPic);
                $("#intPic").val(groupLen.headPic);
                $('.public-main').hideLoading();
            });     
        }

      $(document).on('blur','#judContact',function(){
            var myreg = /^1[34578]\d{9}$/;//手机正则
            if(!myreg.test($("#judContact").val())){layer.alert("请填写正确手机号！");return;}; 
      })   
     $(document).on('keyup','#judJob',function(){
           if($(this).val().replace(/(^\s*)|(\s*$)/g,"").length > 50 ){
              layer.alert("职位描述不要超过50字！");
              return;
            };
      }) 
     $(document).on('keyup','#introduction',function(){
           if($(this).val().replace(/(^\s*)|(\s*$)/g,"").length > 200){
              layer.alert("个人简历不要超过200字！");
              return;
            };
      })  
     $(document).on('blur','#loginCont',function(){ 
        var reg = /^(?=.*[a-z])[a-z0-9]+/ig;
        if(!reg.test($(this).val())){
            layer.alert("请输入数字和字母组合的姓名");
            $('#loginCont').val('');
            return;
        }
      })


    }
    addJud.getQueryString = function (field, url) {
        var href = url ? url : window.location.href;
        var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
        var string = reg.exec(href);
        return string ? string[1] : null;
    }
	addJud.addJudges = function(){
        var self = this;   
        if(self.getQueryString("id")){
        	$('.up-load-result').show();
        	$("#judName").attr("disabled",true);
            $(document).on("click","#finish",function(){
            	var judName = $('#judName').val();//姓名
		    	var judJob = $('#judJob').val();//职位描述
				// var myreg = /^1[34578]\d{9}$/;//手机正则
				var judContact = $('#judContact').val();
		    	var picUpLoad  = $('#picUpLoad').val();//图片上传
            	if(!judName){layer.alert("请填写姓名！");return;} 
	            if(!judJob){layer.alert("请填写职位描述！");return;}
	            // if(!myreg.test($("#judContact").val())){layer.alert("请填写正确手机号！");return;};
                var addJudges = reqConfig.getInterface('addJudges');
                $.ajax({
                    url:addJudges,
                    data:$("#agentForm").serialize(),
                    success:function(data){
                        if(data.code==0){
                            window.location.href="./judgesManage";
                        }
                    }
                });
            });
        }else{
            //页面必填校验
            $(document).on("click","#finish",function(){
            	var judName = $('#judName').val();//姓名
		    	var loginCont = $('#loginCont').val();//登录账号
		    	var judJob = $('#judJob').val();//职位描述
		    	var judContact = $('#judContact').val();//联系电话
				var judContact = $('#judContact').val();
	            if(!judName){layer.alert("请填写姓名！");return;} 
	            if(!loginCont){layer.alert("请填写登录账号！");return;}
	            if(!judJob){layer.alert("请填写职位描述！");return;}            
                var flg = '';       
                var checkLogName = reqConfig.getInterface('checkLoginName');
                $.ajax({
                    url: checkLogName,
                    data: {loginname:$('#loginCont').val()},
                    type: 'get'
                }).done(function (data) {
                    if(data.code == 0){               
                        var addJudges = reqConfig.getInterface('addJudges');
                        $.ajax({
					        url:addJudges,
                            data:$("#agentForm").serialize(),
                            success:function(data){
                                if(data.code==0){
                                    window.location.href="./judgesManage";
                                }
                            }
                        });
                    }else{
                        layer.alert("登录账号已存在!");               
                    }
                }).fail(function (data) {
                    layer.alert("设置失败.");
                });
            }); 
        }           	  
	}
        //页面必填校验
        $(document).on("blur","#loginCont",function(){   
            var checkLogName = reqConfig.getInterface('checkLoginName');
                $.ajax({
                url: checkLogName,
                data: {loginname:$('#loginCont').val()},
                type: 'get'
            }).done(function (data) {
                if(data.code == 0){                    

                }else{
                    layer.alert('登录账号已存在.');
                }
            }).fail(function (data) {
                layer.alert('操作失败.');
            });
        });         
    addJud.initUploadPic = function () {        
        $(document).on('change', '#picUpLoad', function () {
        	$('.up-load-result').show();
            var $self = $(this);
            if (/(\.|\/)(gif|jpe?g|png)$/i.test($self.val())) {
                var formData = new FormData();
                formData.append('file', $self[0].files[0]);
                formData.append('headPic', $self[0].files[0].name);
                $.ajax({
                    url: uplodePic,
                    data: formData,
                    type: 'POST',
                    cache: false,
                    processData: false,
                    contentType: false
                }).done(function (data) {
                    if(data.code == 0){                  	
                        $("#picName").attr('src',data.data);
                        $("#intPic").val(data.data);
                    }
                    else{
                        layer.alert('操作失败!');
                      	$('.up-load-result').hide();
                    }
                }).fail(function (data) {
                    layer.alert('头像上传失败!');
                    $('.up-load-result').hide();
                    return;
                });
            }
        });
    }
    //删除图片
	$(document).on('click', '#dalePic', function(){
		layer.confirm('确定删除？',function(){
			layer.alert('删除成功！');
			$('#picName').attr('src','');
			$("#intPic").val('');
			$('.up-load-result').hide();
		});

    });
	module.exports=addJud;	
})($);
