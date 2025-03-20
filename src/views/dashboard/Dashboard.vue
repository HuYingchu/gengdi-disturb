<template>
    <div id="dashboard-module">
        <div class="section-title">
            环境质量安全类别统计
        </div>
        <div class="summary section">
            <div class="summary-item"
                v-for="item of summaryData">
                <div class="summary-title">
                    {{ item.title }} - {{ item.percent }}
                </div>
                <div class="summary-content">
                    <div class="summary-graph"
                        :style="{'background-color': item.graphColor}">
                    </div>
                    <div class="summary-data">
                        {{ item.data }}<span class="summary-unit"> {{ item.unit }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="section">
            <div class="graph-container"
                 v-for="item of graphData.slice(0, 2)"
                 :style="{'width': item.graphWidth}">
                <div class="graph-title">{{ item.graphTitle }}</div>
                <div class="graph-wrapper" :ref="item.graphRef"></div>
            </div>
        </div>
        <div class="section-title">
            种植结构统计
        </div>
        <div class="section">
            <div class="graph-container"
                 v-for="item of graphData.slice(2, 4)"
                 :style="{'width': item.graphWidth}">
                <div class="graph-title">{{ item.graphTitle }}</div>
                <div class="graph-wrapper" :ref="item.graphRef"></div>
            </div>
        </div>
        <normal-footer></normal-footer>
    </div>
</template>

<script>
import NormalFooter from '@/components/window/NormalFooter';
import echarts from 'echarts';

export default {
    name: "Dashboard",
    components: {
        NormalFooter: NormalFooter
    },
    data() {
        return {
            fetchedData: {
                'quality_type': null,
                'crop_type': null
            },
            summaryData: [
                {'title': '耕地总面积', 'percent': '-%', 'data': 'NaN', 'unit': '亩', 'graphColor': '#aaa'},
                {'title': '安全利用类', 'percent': '-%', 'data': 'NaN', 'unit': '亩', 'graphColor': '#5db756'},
                {'title': '优先保护类', 'percent': '-%', 'data': 'NaN', 'unit': '亩', 'graphColor': '#ffd166'},
                {'title': '严格管控类', 'percent': '-%', 'data': 'NaN', 'unit': '亩', 'graphColor': '#ef476f'},
            ],
            graphData: [
                {'graphRef': '1', graphWidth: '32%', graphTitle: '江北区不同质量安全类别耕地面积统计', graphOption:  {
                        color: ['#5db756', '#ffd166', '#ef476f'],
                        legend: {
                            left: 'left',
                            bottom: 'bottom'
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                mark: {show: true},
                                dataView: {show: true, readOnly: false},
                                restore: {show: true},
                                saveAsImage: {show: true}
                            }
                        },
                        series: [
                            {
                                name: '面积模式',
                                type: 'pie',
                                radius: [50, 100],
                                center: ['50%', '40%'],
                                roseType: 'area',
                                itemStyle: {
                                    borderRadius: 8
                                },
                                data: [
                                    {value: 0, name: '安全利用类'},
                                    {value: 0, name: '优先保护类'},
                                    {value: 0, name: '严格管控类'},
                                ]
                            }
                        ]
                    }},
                {'graphRef': '2', graphWidth: '64%', graphTitle: '各街道不同质量安全类别耕地面积统计', graphOption:  {
                        color: ['#5db756', '#ffd166', '#ef476f'],
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // Use axis to trigger tooltip
                                type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
                            }
                        },
                        legend: {
                            data: ['安全利用类', '优先保护类', '严格管控类']
                        },
                        b: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'value'
                        },
                        yAxis: {
                            type: 'category',
                            data: ['慈城镇', '洪塘街道', '庄桥街道', '区所辖街道', '全区']
                        },
                        series: [
                            {
                                name: '安全利用类',
                                type: 'bar',
                                stack: 'total',
                                label: {
                                    show: true
                                },
                                emphasis: {
                                    focus: 'series'
                                },
                                data: [39561.85,
                                    12929.62,
                                    4035.83,
                                    720.23,
                                    57247.53
                                ]
                            },{
                                name: '优先保护类',
                                type: 'bar',
                                stack: 'total',
                                label: {
                                    show: true
                                },
                                emphasis: {
                                    focus: 'series'
                                },
                                data: [10014.89,
                                    2976.67,
                                    16946.70,
                                    3147.05,
                                    33085.31
                                ]
                            },{
                                name: '严格管控类',
                                type: 'bar',
                                stack: 'total',
                                label: {
                                    show: true
                                },
                                emphasis: {
                                    focus: 'series'
                                },
                                data: [0, 0, 364.03, 0, 364.03]
                            },
                        ]
                    }},
                {'graphRef': '3', graphWidth: '64%', graphTitle: '各街道不同种植类别耕地面积统计', graphOption:  {
                        color: ['#22577a', '#57cc99', '#ff5a5f'],
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // Use axis to trigger tooltip
                                type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
                            }
                        },
                        legend: {
                            data: ['水田', '旱地', '非农用地']
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'value'
                        },
                        yAxis: {
                            type: 'category',
                            data: ['慈城镇', '洪塘街道', '庄桥街道', '区所辖街道', '全区']
                        },
                        series: [
                            {
                                name: '水田',
                                type: 'bar',
                                stack: 'total',
                                label: {
                                    show: true
                                },
                                emphasis: {
                                    focus: 'series'
                                },
                                data: [33420.67,
                                    9672.54,
                                    12647.56,
                                    1674.80,
                                    57415.57
                                ]
                            },{
                                name: '旱地',
                                type: 'bar',
                                stack: 'total',
                                label: {
                                    show: true
                                },
                                emphasis: {
                                    focus: 'series'
                                },
                                data: [13118.21,
                                    4377.85,
                                    7507.73,
                                    1776.16,
                                    26779.95
                                ]
                            },{
                                name: '非农用地',
                                type: 'bar',
                                stack: 'total',
                                label: {
                                    show: true
                                },
                                emphasis: {
                                    focus: 'series'
                                },
                                data: [3037.84,
                                    1855.90,
                                    1191.28,
                                    416.33,
                                    6501.35
                                ]
                            },
                        ]
                    }},
                {'graphRef': '4', graphWidth: '32%', graphTitle: '江北区不同种植类别耕地面积统计', graphOption:  {
                        color: ['#22577a', '#57cc99', '#ff5a5f'],
                        legend: {
                            left: 'left',
                            bottom: 'bottom'
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                mark: {show: true},
                                dataView: {show: true, readOnly: false},
                                restore: {show: true},
                                saveAsImage: {show: true}
                            }
                        },
                        series: [
                            {
                                name: '面积模式',
                                type: 'pie',
                                radius: [50, 100],
                                center: ['50%', '40%'],
                                roseType: 'area',
                                itemStyle: {
                                    borderRadius: 8
                                },
                                data: [
                                    {value: 57415.57, name: '水田'},
                                    {value: 26779.95, name: '旱地'},
                                    {value: 6501.35, name: '非农用地'},
                                ]
                            }
                        ]
                    }},
            ],
            graphs: {}
        }
    },
    watch: {
        'fetchedData.quality_type': function () {
            const _this = this
            _this.assembleSummaryData()
            _this.assembleQualityTypeGraphData()
        },
        'fetchedData.crop_type': function () {
            const _this = this
            _this.assembleCropTypeGraphData()
        }
    },
    mounted() {
        const _this = this

        // Fetch summary data for dashboard.
        _this.fetchSummary('quality_type')
        _this.fetchSummary('crop_type')
        // console.log(_this.fetchedData)

        for (let graphItem of _this.graphData) {
            _this.graphs[graphItem['graphRef']] = echarts.init(_this.$refs[graphItem['graphRef']][0])
            _this.graphs[graphItem['graphRef']].setOption(graphItem['graphOption'])
        }
        window.onresize = () => {
            for (let key in _this.graphs) {
                _this.graphs[key].resize()
            }
        }
    },
    methods: {
        fetchSummary(by) {
            const _this = this
            _this.$axios.get(`/api/arable/summary?by=${by}`)
            .then(res => {
                if (res.data.status === 0) {
                    _this.fetchedData[by] = res.data.data
                }
            })
        },
        assembleSummaryData() {
            const _this = this
            let sumArea = 0
            for (let i=1; i<=3; i++) {
                _this.summaryData[i]['percent'] = _this.fetchedData['quality_type']['total'][`${i}`]['percent'] * 100 + '%'
                _this.summaryData[i]['data'] = (_this.fetchedData['quality_type']['total'][`${i}`]['area'] * 0.0015).toFixed(2)
                _this.summaryData[i]['unit'] = _this.fetchedData['quality_type']['total'][`${i}`]['unit']
                sumArea += _this.fetchedData['quality_type']['total'][`${i}`]['area'] * 0.0015
            }
            _this.summaryData[0]['percent'] = '100%'
            _this.summaryData[0]['data'] = sumArea.toFixed(2)
            _this.summaryData[0]['unit'] = _this.summaryData[1]['unit']
        },
        assembleQualityTypeGraphData() {
            const _this = this
            const qualityTypeData = _this.fetchedData['quality_type']

            // Assemble graph 1
            const graphItem = _this.graphData[0]
            for (let i=1; i<=3; i++) {
                graphItem['graphOption']['series'][0]['data'][i-1]['value'] = (qualityTypeData['total'][`${i}`]['area'] * 0.0015).toFixed(2)
            }
            _this.graphs[graphItem['graphRef']].setOption(graphItem['graphOption'])

            // Assemble graph 2
            const townNames = []
            const townData = {
                '1': [],
                '2': [],
                '3': []
            }
            for (let town of qualityTypeData['towns']) {
                townNames.push(town.name)
                townData['1'].push((town.data['1']['area'] * 0.0015).toFixed(2))
                townData['2'].push((town.data['2']['area'] * 0.0015).toFixed(2))
                townData['3'].push((town.data['3']['area'] * 0.0015).toFixed(2))
            }
            const graphItem2 = _this.graphData[1]
            graphItem2['graphOption']['yAxis']['data'] = townNames
            for (let i=1; i<=3; i++) {
                graphItem2['graphOption']['series'][i-1]['data'] = townData[`${i}`]
            }
            _this.graphs[graphItem2['graphRef']].setOption(graphItem2['graphOption'])
        },
        assembleCropTypeGraphData() {
            const _this = this
            const cropTypeData = _this.fetchedData['crop_type']
            const cropTypes = ['水田', '旱地', '非农用']

            // Assemble graph 4
            const graphItem = _this.graphData[3]
            for (let i=1; i<=3; i++) {
                graphItem['graphOption']['series'][0]['data'][i-1]['value'] = (cropTypeData['total'][cropTypes[i-1]]['area'] * 0.0015).toFixed(2)
            }
            _this.graphs[graphItem['graphRef']].setOption(graphItem['graphOption'])

            // Assemble graph 3
            const townNames = []
            const townData = {
                '1': [],
                '2': [],
                '3': []
            }
            for (let town of cropTypeData['towns']) {
                townNames.push(town.name)
                townData['1'].push((town.data['水田']['area'] * 0.0015).toFixed(2))
                townData['2'].push((town.data['旱地']['area'] * 0.0015).toFixed(2))
                townData['3'].push((town.data['非农用']['area'] * 0.0015).toFixed(2))
            }
            const graphItem2 = _this.graphData[2]
            graphItem2['graphOption']['yAxis']['data'] = townNames
            for (let i=1; i<=3; i++) {
                graphItem2['graphOption']['series'][i-1]['data'] = townData[`${i}`]
            }
            _this.graphs[graphItem2['graphRef']].setOption(graphItem2['graphOption'])
        }
    }
}
</script>

