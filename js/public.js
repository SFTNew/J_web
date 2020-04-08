var _jM = new jModule();
var _ajaxs = [];
$(document).ready(function(){
    _jM.login.init();
    window.onbeforeunload = function(){
        $.each(_ajaxs,function () {
        	this.abort();
        });
        // var frame = $("#klineframe");
        // if(frame != null){frame.removeAttr("src")};
        // _jM = null;
	}
});

//****************************************************************************
function jModule(){};

jModule.prototype.login = {
    user:null,
    go: function(url){
        var backURL = _jM.validate.isEmpty(url)?
            (window.parent?window.parent.location.href:window.location.href):url;
        backURL = encodeURIComponent(backURL);
        // if(window.parent){
        //    window.parent.location.href="/login/login.html#lo?backURL="+backURL;
        // }else{
        //    window.location.href="/login/login.html#lo?backURL="+backURL;
        // }
        // alert("跳转");
        // top.window.location.href="/login/login.html#lo?backURL="+backURL;
        window.top.location.href="/login.html?flag=true"
    },
    logout:function(){
        _jM.post("/platform/user/serverLogout.m",null,function(){
            _jM.setCookie("usessionId", "", -1000, "/");
            clearCookie();
            _jM.post("/platform/user/getUsessionId.m", null, function(rs, data){
                _jM.setCookie("usessionId", data, 0.042, "/");
                _jM.login.go(null);
                window.top.location.href="/index.html";
            }, null);
        }, null);
    },
    isLogin:function(success, failed){
        $.post("/platform/user/isLogin.m", null, function(rs, data){
            if(!rs.result){
                if(failed != null){
                    failed();
                }
            }else{
                if(success != null){
                    success();
                }
            }
        });
    },
    getLogin:function(success){

        _jM.post("/platform/user/serverGetUser.m", null, function(rs, data){
            if(success != null){
                success(data);
            }
        });
    },
    init:function(){
        // 从服务器获取用户usessionId
        var _usessionId = _jM.getCookie("usessionId");
        if(_jM.validate.isEmpty(_usessionId)){
            _jM.post("/platform/user/getUsessionId.m", null, function(rs, data){
                _jM.setCookie("usessionId", data, 0.042, "/");

                if(typeof(session_load)!='undefined'){
                    session_load();
                }
            }, null);
        }else{
            if(typeof(session_load)!='undefined'){
                session_load();
            }
        }

		/*// 检查注册信息是否完善
		 $.post("/platform/user/serverGetUser.m", null, function(data){
		 if(data.statusCode == 0){
		 if(data.result.status==1){// 有效用户
		 // 检查注册信息是否完善
		 if("null" == data.result.userName || _jM.validate.isEmpty(data.result.userName)){
		 //						alert("请完成用户注册流程！");
		 window.location.href="/login/tradepasswd_create.html#re";
		 }
		 }
		 }
		 });*/
    }
}

//Set cookie
jModule.prototype.setCookie = function(name,value, days, path){
    var Days = days;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ encodeURIComponent(value) + ";expires=" + exp.toGMTString()+";path="+path;
}

function clearCookie(){
    var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;)
            document.cookie=keys[i]+'=0;expires=' + new Date( 0).toUTCString()
    }
}

//Get cookies
jModule.prototype.getCookie = function(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return decodeURIComponent(arr[2]);
    else
        return null;
}

//Get param.
jModule.prototype.getParam = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r!= null) return unescape(r[2]); return null;
}

/**
 * Get iframe content.
 *
 * @param p
 */
jModule.prototype.iframe$getElement = function(p){
    if(p == null || p.url == null){
        alert("Url can not be null!");
    }

    var _eleme = p.element == null ? "body" : p.element;
    var _frame = $("<iframe style='display:none' src='"+ p.url +"'></iframe>");
    _frame.prependTo("body");

    _frame.load(function(){
        var html = _frame.contents().find(_eleme).first().html();
        //Call back.
        if(p.success != null){
            p.success(html);
        }
        _frame.remove();
    });
};

jModule.prototype.dropMenu = {
    show : function(p){
        var id     = p.showId;
        var menuId = p.menuId;
        var _top   = (typeof(p.top)=="undefined" || p.top==null)? 0 : p.top;
        var _left  = (typeof(p.left)=="undefined" || p.left==null)? 0 : p.left;

        $("#"+menuId).css("position","absolute");
        $("#"+menuId).css("z-index","98");
        $("#"+menuId).css("display","block");
        $("#"+menuId).css("top",$("#"+id).offset().top + _top);
        $("#"+menuId).css("left",$("#"+id).offset().left + _left);
        $("#"+menuId).hover(null, function(){
            $("#"+menuId).css('display','none');
        });

        if(p.show!=null){
            p.show();
        }
    },
    hidden:function(p){
        var menuId = p.menuId;
        $("#"+menuId).css('display','none');
        if(p.hidden!=null){
            p.hidden();
        }
    }
};


jModule.prototype.getClientBounds = function(){
    var bounds=new Object();
    var isIE=navigator.userAgent.indexOf("MSIE")>0?true:false;

    bounds.width    = isIE?document.body.clientWidth:document.documentElement.clientWidth;
    bounds.height   = isIE?document.body.clientHeight:document.documentElement.clientHeight;
    bounds.scrollTop= document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    bounds.scrollHeight= document.documentElement.scrollHeight || document.body.scrollHeight;
    bounds.screenHeight= window.screen.height;
    bounds.screenWidth = window.screen.width;
    return bounds;
};

