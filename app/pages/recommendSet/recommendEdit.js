(function($){
 
    var addSet = {};
    var layer = require('app/assets/libs/layer/layer');
    var laypage = require('app/assets/libs/laypage/index');
    var datePicker = require('app/assets/libs/datePicker/timer');
    require('app/assets/libs/showloading/loading');
    var caseActivityCaseListUrl = reqConfig.getInterface('caseActivityCaseList');
    var recommendEditUrl = reqConfig.getInterface('recommendEdit');

    var tpl = require('view/selectDot_tpl');

    recommendEdit.getQueryString = function (field, url) {

        var href = url ? url : window.location.href;
        var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
        var string = reg.exec(href);
        return string ? string[1] : null;

    };


    recommendEdit.init = function(page,keywords){

        var self = this;
        var  releaseTime =   self.getQueryString('releaseTime');
        console.log(releaseTime);
         $('.public-main').showLoading();
        $.ajax({
                url:caseActivityCaseListUrl,
                type:'post',
                dataType:'json',
                data:{
                    releaseTime:releaseTime
                }
            }).done(function (data) {
                var list = data.data;
                for(var i=0;i<list.length;i++){
                    if(list.seq == 1){
                        $('#block1').find('.select-result').show();
                        $('#block1').find('.case_id').data("id",list.caseId);
                        $('#block1').find('.case_name').text(list.wsCase.caseNo);
                        $('#block1').find('.case_no').text(list.wsCase.title);
                    }         
                    else if(list.seq == 2){
                        $('#block2').find('.select-result').show();
                        $('#block2').find('.case_id').data("id",list.caseId);
                        $('#block2').find('.case_name').text(list.wsCase.caseNo);
                        $('#block2').find('.case_no').text(list.wsCase.title);
                    }           
                    else if(list.seq == 3){
                        $('#block3').find('.select-result').show();
                        $('#block3').find('.case_id').data("id",list.caseId);
                        $('#block3').find('.case_name').text(list.wsCase.caseNo);
                        $('#block3').find('.case_no').text(list.wsCase.title);
                    }        
                    else if(list.seq == 4){
                        $('#block4').find('.select-result').show();
                        $('#block4').find('.case_id').data("id",list.caseId);
                        $('#block4').find('.case_name').text(list.wsCase.caseNo);
                        $('#block4').find('.case_no').text(list.wsCase.title);
                    }            
                    else if(list.seq == 5){
                        $('#block5').find('.select-result').show();
                        $('#block5').find('.case_id').data("id",list.caseId);
                        $('#block5').find('.case_name').text(list.wsCase.caseNo);
                        $('#block5').find('.case_no').text(list.wsCase.title);
                    }
                }
                 $('.public-main').hideLoading();

            });


        $("#case-set-time").datetimepicker();
    }
    recommendEdit.selectList = function(page,keywords){
            var self = this;
        $(document).on('click','.case-set-button',function(){
            var that = this;
            $('.public-mask').show();
            $('.public-box').show();
            var startDate = $('#startTime').val();
            var endDate = $('#endTime').val();
           $('.public-main').showLoading();
            $.ajax({
                url:caseActivityCaseListUrl,
                type:'post',
                dataType:'json',
                data:{
                    pageNumber:(page || self.curr),
                    keywords:keywords,
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
                            self.selectList(self.curr);
                        }
                    }
                }); 
                $('.public-main').hideLoading();
            }); 

            $(document).off('click','.selectDot');    // 对同一类元素绑定后，一定要解绑
            $(document).on('click','.selectDot',function(event){
          
                var parentNode = $(this).parents('tr');
                var caseName = $(parentNode).find('.case_nameDot').text();
                var caseNo = $(parentNode).find('.case_noDot').text();
                var caseId = $(parentNode).data('id');
                $(that).siblings('.select-result').show();
                $(that).siblings('.select-result').find('.case_name').text(caseName);
                $(that).siblings('.select-result').find('.case_no').text(caseNo);
                $(that).siblings('.select-result').find('.case_id').data("id",caseId);

                var indexOut =  $(that).parents('.block').index();

                console.log('up:' + indexOut);
                $('.case_id').each(function(){
                    var indexInner =  $(this).parents('.block').index();
                    if(indexOut != indexInner ) {
                        if($(this).data('id') == caseId){
                            layer.confirm("该条数据已经被选过了!",function(){
                                 $('.layui-layer-shade').hide();
                                $('.layui-layer').hide(); 
                            })
                        }
                    }
                })

                $('.public-mask').hide();
                $('.public-box').hide();
            })   
            $(document).off('click','.delete');   // 对同一类元素绑定后，一定要解绑
            $(document).on('click','.delete',function(event){

                $(this).parents('.select-result').find('.case_name').text('');
                $(this).parents('.select-result').find('.case_no').text('');
                $(this).parents('.select-result').hide();   
            })
            $('span.close').click(function(){
                $('.public-mask').hide();
                $('.public-box').hide();
            })
        })

    } 

    recommendEdit.save = function(){

       $(document).on('click','#commit',function(){

        var oneId = $('.first').data('id');
        var twoId = $('.second').data('id');
        var thirdId = $('.third').data('id');
        var fouthId = $('.fourth').data('id');
        var fifthId = $('.fifth').data('id');

        var releaseTime = $('#case-set-time').val();
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
    
    recommendEdit.search = function(){
        var self = this;
        var keywords = $('.search').val();
        self.selectList(1,keywords);
    }
    $('#startTime').datetimepicker();
    $('#endTime').datetimepicker();
    module.exports = addSet;

 })($);





