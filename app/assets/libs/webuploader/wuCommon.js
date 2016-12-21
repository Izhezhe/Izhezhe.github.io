var layer = require('app/assets/libs/layer/layer');

var contentType ="application/x-www-form-urlencoded; charset=utf-8";
if(window.XDomainRequest) //for IE8,IE9
	contentType = "text/plain";	
var backEndUrl = flashUploadUrl + "/wuFileUpload";
	var uploadOssUrl = flashUploadUrl + "/wuFileUploadFinish";
	WebUploader.Uploader.register({
	    "before-send-file": "beforeSendFile"
	    , "before-send": "beforeSend"
	    , "after-send-file": "afterSendFile"
	}, {
	    beforeSendFile: function(file){
	        //秒传验证
	        var task = new $.Deferred();
	        var start = new Date().getTime();
	        (new WebUploader.Uploader()).md5File(file, 0, 10*1024*1024).progress(function(percentage){
	            console.log(percentage);
	        }).then(function(val){
	            console.log("总耗时: "+((new Date().getTime()) - start)/1000);
	            md5Mark = val;
	            userInfo.md5 = val;
	            $.support.cors = true;
	            $.ajax({
	                type: "get", 
	                url: backEndUrl,
	                dataType:'html',
	                data: {
	                    status : "md5Check",
	                    md5 : val
	                },
	                contentType:contentType,
	                cache: false, 
	                crossDomain: true,
	                timeout: 60000 //todo 超时的话，只能认为该文件不曾上传过
	            }).then(function(data, textStatus, jqXHR){
	                
	            	data = $.parseJSON(data);
	                if(data.ifExist){   //若存在，这返回失败给WebUploader，表明该文件不需要上传
	                    task.reject();
	                    uploader.skipFile(file);
	                    file.path = data.path;
	                    UploadComlate(file);
	                }else{
	                    task.resolve();
	                    //拿到上传文件的唯一名称，用于断点续传
	                    uniqueFileName = md5(''+userInfo.userId+file.name+file.type+file.size);
	                }
	            }, function(jqXHR, textStatus, errorThrown){    //任何形式的验证失败，都触发重新上传
	            	console.log(jqXHR);
	            	console.log("jqXHR:"+jqXHR+"; textStatus:"+textStatus+"; errorThrown"+errorThrown);
	                //task.resolve();
	                //拿到上传文件的唯一名称，用于断点续传
	            	uniqueFileName = md5(''+userInfo.userId+file.name+file.type+file.size);
	            });
	        });
	        return $.when(task);
	    }, beforeSend: function(block){
	        //分片验证是否已传过，用于断点续传
	        var task = new $.Deferred();
	        $.ajax({
	            type: "get", 
	            url: backEndUrl, 
	            data: {
	                status: "chunkCheck", 
	                name: uniqueFileName, 
	                chunkIndex: block.chunk, 
	                size: block.end - block.start
	            }, 
	            cache: false, 
	            crossDomain: true,
	            contentType:contentType,
	            timeout: 60000,  //todo 超时的话，只能认为该分片未上传过
	            dataType: "html"
	        }).then(function(data, textStatus, jqXHR){
	            if(data.ifExist){   //若存在，返回失败给WebUploader，表明该分块不需要上传
	                task.reject();
	            }else{
	                task.resolve();
	            }
	        }, function(jqXHR, textStatus, errorThrown){    //任何形式的验证失败，都触发重新上传
	        	console.log('分片验证失败');
	        	console.log("jqXHR:"+jqXHR+"; textStatus:"+textStatus+"; errorThrown"+errorThrown);
	            task.resolve();
	        });
	
	        return $.when(task);
	    }, afterSendFile: function(file, response){
	        var chunksTotal = 0;
	        if((chunksTotal = Math.ceil(file.size/chunkSize)) > 1){
	            //合并请求
	            var task = new $.Deferred();
	            $.ajax({
	                type: "get", 
	                url: backEndUrl,
	                async: true,
	                data: {
	                    status: "chunksMerge", 
	                    name: uniqueFileName, 
	                    chunks: chunksTotal, 
	                    ext: file.ext, 
	                    md5: md5Mark,
	                    contentType:contentType
	                }, 
	                cache: false, 
	                crossDomain: true,
	                dataType: "json"
	            }).then(function(data, textStatus, jqXHR){
	                //todo 检查响应是否正常
	                task.resolve();
	                file.path = data.path;
	                UploadComlate(file);
	            }, function(jqXHR, textStatus, errorThrown){
	            	console.log('合并请求失败');
		        	console.log("jqXHR:"+jqXHR+"; textStatus:"+textStatus+"; errorThrown"+errorThrown);
	                task.reject();
	            });
	            return $.when(task);
	        }else{
	        	file.path = response.path;
	            UploadComlate(file);
	        }
	    }
	});
	
	var uploader = WebUploader.create({
		swf: path + "/webuploader/Uploader.swf",
		// 上传服务器路径
		server: backEndUrl, 
		// {Selector, Object} [可选] [默认值：undefined] 指定选择文件的按钮容器，不指定则不创建按钮
		pick: "#picker", 
		resize: false, 
		// {Selector} [可选] [默认值：undefined] 指定Drag And Drop拖拽的容器，如果不指定，则不启动
		dnd: dnd,
		// {Selector} [可选] [默认值：undefined] 指定监听paste事件的容器，如果不指定，不启用此功能。此功能为通过粘贴来添加截屏的图片。建议设置为document.body
		paste: document.body, 
		// {Selector} [可选] [默认值：false] 是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开
		disableGlobalDnd: true, 
		accept : typeof(accept) != 'undefined' ? accept : null,
		thumb: {
			width: 100
			, height: 100
			, quality: 70
			, allowMagnify: true
			, crop: true
			//, type: "image/jpeg"
		}, 
		// {Object} [可选] 配置压缩的图片的选项。如果此选项为false, 则图片在上传前不进行压缩
        compress: false, 
        // {Boolean} [可选] [默认值：false] 是否允许在文件传输时提前把下一个文件准备好。 对于一个文件的准备工作比较耗时，比如图片压缩，md5序列化。 如果能提前在当前文件传输期处理，可以节省总体耗时
		prepareNextFile: true,
		// {Boolean} [可选] [默认值：false] 是否要分片处理大文件上传
		chunked: true, 
		// {Boolean} [可选] [默认值：5242880] 如果要分片，分多大一片？ 默认大小为5M
		chunkSize: chunkSize,
		// {Boolean} [可选] [默认值：3] 上传并发数。允许同时最大上传进程数
		threads: true, 
		// {Object} [可选] [默认值：{}] 文件上传请求的参数表，每次发送都会发送此对象中的参数
		formData: function(){return $.extend(true, {}, userInfo);}, 
		// {int} [可选] [默认值：undefined] 验证文件总数量, 超出则不允许加入队列
		//fileNumLimit: 20, 
		// {int} [可选] [默认值：undefined] 验证单个文件大小是否超出限制, 超出则不允许加入队列
		fileSingleSizeLimit: 5000 * 1024 * 1024, 
		duplicate: true,
		auto : true
	});
	
	uploader.on("fileQueued", function(file){
		// $(dnd).append('<li id="'+file.id+'" style="background:#fff;position:absolute;top:0;left:160px;width:530px;height:35px;z-index:300;color:#ff8700;">' +
		// 		'<span class="fileName">'+file.name+'</span>' +
		// 		'<div class="percentage" style="display:inline-block;margin-left:50px;color:#ff8700;"></div>' +
		// '</li>');
		alert(file);
		/*$(dnd).append('<li id="'+file.id+'">' +
			'<img /><span class="fileName" title="file.name">'+file.name+'</span><span class="itemUpload">上传</span><span class="itemStop">暂停</span><span class="itemDel">删除</span>' +
			'<div class="percentage"></div>' +
		'</li>');
		var $img = $("#" + file.id).find("img");
		uploader.makeThumb(file, function(error, src){
			if(error){
				$img.replaceWith("<span>不能预览</span>");
			}
			$img.attr("src", src);
		});*/
	});
	
	uploader.on( 'uploadSuccess', function( file ) {
	    console.log('uploadSuccess');
	});
	uploader.on( 'uploadError', function( file , type ) {
		console.log('上传失败');
	    console.log(file);
	    console.log(type);
	});
	uploader.on( 'uploadComplete', function( file ) {
	    console.log('uploadComplete');
	});
	/*$(dnd).on("click", ".itemUpload", function(){
		uploader.upload();
        //"上传"-->"暂停"
        $(this).hide();
        $(".itemStop").show();
	});
	
	$(dnd).on("click", ".itemStop", function(){
	    uploader.stop(true);
	    //"暂停"-->"上传"
	    $(this).hide();
	    $(".itemUpload").show();
	});
	
	//todo 如果要删除的文件正在上传（包括暂停），则需要发送给后端一个请求用来清除服务器端的缓存文件
	$(dnd).on("click", ".itemDel", function(){
		uploader.removeFile($(this).parent().attr("id"));	//从上传文件列表中删除
	
		$(this).parent().remove();	//从上传列表dom中删除
	});*/
	
	// 上传过程中触发，携带上传进度
	uploader.on("uploadProgress", function(file, percentage){
		$("#" + file.id + " .percentage").text(Math.round(percentage * 100) + "%");
	});
	// 上传成功
	function UploadComlate(file){
	    console.log(file);
	    overallFileArray += file.path+"="+file.name+";";
	    $("#" + file.id + " .percentage").text("上传完毕");
	    $("#" + file.id).fadeOut(3000);
	    // 生成文件默认缩略图
	    //createFile(file.name,file.path);
	    //自定义上传回传方法
	    createFile(file);
	    //创建完附件取消layer
	    //$('.content').unlayer();
	    //$(".itemStop").hide();
	    //$(".itemUpload").hide();
	    //$(".itemDel").hide();
	}
	// 异常截获
	uploader.on('error', function(status) {
		if(status == 'F_EXCEED_SIZE'){
			console.log('上传文件超出限定大小');
			layer.alert("上传文件超过限定大小");
		};
	});
	// 上传至OSS
	function uploadToOSS(isUploadOss, callback) {
		
		if (typeof(isUploadOss) == 'undefined') {
			isUploadOss = true;
		}
		
		if ("" != overallFileArray && null != overallFileArray) {
			$.ajax({
				type : 'POST',
				timeout : 3600000,
				cache : false,
				url : uploadOssUrl,
				data : {
					fileArray:overallFileArray,
					ossFilePath:ossFilePath,
					isUploadOss:isUploadOss
				},
				success : function(rsp) {
					console.log(rsp);
					callback && callback(rsp);
					if (rsp != "failed") {
						console.log("上传OSS成功");
					} else {
						console.log("上传OSS失败");
					}
				},
				error : function(msg) {
					console.log("连接服务器异常！");
				}
			});
		}
	}
	
	//加layer
	// $("#picker").click(function(){
	// 	$(this).find("input[name=file]").change(function(){
	// 		var tempfile = $(this).val();
	// 		if(tempfile == null || tempfile == '' || tempfile.length == 0){
	// 			//点击了取消按钮
	// 			//do nothing
	// 		}
	// 		else{
	// 			$(".content").layer();
	// 		}
	// 	});
	// });