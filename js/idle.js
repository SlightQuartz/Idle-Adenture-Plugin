var jsonData = null;
var skillGroup = [[], [], []];
var heroNames = [];
var basicInfo = { startTime: null, endTime: null, exp: 0, gold: 0, roundW: 0, roundL: 0, roundD: 0,turns:[]};

$(document).ready(function () {
    Main();
    basicInfo.startTime = new Date();
    $(".basicInfo li>span").eq(0).html(basicInfo.startTime.toUTCString());
});


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
/*
function Main(data) {
    jsonData = JSON.parse(data);
    basicInfo.endTime = new Date();
    ResetAll();
}
//*/

function SetExpChart(expValue,goldValue){
	option_exp.xAxis.data.push(option_exp.xAxis.data.length);
	option_exp.series[0].data.push(expValue);
	option_exp.series[1].data.push(goldValue);
	Echart_build(option_exp,expChart);
}

var charactersArray = [
	{
		name:"Hero_1",
		dmg: 0,
		heal: 0,
	},{
		name:"Hero_2",
		dmg: 0,
		heal: 0,
	},{
		name:"Hero_3",
		dmg: 0,
		heal: 0,
	}];

function SetCharacters(){
	option_characters.yAxis[0].data = [];
	option_characters.series[0].data = [];
	option_characters.series[1].data = [];
	$(charactersArray).each(function(){
		option_characters.yAxis[0].data.push(this.name);
		option_characters.series[0].data.push(this.dmg);
        option_characters.series[1].data.push(this.heal);
    });

    $("#CharactersChart").empty();
    $("#CharactersChart").removeAttr("_echarts_instance_");
    var charactersChart = echarts.init($("#CharactersChart")[0]);
    Echart_build(option_characters, charactersChart);
}


function ResetAll() {
    BasicBoard();
    SetExpChart(jsonData.geff.e, jsonData.geff.g);
    LogsCal();
    SkillBoards(function () { SetCharacters() });
    SummaryBoard();
}

function BasicBoard() {
    $(".basicInfo li>span").eq(1).html(basicInfo.endTime.toUTCString());
    $(".basicInfo li>span").eq(2).html(Math.round((basicInfo.endTime - basicInfo.startTime) / 60000) + "mins");
    $.each(jsonData.end.grpchara, function (index, value) {
        basicInfo.exp += Number(value.exp);
    });
    $(".basicInfo li>span").eq(3).html(basicInfo.exp);
    basicInfo.gold += jsonData.end.gold;
    $(".basicInfo li>span").eq(4).html(basicInfo.gold);
    basicInfo.turns.push(jsonData.log.length);
    /*5*/
    $(".basicInfo li>span").eq(6).html(Math.round(basicInfo.turns.reduce((acc, val) => acc + val, 0) / basicInfo.turns.length));
    /*7*/
}

function LogsCal() {
    if (heroNames.length == 0) {
        $.each(jsonData.myc,function (index, value) {
            heroNames.push(value.nam);
            charactersArray[index].name = value.nam;
            $(".hero").eq(index).addClass("active");
            $(".hero").eq(index).find(".panel-heading").html(value.nam);
        });
    }
    $.each(jsonData.log, function (index, value) {
        LogCal(value);
    });
}

function LogCal(logData) {
    if (heroNames.indexOf(logData.att_combat.atn) >= 0) {
        var aoeD = 0;
        var aoeH = 0;
        $(logData.aoe_combat).each(function () {
            if (this.d != null) { aoeD += Number(this.d)}
            if (this.Heal != null) { aoeH += Number(this.Heal) }
        });
        $(logData.att_round).each(function () {
            SkillGroup(FindAuraUser(this.skn, logData, this.rds), this.skn, 0, 0, 0, 0, this.dmg == null ? 0 : Number(this.dmg), this.heal == null ? 0 : Number(this.heal), 0);
        });
        $(logData.att_aura).each(function () {
            //if (this.d != null) { aoeD += Number(this.d) }
            //if (this.Heal != null) { aoeH += Number(this.Heal) }
            if (this.d != null || this.heal != null) {
                //追溯使用者
                //console.log(jsonData.log.indexOf(logData)+this.skn+ FindAuraUser(this.skn, logData, this.rds));
                SkillGroup(FindAuraUser(this.skn, logData, this.rds), this.skn, 0, 0, 0, 0, this.d == null ? 0 : Number(this.d), this.heal == null ? 0 : Number(this.heal), 0);
            }
        });
        SkillGroup(logData.att_combat.atn, logData.att_combat.ats, Number(logData.att_combat.d) + Number(logData.att_combat.hpf), Number(logData.att_combat.Heal) + Number(logData.att_combat.hpf) + Number(logData.att_combat.phe), aoeD, aoeH,0,0 ,1);
    }
}

