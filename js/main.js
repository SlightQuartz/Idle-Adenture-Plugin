/*
function Main() {
    $.get("../fightlog.txt").success(function (content) {
        $.base64.utf8decode = true;
        data = JSON.parse($.base64.atob(content));
        if (jsonData == null || jsonData.log.length != data.log.length || jsonData.geff.e != data.geff.e || jsonData.geff.g != data.geff.g) {
            jsonData = data;
            basicInfo.endTime = new Date();
            ResetAll();
        }
    });
    //setTimeout("Main()", 10000); //读取频率
}
//*/

function Main(data) {
	$.base64.utf8decode = true;
	jsonData = JSON.parse($.base64.atob(data));
	if (jsonData.log != null) {
		ResetAll();
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