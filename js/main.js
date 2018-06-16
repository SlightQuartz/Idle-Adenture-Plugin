/*
function Main() {
    $.getJSON("../fightlog.json", function (data) {
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
	if (data.startsWith("{")){
		jsonData = JSON.parse(data);
	}else{
		$.base64.utf8decode = true;
		jsonData = JSON.parse($.base64.atob(data));
	}
    ResetAll();
}
//*/