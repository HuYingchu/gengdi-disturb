<template>
    <div id="base-wrapper">
        <div class="section-title">
            安全利用率展示
        </div>
        <div class="summary section">
            <!-- B、C、D的展示 -->
            <div class="summary-item" v-for="item of summaryData.slice(0,3)" >
                <div class="summary-title">
                    {{item.title}}
                </div>
                <div class="summary-content">
                    <div class="summary-graph"
                        :style="{'background-color':item.graphColor}">
                    </div>
                </div>
                <div class="summary-data">
                    {{item.data}}<span class="summary-unit">{{item.unit}}</span>
                </div>
            </div>
            <!-- A的展示 -->
            <div class="summary-item" v-for="item of summaryData.slice(3)" >
                <div class="summary-title">
                    {{item.title}}
                </div>
                <div class="summary-content">
                    <div class="summary-graph"
                        :style="{'background-color':item.graphColor}">
                    </div>
                </div>
                <div class="summary-data">
                    {{item.percent}}
                </div>
            </div>
        </div>
        
        <div class = "graph-section">
            <div class="graph-container"
                v-for="item of graphData.slice(0,4)" 
                :style="{'width':item.graphWidth}">
                <div class="graph-title">{{item.graphTitle}}</div>
                <div class="graph-wrapper" :id="item.graphId" :ref="item.graphRef" ></div>
            </div>
        </div>
        <div class="section-title">
            安全利用类统计情况
        </div>
        <div class = "graph-section" >
            <div class="graph-container"
                v-for="item of graphData.slice(4,5)" 
                :style="{'width':item.graphWidth}">
                <div class="graph-title">{{item.graphTitle}}</div>
                <div class="graph-wrapper" :id="item.graphId" :ref="item.graphRef" ></div>
            </div>
        </div>
        <normal-footer></normal-footer>
        <div style="clear:both;height:0"></div>
    </div>
</template>

<script>
var echarts= require('echarts');
import NormalFooter from '@/components/window/NormalFooter'


