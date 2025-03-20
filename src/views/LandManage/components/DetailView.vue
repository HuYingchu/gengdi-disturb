<template>
    <div class="detail-view-wrapper">
        <el-container>
            <el-aside>
                <div id="detail-map-container"></div>
            </el-aside>
            <el-main>
                <el-row>
                    <el-col :span="9"><div class="grid-content bg-purple"> 耕地编码 </div></el-col>
                    <el-col :span="15"><div class="grid-content bg-purple-light">{{ detailData['data']['properties']['gdbm'] }}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="9"><div class="grid-content bg-purple"> 类别编码 </div></el-col>
                    <el-col :span="15"><div class="grid-content bg-purple-light">{{ detailData['data']['properties']['lbbm'] }}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="9"><div class="grid-content bg-purple"> 是否非农用 </div></el-col>
                    <el-col :span="15"><div class="grid-content bg-purple-light">{{ detailData['data']['properties']['sffny'] }}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="9"><div class="grid-content bg-purple"> 地类名称 </div></el-col>
                    <el-col :span="15"><div class="grid-content bg-purple-light">{{ detailData['data']['properties']['dlmc'] }}</div></el-col>
                </el-row>
            </el-main>
        </el-container>
        <el-container>
            <el-main>
                <el-row>
                    <el-col :span="8"><div class="grid-content bg-purple"> 行政区划 </div></el-col>
                    <el-col :span="16"><div class="grid-content bg-purple-light"> 宁波市-江北区-{{ detailData['data']['properties']['乡镇_mat'] }}-{{ detailData['data']['properties']['qsdwmc'] }} </div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="8"><div class="grid-content bg-purple"> 耕地面积 </div></el-col>
                    <el-col :span="16"><div class="grid-content bg-purple-light"> {{ detailData['data']['properties']['nydtbmj'] }} m²</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="8"><div class="grid-content bg-purple"> 综合环境质量类别 </div></el-col>
                    <el-col :span="2"><div class="grid-content" :style="{
                        'background-color': getArableQualityColor(detailData['data']['properties']['zh5_level']),
                        'border-radius': '50%',
                        'width': '36px',
                        'position': 'relative',
                        'left': '4px'
                    }">{{ detailData['data']['properties']['zh5_level'] }}</div></el-col>
                    <el-col :span="14"><div class="grid-content bg-purple-light"> {{ getArableQualityName(detailData['data']['properties']['zh5_level']) }} </div></el-col>
                </el-row>
                <section>
                    <el-row>
                        <el-col :span="24" style="padding: 10px"> 耕地土壤重金属评价等级 </el-col>
                    </el-row>
                    <el-table
                        class="table"
                        :data="metalData"
                        style="width: 570px; background-color: var(--selector-bg-color); margin: 0 auto"
                        size="small"
                        border
                        :cell-style="{'color': 'var(--content-color)'}"
                        :header-cell-style="{'background-color': '#eceef5'}">
                        <el-table-column
                            v-for="(column) of Object.keys(metalData[0]).slice(0, 8)"
                            :key="column"
                            :prop="column"
                            :label="column"
                            width="71.25px">
                        </el-table-column>
                    </el-table>
                </section>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'