<style scoped lang="stylus">
#dashboard-module
    width 100%
    background-color #f0f2f5
    position relative
    .section
        width 95%
        min-width 600px
        margin 0 auto
        display flex
        flex-wrap wrap
        justify-content space-between
        //border 1px solid red
    .section-title
        width 95%
        //font-weight bold
        font-size 24px
        color #555
        padding 5px 0 5px 50px
    .summary-item
        border-radius 4px
        height 100px
        min-width 300px
        float left
        margin 10px
        padding 10px
        background #fff
        box-shadow 0 2px 5px #ddd
        .summary-title
            padding 10px 20px
            font-size 15px
            color #555
        .summary-content
            position relative
            padding 5px 20px
            .summary-graph
                width 40px
                height 40px
                margin 0 10px 0
                float left
                line-height 50px
                text-align center
                border-radius 50%
            .summary-data
                padding 10px 10px 0 20px
                text-align right
                font-size 30px
                font-weight 600
                font-family Helvetica
                float right
                line-height 20px
                color #555
            .summary-unit
                font-size 13px
    .graph-container
        width 30%
        height 330px
        margin 10px
        border-radius 4px
        box-shadow 0 2px 5px #ddd
        background-color: #fff
        position relative
        .graph-title
            height 30px
            line-height 30px
            padding 5px 20px
            color #555
            font-size 16px
            //font-weight bold
        .graph-wrapper
            width 80%
            height calc(100% - 70px)
            margin 0 auto
</style>