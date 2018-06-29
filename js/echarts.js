var option_exp = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:['Exp','Gold']
    },
    toolbox: {
        show: true,
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {},
        }
    },
    xAxis:  {
        type: 'category',
        boundaryGap: false,
        data: [0]
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            formatter: '{value}'
        }
    },
    series: [
        {
            name:'Exp',
            type:'line',
            data:[0],
            markLine: {
                data: [
                    [{
                        symbol: 'none',
                        x: '91%',
                        yAxis: 'max'
                    }, {
                        symbol: 'circle',
                        label: {
                            normal: {
                                position: 'start',
                            }
                        },
                        type: 'max',
                        name: 'Exp峰值'
                    }]
                ]
            }
        },
        {
            name:'Gold',
            type:'line',
            data:[0],
            markLine: {
                data: [
                    [{
                        symbol: 'none',
                        x: '91%',
                        yAxis: 'max'
                    }, {
                        symbol: 'circle',
                        label: {
                            normal: {
                                position: 'start',
                            }
                        },
                        type: 'max',
                        name: 'Gold峰值'
                    }]
                ]
            }
        }
    ]
};

/// <summary>
/// 为左上exp info折线图添加一组新的数据
/// </summary>
/// <param name="expValue">经验数值</param>
/// <param name="goldValue">金钱数值</param>
function SetExpChart(expValue, goldValue) {
    option_exp.xAxis.data.push(option_exp.xAxis.data.length);
    if (option_exp.series[0].data.length > option_exp.series[1].data.length) {
        option_exp.series[0].data.pop();
    }
    option_exp.series[0].data.push(expValue);
    if (autoBot) {
        var battleTurns = 0;
        var restTurns = 0;
        for (var i = 1; i <= autoRounds; i++) {
            battleTurns += basicInfo.turns[basicInfo.turns.length - i];
            restTurns += basicInfo.rest[basicInfo.rest.length - i];
        }
        option_exp.series[0].data.push(Math.round(1800 * (basicInfo.exp / autoRounds) / ((battleTurns + restTurns) / autoRounds + 1) * (autoRounds > 20 ? 20 : autoRounds / 20)));
    }
    if (option_exp.xAxis.data.length < option_exp.series[0].data.length) {
        option_exp.xAxis.data.push(option_exp.xAxis.data.length);
    }
    option_exp.series[1].data.push(goldValue);
    Echart_build(option_exp, $("#expChart"));
}

var option_characters = {
    tooltip : {
        trigger: 'axis',
        axisPointer : {
            type : 'shadow'
        }
    },
    legend: {
        data: ['Dmg', 'Heal', "Injured", "Ignored", "Injured.aoe","Injured.dot"]
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'value'
        }
    ],
    yAxis : [
        {
            type : 'category',
            axisTick : {show: false},
            data : ['Hero_1','Hero_2','Hero_3']
        }
    ],
    series : [
        {
            name:'Dmg',
            type:'bar',
            stack: 'a',
            label: {
                normal: {
                    show: true,
                }
            },
            data:[120, 132, 101]
        },
        {
            name:'Heal',
            type: 'bar',
            stack: 'a',
            label: {
                normal: {
                    show: true
                }
            },
            data:[320, 302, 341]
        },
        {
            name: 'Injured',
            type: 'bar',
            stack: 'a',
            label: {
                normal: {
                    show: true
                }
            },
            data: [320, 302, 341]
        },
        {
            name: 'Ignored',
            type: 'bar',
            stack: 'a',
            label: {
                normal: {
                    show: true
                }
            },
            data: [320, 302, 341]
        },
        {
            name: 'Injured.aoe',
            type: 'bar',
            stack: 'a',
            label: {
                normal: {
                    show: true
                }
            },
            data: [320, 302, 341]
        },
        {
            name: 'Injured.dot',
            type: 'bar',
            stack: 'a',
            label: {
                normal: {
                    show: true
                }
            },
            data: [320, 302, 341]
        }
    ]
};

var summaryChart = true;
/// <summary>
/// 重设summary图标，使用charactersArray数据
/// </summary>
function SetSummaryChart() {
    if (summaryChart) {
        option_characters.yAxis[0].data = [];
        option_characters.series[0].data = [];
        option_characters.series[1].data = [];
        option_characters.series[2].data = [];
        option_characters.series[3].data = [];
        option_characters.series[4].data = [];
        option_characters.series[5].data = [];
        $(heroList).each(function () {
            option_characters.yAxis[0].data.push(this.name);
            option_characters.series[0].data.push(this.info.dmg);
            option_characters.series[1].data.push(this.info.heal);
            option_characters.series[2].data.push(-this.defend.injuredDmg);
            option_characters.series[3].data.push(-this.defend.ignoredDmg - this.defend.dodgeDmg - this.defend.blockDmg);
            option_characters.series[4].data.push(-this.defend.injuredAoe);
            option_characters.series[5].data.push(-this.defend.injuredDot);
        });
        Echart_build(option_characters, $("#CharactersChart"));
    }
    else {
        option_hp.xAxis.data = option_hp_turn;
        $.each(heroList, function (index, data) {
            option_hp.legend.data.push(data.name);
            option_hp.series[index].name = data.name;
            option_hp.series[index].data = data.hp;
        });
        Echart_build(option_hp, $("#CharactersChart"));
    }
    
}

