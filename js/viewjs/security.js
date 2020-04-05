var app = new Vue({
    el:'#DPX',
    data:{
        username:'',
        uid:'',
        mobile:'',
    },
    methods:{
        userInfo:function(){
            _jM.post("/platform/user/serverGetUser.m", null, function(rs, data){
                // var phone = data.mobile.substr(4);
                //+"&nbsp;&nbsp;"+phone.substr(0,3)+"****"+phone.substr(7);
                app.username = data.userName;
                app.uid = data.id;
                app.mobile = data.mobile;
            })
        }
    },
    created:function(){
        this.userInfo();
    }
})