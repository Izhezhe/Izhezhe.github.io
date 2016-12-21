(function ($) {
    var layer = require('app/assets/libs/layer/layer');
    // require('app/assets/libs/showLoading/showLoading');
    var modifyPwd = {};

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
        //6-20数字字母字符

        return true;
    };
    modifyPwd.init = function () {
        var self = this;
        $('#newPwd,#surePwd').focus(function () {
            $(this).siblings('label').hide();
        });
        $('#newPwd').blur(function () {
            modifyPwd.limit();
            var newPwd = $('#newPwd').val();
            var surePwd = $('#surePwd').val();
            if (newPwd == surePwd) {
                $('#surePwd').siblings('label').hide();
            }
        });
        $('#surePwd').blur(function () {
            modifyPwd.checkSameSure();
        });
        $(document).on('click', '.input-sub', function () {
            if (!modifyPwd.checkForm() || !modifyPwd.limit() || !modifyPwd.checkSameSure()) {
                return false;
            }
            //$('.password').showLoading();

            var Crypto = require('app/assets/libs/crypto/crypto'),
                crypto = new Crypto();
            crypto.encrypt($('#newPwd').val(), function (cryptoModel) {
                self.doModify(cryptoModel);
            })
        });
    };
    modifyPwd.doModify = function (cryptoModel) {
        var postUrl = reqConfig.getInterface('modifyPwd');
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
            // $('.password').hideLoading();
        });
    }
    module.exports = modifyPwd;
})($);