(function ($) {
	var tpl = require('app/pages/commentDetails/view/tpl');
	var $ = require('jquery');
	var layer = require('app/assets/libs/layer/layer');
	require('app/assets/libs/nicescroll/nicescroll');
    require('app/assets/libs/showloading/loading');


    var app = function(){};

    app.getQueryString = function (field, url) {
        var href = url ? url : window.location.href;
        var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
        var string = reg.exec(href);
        return string ? string[1] : null;
    };

    app.loadScore = function () {
	    var self = this;
	    //查询打分项
	    var caseId = app.getQueryString('caseId');
	    var url = reqConfig.getInterface('assessGetScoreReason');      
	    // $('.layout-rig').showLoading();
	    $.ajax({
	        url: url,
	        type: 'get',
	        data: {
	            caseId:caseId
	        },
	    }).done(function (data) {
	        // $('.layout-rig').hideLoading();
	        var html = tpl.right(data.data.scoreReason); 
	        $('#content_right').html(html);

	        //增加模拟滚动效果
            $("#content_score").niceScroll("#content_scroll",{cursorcolor:"#949494"});
	    });  
	};

	app.loadCase = function () {

	    var self = this;
	    //查询打分项
	    var caseId = app.getQueryString('caseId');
	    var url = reqConfig.getInterface('assessGetCaseInfo');      
	    $('.layout-rig').showLoading();
	    $.ajax({
	        url: url,
	        type: 'get',
	        data: {
	            caseId:caseId
	        },
	    }).done(function (data) {
	        $('.layout-rig').hideLoading();
	        var html = tpl.left(data.data.caseInfo); 
	        $('#content_left').html(html);
	    }); 
	    $(document).on('click','.goback',function(){
	    	window.location.href = './viewComment?id='+caseId;
	    }) 
	};
    //加载评论
    app.loadComment = function (caseId) {

        var caseId = app.getQueryString('caseId');
        var url = reqConfig.getInterface('assessGetCaseComments'); 
        $.ajax({
            url: url,
            type: 'get',
            data: {
                caseId:caseId
            },
        }).done(function (data) {
            var html = tpl.comment(data.data);
            $('.content_comment').html(html);
            
            // $('.layout-rig').hideLoading();
        });    
    };
	///加载打分项效果
	app.start = function(){        
		$(document).ready(function() {

			$(document).on("click",".score_tit",function(){
    		
                if(!$(this).siblings('.score_list').is(':visible')) {                   
                    $('.score_list').hide();
                    $('.score_tit').children('i').removeClass('icon_down').addClass('icon_up');
                    $(this).siblings('.score_list').slideDown("fast");
                    $(this).find('i').removeClass('icon_up').addClass('icon_down');

                } else {
                    $(this).siblings('.score_list').slideUp("fast");
                    $(this).find('i').removeClass('icon_down').addClass('icon_up');

                }
    			
    		});
		});
	};

	module.exports = app;

 })($);