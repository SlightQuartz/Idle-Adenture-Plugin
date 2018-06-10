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

function Echart_build(chartOption, $chart) {
    $chart.empty();
    $chart.removeAttr("_echarts_instance_");
    var charactersChart = echarts.init($chart[0]);
	if (chartOption && typeof chartOption === "object") {
        charactersChart.setOption(chartOption, true);
	}
}



