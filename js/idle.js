var jsonData = null;
var basicInfo = { startTime: null, endTime: null, exp: 0, gold: 0, roundW: 0, roundL: 0, roundD: 0, turns: [] };
var heroList = [];
var heroIDList = [];

$(document).ready(function () {
    //Main();
    basicInfo.startTime = new Date();
    $(".basicInfo li>span").eq(0).html([basicInfo.startTime.getFullYear(), basicInfo.startTime.getMonth() + 1, basicInfo.startTime.getDate()].join('-')
        + ' ' + [basicInfo.startTime.getHours(), basicInfo.startTime.getMinutes(), basicInfo.startTime.getSeconds()].join(':'));
});

/// <summary>
/// 重设所有数据和统计图，每次获得json数据后调用
/// </summary>
function ResetAll() {
    basicInfo.endTime = new Date();
    Show_BasicBoard();
    SetExpChart(jsonData.geff.e, jsonData.geff.g);
    LogsCal();
    Show_SkillBoards();
    Show_SummaryBoard();
    Show_HeroInfoBoard();
    SetSummaryChart();
    SetHeroCharts();
}

/// <summary>
/// 分析统计战斗json中的log
/// </summary>
function LogsCal() {
    ResetCharacterID(function () {
        $.each(jsonData.log, function (index, value) {
            LogCal(value);
            HitByFoe(value);
        });
    });
}

function ResetCharacterID(callback) {
    heroIDList = [];
    if (heroList.length == 0) {
        $.each(jsonData.myc, function (index, value) {
            var newHero = new HeroDate();
            newHero.SetID(value.idx, value.nam);
            heroList.push(newHero);
            heroIDList.push(value.idx);
            $(".hero").eq(index).addClass("active");
            $(".hero").eq(index).find(".panel-heading").html(value.nam);
        });
    } else {
        let indexList = [];
        $.each(jsonData.myc, function (index, value) {
            let idx = value.idx;
            let nam = value.nam;
            $.each(heroList, function (index, value) {
                console.log(heroList[index].name);
                if (heroList[index].name == nam && indexList.indexOf(index) == -1) {
                    heroList[index].id = idx;
                    indexList.push(index);
                    return false;
                }
            });
            heroIDList.push(value.idx);
        });
    }
    callback();
}

