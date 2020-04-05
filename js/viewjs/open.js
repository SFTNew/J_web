var app = new Vue({
    el:"#PDX",
    data:{
        list:[],
        marketId:0,
        marketList:[],
        type:0,
        rows:10,
        page:1,
        status:0,
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
                console.log(data);
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
        cancelOrder:function (id){
            if(confirm("确定撤销吗？撤销后不可恢复！")){
                _jM.post("/trade/order/serverCancelOrder.o?orderId="+id, null, function(rs, data){
                    app.initLoad();
                }, function(rs){
                    alert("撤销失败");
                });
            }
        }
    },
    created:function(){
        this.initLoad();
        this.getMarketList();
    }
})