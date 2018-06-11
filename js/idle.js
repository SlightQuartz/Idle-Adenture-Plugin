var jsonData = null;
var skillGroup = [[], [], []];
var heroNames = [];
var heroNamesList = [];
var basicInfo = { startTime: null, endTime: null, exp: 0, gold: 0, roundW: 0, roundL: 0, roundD: 0, turns: [] };


$(document).ready(function () {
    //Main();
    basicInfo.startTime = new Date();
    $(".basicInfo li>span").eq(0).html([basicInfo.startTime.getFullYear(), basicInfo.startTime.getMonth() + 1, basicInfo.startTime.getDate()].join('-')
        + ' ' + [basicInfo.startTime.getHours(), basicInfo.startTime.getMinutes(), basicInfo.startTime.getSeconds()].join(':'));
});

/// <summary>
/// 为左上exp info折线图添加一组新的数据
/// </summary>
/// <param name="expValue">经验数值</param>
/// <param name="goldValue">金钱数值</param>
function SetExpChart(expValue, goldValue) {
    option_exp.xAxis.data.push(option_exp.xAxis.data.length);
    option_exp.series[0].data.push(expValue);
    option_exp.series[1].data.push(goldValue);
    Echart_build(option_exp, $("#expChart"));
}

// summary数据
var charactersArray = [
    {
        name: "Hero_1",
        dmg: 0,
        heal: 0,
    }, {
        name: "Hero_2",
        dmg: 0,
        heal: 0,
    }, {
        name: "Hero_3",
        dmg: 0,
        heal: 0,
    }];


/// <summary>
/// 重设summary图标，使用charactersArray数据
/// </summary>
function SetCharacters() {
    option_characters.yAxis[0].data = [];
    option_characters.series[0].data = [];
    option_characters.series[1].data = [];
    $(charactersArray).each(function () {
        option_characters.yAxis[0].data.push(this.name);
        option_characters.series[0].data.push(this.dmg);
        option_characters.series[1].data.push(this.heal);
    });

    Echart_build(option_characters, $("#CharactersChart"));
}


/// <summary>
/// 重设所有数据和统计图，每次获得json数据后调用
/// </summary>
function ResetAll() {
    basicInfo.endTime = new Date();
    BasicBoard();
    SetExpChart(jsonData.geff.e, jsonData.geff.g);
    LogsCal();
    SkillBoards(function () { SetCharacters() });
    SummaryBoard();
}

/// <summary>
/// 重设左上基本信息
/// </summary>
function BasicBoard() {
    $(".basicInfo li>span").eq(1).html([basicInfo.endTime.getFullYear(), basicInfo.endTime.getMonth() + 1, basicInfo.endTime.getDate()].join('-')
        + ' ' + [basicInfo.endTime.getHours(), basicInfo.endTime.getMinutes(), basicInfo.endTime.getSeconds()].join(':'));
    $(".basicInfo li>span").eq(2).html(Math.round((basicInfo.endTime - basicInfo.startTime) / 60000) + "mins");
    $.each(jsonData.end.grpchara, function (index, value) {
        basicInfo.exp += Number(value.exp);
    });
    $(".basicInfo li>span").eq(3).html(basicInfo.exp);
    basicInfo.gold += jsonData.end.gold;
    $(".basicInfo li>span").eq(4).html(basicInfo.gold);
    basicInfo.turns.push(jsonData.log.length);
    /*5*/
    $(".basicInfo li>span").eq(5).html(Math.round(basicInfo.turns.reduce((acc, val) => acc + val, 0) / basicInfo.turns.length));
    /*7*/
}

/// <summary>
/// 分析统计战斗json中的log
/// </summary>
function LogsCal() {
    if (heroNames.length == 0) {
        $.each(jsonData.myc, function (index, value) {
            heroNames.push(value.nam);
            heroNamesList.push([value.idx,value.nam]);
            charactersArray[index].name = value.nam;
            $(".hero").eq(index).addClass("active");
            $(".hero").eq(index).find(".panel-heading").html(value.nam);
        });
    }
    $.each(jsonData.log, function (index, value) {
        LogCal(value);
    });
}

