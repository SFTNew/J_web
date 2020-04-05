var app = new Vue(
    {
        el:"#BUW",
        data:{
            secret:'',
            googleCode:'',
            vCode:''
        },
        methods:{
            getQrcode:function(){
                _jM.post("/platform/user/createGoogle.m", null, function(rs, data){
                    console.log(data);
                    var qrcode = new QRCode('qrcode', {
                        text: data.qrcode,
                        width: 256,
                        height: 256,
                        colorDark: '#000000',
                        colorLight: '#ffffff',
                        correctLevel: QRCode.CorrectLevel.H
                    });
                    app.secret = data.secret;
                })
            },
            verification:function(){
                var param = {
                    secret:this.secret,
                    googleCode:this.googleCode,
                    vCode:this.vCode
                }
                _jM.post("/platform/user/upGoogle.m", null, function(rs, data){
                        if(rs.statusCode == 0){
                            alert("绑定成功");
                        }else{
                            alert(rs.resultDesc);
                        }
                });
            },
            verificationCode:function(){

            }
        },
        created:function(){
            this.getQrcode();
        }
    }
)