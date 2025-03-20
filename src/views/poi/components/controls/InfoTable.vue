<template>
    <div class="info-panel"
        id="info-panel"
        ref="info-panel"
        :style="{
            'visibility':detailVisible,
        }">
        <div class="info-panel__wrapper"
            v-loading = 'loading'
            v-for="(infoPanelDataSource, index) in infoPanelDataSources"
            :key=index
            v-show="infoPanelDataSource.visible"
            style="position: relative; width: 100%">
            <div v-if="infoPanelDataSource.layerId == 'measure_info' &&  tableData.length!=0">
                <div class="info-panel__header">
                    <svg viewBox="0 0 64 64" width="15px" height="15px" class="data-ex-icons-layers " style="fill: currentcolor; padding:0 5px 0 0"><path d="M50.88,43.52a3.2,3.2,0,0,1,0,5.86L34.56,56.52a6.42,6.42,0,0,1-5.13,0L13.12,49.37a3.2,3.2,0,0,1,0-5.86l4.62-2a6,6,0,0,0,1.48,1l2.16.95-7,3.05,16.32,7.14a3.19,3.19,0,0,0,2.56,0L49.6,46.44l-7-3.05,2.16-.95a6,6,0,0,0,1.48-.95Zm0-14.39a3.2,3.2,0,0,1,0,5.86L34.56,42.13a6.42,6.42,0,0,1-5.13,0L13.12,35a3.2,3.2,0,0,1,0-5.86l4.62-2a6,6,0,0,0,1.48,1l2.16.95-7,3.05L30.72,39.2a3.19,3.19,0,0,0,2.56,0L49.6,32.06l-7-3.05,2.16-.95a6,6,0,0,0,1.48-.95ZM13.12,20.6a3.2,3.2,0,0,1,0-5.86L29.44,7.6a6.39,6.39,0,0,1,5.13,0l16.32,7.14a3.2,3.2,0,0,1,0,5.86L34.56,27.74a6.39,6.39,0,0,1-5.13,0Z"></path></svg>
                    <span class="info-name">{{ title }}</span>
                    <div class="quit-btn">
                        <div class="el-icon-close detail-window-close-btn"  
                            @click="closePanel">
                        </div>
                    </div>
                </div>
                <div class="inner_wrapper">
                    <table class="info-panel__table">
                        <tbody>
                        <tr class="row"
                            v-for="(value, name) in infoData[currentPage-1]"
                            :key="name">
                            <td class="row__name">{{ name }}</td>
                            <td class="row__value">{{ value }}</td>
                        </tr>
                        </tbody>
                    </table>
                    <div class='imgdom'>
                        <img class="img" :src = "img_path" >
                    </div>    
                </div>
                <el-pagination
                        class="pagination"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="currentPageSize"
                        :total="tableData.length">
                </el-pagination>
            </div>
            <div v-else-if="infoPanelDataSource.layerId == 'arable-land' 
                && infoPanelDataSource.data.length != 0 
                && zh5_level != 1">
                <div class="info-panel__header">
                    <svg viewBox="0 0 64 64" width="15px" height="15px" class="data-ex-icons-layers " style="fill: currentcolor; padding: 0 5px 0 0"><path d="M50.88,43.52a3.2,3.2,0,0,1,0,5.86L34.56,56.52a6.42,6.42,0,0,1-5.13,0L13.12,49.37a3.2,3.2,0,0,1,0-5.86l4.62-2a6,6,0,0,0,1.48,1l2.16.95-7,3.05,16.32,7.14a3.19,3.19,0,0,0,2.56,0L49.6,46.44l-7-3.05,2.16-.95a6,6,0,0,0,1.48-.95Zm0-14.39a3.2,3.2,0,0,1,0,5.86L34.56,42.13a6.42,6.42,0,0,1-5.13,0L13.12,35a3.2,3.2,0,0,1,0-5.86l4.62-2a6,6,0,0,0,1.48,1l2.16.95-7,3.05L30.72,39.2a3.19,3.19,0,0,0,2.56,0L49.6,32.06l-7-3.05,2.16-.95a6,6,0,0,0,1.48-.95ZM13.12,20.6a3.2,3.2,0,0,1,0-5.86L29.44,7.6a6.39,6.39,0,0,1,5.13,0l16.32,7.14a3.2,3.2,0,0,1,0,5.86L34.56,27.74a6.39,6.39,0,0,1-5.13,0Z"></path></svg>
                    <span class="info-name">{{ infoPanelDataSource.name }}</span>
                    <div class="quit-btn">
                        <div class="el-icon-close detail-window-close-btn"
                            @click="closePanel">
                        </div>
                    </div>
                </div>
                <table class="info-panel__table">
                    <tbody>
                        <tr class="row">
                            <td class="row__name">pH值</td>
                            <td class="row__value">{{ pH.toFixed(2) }}</td>
                        </tr>
                        <tr class="row"
                            v-for="(value, name) in infoPanelDataSource.data"
                            :key="name">
                            <td class="row__name">{{ name }}</td>
                            <td class="row__value">{{ value }}</td>
                        </tr>
                        <tr class="row">
                            <td class="row__name">是否实施安全利用</td>
                            <td class="row__value">否</td>
                        </tr>
                        <tr class="row" v-show="zh5_level == 3">
                            <td class="row__name">种植结构调整方案</td>
                            <td class="row__value">禁种粮食作物，推荐桑树、花卉等非食用作物</td>
                        </tr>
                        <tr class="row" v-show="isCd && zh5_level != 3">
                            <td class="row__name">种植结构调整方案</td>
                            <td class="row__value">种植低镉富集水稻品种如甬籼15、甬优538</td>
                        </tr>
                        <tr class="row" v-show="isAcid">
                            <td class="row__name">土壤降酸措施</td>
                            <td class="row__value">施用碱性物质如CaO</td>
                        </tr>
                        <tr class="row">
                            <td class="row__name">土壤钝化措施</td>
                            <td class="row__value">{{soilPassive}}</td>
                        </tr>
                        <tr class="row">
                            <td class="row__name" >肥料种类优化</td>
                            <td class="row__value">增施有机肥，推荐施用钙镁磷肥、硅钙镁钾肥</td>
                        </tr>
                        <tr class="row" v-show="zh5_level != 3">
                            <td class="row__name">分蘖期水分管控</td>
                            <td class="row__value">搁田不晒田</td>
                        </tr>
                        <tr class="row" v-show="zh5_level != 3">
                            <td class="row__name">分蘖末期水分管控</td>
                            <td class="row__value">根据苗情适时灌水</td>
                        </tr> 
                        <tr class="row" v-show="zh5_level != 3">
                            <td class="row__name">孕穗期~成熟期水分管控</td>
                            <td class="row__value">全程保持田面3-5cm积水层，收获前自然落干</td>
                        </tr>                                 
                    </tbody>
                </table>
                <div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TMap from "../../utils/tmap2"