/// <summary>
/// 分析统计单个log
/// </summary>
/// <param name="logData">单个log对象</param>
function LogCal(logData) {
	//己方回合
    //根据idx判断，避免与怪物重名
    if (logData.aidx == heroNamesList[0][0] || logData.aidx == heroNamesList[1][0] || logData.aidx == heroNamesList[2][0]) {
        var aoeD = 0;
        var aoeH = 0;
        var BS2 = 0; //炽热之星2判定
        $(logData.att_spec).each(function () {
            if (this.skn == "炽焰之星") { SkillGroup(logData.att_combat.atn, "炽焰之星", 0, 0, 0, 0, Number(this.dmg), 0, 0); }
            if (this.skn == "炽焰之星II") { BS2 = Number(this.admg); }
        });
        $(logData.aoe_combat).each(function () {
            if (BS2 != 0) {
                if (Number(this.d) == BS2) { SkillGroup(logData.att_combat.atn, "炽焰之星II", 0, 0, 0, 0, BS2, 0, 0); }
                else { aoeD += Number(this.d); }
            }
            else {
                if (this.d != null) { aoeD += Number(this.d); }
            }
            if (this.Heal != null) { aoeH += Number(this.Heal); }
        });
        $(logData.att_round).each(function () {
            var roundD = 0;
            var roundH = 0;
            if (this.dmg != null) { roundD += Number(this.dmg) }
            if (this.dyd != null) { roundD += Number(this.dyd) * logData.att_round.length }//改变
            if (this.heal != null) { roundH += Number(this.heal) }
            SkillGroup(logData.att_combat.atn, this.skn, 0, 0, 0, 0, roundD, roundH, 0);
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
        //+ Number(logData.att_combat.ct)/*反击*/ + Number(logData.att_combat.dbk)/*反弹*/
        SkillGroup(logData.att_combat.atn, logData.att_combat.ats, Number(logData.att_combat.d)/*伤害*/ + Number(logData.att_combat.hpf)/*吸血*/, Number(logData.att_combat.Heal) + Number(logData.att_combat.hpf)/*吸血*/ + Number(logData.att_combat.phe)/*被动吸血*/, aoeD, aoeH, 0, 0, 1);
    }
	//敌方回合
    //
	if (logData.didx == heroNamesList[0][0] || logData.didx == heroNamesList[1][0] || logData.didx == heroNamesList[2][0]) {
		if(Number(logData.att_combat.ct) > 0){ 
		  if(Number(logData.att_combat.cnt) >1){
			for(var cntcount=0;cntcount<logData.att_combat.cnt;cntcount++){ SkillGroup(logData.att_combat.dfn,"反击",Math.round(Number(logData.att_combat.ct)/logData.att_combat.cnt),0,0,0,0,0,0);}
		  }
		  else{
		    SkillGroup(logData.att_combat.dfn,"反击",Number(logData.att_combat.ct),0,0,0,0,0,0); 
		  }
		}
		if(Number(logData.att_combat.dbk) > 0){ SkillGroup(logData.att_combat.dfn,"反弹",Number(logData.att_combat.dbk),0,0,0,0,0,0); }
		//毒伤统计
        var PoisonSpitList = [];
        var PoisonSpit2List = [];
        var PoisonList1 = [];
        var PoisonList2 = [];
        var PoisonList3 = [];
        var PoisonList4 = [];
        var PoisonList5 = [];
        var PoisonList6 = [];
        var PoisonList7 = [];
        var PoisonList8 = [];
        if(logData.att_poison!= null) {

		    for(var i =0;i<logData.att_poison.length;i++){
		        switch (logData.att_poison[i].skn) {
                    case "毒雾喷射":
                        //生成每回合毒喷的伤害与轮数列表
                        PoisonSpitList.push([logData.att_poison[i].psd, logData.att_poison[i].rds]);
                        break;
                    case "毒雾喷射II":
                        //生成每回合毒喷的伤害与轮数列表
                        PoisonSpit2List.push([logData.att_poison[i].psd, logData.att_poison[i].rds]);
                        break;
                    case "毒牙":
                        PoisonList1.push([logData.att_poison[i].psd, logData.att_poison[i].rds]);
                        break;
                    case "异域毒刃":
                        PoisonList2.push([logData.att_poison[i].psd, logData.att_poison[i].rds]);
                        break;
                    case "空虚":
                        PoisonList3.push([logData.att_poison[i].psd, logData.att_poison[i].rds]);
                        break;
                    case "瘟疫之触":
                        PoisonList4.push([logData.att_poison[i].psd, logData.att_poison[i].rds]);
                        break;
                    case "异域毒刃II":
                        PoisonList5.push([logData.att_poison[i].psd, logData.att_poison[i].rds]);
                        break;
                    case "瘟疫之触II":
                        PoisonList6.push([logData.att_poison[i].psd, logData.att_poison[i].rds]);
                        break;
                    case "瘟疫之触III":
                        PoisonList7.push([logData.att_poison[i].psd, logData.att_poison[i].rds]);
                        break;
                    case "梦魇毒域":
                        PoisonList8.push([logData.att_poison[i].psd, logData.att_poison[i].rds]);
                        break;
                }
            }
            //毒喷伤害统计
            GroupPoisonSpit(logData,PoisonSpitList,"毒雾喷射");
            //毒喷2伤害统计
            GroupPoisonSpit(logData,PoisonSpit2List,"毒雾喷射II");
            GroupPoison(logData,PoisonList1,"毒牙");
            GroupPoison(logData,PoisonList2,"异域毒刃");
            GroupPoison(logData,PoisonList3,"空虚");
            GroupPoison(logData,PoisonList4,"瘟疫之触");
            GroupPoison(logData,PoisonList5,"异域毒刃II");
            GroupPoison(logData,PoisonList6,"瘟疫之触II");
            GroupPoison(logData,PoisonList7,"瘟疫之触III");
            GroupPoison(logData,PoisonList8,"梦魇毒域");
        }

        //逆恶魔统计
        if(logData.att_spec!= null) {
            $(logData.att_spec).each(function () {
              if(this.skn == "束缚"){
                  var ShacklesUserList = FindSkillUser(logData, "束缚");
                  if(ShacklesUserList.length >0) {
                      SkillGroup(ShacklesUserList[0][0], "束缚", 0, 0, 0, 0, Number(this.rmh), 0, 0);
                  }
              }
            });
        }
        //无来源伤害 魅毒、创伤
	}
}


/// <summary>
/// 将解析出来的伤害进行分组统计
/// </summary>
/// <param name="heroName">角色名</param>
/// <param name="skillName">技能名</param>
/// <param name="Dmg">直接伤害</param>
/// <param name="Heal">直接治疗</param>
/// <param name="AOED">aoe伤害</param>
/// <param name="AOEH">aoe治疗</param>
/// <param name="DotD">dot伤害</param>
/// <param name="DotH">dot治疗</param>
/// <param name="Count">技能使用次数</param>
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

/// <summary>
/// 清空charactersArray数据，并重设角色技能伤害的图和表格
/// </summary>
/// <param name="callback">回调，防止异步执行</param>
function SkillBoards(callback) {
    for (var i = 0; i < 3; i++) {
        charactersArray[i].dmg = 0;
        charactersArray[i].heal = 0;
    }
    $.each(heroNames, function (index, value) {
        var chartData = SkillBoard($(".hero").eq(index).find("tbody"), skillGroup[index]);
        SetSkillChart(index, chartData);
    });
    callback();
}

/// <summary>
/// 重设单个角色技能伤害的表格
/// </summary>
/// <param name="$node">jq对象，角色table</param>
/// <param name="data">该角色所有技能统计数据</param>
/// <returns>summary图表的数据</returns>
function SkillBoard($node, data) {
    var chartData = [];
    $.each(data, function (index, value) {
        if ($node.find("tr").length > index) {
            chartData.push(SkillItem($node.find("tr").eq(index), value));
        } else {
            var $item = $('<tr><th scope= "row">' + (index + 1) + '</th><td>Mark</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>');
            chartData.push(SkillItem($item, value));
            $node.append($item);
        }
    });
    return chartData;
}

/// <summary>
/// 重设单个技能条目
/// </summary>
/// <param name="$node">jq对象，技能tr</param>
/// <param name="data">该技能统计数据</param>
/// <returns>技能累加数值</returns>
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

/// <summary>
/// 计算数组非0元素数量
/// </summary>
/// <param name="array">数组</param>
/// <returns>数量</returns>
function CountWithoutZero(array) {
    var count = 0;
    $(array).each(function () {
        if (this != 0) {
            count++;
        }
    });
    return count;
}

/// <summary>
/// 清空charactersArray数据，并重设summary图和表格
/// </summary>
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

/// <summary>
/// 追溯光环使用者
/// </summary>
/// <param name="auraName">光环名</param>
/// <param name="logData">log条目数据</param>
/// <param name="rds">光环轮数</param>
/// <returns>使用者</returns>
function FindAuraUser(auraName, logData, rds) {
    var userName = null;
    var preRound = jsonData.log.indexOf(logData);
    // 寻找自身光环最初起效回合
    for (var i = 2; i < 7; i++) {
        if (jsonData.log[preRound - i].att_combat.atn == logData.att_combat.atn) {
            FindAuraUser_2(auraName, jsonData.log[preRound], rds, jsonData.log[preRound - i], function (preRds) {
                if (preRds < 0) {
                    return;
                } else {
                    // 找到前一轮光环，递归查找前一轮
                    preRound -= i;
                    i = 1;
                }
            });
        } else {
            if (preRound - i - 1 < 0) { break; }
        }
    }
    // 寻找使光环起效的技能
    for (var i = 0; i < 6; i++) {
        if (preRound - i >= 0) {
            //console.log(preRound+jsonData.log[preRound - i].att_combat.ats);
            if (jsonData.log[preRound - i].att_combat.ats.indexOf(auraName) != -1) {
                userName = jsonData.log[preRound - i].att_combat.atn;
                break;
            }
        }
    }
    //找不到使用者，最初回合的角色作为使用者
    if (userName == null) {
        userName = jsonData.log[preRound].att_combat.atn;
    }
    return userName;
}

/// <summary>
/// 找到的轮次光环持续时间，并回调
/// </summary>
/// <param name="auraName">光环名</param>
/// <param name="logData">log条目数据</param>
/// <param name="rds">光环轮数</param>
/// <param name="pre_logData">前一轮的log</param>
/// <param name="callback">回调</param>
/// <returns>preRound，前一轮持续时间</returns>
function FindAuraUser_2(auraName, logData, rds, pre_logData, callback) {
    var preRound = -1;
    $(pre_logData.att_aura).each(function () {
        if (this.skn == auraName) {
            if (this.rds > rds) {
                preRound = this.rds;
            } else if (this.rds == rds && logData.att_combat.ats.indexOf("炽热光辉") != -1) {
                preRound = this.rds;
            }
            return;
        }
    });
    callback(preRound);
}

//生成最近使用毒喷的英雄序列
function FindPoisonSpitUser(logData,skillname){
    var PoisonSpitUserList = [];
    var preRound = jsonData.log.indexOf(logData);
    for (var i = 1; i < 50;i++) {
        if(preRound-i < 0){break;}
        else {
            if (heroNames.indexOf(jsonData.log[preRound - i].att_combat.atn) >= 0 && jsonData.log[preRound - i].att_combat.ats == skillname) {
                PoisonSpitUserList.push([jsonData.log[preRound - i].att_combat.atn, preRound - i]);
            }
        }
    }
    //返回英雄列表
    return PoisonSpitUserList;
}

//生成最近使用某技能的序列
function FindSkillUser(logData,skillname){
    var SkillUserList = [];
    var preRound = jsonData.log.indexOf(logData);
    for (var i = 1; i < 50;i++) {
        if(preRound-i < 0){break;}
        else {
            //判断条件：1.己方英雄 2.对当前目标使用过技能 3.技能名判定
            if (heroNames.indexOf(jsonData.log[preRound - i].att_combat.atn) >= 0 && jsonData.log[preRound - i].didx == logData.aidx && jsonData.log[preRound - i].att_combat.ats == skillname) {
                SkillUserList.push([jsonData.log[preRound - i].att_combat.atn, preRound - i]);
            }
        }
    }
    //返回英雄列表
    return SkillUserList;
}
//统计毒喷伤害
function GroupPoisonSpit(logData,List,SkillName){
    if (List.length >0 ) {
        //生成50t内使用过毒喷的英雄列表
        var UserList = FindPoisonSpitUser(logData, SkillName);
        for (var i = 0; i < List.length; i++) {
            //时间最长的毒喷归属于最近使用毒喷技能的英雄，按顺序一一对应
            //灵魂操纵可能会导致毒数量多于释放技能人数，特殊处理，舍弃时间最短的一个
            if(UserList.length >0 && i < UserList.length) {
                SkillGroup(UserList[i][0], SkillName, 0, 0, 0, 0, Number(List[List.length - 1 - i][0]), 0, 0);
            }
        }
    }
}
//统计毒伤害
function GroupPoison(logData,List,SkillName) {
    if (List.length >0 ) {
        var UserList = FindSkillUser(logData, SkillName);
        for (var i = 0; i < List.length; i++) {
            //灵魂操纵可能会导致毒数量多于释放技能人数，特殊处理，舍弃时间最短的一个
            if(UserList.length >0 && i < UserList.length) {
                SkillGroup(UserList[i][0], SkillName, 0, 0, 0, 0, Number(List[List.length - 1 - i][0]), 0, 0);
            }
        }
    }
}

/// <summary>
/// 设置summary
/// </summary>
function SummaryBoard() {
    $(charactersArray).each(function () {
        $(".summary tbody").empty();
        $(charactersArray).each(function () {
            $node = $('<tr><th scope="row">' + ($(".summary tbody").find("tr").length + 1) + '</th><td>' + this.name + '</td><td>' + this.dmg + '</td><td>' + this.heal + '</td></tr>');
            $(".summary tbody").append($node);
        });
    });
}