/*响应式导航*/
$(function(){
    $(".list-x").on("click",function(){
        $(".menu-list").slideToggle();
    })
});

/*项目开发3d展示*/
$(function(){
    $(document).ready(function(){
        $(".project").hover3d({
            selector:".project__card",
            shine:true
        });
    });
});
/*设计作品3d展示*/
$(function(){
    var Tabs = function () {
        var toggler = $('.views-toggle');
        var tabs = $('li.tabs__item');
        var toggled = false;
        var transform = function (el, value) {
            el.css('transform', value);
            el.css('-webkit-transform', value);
            el.css('-ms-transform', value);
        };
        var transition = function (el, value) {
            el.css('transition', value);
            el.css('-webkit-transition', value);
            el.css('-ms-transition', value);
        };
        var moveContent = function () {
            if (!toggled) {
                toggled = true;
            } else {
                toggled = false;
            }
            moveTabs(toggled);
            return false;
        };
        var moveTabs = function (a) {
            var transY, scale;
            if (a) {
                tabs.css({
                    'opacity': '1',
                    'box-shadow': '0 30px 60px rgba(0,0,0,0.4)',
                    'cursor': 'pointer'
                });
                tabs.each(function (index) {
                    transY = index * 10;
                    scale = 0.5 + index / 25;
                    transform($(this), 'translate3d(0,' + transY + 'vh, 0) scale(' + scale + ')');
                });
                toggler.addClass('views-toggle--hidden');
            } else {
                transform(tabs, 'translate3d(0,0,0) scale(1)');
            }
        };
        var switchTabs = function () {
            var selected = $(this);
            var others = selected.siblings('li');
            if (toggled) {
                transition(others, 'transform 0.3s cubic-bezier(0.755, 0.05, 0.855, 0.06)');
                transform(others, 'translate3d(0, 100%, 0) scale(1)');
                transform(selected, 'translate3d(0,0,0) scale(1)');
                tabs.css({
                    'box-shadow': '0 30px 60px rgba(0,0,0,0.4)',
                    'cursor': 'default'
                });
                toggled = false;
                selected.on('transitionend webkitTransitionend', function () {
                    toggler.removeClass('views-toggle--hidden');
                    others.css({ 'opacity': '0' });
                    transform(others, 'translate3d(0, 100%, 0) scale(0)');
                    transition(others, 'transform 0.9s cubic-bezier(0.23, 1, 0.32, 1)');
                    selected.off('transitionend webkitTransitionend');
                });
            }
        };
        var setup = function () {
            toggled = true;
            moveTabs(toggled);
        };
        var init = function () {
            $(document).on('ready', setup);
            toggler.on('click touchstart', moveContent);
            tabs.on('click touchstart', switchTabs);
        };
        return { init: init };
    }();
    Tabs.init();
});
/*个人简介小图标点击事件*/
$(function(){
    var lis=$(".social>li");
        lis.hover(function()
        {
            $(this).addClass("active");
        },function(){
            $(this).removeClass("active");
        })
});
/*楼层跳转*/

$(function(){
    var ch = document.documentElement.clientHeight;
    var floor = $(".floor-lc");
    var floorArr=[];

    for (var i = 0; i <floor.length; i++)
    {
        floorArr.push(floor[i].offsetTop);
    }
    var flag = true;
    var item = $('.btn-lz');
    item.on("click",function(){
        flag=false;
        var index=$(this).index();
        var obj=document.body.scrollTop?document.body:document.documentElement;
        var scrollTop=obj.scrollTop;
        item.removeClass("active").eq(index).addClass("active");
        animate(document.documentElement,{scrollTop:floorArr[index]},function(){
            flag=true;
        });
        animate(document.body,{scrollTop:floorArr[index]},function(){
            flag=true;
        });
    });


    window.onscroll=function()
    {
        if (!flag) {
            return;
        }
        //获取当前滚轮滚动的距离
        var obj = document.body.scrollTop ? document.body : document.documentElement.scrollTop;
        var scrollTop = obj.scrollTop;
        //临界条件 可视窗口的高度+滚轮滚动的距离>=某个楼层的offsetHeight
        for (var i = 0; i < floorArr.length; i++){
            if (ch + scrollTop >1200)
            {
                //获取当前楼层下面的图片并且给它最佳路径floor[i]
                var progressBar= $('.progress-bar');
                console.log(progressBar.length);
                progressBar[0].className="progress-bar bar1";
                progressBar[1].className="progress-bar bar2";
                progressBar[2].className="progress-bar bar3";

            }
        }
    }
    
    
    
    
});
/*音乐图标点击事件*/
$(function(){
    var musicbtn=$(".website-audio");
    musicbtn.on("click",function(){
        $(this).toggleClass("active");
    })

});
$(function(){
    var audio=document.querySelector("audio");
    var play=document.querySelector(".website-audio");
    if(audio.duration==audio.currentTime){
        alert(1);
        audio.load();
        audio.play();
    }
    else
    {
        play.onclick=function()
        {
            if (audio.paused)
            {
                audio.play();
            }
            else{
                audio.pause();
            }
        }
    }

})