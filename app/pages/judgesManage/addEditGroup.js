(function ($) {
    var activity ={
        curr: 1
    };
    var layer = require('app/assets/libs/layer/layer');
    var laypage = require('app/assets/libs/laypage/index');
    var url = reqConfig.getInterface('addEditGroupList');
    var groupNameUrl = reqConfig.getInterface('groupName');
    var submitUrl = reqConfig.getInterface('submitGroup');
    require('app/assets/libs/showloading/loading');
    var uplodePic = reqConfig.getInterface('uploadPic');

    var tpl = require('view/tpl');
    //获取id
    activity.getQueryString = function (field, url) {
        var href = url ? url : window.location.href;
        var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
        var string = reg.exec(href);
        return string ? string[1] : null;
    };
    activity.list = function(page,keywords){
        var self = this;
        if(self.getQueryString('id')){
            $('.up-load-result').show();
        }
        $('.public-main').showLoading();
         $.ajax({
            url:url,
            type:'get',
            dataType:'json',
            data:{
                pageNumber: (page || self.curr),
                keywords: keywords,
                id: activity.getQueryString('id')
            }
        }).done(function (data) {
            var html = tpl.addEeditGroup(data.data.userList);
            $('.public-table-area').html(html);
            $('.condition').attr('id',data.data.group.id);
            $('.condition').val(data.data.group.name);
            $('#picName').attr('src',data.data.group.headPic);
            $('#intPic').val(data.data.group.headPic);
            //判断组名是否存在
            self.groupName(data.data.group.name);
            // 判断是否是组长
            self.selectLeader(data.data.group.leaderUserId);
            $('.public-main').hideLoading();
            $('.control span em').on('click',function(){
                $(this).toggleClass('on');
            });
            // 组长选中时，同时让组员选中
            $('.selectLeader>em').on('click',function(){
                if($(this).hasClass('on')){
                    $(this).parent().siblings('span').children('em').addClass('on');
                }
            })
            // 限制组长只能选一个
            $('.control').each(function(){
                $(this).children().eq(1).children('em').each(function(){
                    $(this).on('click',function(){
                        if($(this).hasClass('on')){
                            var sib = $(this).parent().parent().parent().siblings();
                            sib.splice(0,1);
                            $.each(sib,function(){
                                $(this).each(function(){
                                    $(this).children().children().eq(2).children('em').each(function(){
                                        $(this).removeClass('on');
                                    })
                                })
                            })
                        };
                    })
                })
            });


        });
    };
    activity.selectLeader = function(leaderUserId){
        $('.selectLeader').each(function(){
            if(leaderUserId == $(this).parent().attr('id')){
                $(this).children().addClass('on');
            }
        })
    }
    activity.groupName = function(groupName){
        //判断组名是否存在
        $('.condition').on('keyup',function(){
            var name = $('.condition').val();
            if(name != groupName){
                console.log(name);
                $.ajax({
                    url:groupNameUrl,
                    type:'post',
                    dataType:'json',
                    data:{
                        "name":name //组名
                    }
                }).done(function (data) {
                    if(data.code == 0){
                        
                    }else{
                        layer.alert('组名已存在');
                    }
                });
            }
        });
    };
    activity.submitGroup = function(){
        var self = this;
        $('.edit-group-submit>input').on('click',function(){
            var userid = [];
            var leaderid = "";
            $('.control').each(function(){
                if($(this).children().eq(0).children('em').hasClass('on')){
                    userid.push($(this).attr('id'));
                }
                if($(this).children().eq(1).children('em').hasClass('on')){
                    leaderid = $(this).attr('id');
                }
            });
            if($('.condition').val() == ''){
                layer.alert('请输入组名');
                return false;
            } else if($('#intPic').val() == '') {
                 layer.alert('请上传用户头像！');
                return false;
            }else{
                // 新增编辑提交
                $.ajax({
                url:submitUrl,
                type:'get',
                dataType:'json',
                data:{
                    "id": $('.condition').attr('id'), //组id
                    "userid": userid.join(','), //指派id
                    "leaderid": leaderid, //组长id
                    "name": $('.condition').val(), //组名
                    "picLink":$('.condition_link').val(),
                    "headPic":$('#intPic').val() //上传的图片
                    }
                }).done(function (data) {
                    if(data.code == 0){
                        window.location.href = './judgesGroup';
                    }else{
                        layer.alert('提交失败');
                    }
                });
            }
        });
    }
    activity.search = function(){
        var self = this;
        var keywords = $('#search').val();
        self.list(1,keywords);
    };
    activity.checkout = function(){
       $(document).on("blur",".condition_link",function(){
             var conUrl = $('.condition_link').val();
             var urlRule = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
            console.log(conUrl);
            if(!urlRule.test(conUrl)) {layer.alert("请输入正确格式的URL(如:https://www.baidu.com)！");return;}
       })
       
    };
    
    activity.initUploadPic = function () {        
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


        //删除图片
        $(document).on('click', '#dalePic', function(){
            layer.confirm('确定删除？',function(){
                layer.alert('删除成功！');
                $('#picName').attr('src','');
                $("#intPic").val('');
                $('.up-load-result').hide();
            });

        });
    }
    if(activity.getQueryString('id')){
        $('.select a').text('编辑小组');
    }else{
        $('.select a').text('创建小组');
    }
    module.exports = activity;
})($);