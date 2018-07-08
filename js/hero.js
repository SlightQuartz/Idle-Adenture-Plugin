var skillDataLength = 0;
function HeroDate() {
    this.id = null;
    this.name = null;
    var skillGroup = [];
    var info = {
        dmg: 0,      //总伤害
        heal: 0,     //总治疗
        act: 0,      //行动回合
        asTarget: 0, //被作为目标回合
        hit: 0,      //总攻击次数
        injured: 0,  //总被击次数
        crit: 0,     //暴击次数
        crited: 0,   //被暴击次数
        dodged: 0,   //被闪避次数
        dodge: 0,    //闪避次数
        blocked: 0,  //被格挡次数
        block: 0     //格挡次数
    };
    var defend = {
        dmg: 0,       //总伤害
        heal: 0,      //总治疗
        injuredDmg: 0,//总受伤
        ignoredDmg: 0,//无视伤害
        dodgeDmg: 0, //躲避伤害
        blockDmg: 0, //格挡伤害
        // 因无法区分重名角色，故暂不统计
        injuredAoe: 0,//总aoe受伤
        injuredDot: 0,//总dot受伤
    };
    var hp = [];

    this.SetID = function(idValue,nameValue) {
        this.id = idValue;
        this.name = nameValue;
    };
    Object.defineProperty(this, "skill", {
        get: function () {
            return skillGroup;
        },
        set: function (array) {
            //array[skillName,dmgA,aoeD,dotD,healA,aoeH,dotH,times]
            let exist = false;
            $(skillGroup).each(function () {
                if (this.name == array[0]) {
                    if (array[1] > 0) { this.dmgA.push(array[1]); }
                    while (skillDataLength > 0 && this.dmgA.length > skillDataLength) { this.dmgA.shift(); }
                    if (array[2] > 0) { this.aoeD.push(array[2]); }
                    while (skillDataLength > 0 && this.aoeD.length > skillDataLength) { this.aoeD.shift(); }
                    if (array[3] > 0) { this.dotD.push(array[3]); }
                    while (skillDataLength > 0 && this.dotD.length > skillDataLength) { this.dotD.shift(); }
                    if (array[4] > 0) { this.healA.push(array[4]); }
                    while (skillDataLength > 0 && this.healA.length > skillDataLength) { this.healA.shift(); }
                    if (array[5] > 0) { this.aoeH.push(array[5]); }
                    while (skillDataLength > 0 && this.aoeH.length > skillDataLength) { this.aoeH.shift(); }
                    if (array[6] > 0) { this.dotH.push(array[6]); }
                    while (skillDataLength > 0 && this.dotH.length > skillDataLength) { this.dotH.shift(); }
                    this.times += Number(array[7]);
                    exist = true;
                    info.dmg += array[1] + array[2] + array[3];
                    info.heal += array[4] + array[5] + array[6];
                    return false;
                }
            });
            if (!exist) {
                var skillItem = {
                    name: array[0],
                    dmgA : [],
                    aoeD : [],
                    dotD : [],
                    healA : [],
                    aoeH : [],
                    dotH: [],
                    times: Number(array[7])
                }
                if (array[1]>0){skillItem.dmgA.push(array[1]);}
                if (array[2]>0){skillItem.aoeD.push(array[2]);}
                if (array[3]>0){skillItem.dotD.push(array[3]);}
                if (array[4]>0){skillItem.healA.push(array[4]);}
                if (array[5]>0){skillItem.aoeH.push(array[5]);}
                if (array[6]>0){skillItem.dotH.push(array[6]);}
                info.dmg += array[1] + array[2] + array[3];
                info.heal += array[4] + array[5] + array[6];
                skillGroup.push(skillItem);
            }
        }
    });
    Object.defineProperty(this, "info", {
        get: function () {
            return info;
        }
    });
    this.hit = function (hit, crit, dodged, blocked) {
        info.act++;
        info.hit += hit;
        info.crit += crit;
        info.dodged += dodged;
        info.blocked += blocked;
    };
    this.injured = function (injured, crited, dodge, block) {
        info.asTarget++;
        info.injured += injured;
        info.crited += crited;
        info.dodge += dodge;
        info.block += block;
    };

    Object.defineProperty(this, "defend", {
        get: function () {
            defend.dmg = info.dmg;
            defend.heal = info.heal;
            defend.dodgeDmg = Math.round((defend.injuredDmg + defend.ignoredDmg) * info.dodge / (info.injured - info.dodge - info.block));
            defend.blockDmg = Math.round((defend.injuredDmg + defend.ignoredDmg) * info.block / (info.injured - info.dodge - info.block));
            return defend;
        },
        set: function (array) {
            //array[injuredDmg, ignoredDmg, injuredAoe, injuredDot]
            defend.injuredDmg += Number(array[0]);
            defend.ignoredDmg += Number(array[1]);
            // 因无法区分重名角色，故暂不统计
            defend.injuredAoe += Number(array[2]);
            defend.injuredDot += Number(array[3]);
        }
    });

    Object.defineProperty(this, "hp", {
        get: function () {
            return hp;
        },
        set: function (data) {
            hp.push(Number(data));
            while (HPLength > 0 && hp.length > HPLength) {
				hp.shift();
			}
        }
    });
	
}
            
                    