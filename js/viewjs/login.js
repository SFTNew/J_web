var app = new Vue({
    el:"#BUW",
    data:{
        vshow_password:false,
        vshow_mobile:false,
        vshow_validateCode:false,

        msg_mobile:"",
        msg_password:"",
        msg_validateCode:"",

        validateCode:"",
        mobile:"",
        password:"",
    },
    methods:{ 
        login:function(){
            
            if(!this.vshow_mobile&& !this.vshow_password){
                var params = {
                    mobile: this.mobile,
                    password: this.password,
                    validateCode: this.validateCode
                } 
                $.post("/platform/user/login.m", params, function(data){
                    console.log(data);
                    _jM.login.getLogin(function(user){
                        // if(user.status==1){// 有效用户
                            //检查注册信息是否完善
                            if("null" == user.userName || _jM.validate.isEmpty(user.userName)){
                                window.location.href="security.html";
                            } else {
                                // 获取返回地址
                            var backURL= _jM.getParam("backURL");
                            if(_jM.validate.isNotEmpty(backURL)){
                                window.location.href=backURL;
                            }else{
                                window.location.href="/index.html#ho";
                            }
                        }
                        // }else{
                        //     alert("当前用户已冻结");
                        // }
                    });
                });
            }
        },
        flushValidateCodeImgLogin:function(){
            $("#validateCodeImgLogin").attr("src", "/platform/user/getValidateCodeImg.m?t=" + Math.random());
        },
        blur_mobile:function(){
            if(_jM.validate.isEmpty(this.mobile)){
                this.vshow_mobile = true;
                this.msg_mobile = "手机号不能为空";
            }else if(!/^1(3|4|5|7|8|9)\d{9}$/.test(this.mobile)){
                this.vshow_mobile = true;
                this.msg_mobile = "手机号格式错误";
            }else{
                this.vshow_mobile = false;
            }
        },
        blur_password:function(){
            if(_jM.validate.isEmpty(this.password)){
                vshow_password = true;
                this.msg_password = "密码不能为空";
            }else if(!_jM.validate.isLengthBetween(this.password,6,15)){
                vshow_password = true;
                this.msg_password = "密码长度应该在6-15";
            }else{
                vshow_password = false;
            }
        }
    },
    created:function(){
        $("#validateCodeImgLogin").attr("src", "/platform/user/getValidateCodeImg.m?t=" + Math.random());
    }
})

/**
 * 刷新图片验证码
 */