/// <summary>
/// 分析统计单个log
/// </summary>
/// <param name="logData">单个log对象</param>
function LogCal(logData) {
    //己方回合
    //根据idx判断，避免与怪物重名
    if (heroIDList.indexOf(Number(logData.aidx)) >= 0) {
        var aoeD = 0;
        var aoeH = 0;
        var BS2 = 0; //炽热之星2判定
        $(logData.att_spec).each(function () {
            if (this.skn == "炽焰之星") {
                SkillGroup(logData.aidx, "炽焰之星", 0, 0, 0, 0, Number(this.dmg), 0);
            }
            if (this.skn == "炽焰之星II") { BS2 = Number(this.admg); }
        });
        $(logData.aoe_combat).each(function () {
            if (BS2 != 0) {
                if (Number(this.d) == BS2) { SkillGroup(logData.aidx, "炽焰之星II", 0, 0, 0, 0, BS2, 0); }
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
            SkillGroup(logData.aidx, this.skn, 0, 0, 0, 0, roundD, roundH);
        });
        $(logData.att_aura).each(function () {
            if (this.d != null || this.heal != null) {
                //追溯使用者
                //console.log(jsonData.log.indexOf(logData)+this.skn+ FindAuraUser(this.skn, logData, this.rds));
                SkillGroup(FindAuraUser(this.skn, logData, this.rds), this.skn, 0, 0, 0, 0, this.d == null ? 0 : Number(this.d), this.heal == null ? 0 : Number(this.heal));
            }
        });
        SkillGroup(logData.aidx, logData.att_combat.ats, Number(logData.att_combat.d)/*伤害*/ + Number(logData.att_combat.hpf)/*吸血*/, Number(logData.att_combat.Heal) + Number(logData.att_combat.hpf)/*吸血*/ + Number(logData.att_combat.phe)/*被动吸血*/, aoeD, aoeH, 0, 0);
    }
    //敌方回合
    if (heroIDList.indexOf(Number(logData.didx)) >= 0) {
        if (Number(logData.att_combat.ct) > 0) {
            for (var i = 0; i < logData.att_combat.cnt; i++) {
                SkillGroup(logData.didx, "反击", Math.round(Number(logData.att_combat.ct) / logData.att_combat.cnt), 0, 0, 0, 0, 0);
            }
        }
        if (Number(logData.att_combat.dbk) > 0) {
            SkillGroup(logData.didx, "反弹", Number(logData.att_combat.dbk), 0, 0, 0, 0, 0);
        }
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
        if (logData.att_poison != null) {
            for (var i = 0; i < logData.att_poison.length; i++) {
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
            GroupPoisonSpit(logData, PoisonSpitList, "毒雾喷射");
            //毒喷2伤害统计
            GroupPoisonSpit(logData, PoisonSpit2List, "毒雾喷射II");
            GroupPoison(logData, PoisonList1, "毒牙");
            GroupPoison(logData, PoisonList2, "异域毒刃");
            GroupPoison(logData, PoisonList3, "空虚");
            GroupPoison(logData, PoisonList4, "瘟疫之触");
            GroupPoison(logData, PoisonList5, "异域毒刃II");
            GroupPoison(logData, PoisonList6, "瘟疫之触II");
            GroupPoison(logData, PoisonList7, "瘟疫之触III");
            GroupPoison(logData, PoisonList8, "梦魇毒域");
        }

        //逆恶魔统计
        if (logData.att_spec != null) {
            $(logData.att_spec).each(function () {
                if (this.skn == "束缚") {
                    var ShacklesUserList = FindSkillUser(logData, "束缚");
                    if (ShacklesUserList.length > 0) {
                        SkillGroup(ShacklesUserList[0][0], "束缚", 0, 0, 0, 0, Number(this.rmh), 0);
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
function SkillGroup(heroID, skillName, DmgA, HealA, AOED, AOEH, DotD, DotH) {
    DmgA = Number(DmgA);
    HealA = Number(HealA);
    AOED = Number(AOED);
    AOEH = Number(AOEH);
    DotD = Number(DotD);
    DotH = Number(DotH);
    $(heroList).each(function () {
        if (this.id == Number(heroID)) {
            this.skill = [skillName, DmgA, AOED, DotD, HealA, AOEH, DotH];
            return false;
        }
    });
}


/// <summary>
/// 追溯光环使用者
/// </summary>
/// <param name="auraName">光环名</param>
/// <param name="logData">log条目数据</param>
/// <param name="rds">光环轮数</param>
/// <returns>使用者</returns>
function FindAuraUser(auraName, logData, rds) {
    var userID = null;
    var preRound = jsonData.log.indexOf(logData);
    // 寻找自身光环最初起效回合
    for (var i = 2; i < 7; i++) {
        if (jsonData.log[preRound - i].aidx == logData.aidx) {
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
            if (jsonData.log[preRound - i].att_combat.ats.indexOf(auraName) != -1) {
                userID = jsonData.log[preRound - i].aidx;
                break;
            }
        }
    }
    //找不到使用者，最初回合的角色作为使用者
    if (userID == null) {
        userID = jsonData.log[preRound].aidx;
    }
    return userID;
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
function FindPoisonSpitUser(logData, skillname) {
    var PoisonSpitUserList = [];
    var preRound = jsonData.log.indexOf(logData);
    for (var i = 1; i < 50; i++) {
        if (preRound - i < 0) { break; }
        else {
            if (heroList.indexOf(jsonData.log[preRound - i].aidx) >= 0 &&
                jsonData.log[preRound - i].att_combat.ats == skillname) {
                PoisonSpitUserList.push([jsonData.log[preRound - i].aidx, preRound - i]);
            }
        }
    }
    //返回英雄列表
    return PoisonSpitUserList;
}

//生成最近使用某技能的序列
function FindSkillUser(logData, skillname) {
    var SkillUserList = [];
    var preRound = jsonData.log.indexOf(logData);
    for (var i = 1; i < 50; i++) {
        if (preRound - i < 0) { break; }
        else {
            //判断条件：1.己方英雄 2.对当前目标使用过技能 3.技能名判定
            if (heroList.indexOf(jsonData.log[preRound - i].aidx) >= 0 &&
                jsonData.log[preRound - i].didx == logData.aidx &&
                jsonData.log[preRound - i].att_combat.ats == skillname) {
                SkillUserList.push([jsonData.log[preRound - i].aidx, preRound - i]);
            }
        }
    }
    //返回英雄列表
    return SkillUserList;
}
//统计毒喷伤害
function GroupPoisonSpit(logData, List, SkillName) {
    if (List.length > 0) {
        //生成50t内使用过毒喷的英雄列表
        var UserList = FindPoisonSpitUser(logData, SkillName);
        for (var i = 0; i < List.length; i++) {
            //时间最长的毒喷归属于最近使用毒喷技能的英雄，按顺序一一对应
            //灵魂操纵可能会导致毒数量多于释放技能人数，特殊处理，舍弃时间最短的一个
            if (UserList.length > 0 && i < UserList.length) {
                SkillGroup(UserList[i][0], SkillName, 0, 0, 0, 0, Number(List[List.length - 1 - i][0]), 0, 0);
            }
        }
    }
}
//统计毒伤害
function GroupPoison(logData, List, SkillName) {
    if (List.length > 0) {
        var UserList = FindSkillUser(logData, SkillName);
        for (var i = 0; i < List.length; i++) {
            //灵魂操纵可能会导致毒数量多于释放技能人数，特殊处理，舍弃时间最短的一个
            if (UserList.length > 0 && i < UserList.length) {
                SkillGroup(UserList[i][0], SkillName, 0, 0, 0, 0, Number(List[List.length - 1 - i][0]), 0, 0);
            }
        }
    }
}

/// <summary>
/// 命中统计
/// </summary>
/// <param name="logData">单个log对象</param>
function HitByFoe(logData) {
    if (heroIDList.indexOf(Number(logData.didx)) >= 0) {
        $(heroList).each(function () {
            if (this.id == logData.didx) {
                if (Number(logData.att_combat.atc) > 0 && Number(logData.att_combat.d) == 0 && Number(logData.att_combat.dc) == 0 && Number(logData.att_combat.dr) > 0) {
                    this.injured(Number(logData.att_combat.atc), Number(logData.att_combat.cc), Number(logData.att_combat.dc), 1);
                } else {
                    this.injured(Number(logData.att_combat.atc), Number(logData.att_combat.cc), Number(logData.att_combat.dc),0);
                }
                return false;
            }
        });
    }
    else {
        $(heroList).each(function () {
            if (this.id == logData.aidx) {
                if (Number(logData.att_combat.atc) > 0 && Number(logData.att_combat.d) == 0 && Number(logData.att_combat.dc) == 0 && Number(logData.att_combat.dr) > 0) {
                    this.hit(Number(logData.att_combat.atc), Number(logData.att_combat.cc), Number(logData.att_combat.dc), 1);
                } else {
                    this.hit(Number(logData.att_combat.atc), Number(logData.att_combat.cc), Number(logData.att_combat.dc), 0);
                }
                return false;
            }
        });
    }
}