export default {
    name: "DetailView",
    props: {
        detailData: {
            type: Object,
            default() {
                return {
                    "type": "geojson",
                    "data": {
                        "type": "Feature",
                        "properties": {
                            "dlmc": "水田",
                            "qsdwmc": "北门村",
                            "nydtbmj": 8524.05,
                            "dllb": "耕地",
                            "centerx": 121.452174977,
                            "centery": 29.991132930399999,
                            "cd_level": 1.0,
                            "hg_level": 2.0,
                            "as_level": 1.0,
                            "cr_level": 1.0,
                            "cu_level": 1.0,
                            "zn_level": 1.0,
                            "ni_level": 1.0,
                            "bap_level": 1.0,
                            "zh5_level": 2.0,
                            "zh3_level": 1.0,
                            "zh8_level": 2.0,
                            "zh9_level": 2.0,
                            "pb_level": 1.0,
                            "gdbm": "330205285245219113",
                            "lbbm": "330205000741Ⅱ",
                            "zh5temp": "Ⅱ",
                            "nzwlx": "非农用地",
                            "sffny": "否",
                            "BZ": "主要种植梨树",
                            "乡镇_mat": "慈城镇",
                            "dlwz": "经度（121.45162980736973-121.4528007129826），纬度（29.99064807005243-29.991612741335018）",
                            "mbwrw": "汞",
                        },
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [ [ [ 121.452800712982594, 29.99139016092721 ], [ 121.452627556616562, 29.99064807005243 ], [ 121.451641968901754, 29.990836575147853 ], [ 121.451635286938995, 29.991007083909835 ], [ 121.45163047196877, 29.99133791301432 ], [ 121.451629807369727, 29.991612741335018 ], [ 121.452781721998917, 29.991393974052698 ], [ 121.452800712982594, 29.99139016092721 ] ] ]
                        }
                    }
                }
            }
        }
    },
    data() {
        return {
            map: null
        }
    },
    computed: {
        metalData() {
            const detailData = this.detailData
            return [{
                "镉(Cd)": detailData['data']['properties']["cd_level"],
                "汞(Hg)": detailData['data']['properties']["hg_level"],
                "砷(As)": detailData['data']['properties']["as_level"],
                "铅(Pb)": detailData['data']['properties']["pb_level"],
                "铬(Cr)": detailData['data']['properties']["cr_level"],
                "铜(Cu)": detailData['data']['properties']["cu_level"],
                "锌(Zn)": detailData['data']['properties']["zn_level"],
                "镍(Ni)": detailData['data']['properties']["ni_level"],
                // "苯并(a)芘": detailData['data']['properties']["bap_level"],
                // "综合三项()": detailData['data']['properties']["zh3_level"],
                // "综合五项": detailData['data']['properties']["zh5_level"],
                // "综合八项": detailData['data']['properties']["zh8_level"],
                // "综合九项": detailData['data']['properties']["zh9_level"],
            }]
        }
    },
    watch: {
        detailData() {
            // this.initMap()
            console.log("change detail")
            this.refreshMap()
        }
    },
    mounted() {
        this.initMap()
        // console.log(this.metalData)
    },
    methods: {
        initMap() {
            const _this = this
            const properties = _this.detailData['data']['properties']
            const lat = properties['centerx'], lon = properties['centery']

            _this.map = new mapboxgl.Map({
                container: 'detail-map-container',
                style: 'mapbox://styles/mapbox/satellite-streets-v11',
                center: [lat, lon],
                zoom: 15,
                interactive: false,
                attributionControl: false
            })
            _this.map.on('load', function () {
                _this.map.addSource("detail-polygon", _this.detailData)
                _this.map.addLayer({
                    id: 'detail-polygon',
                    type: 'fill',
                    source: 'detail-polygon',
                    layout: {},
                    paint: {
                        'fill-color': '#17a2b8',
                        'fill-opacity': 0.5
                    }
                })
                _this.map.addLayer({
                    'id': 'outline',
                    'type': 'line',
                    'source': 'detail-polygon',
                    'layout': {},
                    'paint': {
                        'line-color': '#e83e8c',
                        'line-width': 2
                    }
                });
            })
        },
        refreshMap() {
            const _this = this
            const properties = _this.detailData['data']['properties']
            const lat = properties['centerx'], lon = properties['centery']

            // 删除旧图层
            _this.map.removeLayer('detail-polygon')
            _this.map.removeLayer('outline')
            _this.map.removeSource('detail-polygon')

            // 添加新图层
            _this.map.addSource("detail-polygon", _this.detailData)
            _this.map.addLayer({
                id: 'detail-polygon',
                type: 'fill',
                source: 'detail-polygon',
                layout: {},
                paint: {
                    'fill-color': '#17a2b8',
                    'fill-opacity': 0.5
                }
            })
            _this.map.addLayer({
                'id': 'outline',
                'type': 'line',
                'source': 'detail-polygon',
                'layout': {},
                'paint': {
                    'line-color': '#e83e8c',
                    'line-width': 2
                }
            })
            const bounds = _this.getBounds(_this.detailData.data)
            _this.map.fitBounds(bounds, {
                padding: 50,
                animate: false
            })
        },
        getArableQualityName(qualityNum) {
            const qualityNameWithNum = {
                1: '优先保护类',
                2: '安全利用类',
                3: '严格管控类'
            }
            return qualityNameWithNum[qualityNum]
        },
        getArableQualityColor(qualityNum) {
            const qualityNameWithNum = {
                1: '#5db756',
                2: '#ffd166',
                3: '#ef476f'
            }
            return qualityNameWithNum[qualityNum]
        },
        /**
         * Get bounds of a polygon feature
         * @param feature: Feature object
         * @return bounds
         */
        getBounds(feature) {
            const coordinates = feature.geometry.coordinates[0];
            const bounds = coordinates.reduce(function (bounds, coord) {
                return bounds.extend(coord);
            }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
            return bounds
        }
    }
}
</script>

<style scoped lang="stylus">
.detail-view-wrapper
    padding 10px
    position relative
    #detail-map-container
        width 95%
        height 150px
    .bg-purple
        background: #e0e4ef
    .bg-purple-light
        background: #eceef5
    .grid-content
        border-radius: 4px
        min-height 36px
        line-height 36px
        font-size 15px
        text-align center
        margin 0 5px 5px
        overflow-x scroll
</style>