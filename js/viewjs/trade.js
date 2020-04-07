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
                    app.orderList = data.result;
                    // alert(JSON.stringify(app.orderList))
                }
            });
        },
        //获取成交记录
        getTurnoverOrderList:function() {
            _jM.post("/trade/order/getTurnoverOrderList.o?marketId=" + this.market.tradeMarket.id, null, function (rs, data) {
                if (data != null) {
                    app.tradeList = data;
                    
                }
            });
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
    },
    created:function(){
        this.isLogin();
        this.getmarketList();
    }
})

// $(function(){
//     socket && socket.connected && socket.close();
//     socket = socket = io("ws://47.75.63.29:9092/?market=" + market.id+"&userSession="+_jM.getCookie("szxzjx.cn"), {transports: ["websocket", "pull"],reconnect: false,forceNew: true});
//     socket.on('ok', function (data) {
//         console.log(data);
//     });
//     socket.on('depth', function (data) {
//         console.log("收到下单");
//         // var data = JSON.parse(data);
//         // if (depthLastTime != null && data.time < depthLastTime) {
//         //     return;
//         // }
//         // resolveDepth(data);
//     });

//     socket.on('tunoverOrder', function (data) {
//         console.log("收到成交单");
//         var json = JSON.parse(data);
//         data = json.tunoverOrder;
//         //订单成交
//         //getMarketPrice();
//         // if (data != null) {
//         //     var turnoverList = "";
//         //     var now = new Date();
//         //     for (var i = 0; i < data.length; i++) {

//         //         var date = new Date(data[i].createTime);
//         //         if(date.getUTCFullYear() != now.getUTCFullYear() || date.getUTCDay() != now.getUTCDay()
//         //             || date.getUTCMonth() != now.getUTCMonth()
//         //         ){
//         //             break;
//         //         }

//         //         if(i == 0){
                
//         //             var big;
//         //             var small;
//         //             var nowprice = keepTwoDecimalFull(data[i].price);
//         //             var dotindex = nowprice.indexOf(".");

//         //             if(dotindex >= 0){
//         //                 big = nowprice.substring(0,dotindex);
//         //                 small = nowprice.substring(dotindex + 1,nowprice.length);
//         //                 if(small.length < 2){
//         //                     small += '0';
//         //                 }
//         //             }
//         //             $("#currentPrice").html(big+".<span class='mini-price'>"+ small +"￥</span>");

//         //             var old = parseFloat($("#totalNum").text());
//         //             $("#totalNum").html(keepTwoDecimalFull(old+data[i].number*2));
//         //             var zdf = keepTwoDecimalFull((data[i].price - lastTodayPrice) /lastTodayPrice * 100);
//         //             zdf = !isFinite(zdf) ? 0 : zdf;
//         //             if (_last_price != data[i].price) {
//         //                 if (data[i].price >= _last_price) {
//         //                     $("#currentPrice").css("color", "red");
//         //                     $('#currentPrice').next('i').addClass('tu_rnon').removeClass('next_down');
//         //                 } else {
//         //                     $("#currentPrice").css("color", "green");
//         //                     $('#currentPrice').next('i').addClass('next_down').removeClass('tu_rnon');
//         //                     $('#currentPrice').next('i').height(60);
//         //                 }
//         //             }
//         //             $("#zhangdie").html(zdf + "%");

//         //             if (keepTwoDecimalFull(zdf) > 0) {
//         //                 $("#zhangdie").css("color", "red");
//         //             } else {
//         //                 $("#zhangdie").css("color", "green");
//         //             }

//         //             changeMax(data[i].price);
//         //             changeMin(data[i].price);

//         //             try{
//         //                 var a = data[i].createTime;
//         //                 var b = {
//         //                     l:parseFloat(data[i].number),
//         //                     j:parseFloat(data[i].number) * parseFloat(data[i].price),
//         //                     s:parseFloat(data[i].price),
//         //                     max:parseFloat($("#maxPrice").text()),
//         //                     min:parseFloat($("#minPrice").text())
//         //                 };
//         //                 super_setdata(a,b);
//         //             }catch (erro){

//         //             }

//         //         }


//         //         var isBuy = data[i].type == 1;
//         //         var date = new Date(data[i].createTime);
//         //         var hours = date.getHours()<10?'0'+date.getHours():date.getHours();
//         //         var minetes = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
//         //         var seconds = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
//         //         turnoverList +=
//         //             "<tr class='" + (!isBuy ? "red" : "green") + "'>" +
//         //             "<td width='60'>" + (hours+":"+minetes+":"+seconds) + "</td>" +
//         //             "<td width='60'>" + keepTwoDecimalFull(data[i].price) + "</td>" +
//         //             "<td width='60'>" + keepTwoDecimalFull(data[i].number) + "</td>\n" +
//         //             "</tr>";
//         //     }
//         //     $("#tunoverList").html(turnoverList);
//         // }
//     });

//     socket.on('clean', function (data) {
//         //系统清理委托单完成的时候 统一刷新页面
//         $("#myEntrustList").html("");
//     });

//     socket.on('user', function (data, time) {
//         console.log("收到用户更新");
//         // if (data != null) {
//         //     var html = "";
//         //     var now = new Date();
//         //     for (var i = 0; i < data.length; i++) {
//         //         var isBuy = data[i].type == 1;
//         //         var date = new Date(data[i].createTime);
//         //         if(date.getUTCFullYear() != now.getUTCFullYear() || date.getUTCDay() != now.getUTCDay()
//         //             || date.getUTCMonth() != now.getUTCMonth()
//         //         ){
//         //             break;
//         //         }
//         //         html += "<tr class='" + (isBuy ? "red" : "green") + "'>" +
//         //             " <td>"+_jM.date.date2DateTimeString(date)+"</td>"+
//         //             " <td>" + (isBuy ? "买" : "卖") + "</td>\n" +
//         //             " <td>" + keepTwoDecimalFull(data[i].price) + "</td>\n" +
//         //             " <td>" + keepTwoDecimalFull(data[i].num) + "</td>\n" +
//         //             " <td>" + keepTwoDecimalFull(data[i].deal) + "</td>\n" +
//         //             " <td>" + keepTwoDecimalFull(data[i].num-data[i].deal) + "</td>\n" +
//         //             " <td>" + (data[i].status==0 ? "未成交":(data[i].status==1 ?"已成交":"已撤销"))+ "</td>\n" +
//         //             "<td>"+(data[i].status==0 ?"<a class='c_0662f4' href='javascript:void(0)' onclick='cancelOrder(this,\"" + data[i].id + "\")'>撤销委托</a>":(data[i].status==1?"完成":"已撤销"))+"</td>" +
//         //             " </tr>";
//         //     }
//         //     if(data.length <= 0){
//         //         html += "<tr><td rowspan='8' class='no-hover' style='font-size: 16px;color:#888;padding: 28px 0px !important;text-align: center;'><i class='warn'></i>暂无委托</td></tr>";
//         //     }
//         //     //console.log("weituo")
//         //     $("#myEntrustList").html(html);
//         // }
//         // getUserAccount();
//     });
//     socket.on('disconnect', function () {
//         socket = socket = io("ws://47.75.63.29:9092/?market=" +  market.id+"&userSession="+_jM.getCookie("szxzjx.cn"), {transports: ["websocket", "pull"]});
//     });
// })