import mapboxgl from "mapbox-gl"

export default {
    props: {
        visibleLayerInfos: {
            type: Array,
            required: true
        },

    },
    data() {
        return {
            tmap: null,
            infoPanelDataSources: {},
            tagColor: 'var(--content-bg-color)',
            defaultInfoPanelConfig: {
                titleField: "name",
                alias: null
            },
            title:"江北区管控受污染耕地POI",
            popup: null,
            att:{'经度':121.578869,
                '纬度':29.2988272},//属性
            img_path : '/image/default.jpg',
            image_name:'default.jpg',
            update_flag:true,
            loading:true,
            detailVisible:'hidden',
            tableData:[],//存储信息页面数据
            infoData:[],//更换键名后展示信息
            currentPage:1,
            currentPageSize:1,
            totalItemsNum:1,
            pH:0,
            soilPassive:"",
            isCd:false,
            zh5_level:1

        }
    },
    mounted() {
        const _this = this
        _this.tmap = TMap.getInstance()
        _this.popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        })
        _this.tmap.map.on('load', function() {
            _this.registerInfoPanel()
        })
    },

    methods: {
        registerInfoPanel() {
            const _this = this
            const map = _this.tmap.map

            // 地图中的 hover 事件
            _this.visibleLayerInfos.forEach(layerInfo => {
                layerInfo.layers.forEach(layerConfig => {
                    const layerId = layerConfig.layer.id
                    const infoPanelConfig = layerConfig.infoPanelConfig

                    if (!layerConfig.hoverable) {
                        return
                    }

                    _this.infoPanelDataSources[layerId] = {
                        visible: false,
                        name: '',
                        layerId:'',
                        data: {}
                    }

                    map.on('mousemove',layerId,function(e){
                        map.getCanvas().style.cursor = 'pointer';
                    })
                    map.on('mouseleave',layerId,function(e){
                        map.getCanvas().style.cursor = '';
                    })

                    map.on('click', layerId, function (e) {
                        if (_this.showInfoPanel) {
                            _this.showInfoPanel = false
                        }
                        // console.log("layer",layerId)
                        _this.infoData=[];//清空信息
                        _this.tableData=[];//清空信息
                        _this.img_path = '/image/default.jpg'
                        _this.infoPanelDataSources['arable-land']={
                            visible: false,
                            name: '',
                            layerId:'',
                            data: {}
                        };
                        const feature = e.features[0]
                        _this.loading = true
                        _this.detailVisible = 'visible'
                        map.getCanvas().style.cursor = 'pointer';
                        // console.log("info",_this.tableData)
                        _this.updateInfoPanelInfo(feature, layerId, infoPanelConfig)
                    })
                })
            })
        },
        /**
         * 关闭窗口，代替原来的mouseleave的功能
         */
        closePanel() {
            const _this = this;
            const map = _this.tmap.map;
            map.getCanvas().style.cursor = '';
            _this.detailVisible = 'hidden';
            _this.infoData=[];//关闭窗口后，清口信息
            _this.img_path = '/image/default.jpg'
            _this.infoPanelDataSources['arable-land']={
                visible: false,
                name: '',
                layerId:'',
                data: {}
            };

        },

        /**
         * 根据 hover 或 click 事件更新信息板位置
         * @param evt hover 或 click 事件
         * @rtype null
         */
        updateInfoPanelPosition(evt, feature) {
            const _this = this
            const map = _this.tmap.map
            const coordinates = feature.geometry.coordinates.slice()
            // console.log("coor",coordinates)
            // console.log("html",_this.$refs['info-panel'])

            map.getCanvas().style.cursor = 'pointer';
            // console.log(_this.$refs['info-panel'])
            // _this.popup.setLngLat(evt.lngLat).setHTML(_this.$refs['info-panel'].innerHTML).addTo(map)
            _this.popup.setLngLat(evt.lngLat).setHTML(document.getElementById('info-panel').innerHTML).setMaxWidth("600px").addTo(map)
        },
        /**
         * 根据目标 feature 更新信息板内容
         * @param feature  目标 feature 对象
         * @param layerId
         * @param infoPanelConfig
         * @rtype Boolean
         */
        updateInfoPanelInfo(feature, layerId, infoPanelConfig) {
            const _this = this
            const attrs = feature.properties
            console.log("attrs", attrs)
            // 点击POI点位触发info-panel信息更新
            if(layerId == "measure_info"){
                const lon = attrs['longitude']
                // const id = 'A102'
                const img_alias = Object.keys(infoPanelConfig.img_alias)[0];
                _this.currentPage = 1;
                const alias = infoPanelConfig.alias
                _this.$axios.get(`/api/measure/query_item_by_lon?longitude=${lon}`)
                .then(res =>{
                    if (res.data.status === 0){
                        _this.tableData = res.data.data;
                        _this.att = res.data.data;
                        _this.image_name = _this.att['0']['picture_name']
                        _this.updateInfo(_this.currentPage);
                        for(let i=0;i<_this.tableData.length;i++){
                            _this.infoData[i] = {}
                            Object.keys(alias).forEach((key) => {
                                let val = _this.tableData[i][key]
                                if(alias[key]=='措施类型' && val==1){
                                    val = '治理措施'
                                }else if(alias[key]=='措施类型' && val==2){
                                    val = '试验田块'
                                }
                                if(val && val != "null"){
                                    _this.infoData[i][alias[key]] = val
                                }
                            })
                        }
                        _this.loading = false
                    }
                }).catch(err => {
                    console.log(err)
                })
            }else{
                _this.loading = false
            }
            
            // 点击地块触发info-panel信息更新
            if (layerId == 'arable-land') {
                _this.pH = Math.random() * (7 - 5.5) + 5.5;
                if (_this.pH < 5.5) {
                    _this.isAcid = true
                    _this.soilPassive = "碱性物质+腐殖酸/含硅材料"
                } else if (_this.pH < 6.5) {
                    _this.isAcid = true
                    _this.soilPassive = "碱性物质+腐殖酸"
                } else {
                    _this.isAcid = false
                    _this.soilPassive = "腐殖酸/生物炭"
                }

                if (attrs.mbwrw.includes('镉')) {
                    _this.isCd = true
                } else {
                    _this.isCd = false
                }
                _this.zh5_level = attrs.zh5_level
            }


            if (!infoPanelConfig) return false

            _this.$set(_this.infoPanelDataSources, layerId, {
                visible: true,
                name: attrs[infoPanelConfig.titleField] || infoPanelConfig.title,
                layerId:layerId,
                data: (() => {
                    const alias = infoPanelConfig.alias
                    if (!alias) {
                        return attrs
                    } else {
                        const data = {}
                        Object.keys(alias).forEach((key) => {
                            let val = attrs[key]
                            if (val && val !== "null") {
                                data[alias[key]] = val
                            }
                        })
                        return data
                    }
                })(),
            })


            _this.$forceUpdate()
            
            return true
        },

        /**
         * 更换页码发生的指令
         */
        handleCurrentChange(currentPage){
            this.currentPage = currentPage
            this.updateInfo(currentPage) //更换页面信息
        },

        /**
         * 更换页码时，信息的变动，不进行属性请求操作,只请求图片信息
         */
        updateInfo(currentPage){
            const _this = this;
            const image_name = _this.tableData[currentPage-1]['picture_name']
            _this.img_path = '/image/' + image_name
            console.log("path",_this.img_path)
            _this.$axios.get(_this.img_path)
            .then(res => {
                // _this.img_path = '/image/' + _this.image_name
            }).catch(err => {
                _this.img_path = '/image/default.jpg'
            })
        }
    }
}
</script>

