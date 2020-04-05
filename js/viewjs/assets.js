var app = new Vue({
    el:'#DPX',
    data:{
        list:[]
    },
    methods:{
        initLoad:function(){
            _jM.post("/trade/finance/serverGetUserAccountList.o", null, function(rs, data){
                console.log(data);
                app.list = data;
            });
        }
    },
    created:function(){
        this.initLoad();
    }
})