jModule.prototype.timer = {
    start : function(p){
        var time = p.time == null ? 1000 :p.time;
        var callback = p.callback;

        return window.setInterval(callback, time);
    },
    stop : function(p){
        if(p.timeHandler == null){
            return;
        }
        window.clearInterval(p.timeHandler);
    }
};

jModule.prototype.layer = {
    show : function(p){
        var height= document.body.scrollHeight;
        var html  = "<div id='"+p.id+"' style='width:100%;height:"+height+"px;position:absolute;background-color:#fff;"
            + "filter:alpha(opacity=25);-moz-opacity:0.25;opacity:0.25;z-index:19;left:0px;top:0px;text-align:center;'></div>";

        $(html).appendTo($("body"));
        return p.id;
    },
    hidden: function(p){
        $("#"+p.id).remove();
    }
};

jModule.prototype.date = {
    string2Date : function(str){
        var date = eval('new Date(' + str.replace(/\d+(?=-[^-]+$)/, function (a){
                return parseInt(a, 10) - 1; }).match(/\d+/g) + ')'
        );
        return date;
    },
    date2DateString : function(date){
        return date == null ? "": (date.getFullYear()+"-"+((date.getMonth()+1)<10?'0'+(date.getMonth()+1):(date.getMonth()+1))
        +"-"+(date.getDate()<10?'0'+date.getDate():date.getDate()));
    },
    date2DateTimeString : function(date){
        return date == null ? "": (date.getFullYear()+"-"+((date.getMonth()+1)<10?'0'+(date.getMonth()+1):(date.getMonth()+1))
            +"-"+(date.getDate()<10?'0'+date.getDate():date.getDate())+" "+(date.getHours()<10?'0'+date.getHours():date.getHours())+":"+
            (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())
            +":"+
            (date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds())
        );
    },
    isSomeDay:function (date) {
        var now = new Date();
        if(date.getYear() == now.getYear() && date.getMonth() == now.getMonth() && date.getDay() == now.getDay()){
            return true;
        }else{
            return false;
        }
    },
};

jModule.prototype.post = function(url, param, success, error){
    var a = $.post(url, param, function(data){
        if(data.statusCode != 0){
            if(data.statusCode == 1000){
                _jM.login.go(null);
            }
            if(error != null){
                error(data);
            }
        }else{
            if(success != null){
                success(data, data.result);
            }
        }
    });
    _ajaxs.push(a);
};

jModule.prototype.validate = {
    ifNullUseDefault : function(v, def){
        if(_jM.validate.isEmpty(v)){
            return def;
        }
        return v;
    },
    //是否是有效的手机号
    isMobile : function(v){
        v = $.trim(v);
        return v.match(/^1\d{10}$/);
    },
    //是否是空字符串或者null
    isEmpty : function(v){
        v = $.trim(v);
        return v== null || v=="" || v.length<=0;
    },
    //是否不为空字符串
    isNotEmpty :function(v){
        v = $.trim(v);
        return v!=null && v!="" && v.length>0;
    },
    //是否是有效的数字，包括整数与小数
    isNumber : function(v){
        v = $.trim(v);
        return !isNaN(v);
    },
    //是否是整数
    isInteger : function(v){
        v = $.trim(v);
        return v.match(/^[0-9]*$/)
    },
    //是否是货币数字，小数点后两位
    isBigDecimal : function(v){
        v = $.trim(v);
        if(isNaN(v)){return false;}

        var index = v.lastIndexOf(".");
        if(index==-1){
            return true;
        }else{
            return index>=v.length-3;
        }
    },
    //是否是有效的数字，且在指定的范围内
    isNumberRangeIn : function(v, min, max){
        v = $.trim(v);
        if(isNaN(v)){return false;}
        var v2 = parseFloat(v);
        if(v2 < min || v2> max){
            return false;
        }
        return true;
    },
    //是否是货币数字，且在指定的范围内
    isDecimalRangeIn : function(v, min, max){
        v = $.trim(v);
        if(_jM.validate.isBigDecimal(v)){
            var v2 = parseFloat(v);
            return v2>=min && v2<=max;
        }
        return false;
    },
    //是否全是字母
    isCharacter : function(v){
        v = $.trim(v);
        return v.match(/^[A-Za-z]+$/);
    },
    //是否全是数字
    isDigital : function(v){
        v = $.trim(v);
        return v.match(/^[0-9]*$/);
    },
    //是否包含非法的字符
    isIllegalCharacter :function(v){
        v = $.trim(v);
        return v.match(/^((?![！~@#￥%……&*]).)*$/);
    },
    //字符串长度是否在有效的范围内
    isLengthBetween:function(v, min, max){
        v = $.trim(v);
        return v!=null && v.length>=min && v.length<=max;
    }
};

/**
 * 时间倒计时
 * @param id id名
 * @param intDiff 倒计时总秒数量
 */
jModule.prototype.countDown = function(id, intDiff){
    var dayObj,hourObj,minuteOjb,secondObj;
    if(id != null && id != ""){
        dayObj = $('#' + id + ' .day_show');
        hourObj = $('#' + id + ' .hour_show');
        minuteOjb = $('#' + id + ' .minute_show');
        secondObj = $('#' + id + ' .second_show');
    } else {
        dayObj = $('.day_show');
        hourObj = $('.hour_show');
        minuteOjb = $('.minute_show');
        secondObj = $('.second_show');
    }
    window.setInterval(function(){
        var day=0,
            hour=0,
            minute=0,
            second=0;//时间默认值
        if(intDiff > 0){
            day = Math.floor(intDiff / (60 * 60 * 24));
            hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
            minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        }
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;

        dayObj.html(day);
        hourObj.html(hour);
        minuteOjb.html(minute);
        secondObj.html(second);

        intDiff--;
    }, 1000);
}