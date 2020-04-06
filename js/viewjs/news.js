var app = new Vue({
    el:"#DPX",
    data:{
        list:[]
    },
    methods:{
        loadInit:function(){
            _jM.post("/cms/article/selectAllArticle.m?parentId=0&page=1&rows=10", null, function(rs, data){
                console.log(data);
                app.list = data.result;
            })
        },
        isLogin:function(){
            _jM.login.isLogin(function () {
                $("#login").show();
                $("#noLogin").hide();
                app.userInfo();
            }, function () {
                $("#noLogin").show()
            });
        },
    },
    created:function(){
        this.loadInit();
        this.isLogin();
    }
})