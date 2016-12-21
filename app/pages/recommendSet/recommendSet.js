
$=require("jquery");
var layer = require('app/assets/libs/layer/layer');
var tpl = require('view/recommendDot');
var app=function(){};

require('app/assets/libs/showloading/loading');
/*获取时间日期*/
app.prototype.recommendSetDate=function(){
	var that=this;
	var url=reqConfig.getInterface("recommendDate");
	 $('.public-main').showLoading();
	$.ajax({
		url:url,
		type: 'post',
		dataType: 'json',
	})
	.done(function(data) {
		if(data.code==0){
			var dateHtml=tpl.dateSet(data);
			$("#recomment-set-date").empty();
			$("#recomment-set-date").html(dateHtml);
			that.recommendSet();
		}
		$('.public-main').hideLoading();
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});	
}
/*根据日期获取数据*/
app.prototype.recommendSet=function(){
	var url=reqConfig.getInterface("recommendSet");
	var selectDate=$("#recomment-set-date option:selected").val();
	$.ajax({
		url:url,
		type: 'post',
		dataType: 'json',
		data:{releaseTime:selectDate},
	})
	.done(function(data) {
		if(data.code==0){
			var html=tpl.recommendCommentSet(data);
			$("#recommend-set").empty();
			$("#recommend-set").html(html);
		}
	})
	.fail(function(){
		console.log("error");
	})
	.always(function(){
		console.log("complete");
	});	
}

/*初始化*/
app.prototype.init=function(){
	var that=this;
	$(document).on("change","#recomment-set-date",function(){
		var dateDate=$("#recomment-set-date option:selected").val();
		var url=reqConfig.getInterface("recommendSet");
			$.ajax({
				url:url,
				type: 'post',
				dataType: 'json',
				data:{textDate:dateDate},
			})
			.done(function(data) {
				if(data.code==0){
					that.recommendSet();
				}
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});	
	});
	$(document).on("click","#recommend-set-edit",function(){
		var url="./addSet?releaseTime="+$("#recomment-set-date option:selected").val();
		window.location.href=url;
	});
	$(document).on("click","#recommend-set-delete",function(){
		var url=reqConfig.getInterface("recommendDelete");
		var releaseTime=$("#recomment-set-date option:selected").val();
		    layer.confirm('你确定删除该条记录嘛？', {
			  btn: ['确定','取消'] //按钮
			}, function(){
				$.ajax({
					url:url,
					type: 'post',
					dataType: 'json',
					data: {releaseTime: releaseTime},
				})
				.done(function(data) {
					if(data.code==0){
						$("#recommend-set").empty();
					}
					layer.msg('删除成功', {time:600,icon: 1});
					window.location.href="./recommendSet";
				})
				.fail(function(data) {
					console.log("error");
					layer.msg('网络出问题', {time:1000,icon: 1});
				})
			}, function(){
			});
	});
}

module.exports=app;