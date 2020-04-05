var app = new Vue({
    el:"#DPX",
    data:{
        list:[],
        marketId:0,
        marketList:[],
        type:0,
        rows:10,
        page:1,
        status:-1,
    },
    methods:{
        initLoad:function(){
            var param = {
                marketId:this.marketId,
                type:this.type,
                status:this.status,
                rows:this.rows,
                page:this.page
            }
            _jM.post("/trade/order/serverGetEntrustOrderList.o", param, function(rs, data){
                app.list = data.result;
            })
        },
        getMarketList:function (){
            _jM.post("/trade/order/getMarketList.o", null, function(rs, data){
                app.marketList = data;
            }, null);
        },
        getTitle:function(id){
            for(var i = 0;i<this.marketList.length;i++){
                if(id == this.marketList[i].id){
                    return this.marketList[i].title;
                }
            }
        },
        getStatus:function(status){
            switch(status){
                case 0:
                    return "交易中";
                case 1:
                    return "已成交";
                case 2:
                    return "已取消";
                case 3:
                    return "已取消";	
                }
                return "未知";
        }
    },
    created:function(){
        this.initLoad();
        this.getMarketList();
    }
})