﻿
function Main() {
	content = $.ajax({url:"../fightlog.json",async:false});
    $.base64.utf8decode = true;
    data = JSON.parse($.base64.atob(content.responseText));
    if (jsonData == null || jsonData.log.length != data.log.length || jsonData.geff.e != data.geff.e || jsonData.geff.g != data.geff.g) {
        jsonData = data;
        basicInfo.endTime = new Date();
        ResetAll();
		if (autoBot){
			AutoBot();
		}
    }
	/*
    $.get("../fightlog.txt").success(function (content) {
		console.log(content);
        $.base64.utf8decode = true;
        data = JSON.parse($.base64.atob(content));
        if (jsonData == null || jsonData.log.length != data.log.length || jsonData.geff.e != data.geff.e || jsonData.geff.g != data.geff.g) {
            jsonData = data;
            basicInfo.endTime = new Date();
            ResetAll();
        }
    });*/
    //setTimeout("Main()", 10000); //读取频率
}
//*/
/*
function Main(data) {
	$.base64.utf8decode = true;
	jsonData = JSON.parse($.base64.atob(data));
	if (jsonData.log != null) {
		ResetAll();
		if (autoBot){
			AutoBot();
		}
    }
}
//*/

// 输出data数据
function WriteLog_fightlog(data) {
    var options = {
        dom: document.getElementById('JsonCanvas'),
        isCollapsible: true,
        quoteKeys: true,
        tabSize: 1
    };
    window.jf = new JsonFormatter(options);
    jf.doFormat(data);
    window.jf.collapseAll();
};

// Fight btn
function MenuFight() {
    $(".navbar-collapse .navbar-nav>li").removeClass("active");
    $(".navbar-collapse .navbar-nav>li").eq(0).addClass("active");
    $(".container").removeClass("active");
    $(".container").eq(0).addClass("active");
    Echart_build(option_exp, $("#expChart"));
    SetSummaryChart();
    Show_SkillBoards();
    SetHeroCharts();
}

// Json btn
function MenuJson(data) {
    $(".navbar-collapse .navbar-nav>li").removeClass("active");
    $(".navbar-collapse .navbar-nav>li").eq(1).addClass("active");
    $(".container").removeClass("active");
    $(".container").eq(1).addClass("active");
    WriteLog_fightlog(data);
}

var autoBot = false;
var urlValue = "http://localhost/dps/idle.html"
function AutoOffLine() {
    if (window.location.href.startsWith("file")) {
        window.location.href = urlValue; 
    } else {
        if (autoBot) {
            autoBot = false;
            $(".navbar-brand").removeClass("danger");
            $(".bot").removeClass("danger");
        } else {
            autoBot = true;
            $(".navbar-brand").addClass("danger");
            $(".bot").addClass("danger");
        }
    }
}

//Setting btn
function MenuSetting() {
    $(".navbar-collapse .navbar-nav>li").removeClass("active");
    $(".navbar-collapse .navbar-nav>li").eq(2).addClass("active");
    $(".container").removeClass("active");
    $(".container").eq(2).addClass("active");
    SetSettingData();
}

//Log btn
function MenuLog() {

}

var lastExp = 0;
var autoRounds = 0;
var minExpIncrease = 15000;
var maxRound = 20;
var retryExp = true;
function AutoBot(){
    if (((retryExp===true || retryExp==="true") && jsonData.end.grpchara == null) ||
        (jsonData.geff.e != lastExp/*不完全判断*/ && jsonData.geff.e - lastExp < minExpIncrease)) {
		$(".bot iframe")[0].contentWindow.location.href="http://idlesteam.marrla.com/API/Group/ClearEff.aspx";
		lastExp = 0;
		autoRounds = 0;
	}
	else{
		autoRounds++;
		lastExp = jsonData.geff.e;
        if (autoRounds >= maxRound){
            $(".bot iframe")[0].contentWindow.location.href="http://idlesteam.marrla.com/API/Group/SetGuaJi.aspx?g=y";
		}
    }
}
    
function SetSettingData() {
    $("#setting_hpDataLimited").attr("value",HPLength);
    $("#setting_sKillDataLimimted").attr("value",skillDataLength);
    $("#bot_AutoRounds").attr("value",autoRounds);
    $("#bot_MinExpIncrease").attr("value",minExpIncrease);
    $("#bot_MaxRound").attr("value", maxRound);
    if (retryExp===true || retryExp ==="true") {
        $("#bot_retry")[0].checked = true;
    }
}