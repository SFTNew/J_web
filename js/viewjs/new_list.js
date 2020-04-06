var app = new Vue({
    el:"#DPX",
    data:{
        title:"",
        createTime:"",
        author:'',
        content:"",
    },
    methods:{
        getNew:function(id){
            _jM.post("/cms/article/articleById.m?articleId="+id, null, function(data){
                app.title = data.result.articleName;
                app.author = data.result.articleAuthor;
                app.createTime = data.result.createTime;
                app.content = data.result.articleContent;
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
        var id = _jM.getParam("id");
        this.getNew(id);
        this.isLogin();
    }
})