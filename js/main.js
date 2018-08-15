
var setTimeoutValue = 30000;

function Main() {
    $.getJSON("../fightlog.json", function (data) {
		if (data.log != null){
			if (jsonData == null || jsonData.log.length != data.log.length || jsonData.geff.e != data.geff.e || jsonData.geff.g != data.geff.g) {
				jsonData = data;
                basicInfo.endTime = new Date();
                autoRounds++;
                ResetAll();
				if (autoBot) {
					AutoBot();
				}
			}
		}
    });
    setTimeout("Main()", setTimeoutValue); //读取频率
}
//

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
function AutoOffLine() {
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

function Btn_Reset() {
    location.reload();
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
    $(".navbar-collapse .navbar-nav>li").removeClass("active");
    $(".navbar-collapse .navbar-nav>li").eq(3).addClass("active");
    $(".container").removeClass("active");
    $(".container").eq(3).addClass("active");
    UpdateLog();
}

var lastRetryExp = 0;
var autoRounds = 0;
var minExpIncrease = 15000;
var maxRound = 20;
var retryExp = true;
function AutoBot(){
    if (((retryExp===true || retryExp==="true") && jsonData.end.grpchara == null) ||
        (option_exp.series[0].data[option_exp.series[0].data.length-1] - option_exp.series[0].data[option_exp.series[0].data.length-2] < minExpIncrease)) {
		$(".bot iframe")[0].contentWindow.location.href="http://idlesteam.marrla.com/API/Group/ClearEff.aspx";
        lastRetryExp = basicInfo.exp;
        autoRounds = 0;
	}
	else{
        if (autoRounds >= maxRound){
            $(".bot iframe")[0].contentWindow.location.href="http://idlesteam.marrla.com/API/Group/SetGuaJi.aspx?g=y";
		}
    }
    SetCookie();
}


function SetCookie() {//7天有效
    $.cookie('setTimeoutValue', setTimeoutValue, { expires: 7 });
    $.cookie('HPLength', HPLength, { expires: 7 });
    $.cookie('skillDataLength', skillDataLength, { expires: 7 });
    $.cookie('lastRetryExp', lastRetryExp, { expires: 7 });
    $.cookie('autoRounds', autoRounds, { expires: 7 });
    $.cookie('minExpIncrease', minExpIncrease, { expires: 7 });
    $.cookie('maxRound', maxRound, { expires: 7 });
    $.cookie('retryExp', retryExp, { expires: 7 });
}

function GetCookie() {
    if ($.cookie('setTimeoutValue') != undefined) {
        setTimeoutValue = $.cookie('setTimeoutValue');
    }
    if ($.cookie('HPLength') != undefined) {
        HPLength = $.cookie('HPLength');
    }
    if ($.cookie('skillDataLength') != undefined) {
        skillDataLength = $.cookie('skillDataLength');
    }

    if ($.cookie('lastRetryExp') != undefined) {
        lastRetryExp = $.cookie('lastRetryExp');
    }
    if ($.cookie('autoRounds') != undefined) {
        autoRounds = $.cookie('autoRounds');
    }
    if ($.cookie('minExpIncrease') != undefined) {
        minExpIncrease = $.cookie('minExpIncrease');
    }
    if ($.cookie('maxRound') != undefined) {
        maxRound = $.cookie('maxRound');
    }
    if ($.cookie('retryExp') != undefined) {
        retryExp = $.cookie('retryExp');
    }
}

function SetSettingData() {
    $("#setting_setTimeoutValue").val(setTimeoutValue / 1000);
    $("#setting_hpDataLimited").val(HPLength);
    $("#setting_skillDataLimimted").val(skillDataLength);
    $("#bot_AutoRounds").val(autoRounds);
    $("#bot_MinExpIncrease").val(minExpIncrease);
    $("#bot_MaxRound").val(maxRound);
    if (retryExp===true || retryExp ==="true") {
        $("#bot_retry")[0].checked = true;
    }
}

function AutoDungeon() {
    var did = [9,10,11,12,13,14,15,16,7,5,1,2,3,4,17,18,19,20];
    $.each(did, function (index, value) {
        //setTimeout('$(".bot iframe")[0].contentWindow.location.href = "http://idlesteam.marrla.com/DungeonFight.aspx?did=-' + did[index] + '"', index * 5000);
        setTimeout('$(".bot iframe")[0].contentWindow.location.href = "http://idlesteam.marrla.com/DungeonFightAuto.aspx?did=-' + did[index] + '"', index * 15000);
    });
}