var option_skill = {
    tooltip : {
        trigger: 'axis',
        axisPointer : {
            type : 'shadow'
        }
    },
    legend: {
        data: ['D.A', 'D.aoe', 'D.ot', 'H.A', 'H.aoe', 'H.ot']
    },
    grid: {
        top: '20%',
        left: '3%',
        right: '4%',
        bottom: '2%',
        containLabel: true
    },
    xAxis:  {
        type: 'value'
    },
    yAxis: {
        type: 'category',
        data: ['Skill_1','Skill_2','Skill_3','Skill_2','Skill_3']
    },
    series: [
        {
            name: 'D.A',
            type: 'bar',
            stack: '伤害',
            label: {
            },
            data: [-320, -302, -301, -302, -301]
        },
        {
            name: 'D.aoe',
            type: 'bar',
            stack: '伤害',
            label: {
            },
            data: [120, 132, 101, 302, 301]
        },
        {
            name: 'D.ot',
            type: 'bar',
            stack: '伤害',
            label: {
            },
            data: [120, 132, 101, 302, 301]
        },
        {
            name: 'H.A',
            type: 'bar',
            stack: '伤害',
            label: {
            },
            data: [220, 182, 191, 302, 301]
        },
        {
            name: 'H.aoe',
            type: 'bar',
            stack: '伤害',
            label: {
            },
            data: [150, 212, 201, 302, 301]
        },
        {
            name: 'H.ot',
            type: 'bar',
            stack: '伤害',
            label: {
            },
            data: [150, 212, 201, 302, 301]
        }
    ]
};

/// <summary>
/// 绘制技能表
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
    });

    $(".skillChart>div").eq(index).empty();
    $(".skillChart>div").eq(index).removeAttr("_echarts_instance_");
    var skillChart = echarts.init($(".skillChart>div")[index]);
    if (option_skill && typeof option_skill === "object") {
        skillChart.setOption(option_skill, true);
    }
}

option_hero = {
    tooltip: {},
    legend:{ 
        selected: {
        },
        show:false
    },
    radar: {
        // shape: 'circle',
        name: {
            textStyle: {
                color: '#999',
           }
        },
        indicator: [
            { name: 'Injured', max: 0 },
            { name: 'Dmg',max: 0},
            { name: 'Ignored', max: 0 },
            { name: 'Heal', max: 0 }
        ]
    },
    series: [{
        type: 'radar',
        // areaStyle: {normal: {}},
        data : [
            {
                value: [0, 0, 0, 0],
                name : 'hero_1'
            },
            {
                value: [0, 0, 0, 0],
                name: 'hero_2'
            },
            {
                value: [0, 0, 0, 0],
                name: 'hero_3'
            }
        ]
    }]
};

function SetHeroCharts() {
    var dataGroup = [0,0];
    $.each(heroList, function (index, value) {
        option_hero.series[0].data[index].name = this.name+index;
        option_hero.legend.selected[this.name + index] = true;
        var dataValue = [
            Number(Math.round(this.defend.injuredDmg / this.info.asTarget)),
            Number(Math.round(this.info.dmg / this.info.act)),
            Number(Math.round((this.defend.ignoredDmg + this.defend.dodgeDmg + this.defend.blockDmg) / this.info.asTarget)),
            Number(Math.round(this.info.heal / this.info.act))];

        if (dataValue[0] > dataGroup[1]) { dataGroup[1] = dataValue[0]; }
        if (dataValue[1] > dataGroup[0]) { dataGroup[0] = dataValue[1]; }
        if (dataValue[2] > dataGroup[1]) { dataGroup[1] = dataValue[2]; }
        if (dataValue[3] > dataGroup[0]) { dataGroup[0] = dataValue[3]; }
        option_hero.series[0].data[index].value = dataValue;
    });
    option_hero.radar.indicator = [
        { name: 'Injured', max: dataGroup[1] },
        { name: 'Dmg', max: dataGroup[0] },
        { name: 'Ignored', max: dataGroup[1] },
        { name: 'Heal', max: dataGroup[0] }
    ]
    $.each(heroList, function (index_0, value) {
        $.each(heroList, function (index_1, value) {
            option_hero.legend.selected[this.name + index_1] = false;
        });
        option_hero.legend.selected[this.name + index_0] = true;
        Echart_build(option_hero, $(".heroChart>div").eq(index_0));
    });
}

function Echart_build(chartOption, $chart) {
    $chart.empty();
    $chart.removeAttr("_echarts_instance_");
    var charactersChart = echarts.init($chart[0]);
	if (chartOption && typeof chartOption === "object") {
        charactersChart.setOption(chartOption, true);
	}
}
var HPLength = 800;
var option_hp_skillName = [];
var option_hp_turn = [];
var option_hp = {
    xAxis: {
        type: 'category',
        data: []
    },
    yAxis: {
        type: 'value'
    },
    legend: {
        data: []
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            label: {
                backgroundColor: '#6a7985',
                formatter: function (params) {
                    return option_hp_turn[params.seriesData[0].dataIndex] + " " +option_hp_skillName[params.seriesData[0].dataIndex];
                }
            }
        }
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {},
        }
    },
    dataZoom: [
        {
            show: true,
            startValue: 0
        }
    ],
    series: [{
            name: '',
            data: [],
            type: 'line'
        },
        {
            name: '',
            data: [],
            type: 'line'
        },
        {
            name: '',
            data: [],
            type: 'line'
        }]
};

