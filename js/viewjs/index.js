var  app = new Vue({
    el:"#BUW",
    data:{
        markets:null,
        username:"",
    },
    methods:{
        getMarketList:function(){
            _jM.post("/platform/trade/getMarketList.m",null,function (rs,data) {
                app.markets = data;
                console.log(data);
                console.log(app.markets[0].tradeMarket.name)
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
        userInfo:function(){
            _jM.post("/platform/user/serverGetUser.m", null, function(rs, data){
                var phone = data.mobile.substr(4);
                app.username = data.userName+"&nbsp;&nbsp;"+phone.substr(0,3)+"****"+phone.substr(7);
            })
        },
        getzdf:function(item){
            if(item.newest!=null){
                return this.keepTwoDecimalFullss((item.newest.closePrice-item.tradeMarket.closePrice)/item.tradeMarket.closePrice*100);
            }else{
                return 0;
            }
        },
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
        }

    },
    created:function(){
        this.isLogin();
        this.getMarketList();
    }
})

var socket = null;

// function connect(market,token){
//     //socket = io.connect('ws://localhost:8081/socket.io/?market=1&userId=1')
//     socket && socket.connected && socket.close();
//     var deep = '', protocol = void 0, host = void 0;
//     protocol = 'ws';
//     host = 'localhost';
//     socket = io("ws://47.75.63.29:9092/?market="+market,{transports: ["websocket", "pull"]});

//     socket.on('connect', function(){
//     	console.log("已经链接上")
// 	});
//     socket.on('depth', function(data){
//     	var  data = JSON.parse(data);
//         if(data != null){
//             var buyList = "";
//             var sellList = "";

//             if(data.buys != null){
//                 for(var i=0; i<data.buys.length; i++){
//                     buyList+="<ul class='entrust_order' style='height:22px;line-height:22px;' onclick='sellOutS(this)'>";
//                     buyList+="<li class='first' style='width: 70px;'>买"+(i+1)+"</li>";
//                     buyList+="<li class='w85' style='width: 70px;'>"+data.buys[i].price+"</li>";
//                     buyList+="<li class='w64' style='width: 100px;'>"+data.buys[i].number+"</li>";
//                     buyList+="<li class='w62' style='width: 120px;'>"+data.buys[i].price*data.buys[i].number+"</li>";
//                     buyList+="</ul>";
//                     if(i==0){
//                         $("#sell_best_price").html(data.buys[i].price);
//                     }
//                 }
//             }
//             if(data.sells != null){
//                 for(var j=data.sells.length-1; j>=0; j--){
//                     sellList+="<ul class='entrust_order' style='height:22px;line-height:22px;' onclick='purchaseS(this)'>";
//                     sellList+="<li class='first' style='width: 70px;'>卖"+(j+1)+"</li>";
//                     sellList+="<li class='w85' style='width: 70px;'>"+data.sells[j].price+"</li>";
//                     sellList+="<li class='w64' style='width: 100px;'>"+data.sells[j].number+"</li>";
//                     sellList+="<li class='w62' style='width: 120px;'>"+data.sells[j].price*data.sells[j].number+"</li>";
//                     sellList+="</ul>"
//                     if(j==0){
//                         $("#buy_best_price").html(data.sells[j].price);
//                     }
//                 }
//             }

//             $("#selllist").html(sellList);
//             $("#buylist").html(buyList);

//         }
// 	});

//     socket.on('turnOver',function (data) {
//     	console.log(data);
//     	if(data == market){
//             getTurnoverOrderList();
//             getUserRelevant();
//             getIntegral();
//             kLineLoad();
// 		}
//     })

//     socket.on('markect',function(data){
//     	console.log(data);
// 	});
//     socket.on('disconnect', function(){
//     	console.log("disconnect")
// 	});
// }