(function($){

	var editComment = {};
    var layer = require('app/assets/libs/layer/layer');
    var laypage = require('app/assets/libs/laypage/index');
    var approveListUrl = reqConfig.getInterface('approveEdit');
    var tpl = require('view/editComment_tpl');

    var approveSaveUrl = reqConfig.getInterface('approveSave');
    // var tpl = require('view/allComment_tpl');
    var jumpUrl = reqConfig.getInterface('allComment');

	editComment.getQueryString = function (field, url) {
        var href = url ? url : window.location.href;
        var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
        var string = reg.exec(href);
        return string ? string[1] : null;
    };
    editComment.appearEdit = function(){
    	var editId = this.getQueryString('id');
        var self = this;
        $.ajax({
            url: approveListUrl,
            type:'post',
            dataType:'json',
            data: {
                id:editId
            }
        }).done(function (data) {
           	var html = tpl.toEdit(data.data);
           $('.public-content').html(html);
        });      
    };
    editComment.init = function(){
    	this.appearEdit();
    }


    editComment.back = function(){
    	var self = this;
    	$(document).on('click','.submit-button',function(){   		
    		var editId = self.getQueryString('id');
    		var comments = $('.edit-comment textarea').val();
	    	$.ajax({
	            url: approveSaveUrl,
	            type:'post',
	            dataType:'json',
	            data: {
	                id:editId,
	                comments:comments
	            }
	        }).done(function (data) {
	        	console.log(data.code);
	           if(data.code == 0)  {
                    var parent = editComment.getQueryString('parent');
                    if(parent == 0){
                       window.location.href = './allComment'; 
                   }else if(parent == 1){
                        window.location.href = './waitComment';
                   }else if(parent == 2) {
                        window.location.href = './overComment';
                   }
	           		
	           }
	        });
    	})


    }
    module.exports = editComment;

})($);