function SkillGroup(heroName, skillName, Dmg, Heal, AOED, AOEH, DotD, DotH, Count) {
    var exist = false;
    Dmg = Number(Dmg);
    Heal = Number(Heal);
    AOED = Number(AOED);
    AOEH = Number(AOEH);
    DotD = Number(DotD);
    DotH = Number(DotH);
    $.each(skillGroup[heroNames.indexOf(heroName)], function (index, value) {
        if (value.name == skillName) {
            exist = true;
            value.Dmg.push(Dmg);
            value.Heal.push(Heal);
            value.AOED.push(AOED);
            value.AOEH.push(AOEH);
            value.DotD.push(DotD);
            value.DotH.push(DotH);
            value.Count += Count;
        }
    });
    if (!exist) {
        skillGroup[heroNames.indexOf(heroName)].push({ name: skillName, Dmg: [Dmg], Heal: [Heal], AOED: [AOED], AOEH: [AOEH], DotD: [DotD], DotH: [DotH], Count: Count });
    }
}

function SkillBoards(callback) {
    for (var i = 0; i < 3;i++){
        charactersArray[i].dmg = 0;
        charactersArray[i].heal = 0;
    }
    $.each(heroNames, function (index, value) {
        var chartData = SkillBoard($(".hero").eq(index).find("tbody"), skillGroup[index]);
        SetSkillChart(index, chartData);
    });
    callback();
}

function SkillBoard($node, data) {
    var chartData = [];
    $.each(data, function (index, value) {
        if ($node.find("tr").length > index) {
            chartData.push(SkillItem($node.find("tr").eq(index), value,));
        } else {
            var $item = $('<tr><th scope= "row">' + (index + 1) + '</th><td>Mark</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>')
            chartData.push(SkillItem($item, value));
            $node.append($item);
        }
    });
    return chartData;
}

function SkillItem($item, data) {
    $item.find("td").eq(0).html(data.name);
    var dmgASum = data.Dmg.reduce((acc, val) => acc + val, 0);
    var dmgCount = CountWithoutZero(data.Dmg);
    if (dmgCount != 0) {
        $item.find("td").eq(2).html(Math.round(dmgASum / dmgCount) + "*" + dmgCount);
    } else {
        $item.find("td").eq(2).html(0);
    }
    var aoeDSum = data.AOED.reduce((acc, val) => acc + val, 0);
    var aoeDCount = CountWithoutZero(data.AOED);
    if (aoeDCount != 0) {
        $item.find("td").eq(3).html(Math.round(aoeDSum / aoeDCount) + "*" + aoeDCount);
    } else {
        $item.find("td").eq(3).html(0);
    }
    var dotDSum = data.DotD.reduce((acc, val) => acc + val, 0);
    var dotDCount = CountWithoutZero(data.DotD);
    if (dotDCount != 0) {
        $item.find("td").eq(4).html(Math.round(dotDSum / dotDCount) + "*" + dotDCount);
    } else {
        $item.find("td").eq(4).html(0);
    }
    var dmgSum = dmgASum + aoeDSum + dotDSum;
    $item.find("td").eq(1).html(dmgSum);

    var healASum = data.Heal.reduce((acc, val) => acc + val, 0);
    var healCount = CountWithoutZero(data.Heal);
    if (healCount != 0) {
        $item.find("td").eq(6).html(Math.round(healASum / healCount) + "*" + healCount);
    } else {
        $item.find("td").eq(6).html(0);
    }
    var aoeHSum = data.AOEH.reduce((acc, val) => acc + val, 0);
    var aoeHCount = CountWithoutZero(data.AOEH);
    if (aoeHCount != 0) {
        $item.find("td").eq(7).html(Math.round(aoeHSum / aoeHCount) + "*" + aoeHCount);
    } else {
        $item.find("td").eq(7).html(0);
    }
    var dotHSum = data.DotH.reduce((acc, val) => acc + val, 0);
    var dotHCount = CountWithoutZero(data.DotH);
    if (dotHCount != 0) {
        $item.find("td").eq(8).html(Math.round(dotHSum / dotHCount) + "*" + dotHCount);
    } else {
        $item.find("td").eq(8).html(0);
    }
    var healSum = healASum + aoeHSum + dotHSum;
    $item.find("td").eq(5).html(healSum);


    return [data.name, dmgASum, aoeDSum, dotDSum, healASum, aoeHSum, dotHSum];
}

