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
    option_exp.series[0].data.push(expValue);
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
        data:[ 'Dmg', 'Heal']
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
        }
    ]
};

/// <summary>
/// 重设summary图标，使用charactersArray数据
/// </summary>
function SetSummaryChart() {
    option_characters.yAxis[0].data = [];
    option_characters.series[0].data = [];
    option_characters.series[1].data = [];
    $(heroList).each(function () {
        option_characters.yAxis[0].data.push(this.name);
        option_characters.series[0].data.push(this.info.dmg);
        option_characters.series[1].data.push(this.info.heal);
    });
    Echart_build(option_characters, $("#CharactersChart"));
}

var option_skill = {
    tooltip : {
        trigger: 'axis',
        axisPointer : {
            type : 'shadow'
        }
    },
    legend: {
        data: ['D.A', 'D.aoe', 'D.dot', 'H.A', 'H.aoe', 'H.dot']
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
            name: 'D.dot',
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
            name: 'H.dot',
            type: 'bar',
            stack: '伤害',
            label: {
            },
            data: [150, 212, 201, 302, 301]
        }
    ]
};
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
            { name: 'Dmg',max: 1500},
            { name: 'Crit', max: 30},
            { name: 'Dodged', max: 30},
            { name: 'Blocked', max: 30},
            { name: 'Heal', max: 1500},
            { name: 'Crited', max: 30},
            { name: 'Dodge', max: 30},
            { name: 'Block', max: 30}
        ]
    },
    series: [{
        type: 'radar',
        // areaStyle: {normal: {}},
        data : [
            {
                value: [0, 0, 0, 0, 0, 0, 0, 0],
                name : 'hero_1'
            },
            {
                value: [0, 0, 0, 0, 0, 0, 0, 0],
                name: 'hero_2'
            },
            {
                value: [0, 0, 0, 0, 0, 0, 0, 0],
                name: 'hero_3'
            }
        ]
    }]
};

function SetHeroCharts() {
    var dataGroup = [1000, 20, 20, 20, 500, 20, 20, 20];
    $.each(heroList, function (index, value) {
        option_hero.series[0].data[index].name = this.name;
        option_hero.legend.selected[this.name] = true;
        var dataValue = 
                   [Number(Math.round(this.info.dmg / this.info.act)),
                    Number(Math.round(this.info.crit*100 / this.info.hit)),
                    Number(Math.round(this.info.dodged * 100 / this.info.hit)),
                    Number(Math.round(this.info.blocked * 100 / this.info.hit)),
                    Number(Math.round(this.info.heal / this.info.act)),
                    Number(Math.round(this.info.crited * 100 / this.info.injured)),
                    Number(Math.round(this.info.dodge * 100 / this.info.injured)),
                    Number(Math.round(this.info.block * 100 / this.info.injured))];

        $.each(dataGroup, function (index ,value) {
            if (value < dataValue[index]) {
                dataGroup[index] = dataValue[index];
            }
        });
        option_hero.series[0].data[index].value = dataValue;
    });
    option_hero.radar.indicator = [
        { name: 'Dmg', max: dataGroup[0] },
        { name: 'Crit', max: dataGroup[1] },
        { name: 'Dodged', max: dataGroup[2] },
        { name: 'Blocked', max: dataGroup[3] },
        { name: 'Heal', max: dataGroup[4] },
        { name: 'Crited', max: dataGroup[5] },
        { name: 'Dodge', max: dataGroup[6] },
        { name: 'Block', max: dataGroup[7] }
    ]
    $.each(heroList, function (index, value) {
        $.each(heroList, function (index, value) {
            option_hero.legend.selected[this.name] = false;
        });
        option_hero.legend.selected[this.name] = true;
        Echart_build(option_hero, $(".heroChart>div").eq(index));
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