export default ({
    name:'Safedashboard',
    components:{
        NormalFooter
    },
    data(){
        return{
            fetchedData:{
                'quality_type':null,
                'pollution_data':null
                
            },
            redisData:{
                'quality_type':false,
                'pollution_data':false
            },//判断是否进行第一次抓取
            summaryData:[
                {'title':'治理修复安全利用类','percent':'-%','data':'NaN','unit':'亩','graphColor':'#ffd166'},
                {'title':'治理修复严格管控类','percent':'-%','data':'NaN','unit':'亩','graphColor':'#ef476f'},
                {'title':'受污染耕地','percent':'-%','data':'NaN','unit':'亩','graphColor':'#DC143C'},
                {'title':'安全利用率','percent':'-%','data':'NaN','unit':'亩','graphColor':'#22577a'}
            ],
            graphData:[
                {'graphRef':'1',"graphId":"graph1",graphWidth:'40%','graphTitle':'慈城镇安全利用情况统计',graphOption:{
                    color:['#22577a', '#57cc99', '#ff5a5f'],
                    tooltip:{
                        trigger:'item',//弹窗指示功能,利用axis来触发trigger
                        axisPointer:{//坐标轴指示器配置项
                            type:'shadow'  //shadow为默认项，还有line和cross
                        },

                    },
                    legend:{
                        data:['受污染耕地','治理修复安全利用类','治理修复严格管控类']
                    },
                    grid:{
                        left:'2%',
                        right:'8%',
                        bottom:'3%',
                        containLabel:true
                    },
                    xAxis:[{
                        type:'value',
                        name:'(亩)'
                    }],
                    yAxis:[{
                        type:'category',
                        data:['慈城镇']
                    }],
                    series:[
                        {
                            name:'受污染耕地',
                            type:'bar',
                            label:{
                                show:true
                            },
                            emphasis:{
                                focus:'series' //可选为none
                            },
                            data:[39561.85,
                                // 12929.62,
                                // 14035.83,
                                // 1720.23,
                                // 57247.53
                            ],
                            markLine:{
                                symbol:"none",
                                itemStyle:{
                                    normal:{
                                        color:'#fa8565',
                                        label:{show:false},
                                    }
                                },
                                lineStyle:{
                                    width:3,
                                },


                                data: [{
                                    name:'质量标准基线',
                                    // xAxis:'慈溪镇',
                                    xAxis:25000,
                                    label:{
                                        formatter:"安全利用率达标线"

                                    },
                                }]
                            }
                        },
                        {
                            name:'治理修复安全利用类',
                            type:'bar',
                            stack:'安全利用',
                            label:{
                                show:true
                            },
                            emphasis:{
                                focus:'series'
                            },
                            data:[10014.89,
                                // 2976.67,
                                // 16946.70,
                                // 3147.05,
                                // 33085.31
                                ]
                        },
                        {
                            name:'治理修复严格管控类',
                            type:'bar',
                            stack:'安全利用',
                            label:{
                                show:true
                            },
                            emphasis:{
                                focus:'series'
                            },
                            data:[55]
                        }
                    ]
                }},
                {'graphRef':'2',"graphId":"graph2",graphWidth:'40%','graphTitle':'洪塘街道安全利用情况统计',graphOption:{
                    color:['#22577a', '#57cc99', '#ff5a5f'],
                    tooltip:{
                        trigger:'item',//弹窗指示功能,利用axis来触发trigger
                        axisPointer:{//坐标轴指示器配置项
                            type:'shadow'  //shadow为默认项，还有line和cross
                        },

                    },
                    legend:{
                        data:['受污染耕地','治理修复安全利用类','治理修复严格管控类']
                    },
                    grid:{
                        left:'2%',
                        right:'8%',
                        bottom:'3%',
                        containLabel:true
                    },
                    xAxis:[{
                        type:'value',
                        name:'(亩)'
                    }],
                    yAxis:[{
                        type:'category',
                        data:['洪塘街道']
                    }],
                    series:[
                        {
                            name:'受污染耕地',
                            type:'bar',
                            label:{
                                show:true
                            },
                            emphasis:{
                                focus:'series' //可选为none
                            },
                            data:[//39561.85,
                                12929.62,
                                // 14035.83,
                                // 1720.23,
                                // 57247.53
                            ],
                            markLine:{
                                symbol:"none",
                                itemStyle:{
                                    normal:{
                                        color:'#fa8565',
                                        label:{show:false}
                                    }
                                },
                                lineStyle:{
                                    width:3,
                                },


                                data: [{
                                    name:'质量标准基线',
                                    // xAxis:'慈溪镇',
                                    xAxis:8500,
                                    label:{
                                        formatter:"安全利用率达标线"

                                    },
                                }]
                            }
                        },
                        {
                            name:'治理修复安全利用类',
                            type:'bar',
                            stack:'安全利用',
                            label:{
                                show:true
                            },
                            emphasis:{
                                focus:'series'
                            },
                            data:[//10014.89,
                                2976.67,
                                // 16946.70,
                                // 3147.05,
                                // 33085.31
                                ]
                        },
                        {
                            name:'治理修复严格管控类',
                            type:'bar',
                            stack:'安全利用',
                            label:{
                                show:true
                            },
                            emphasis:{
                                focus:'series'
                            },
                            data:[80]
                        }
                    ]
                }},
                {'graphRef':'3',"graphId":"graph3",graphWidth:'40%','graphTitle':'庄桥街道安全利用情况统计',graphOption:{
                    color:['#22577a', '#57cc99', '#ff5a5f'],
                    tooltip:{
                        trigger:'item',//弹窗指示功能,利用axis来触发trigger
                        axisPointer:{//坐标轴指示器配置项
                            type:'shadow'  //shadow为默认项，还有line和cross
                        },

                    },
                    legend:{
                        data:['受污染耕地','治理修复安全利用类','治理修复严格管控类']
                    },
                    grid:{
                        left:'2%',
                        right:'8%',
                        bottom:'3%',
                        containLabel:true
                    },
                    xAxis:[{
                        type:'value',
                        name:'(亩)'
                    }],
                    yAxis:[{
                        type:'category',
                        data:['庄桥街道']
                    }],
                    series:[
                        {
                            name:'受污染耕地',
                            type:'bar',
                            label:{
                                show:true
                            },
                            emphasis:{
                                focus:'series' //可选为none
                            },
                            data:[//39561.85,
                                // 12929.62,
                                18035.83,
                                // 1720.23,
                                // 57247.53
                            ],
                            markLine:{
                                symbol:"none",
                                itemStyle:{
                                    normal:{
                                        color:'#fa8565',
                                        label:{show:false}
                                    }
                                },
                                lineStyle:{
                                    width:3,
                                },


                                data: [{
                                    name:'质量标准基线',
                                    // xAxis:'慈溪镇',
                                    xAxis:12000,
                                    label:{
                                        formatter:"安全利用率达标线"

                                    },
                                }]
                            }
                        },
                        {
                            name:'治理修复安全利用类',
                            type:'bar',
                            stack:'安全利用',
                            label:{
                                show:true
                            },
                            emphasis:{
                                focus:'series'
                            },
                            data:[//10014.89,
                                // 2976.67,
                                16946.70,
                                // 3147.05,
                                // 33085.31
                                ]
                        },
                        {
                            name:'治理修复严格管控类',
                            type:'bar',
                            stack:'安全利用',
                            label:{
                                show:true
                            },
                            emphasis:{
                                focus:'series'
                            },
                            data:[120]
                        }
                    ]
                }},
                {'graphRef':'4',"graphId":"graph4",graphWidth:'40%','graphTitle':'江北区所辖街道安全利用情况统计',graphOption:{
                    color:['#22577a', '#57cc99', '#ff5a5f'],
                    tooltip:{
                        trigger:'item',//弹窗指示功能,利用axis来触发trigger
                        axisPointer:{//坐标轴指示器配置项
                            type:'shadow'  //shadow为默认项，还有line和cross
                        },

                    },
                    legend:{
                        data:['受污染耕地','治理修复安全利用类','治理修复严格管控类']
                    },
                    grid:{
                        left:'2%',
                        right:'8%',
                        bottom:'3%',
                        containLabel:true
                    },
                    xAxis:[{
                        type:'value',
                        name:'(亩)'
                    }],
                    yAxis:[{
                        type:'category',
                        data:['江北区所辖街道']
                    }],
                    series:[
                        {
                            name:'受污染耕地',
                            type:'bar',
                            label:{
                                show:true
                            },
                            emphasis:{
                                focus:'series' //可选为none
                            },
                            data:[//39561.85,
                                // 12929.62,
                                // 14035.83,
                                5720.23,
                                // 57247.53
                            ],
                            markLine:{
                                symbol:"none",
                                itemStyle:{
                                    normal:{
                                        color:'#fa8565',
                                        label:{show:false}
                                    }
                                },
                                lineStyle:{
                                    width:3,
                                },


                                data: [{
                                    name:'质量标准基线',
                                    // xAxis:'慈溪镇',
                                    xAxis:3500,
                                    label:{
                                        formatter:"安全利用率达标线"

                                    },
                                }]
                            }
                        },
                        {
                            name:'治理修复安全利用类',
                            type:'bar',
                            stack:'安全利用',
                            label:{
                                show:true
                            },
                            emphasis:{
                                focus:'series'
                            },
                            data:[//10014.89,
                                // 2976.67,
                                // 16946.70,
                                3147.05,
                                // 33085.31
                                ]
                        },
                        {
                            name:'治理修复严格管控类',
                            type:'bar',
                            stack:'安全利用',
                            label:{
                                show:true
                            },
                            emphasis:{
                                focus:'series'
                            },
                            data:[80]
                        }
                    ]
                }},
                {'graphRef':'5',"graphId":"graph5",graphWidth:'80%','graphTitle':'各街道安全利用率统计',graphOption:{
                    color:['#22577a'],
                    tooltip:{
                        trigger:'item',
                        axisPointer:{
                            type:'shadow'
                        }
                    },
                    legend:{
                        data:['安全利用率']
                    },
                    grid:{
                        left:'3%',
                        right:'8%',
                        bottom:'3%',
                        containLabel:true
                    },
                    xAxis:{
                        type:'category',
                        data:['慈城镇', '洪塘街道', '庄桥街道', '区所辖街道', '全区']
                    },
                    yAxis:{
                        type:'value',
                        name:'百分比(%)',
                        min:0,
                        max:100,
                        axisLine:{
                            show:true
                        }
                        // axisLabel:{
                        //     formatter:'{value}%'
                        // }
                    },
                    series:{
                        name:'安全利用率',
                        type:'bar',
                        label:{
                            show:true
                        },
                        data:[
                            67,73,80,67,73
                        ],
                        markLine:{
                            symbol:'none',
                            silent:true,
                            lineStyle:{
                                color:'#fa8565',
                                label:{show:false},
                                width:3
                            },
                            label:{
                                position:'end',
                                formatter:'达标线'
                            },
                            data:[{yAxis:80}]
                        }
                    }
                }}
            ],
            graphs:{}
        }
    },
    watch:{
        'fetchedData.quality_type' : function(){
            const _this = this;
            if(!_this.redisData['quality_type']){
                _this.assembleSummaryData1()
                _this.assembleGraphData()
            }
            // _this.assembleQualityTypeGraphData()
        },
        'fetchedData.pollution_data' : function(){
            const _this = this;
            if(!_this.redisData['pollution_data']){
                _this.assembleSummaryData2()
                _this.assembleGraphData()
            }
            // _this.assemblePollutionDataGraphData()
        }
    },
    mounted(){
        const _this = this;

        //抓取summary data for dashboard
        _this.fetchSummary('quality_type')
        _this.fetchSummary('pollution_data')
        //console.log("mounted",_this.fetchedData)
        for(let graphItem of _this.graphData){
            // _this.graphs[graphItem['graphRef']] = echarts.init(_this.$refs[graphItem['graphRef']])
            //不知什么原因在这个版本里不能用$refs取用对象，不然就会报错
            _this.graphs[graphItem['graphId']] = echarts.init(document.getElementById(graphItem['graphId']))
            _this.graphs[graphItem['graphId']].setOption(graphItem['graphOption'])
            
        }


        let winresize = () => {
            for(let key in _this.graphs){
                setTimeout( () => {
                    // console.log("resize")
                    _this.graphs[key].resize()},500)
            }
        }
        //resize必需
        window.addEventListener('resize',winresize)
        
    },


    methods:{
        fetchSummary(by){
            const _this = this;
            this.$axios.get(`/api/arable/summary?by=${by}`)
            .then(res => {
                //这块还得看具体接口是怎样的
                if(res.data.status === 0){
                    _this.fetchedData[by] = res.data.data
                    //console.log("axios",_this.fetchedData[by])
                    _this.redisData[by] = !_this.redisData[by]
                    if(by=='quality_type'){
                        _this.assembleSummaryData1()
                    }else if (by == 'pollution_data'){
                        _this.assembleSummaryData2()
                    }
                    //即两个数据都已抓取到
                    if(_this.redisData['quality_type'] && _this.redisData['pollution_data']){
                        _this.assembleGraphData()
                    }
                }
            }).catch(err => {
                console.log(err)
            })
        },
        assembleSummaryData1(){
            const _this = this;
            let sumArea = 0
            for(let i=1;i<3;i++){
                sumArea += _this.fetchedData['quality_type']['total'][`${i+1}`]['area'] * 0.0015
            }
            _this.summaryData[2]['percent'] = '100%'
            _this.summaryData[2]['data'] = sumArea.toFixed(2);
            _this.summaryData[2]['unit'] = _this.fetchedData['quality_type']['total']['1']['unit'] 
        },
        assembleSummaryData2(){
            const _this = this;
            for( let i=1;i<3;i++){
                // _this.summaryData[`${i-1}`]['percent'] = _this.fetchedData['pollution_data']['total'][`${i+1}`]['percent'] * 100 +'%';
                _this.summaryData[`${i-1}`]['data'] = (_this.fetchedData['pollution_data']['total'][`${i+1}`]['area']).toFixed(2);
                _this.summaryData[`${i-1}`]['unit'] =  _this.fetchedData['pollution_data']['total'][`${i+1}`]['unit']
            }
            // var result = (parseFloat(_this.summaryData[0]['data']) + parseFloat(_this.summaryData[1]['data']) ) / parseFloat(_this.summaryData[2]['data'] )*100
            // _this.summaryData[3]['percent'] = (result).toFixed(2) + '%' 
            _this.summaryData[3]['percent'] = (_this.fetchedData['pollution_data']['total']['safe'] * 100).toFixed(2) +'%';
        },
        getPollutionData(){
            const _this = this;
            const pollutionData = toRaw(_this.fetchedData['pollution_data'])
            console.log(pollutionData)
            return pollutionData
        },
        getQualityData(){
            const _this = this;
            const qualityTypeData = toRaw(_this.fetchedData['quality_type'])
            return qualityTypeData
        },
        assembleGraphData(){
            const _this = this;

            const qualityTypeData = _this.fetchedData['quality_type']

            const pollutionData = _this.fetchedData['pollution_data']

            // const qualityTypeData = _this.getQualityData()
            // const pollutionData = _this.getPollutionData()

            //Assemble graph 1-4
            let townNames = []
            let dataId = ['polluted','measure_2','measure_3']
            let townData = {
                'polluted':[],
                'measure_2':[],
                'measure_3':[]
            }
            let standard = 0.85 //设定安全利用率达标标准百分比
            //console.log(_this.fetchedData['quality_type'])
            // console.log(pollutionData)
            for(let town of qualityTypeData['towns']){
                townNames.push(town.name)
                let sumArea =0
                sumArea += (town.data['2']['area'] * 0.0015)
                sumArea += (town.data['3']['area'] * 0.0015)
                townData['polluted'].push(sumArea.toFixed(2))
                for(let ptown of pollutionData['towns']){
                    if (town.name == ptown.name){
                        townData['measure_2'].push((ptown.data['2']['area']).toFixed(2))
                        townData['measure_3'].push((ptown.data['3']['area']).toFixed(2))
                        break
                    }
                }
            }
            standard = pollutionData['safeStandard']
            for(let i=0;i<4;i++){
                const graphItem = _this.graphData[i]
                graphItem['graphTitle'] = townNames[i] + "安全利用情况统计" 
                // graphItem['graphOption']['yAxis']['data'] = townNames[i]
                graphItem['graphOption']['yAxis'][0]['data'][0] = townNames[i]
                // console.log("name",graphItem['graphOption']['yAxis'][0]['data'][0])
                for(let j=0;j<3;j++){
                    graphItem['graphOption']['series'][j]['data'][0] = townData[dataId[j]][i]
                    
                }
                let polluted_data = townData['polluted'][i]
                graphItem['graphOption']['series'][0]['markLine']['data'][0]['xAxis'] = polluted_data * standard
                _this.graphs[graphItem['graphId']].setOption(graphItem['graphOption'])
            }
            
            //assemble graph 5
            townNames = []
            townData = {
                'safe' : []
            }
            let i=0
            const graphItem5 = _this.graphData[4]
            for(let town of pollutionData['towns']){
                townNames.push(town.name)
                graphItem5['graphOption']['series']['data'][i] = (town.data['safe'] * 100).toFixed(2)
                i++;
            }
            graphItem5['graphOption']['xAxis']['data'] = townNames
            graphItem5['graphOption']['series']['markLine']['data'][0]['yAxis'] = standard *100
            _this.graphs[graphItem5['graphId']].setOption(graphItem5['graphOption'])

        }


    }
})

