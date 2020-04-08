var app = new Vue({
    el:'#DPX',
    data:{
        buyPrice:0,
        buyNumber:0,
        buyTotal:0,
        sellPrice:0,
        sellNumber:0,
        sellTotal:0,
        canUseKRW:0,
        canUseCoin:0,
        nowPrice:0,
        buyList:[],//买入委托记录
        sellList:[],//卖出委托
        tradeList:[],//成交记录
        orderList:[],//个人委托
        marketList:[],//市场列表
        market:{},  //当前市场
    },
    methods:{
        //下单
        createOrder:function(obj,type){
            var param = {}
            param.marketId = this.market.tradeMarket.id;
            param.type = type;
            if(type == 1){
                param.price = this.buyPrice;
                param.number = this.buyNumber;
            }else{
                param.price = this.sellPrice;
                param.number = this.sellNumber;
            }
            $(obj).attr('disabled', 'disabled');

            _jM.post("/trade/order/serverCreateOrder.o", param, function (rs, data) {
                alert("下单成功");
                app.clearData();
                $(obj).removeAttr('disabled');
            },function(rs){
                $(obj).removeAttr('disabled');
                if(rs.statusCode == 1000){
                    alert("请先您登陆后在下单");
                }else if (rs.statusCode == 2000) {
                    alert("参数设置有误，请检查价格与数量，交易密码！");
                } else if (rs.statusCode == 3002) {
                    alert("交易密码错");
                } else if (rs.statusCode == 2001) {
                    alert("不在交易时间范围内！");
                } else if (rs.statusCode == 2002) {
                    alert(rs.resultDesc);
                } else if (rs.statusCode == 2003) {
                    alert("交易金额超出最大单笔交易范围！");
                } else if (rs.statusCode == 2004) {
                    alert("当前系统繁忙，请稍后再试！");
                } else if (rs.statusCode == 2005) {
                    alert("系统升级中，请稍后再试！");
                } else if (rs.statusCode == 2006) {
                    alert("系统已经达到最大涨跌幅，禁止交易。");
                } else if (rs.statusCode == 3000) {
                    alert("用户余额不够，请充值后再试！");
                } else if (rs.statusCode == 3001) {
                    alert("用户账户状态被冻结，不能完成下单！");
                } else if (rs.statusCode == 3003) {
                    alert("当前商品不可交易！");
                }else if(rs.statusCode == 3004){
                    alert("不在交易时间范围内！");
                }else if (rs.statusCode == 1) {
                    alert(rs.resultDesc);
                }
            });

        },
        //取消下单
        cancelOrder:function(serialNumber){
            var serialNumber = serialNumber;
            if (confirm("确定撤销吗？撤销后不可恢复！")) {
                _jM.post("/trade/order/serverCancelOrder.o?orderId=" + serialNumber, null, function (rs, data) {
                    // layer.msg("撤销成功！");
                    // getUserRelevant();
                }, function (rs) {
                    // layer.msg("撤销失败，" + rs.resultDesc, {icon: 2});
                    // $(obj).attr('onclick', 'cancelOrder(' + obj + ',' + serialNumber + ')');
                });
            }
        },
        //获取订单
        getOrders:function(){
            _jM.post("/trade/order/serverGetEntrustOrderList.o?rows=10&page=1&marketId=" + this.marketId + "&status=-1", null, function (rs, data) {
                if (data != null) {
                    app.orderList = data;
                }
            });
        },
        //获取市场列表
        getmarketList:function(){
            _jM.post("/platform/trade/getMarketList.m", null, function (rs, data) {
                if (data != null && data.length > 0) {
                    console.log(data);
                    app.marketList = data;
                    app.indexMarket(data[0]);
                }
            });
        },
        //选择当前市场
        indexMarket:function(item){
            this.market = item;
            this.getUserAccount();
            this.getTurnoverOrderList();
            this.getDepth(); 
            this.getEntrustOrderList();
            this.getMarketCurrentPrice();
            initSocket();
        },
        //获取用户账户
        getUserAccount: function(){
            // alert(JSON.stringify(this.market));
            _jM.post("/trade/finance/serverGetUserAccount.o?marketId=" + this.market.tradeMarket.id, null, function (rs, data) {
                if (data != null) {
                    app.canUseKRW = data.buyAmount;
                    app.canUseCoin = data.sellAmount;
                }
            });
        },
        getEntrustOrderList:function(){
            _jM.post("/trade/order/serverGetEntrustOrderList.o?rows=20&page=1&marketId=" + this.market.tradeMarket.id + "&status=-1", null, function (rs, data) {
                if (data != null) {
                    app.orderList = [];
                    app.orderList.push(...data.result);
                    // alert(JSON.stringify(app.orderList))
                }
            });
        },
        getMarketCurrentPrice:function () {
            _jM.post("/trade/data/getNewest.o?marketId=" +this.market.tradeMarket.id, null, function (rs, data) {
                if (data != null) {
                    console.log(data);
                }
            })},
        //获取成交记录
        getTurnoverOrderList:function() {
            _jM.post("/trade/order/getTurnoverOrderList.o?marketId=" + this.market.tradeMarket.id, null, function (rs, data) {
                if (data != null) {
                    app.tradeList = data;
                    
                }
            });
        },
        clearData:function(){
            this.buyPrice = 0;
            this.sellPrice = 0;
            this.buyNumber = 0;
            this.sellNumber = 0;
            this.buyTotal = 0;
            this.sellTotal = 0;
        },
        //计算涨跌幅
        getzdf:function(item){
            if(item.newest!=null){
                return this.keepTwoDecimalFullss((item.newest.closePrice-item.tradeMarket.closePrice)/item.tradeMarket.closePrice*100);
            }else{
                return 0;
            }
        },
        //保留小数
        keepTwoDecimalFullss:function (num) {
            var result = parseFloat(num);
            if (isNaN(result)) {
//                alert('传递参数错误，请检查！');
                return "0.00";
            }
            result = Math.round(num * 100) / 100;
            var s_x = result.toString();
            var pos_decimal = s_x.indexOf('.');
            if (pos_decimal < 0) {
                pos_decimal = s_x.length;
                s_x += '.';
            }
            while (s_x.length <= pos_decimal + 2) {
                s_x += '0';
            }
            return s_x;
        },
        tradeTime:function(item){
            var date = new Date(item.createTime);
            // if(date.getUTCFullYear() != now.getUTCFullYear() || date.getUTCDay() != now.getUTCDay()
            //     || date.getUTCMonth() != now.getUTCMonth()
            // ){
            //     break;
            // }
            var hours = date.getHours()<10?'0'+date.getHours():date.getHours();
            var minetes = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
            var seconds = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
            return hours+":"+minetes+":"+seconds;
        },
        isToday:function(item){
            var now = new Date();
            var date = new Date(item.createTime);
            if(date.getUTCFullYear() != now.getUTCFullYear() || date.getUTCDay() != now.getUTCDay()
                || date.getUTCMonth() != now.getUTCMonth()
            ){
                return false;
            }
            return true;
        },
        //获取买一卖一列表
		getDepth:function() {
			_jM.post("/trade/order/getEntrustOrderList.o?limit=6&marketId="+this.market.tradeMarket.id, null, function(rs, data) {
                var data = JSON.parse(rs.resultDesc);
                app.buyList = data.buys;
                app.sellList = data.sells;
			}, null);
        },
        isLogin:function(){
            _jM.login.isLogin(function () {
                $("#login").show();
                $("#noLogin").hide();
            }, function () {
                $("#noLogin").show()
            });
        },
        validateInput:function (obj){
            var val = parseFloat($(obj).val());
        
            if(val < 0){
                $(obj).val(0);
            }
            if($(obj).val().indexOf("0") == 0 && $(obj).val() >= 1){
                $(obj).val(val);
            }
        },
        
        validatNumber:function (obj,type) {
            if(type==2){
                obj.value = obj.value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
                obj.value = obj.value.replace(/^\./g, ""); //验证第一个字符是数字
                obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
                obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3'); //只能输入两个小数
            }else{
                obj.value = obj.value.replace(/[^\d]/g, ""); //清除"数字"和"."以外的字符
                
            }
        },
        
        validatNull:function (obj) {
            if (obj.value == null || obj.value == "") {
                layer.tips("请输入数据", obj);
            }
        },
        total:function(type){
            if(type ==1){
                this.buyTotal = this.buyNumber * this.buyPrice;
            }else{
                this.sellTotal = this.sellNumber * this.sellPrice;
            }
        }
    },
    created:function(){
        this.isLogin();
        this.getmarketList();
    }
})

