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
                if (this.name == array[0]){
                    this.dmgA.push(array[1]);
                    this.aoeD.push(array[2]);
                    this.dotD.push(array[3]);
                    this.healA.push(array[4]);
                    this.aoeH.push(array[5]);
                    this.dotH.push(array[6]);
                    //this.times.push(array[7]);
                    this.times += Number(array[7]);
                    exist = true;
                    info.dmg += array[1] + array[2] + array[3];
                    info.heal += array[4] + array[5] + array[6];
                    return;
                }
            });
            if (!exist) {
                var skillItem = {
                    name: [array[0]],
                    dmgA : [array[1]],
                    aoeD : [array[2]],
                    dotD : [array[3]],
                    healA : [array[4]],
                    aoeH : [array[5]],
                    dotH: [array[6]],
                    times: Number(array[7])
                }
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
            return defend;
        },
        set: function (array) {
            //array[injuredDmg, ignoredDmg, injuredAoe, injuredDot]
            defend.injuredDmg += Number(array[0]);
            defend.ignoredDmg += Number(array[1]);
            defend.dodgeDmg = Math.round((defend.injuredDmg + defend.ignoredDmg) * info.dodge / (info.injured - info.dodge - info.block));
            defend.blockDmg = Math.round((defend.injuredDmg + defend.ignoredDmg) * info.block / (info.injured - info.dodge - info.block));
            // 因无法区分重名角色，故暂不统计
            defend.injuredAoe += Number(array[2]);
            defend.injuredDot += Number(array[3]);
        }
    });
}
            
                    