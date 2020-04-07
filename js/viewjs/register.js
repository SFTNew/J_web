var app = new Vue({
    el: "#BUW",
    data: {
        vshow_account: false,
        vshow_password: false,
        vshow_mobile: false,
        vshow_validateCode: false,
        vshow_repassword: false,
        vshow_sms: false,

        msg_account: "",
        msg_mobile: "",
        msg_password: "",
        msg_validateCode: "",
        msg_repassword: "",
        msg_sms: "",

        account: "",
        validateCode: "",
        mobile: "",
        password: "",
        repassword: "",
        sms: "",

        countDowm: -1,
    },
    methods: {
        sendSms: function () {
            if (this.countDowm > 0) {
                return;
            }

            if (this.mobile.length == 0) {
                alert("手机号码不能为空")
                return;
            }
            if (this.validateCode.length == 0) {
                alert("图片验证码不能为空")
                return;
            }
            var areaCode = document.getElementById("codeSelect").value;
            var params = {
                mobile: areaCode + "|" +this.mobile,
                validateCodeImg: this.validateCode
            }

            console.log(params)
            $.post("/platform/user/validateSendSms.m", params, function (data) {
                if(data.statusCode === "0") {
                    app.countDowm = 60;
                    var countDownInterval = window.setInterval(function () {
                        app.countDowm--;
                        if (app.countDowm < 0) {
                            app.countDowm = -1;
                            window.clearInterval(countDownInterval);
                        }
                    }, 1000);
                }
            });
        },
        register: function () {
            console.log("----register")

            if (this.account.length == 0) {
                alert("用户名不能为空")
                return;
            }
            if (this.mobile.length == 0) {
                alert("手机号码不能为空")
                return;
            }
            if (this.sms.length == 0) {
                alert("短信验证码不能为空")
                return;
            }
            if (this.password.length == 0) {
                alert("密码不能为空")
                return;
            }
            if (this.repassword.length == 0) {
                alert("确认密码不能为空")
                return;
            }

            if (this.repassword !== this.password) {
                alert("两次密码不相同")
                return;
            }

            var areaCode = document.getElementById("codeSelect").value;
            var params = {
                mobile: areaCode + "|" +this.mobile,
                password: this.password,
                repassword: this.repassword,
                validateCode: this.sms
            };
            $.post("/platform/user/regist.m", params, function (data) {
                console.log(data);
                if(data.statusCode === "0") {
                    alert("注册成功")
                    window.location.href="login.html";
                }
            });

        },
        flushValidateCodeImgLogin: function () {
            $("#validateCodeImgLogin").attr("src", "/platform/user/getValidateCodeImg.m?t=" + Math.random());
        },
        blur_account: function () {
            if (_jM.validate.isEmpty(this.account)) {
                this.vshow_account = true;
                this.msg_account = "用户名不能为空";
            } else if (!_jM.validate.isLengthBetween(this.account, 6, 16)) {
                this.vshow_account = true;
                this.msg_account = "用户名长度应该在6-16";
            } else {
                this.vshow_account = false;
            }
        },
        blur_mobile: function () {
            if (_jM.validate.isEmpty(this.mobile)) {
                this.vshow_mobile = true;
                this.msg_mobile = "手机号不能为空";
            } else {
                this.vshow_mobile = false;
            }
        },
        blur_sms: function () {
            if (_jM.validate.isEmpty(this.sms)) {
                this.vshow_sms = true;
                this.msg_sms = "短信验证码不能为空";
            } else {
                this.vshow_sms = false;
            }
        },
        blur_password: function () {
            if (_jM.validate.isEmpty(this.password)) {
                this.vshow_password = true;
                this.msg_password = "密码不能为空";
            } else if (!_jM.validate.isLengthBetween(this.password, 6, 15)) {
                this.vshow_password = true;
                this.msg_password = "密码长度应该在6-15";
            } else {
                this.vshow_password = false;
            }
        },
        blur_repassword: function () {
            if (_jM.validate.isEmpty(this.repassword)) {
                this.vshow_repassword = true;
                this.msg_repassword = "密码不能为空";
            } else if (!_jM.validate.isLengthBetween(this.repassword, 6, 15)) {
                this.vshow_repassword = true;
                this.msg_repassword = "密码长度应该在6-15";
            } else {
                this.vshow_repassword = false;
            }
        }
    },
    computed: {
        sendSmsText: function () {
            return this.countDowm > 0 ? (this.countDowm + "s") : "发送验证码";
        }
    },
    created: function () {
        $("#validateCodeImgLogin").attr("src", "/platform/user/getValidateCodeImg.m?t=" + Math.random());
    }
})

/**
 * 刷新图片验证码
 */