<style lang="stylus" scoped>
#info-panel{
    position:relative;
    background-color:white
    border-radius:5%;
    #quit-btn{
        position:absolute;
        left:40%
    }
}
.info-panel__header
    width 100%
    padding 0 14px
    margin-top 12px
    position relative
    display flex
    align-items center
    .info-name
        display inline-block
        width calc(100% - 35px)
        color var(--header-color)
        font-size 14px
        font-weight 500
        letter-spacing 0.43px
    .color-tag
        display inline-block
        position absolute
        right 20px
        width 20px
        height 20px
        line-height 20px
        border-radius 100%
.info-panel__table
    width 100%
    padding 12px
    position relative
    tr.row
        font-size 13px
        line-height 15px
        .row__name
            color var(--content-color)
            padding 4px
            width 140px
        .row__value
            color var(--header-color)
            padding 4px
            text-align right
            font-weight 500

.inner_wrapper{
    display: flex;
    justify-content space-between;
}

.imgdom{
    // flex:1;
    width:60%;
    // border:1px solid;
    display:flex;
    justify-content: center;
    align-items:center;
    .img{
        width:180px;
        height:180px;
        margin-right:30px;
    }
}
.detail-window-close-btn{
    right 5px
    top 2px
    // margin 10px
    margin:0 0 0 -30px;
    width 25px
    height 25px
    line-height 25px
    text-align center
    background-color: #eee
    border-radius 50%
    color #aaa
    cursor pointer
    transition .2s all ease-in-out
}
.detail-window-close-btn:hover{
    background-color: #aee3df
    color #fff
}
            
</style>