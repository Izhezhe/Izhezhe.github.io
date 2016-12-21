(function ($) {
    var layer = require('app/assets/libs/layer/layer');
    //require('app/assets/libs/showLoading/showLoading');
    var modifyPwd = {};
    modifyPwd.getQueryString = function (field, url) {
        var href = url ? url : window.location.href;
        var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
        var string = reg.exec(href);
        return string ? string[1] : null;
    };

    modifyPwd.checkSameOld = function () {
        var self = this;
        var flag = false;
        var Crypto = require('app/assets/libs/crypto/crypto'),
            crypto = new Crypto();
        var oldPwd = $('#oldPwd').val();
        var pwd = crypto.encrypt(oldPwd);
        var checkUrl = reqConfig.getInterface('checkPwd');
        $.ajax({
            url: checkUrl,
            type: 'post',
            async: false,
            data: pwd
        }).done(function (data) {
            if (data.code === 0) {
                flag = true;
            } else {
                $('#oldPwd').siblings('label').show().text('初始密码不正确');
            }
        });
        return flag;
    };
    modifyPwd.checkSameSure = function () {
        var newPwd = $('#newPwd').val();
        var surePwd = $('#surePwd').val();
        if (newPwd == surePwd) {
            $('#surePwd').siblings('label').hide();
            return true;
        } else if (surePwd == '') {
            $('#surePwd').siblings('label').hide();
        } else {
            $('#surePwd').siblings('label').show().text('两次输入密码不一致');
            return false;
        }
        return true;
    };
    modifyPwd.limit = function () {
        var reg = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,20}$/;
        var regnew = $("#newPwd").val();
        if (!reg.test(regnew)) {
            $('#newPwd').siblings('label').show().text('密码必须由6到20位数字、字母、字符组成');
            return false;
        } else {
            $('#newPwd').siblings('label').hide();
        }
        return true;
    }
    modifyPwd.checkForm = function () {

        var oldPwd = $.trim($("#oldPwd").val());
        if ('' == oldPwd) {
            $("#oldPwd").siblings("label").show();
            return false;
        } else {
            $("#oldPwd").siblings("label").hide();
        }
        var newPwd = $.trim($("#newPwd").val());
        if ('' == newPwd) {
            $("#newPwd").siblings("label").show();
            return false;
        } else {
            $("#newPwd").siblings("label").hide();
        }
        var surePwd = $.trim($("#surePwd").val());
        if ('' == surePwd) {
            $("#surePwd").siblings("label").show();
            return false;
        } else {
            $("#surePwd").siblings("label").hide();
        }

        return true;
    };
    modifyPwd.init = function () {
        var self = this;
        $('#oldPwd,#newPwd,#surePwd').focus(function () {
            $(this).siblings('label').hide();
        });
        $('#oldPwd').blur(function () {
            modifyPwd.checkSameOld();
        });
        $('#newPwd').blur(function () {
            modifyPwd.limit();
            modifyPwd.checkSameSure();
        });
        $('#surePwd').blur(function () {
            modifyPwd.checkSameSure();
        });
        $(document).on('click', '.input-sub', function () {
            if (!modifyPwd.checkForm() || !modifyPwd.checkSameOld() || !modifyPwd.limit() || !modifyPwd.checkSameSure()) {
                return false;
            }
           // $('.content-right').showLoading();
            var json = JSON.stringify({
                oldPassword: $('#oldPwd').val(),
                password: $('#newPwd').val()
            });
            var Crypto = require('app/assets/libs/crypto/crypto'),
                crypto = new Crypto();
            crypto.encrypt(json, function (cryptoModel) {
                self.doModify(cryptoModel);
            })
        });
    };
    modifyPwd.doModify = function (cryptoModel) {
        var postUrl = reqConfig.getInterface('changePwd');
        $.ajax({
            url: postUrl,
            type: 'post',
            data: cryptoModel
        }).done(function (data) {
            if (data.code === 0) {
                layer.alert("修改成功",
                    function () {
                        location.href = "./index";
                    });
            } else {
                layer.alert("发生错误，请稍后重试");
            }
           // $('.content-right').hideLoading();
        });
    }
    module.exports = modifyPwd;
})($);