</script>

<style lang="stylus">
    #base-wrapper {
        width:100%;
        height:100%;
        background-color: #f0f2f5;
        position: relative;
        
        .section{
            width:95%;
            min-width:600px;
            margin:0 auto;
            display: flex;
            flex-wrap:wrap;
            justify-content:space-between;
        }
        .section-title{
            width:95%;
            font-size:24px;
            color:#555;
            padding:5px 0 5px 50px;
        }
        .summary-item{
            border-radius:4px;
            height:120px;
            min-width:300px;
            // max-width:300px;
            float:left;
            margin:10px;
            padding:10px;
            background: #fff;
            box-shadow: 0 2px 5px #ddd;
            .summary-title{
                padding:10px 20px;
                font-size:20px;
                color:#555;
            }
            .summary-content{
                position: relative;
                padding: 5px 20px;
            }
            .summary-graph{
                width:40px;
                height:40px;
                margin:0 10px 0;
                float:left;
                line-height:50px;
                text-align:center;
                border-radius:50%;
            }
            .summary-data{
                padding: 10px 10px 0 20px;
                text-align: right;
                font-size: 24px;
                font-weight: 600;
                font-family:Helvetica;
                float:right;
                line-height:20px;
                color:#555;
            }
            .summary-unit{
                font-size:13px;
            }
        }
        .graph-section{
            width:95%;
            min-width:600px;
            margin:0 auto;
            display: flex;
            flex-wrap:wrap;
            justify-content:center;
            .graph-container{
                width:30%;
                height:330px;
                margin:3%;
                border-radius:4px;
                box-shadow:0 2px 5px #ddd;
                background-color:#fff;
                position:relative;
            .graph-title{
                height:30px;
                line-height:30px;
                padding:5px 20px;
                color:#555;
                font-size:16px;
            }
            .graph-wrapper{
                width:80%;
                height: 90%;
                margin:0 auto;
                display: flex;
                flex-wrap:wrap;
                justify-content:center;
            }
        }
        }
        
}
</style>