function CountWithoutZero(array) {
    var count = 0;
    $(array).each(function () {
        if (this != 0){
            count++;
        }
    });
    return count;
}

function SetSkillChart(index, data) {
    option_skill.yAxis.data = [];
    $(option_skill.series).each(function () {
        this.data = [];
    });
    $(data).each(function () {
        option_skill.yAxis.data.push(this[0]);
        option_skill.series[0].data.push(this[1]);
        option_skill.series[1].data.push(this[2]);
        option_skill.series[2].data.push(this[3]);
        option_skill.series[3].data.push(this[4]);
        option_skill.series[4].data.push(this[5]);
        option_skill.series[5].data.push(this[6]);
        charactersArray[index].dmg += this[1] + this[2] + this[3];
        charactersArray[index].heal += this[4] + this[5] + this[6];
    });

    $(".skillChart>div").eq(index).empty();
    $(".skillChart>div").eq(index).removeAttr("_echarts_instance_");
    var skillChart = echarts.init($(".skillChart>div")[index]);
    if (option_skill && typeof option_skill === "object") {
        skillChart.setOption(option_skill, true);
    }
}

function FindAuraUser(auraName, logData, rds) {
    var userName = null;
    var preRound = jsonData.log.indexOf(logData);
    for (var i = 2; i < 7;i++){
        if (jsonData.log[preRound-i].att_combat.atn == logData.att_combat.atn) {
            FindAuraUser_2(auraName, jsonData.log[preRound], rds, jsonData.log[preRound - i], function (preRds) {
                if (preRds < 0) {
                    return;
                } else {
                    preRound -= i;
                    i = 1;
                }
            });
        } else {
            if (preRound - i - 1 < 0) { break; }
        }
    }

    for (var i = 0; i < 6; i++){
        if (preRound - i >= 0) {
            //console.log(preRound+jsonData.log[preRound - i].att_combat.ats);
            if (jsonData.log[preRound - i].att_combat.ats.indexOf(auraName) != -1){
                userName = jsonData.log[preRound - i].att_combat.atn;
                break;
            }
        }
    }
    if (userName == null) {
        userName = jsonData.log[preRound].att_combat.atn;
    }
    return userName;
}
function FindAuraUser_2(auraName, logData, rds, pre_logData, callback) {
    var preRound = -1;
    $(pre_logData.att_aura).each(function () {
        if (this.skn == auraName) {
            if (this.rds > rds) {
                preRound = this.rds;
            } else if (this.rds == rds && logData.att_combat.ats.indexOf("炽热光辉")!=-1) {
                preRound = this.rds;
            }
            return;
        }
    });
    callback(preRound);
}
function SummaryBoard() {
    $(charactersArray).each(function () {
        $(".summary tbody").empty();
        $(charactersArray).each(function () {
            $node = $('<tr><th scope="row">' + ($(".summary tbody").find("tr").length + 1) + '</th><td>' + this.name + '</td><td>' + this.dmg + '</td><td>' + this.heal + '</td></tr>');
            $(".summary tbody").append($node);
        });
    });
}