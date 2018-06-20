/// <summary>
/// 重设左上基本信息
/// </summary>
function Show_BasicBoard() {
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
/// 清空charactersArray数据，并重设角色技能伤害的图和表格
/// </summary>
function Show_SkillBoards() {
    $.each(heroList, function (index, value) {
        var chartData = SkillBoard($(".hero .panel>table").eq(index).find("tbody"), this.skill);
        SetSkillChart(index, chartData);
    });
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
    var dmgASum = data.dmgA.reduce((acc, val) => acc + val, 0);
    var dmgCount = CountWithoutZero(data.dmgA);
    if (dmgCount != 0) {
        $item.find("td").eq(2).html(Math.round(dmgASum / dmgCount) + "*" + dmgCount);
    } else {
        $item.find("td").eq(2).html(0);
    }
    var aoeDSum = data.aoeD.reduce((acc, val) => acc + val, 0);
    var aoeDCount = CountWithoutZero(data.aoeD);
    if (aoeDCount != 0) {
        $item.find("td").eq(3).html(Math.round(aoeDSum / aoeDCount) + "*" + aoeDCount);
    } else {
        $item.find("td").eq(3).html(0);
    }
    var dotDSum = data.dotD.reduce((acc, val) => acc + val, 0);
    var dotDCount = CountWithoutZero(data.dotD);
    if (dotDCount != 0) {
        $item.find("td").eq(4).html(Math.round(dotDSum / dotDCount) + "*" + dotDCount);
    } else {
        $item.find("td").eq(4).html(0);
    }
    var dmgSum = dmgASum + aoeDSum + dotDSum;
    $item.find("td").eq(1).html(dmgSum);

    var healASum = data.healA.reduce((acc, val) => acc + val, 0);
    var healCount = CountWithoutZero(data.healA);
    if (healCount != 0) {
        $item.find("td").eq(6).html(Math.round(healASum / healCount) + "*" + healCount);
    } else {
        $item.find("td").eq(6).html(0);
    }
    var aoeHSum = data.aoeH.reduce((acc, val) => acc + val, 0);
    var aoeHCount = CountWithoutZero(data.aoeH);
    if (aoeHCount != 0) {
        $item.find("td").eq(7).html(Math.round(aoeHSum / aoeHCount) + "*" + aoeHCount);
    } else {
        $item.find("td").eq(7).html(0);
    }
    var dotHSum = data.dotH.reduce((acc, val) => acc + val, 0);
    var dotHCount = CountWithoutZero(data.dotH);
    if (dotHCount != 0) {
        $item.find("td").eq(8).html(Math.round(dotHSum / dotHCount) + "*" + dotHCount);
    } else {
        $item.find("td").eq(8).html(0);
    }
    var healSum = healASum + aoeHSum + dotHSum;
    $item.find("td").eq(5).html(healSum);
    return [data.name[0], dmgASum, aoeDSum, dotDSum, healASum, aoeHSum, dotHSum];
}

/// <summary>
/// 设置summary
/// </summary>
function Show_SummaryBoard() {
    $(".summary tbody").empty();
    var totaldmg = 0;
    var totalheal = 0;
    var totalinjured = 0;
    var totalignore = 0;
    $(heroList).each(function () {
        totaldmg += this.info.dmg;
        totalheal += this.info.heal;
        totalinjured += this.defend.injuredDmg + this.defend.injuredAoe + this.defend.injuredDot;
    });
    $(heroList).each(function () {
        $node = $('<tr><th scope="row">' + ($(".summary tbody").find("tr").length + 1) + '</th><td>' + this.name + '</td><td>'
            + this.info.dmg +'&nbsp;('+((totaldmg>0)?(this.info.dmg*100/totaldmg).toFixed(2):0) +'%)</td><td>'
            + this.info.heal + '&nbsp;(' + ((totalheal > 0) ? (this.info.heal * 100 / totalheal).toFixed(2) : 0) + '%)</td><td>'
            + this.defend.injuredDmg + '&nbsp;(' + ((totalinjured > 0) ? (this.defend.injuredDmg * 100 / totalinjured).toFixed(2) : 0) + '%)</td><td>'
            + (this.defend.ignoredDmg + this.defend.dodgeDmg + this.defend.blockDmg) + '&nbsp;(' + ((this.defend.injuredDmg + this.defend.ignoredDmg + this.defend.dodgeDmg + this.defend.blockDmg > 0) ? ((this.defend.ignoredDmg + this.defend.dodgeDmg + this.defend.blockDmg) * 100 / (this.defend.injuredDmg + this.defend.ignoredDmg + this.defend.dodgeDmg + this.defend.blockDmg)).toFixed(2) : 0) + '%)</td><td>'
            + this.defend.injuredAoe + '&nbsp;(' + ((totalinjured > 0) ? (this.defend.injuredAoe * 100 / totalinjured).toFixed(2) : 0) + '%)</td><td>'
            + this.defend.injuredDot + '&nbsp;(' + ((totalinjured > 0) ? (this.defend.injuredDot * 100 / totalinjured).toFixed(2) : 0) + '%)</td></tr>');
        $(".summary tbody").append($node);
    });
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
/// 设置角色信息
/// </summary>
function Show_HeroInfoBoard(){
    $.each(heroList,function (index,value) {
        $(".panel-body table").eq(index).find("td").eq(0).html(this.info.dmg);
        $(".panel-body table").eq(index).find("td").eq(1).html(this.info.heal);
        $(".panel-body table").eq(index).find("td").eq(2).html(Math.round(this.info.dmg/this.info.act));
        $(".panel-body table").eq(index).find("td").eq(3).html(Math.round(this.info.heal/this.info.act));
        $(".panel-body table").eq(index).find("td").eq(4).html(this.info.hit);
        $(".panel-body table").eq(index).find("td").eq(5).html(this.info.injured);
        $(".panel-body table").eq(index).find("td").eq(6).html(Math.round(this.info.crit * 100 / this.info.hit) + "%(" + this.info.crit + ")");
        $(".panel-body table").eq(index).find("td").eq(7).html(Math.round(this.info.crited * 100 / this.info.injured) + "%(" + this.info.crited + ")");
        $(".panel-body table").eq(index).find("td").eq(8).html(Math.round(this.info.dodged * 100 / this.info.hit) + "%(" + this.info.dodged + ")");
        $(".panel-body table").eq(index).find("td").eq(9).html(Math.round(this.info.dodge * 100 / this.info.injured) + "%(" + this.info.dodge + ")");
        $(".panel-body table").eq(index).find("td").eq(10).html(Math.round(this.info.blocked * 100 / this.info.hit) + "%(" + this.info.blocked + ")");
        $(".panel-body table").eq(index).find("td").eq(11).html(Math.round(this.info.block * 100 / this.info.injured) + "%(" + this.info.block + ")");
    });
}