var socket;
var depthLastTime = null;

function initSocket(){
   
    socket && socket.connected && socket.close();
    console.log("初始化socket");
    socket = socket = io("ws://47.75.63.29:9092/?market=" + app.market.tradeMarket.id+"&userSession="+_jM.getCookie("szxzjx.cn"), {transports: ["websocket", "pull"],reconnect: false,forceNew: true});
    socket.on('ok', function (data) {
        console.log("链接成功");
    });
    socket.on('depth', function (data) {
        console.log("收到下单");
        var data = JSON.parse(data);
        if (depthLastTime != null && data.time < depthLastTime) {
            return;
        }
        app.buyList = [];
        app.sellList = [];
        app.sellList.push(...data.sells);
        app.buyList.push(...data.buys);
        
    });

    socket.on('tunoverOrder', function (data) {
        console.log("收到成交单");
        var json = JSON.parse(data);
        data = json.tunoverOrder;
        app.tradeList = [];
        app.tradeList.push(...data);
    });

    socket.on('clean', function (data) {
        //系统清理委托单完成的时候 统一刷新页面
        app.buyList.length = 0;
        app.sellList.length = 0;
    });

    socket.on('user', function (data, time) {
        console.log("收到用户更新");
        app.getEntrustOrderList();
        app.getUserAccount();
    });
    socket.on('disconnect', function () {
        socket = socket = io("ws://47.75.63.29:9092/?market=" + app.market.tradeMarket.id+"&userSession="+_jM.getCookie("szxzjx.cn"), {transports: ["websocket", "pull"]});
    });
}