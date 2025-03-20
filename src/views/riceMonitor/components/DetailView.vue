<template>
    <div class="detail-view-wrapper">
        <el-container>
            <el-aside width="50%">
                <div id="detail-map-container"></div>
            </el-aside>
            <el-main width="50%">
                <div id="detail-map-container-right"></div>
            </el-main>
        </el-container>
        <div id="interval"></div>
        <el-container>
            <el-main>
                <el-row>
                    <el-col :span="8"><div class="grid-content bg-purple"> 水稻种植判别结果 </div></el-col>
                    <el-col :span="16"><div class="grid-content bg-purple-light"> {{ detailData['data']['properties']['image_date']}}: {{isRice}}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="8"><div class="grid-content bg-purple"> 耕地编码 </div></el-col>
                    <el-col :span="16"><div class="grid-content bg-purple-light"> {{ detailData['data']['properties']['gdbm'] }}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="8"><div class="grid-content bg-purple"> 行政区划 </div></el-col>
                    <el-col :span="16"><div class="grid-content bg-purple-light"> 宁波市-江北区-{{ detailData['data']['properties']['乡镇_mat'] }}-{{ detailData['data']['properties']['qsdwmc'] }} </div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="8"><div class="grid-content bg-purple"> 耕地质量类别 </div></el-col>
                    <el-col :span="2"><div class="grid-content" :style="{
                        'background-color': getArableQualityColor(detailData['data']['properties']['zh5_level']),
                        'border-radius': '50%',
                        'width': '36px',
                        'position': 'relative',
                        'left': '4px'
                    }">{{ detailData['data']['properties']['zh5_level'] }}</div></el-col>
                    <el-col :span="14"><div class="grid-content bg-purple-light"> {{ getArableQualityName(detailData['data']['properties']['zh5_level']) }} </div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="4"><div class="grid-content bg-purple"> 地类名称 </div></el-col>
                    <el-col :span="8"><div class="grid-content bg-purple-light">{{ detailData['data']['properties']['dlmc'] }}</div></el-col>
                    <el-col :span="4"><div class="grid-content bg-purple"> 耕地面积 </div></el-col>
                    <el-col :span="8"><div class="grid-content bg-purple-light"> {{ detailData['data']['properties']['nydtbmj'] }} m²</div></el-col>
                </el-row>
                <section>
                    <el-row>
                        <el-col :span="24" style="padding: 10px"> 《浙江省农用地土壤污染详查项目》田块主要农作物调查结果 </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24"><div class="grid-content bg-purple-light"> {{ detailData['data']['properties']['bz'] }} </div></el-col>
                    </el-row>
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
            map: null,
            map_right: null,
            isRice: '疑似种植'
        }
    },
    watch: {
        detailData() {
            // this.initMap()
            // console.log("change detail")
            this.refreshMap()
            // console.log('mean', this.detailData['data']['properties']['mean'])
            if (this.detailData['data']['properties']['mean'] >= 127.5) {
                this.isRice = "疑似种植"
            } else {
                this.isRice = "未种植"
            }
        }
    },
    mounted() {
        this.initMap()
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
                _this.map.addSource("detail-image", { 
                    type: 'raster',
                    'tiles': [
                        'http://10.75.68.56:8080/geoserver/raster_data/wms?service=WMS&version=1.1.0&request=GetMap&layers=raster_data%3Arice_monitor_jb_2019_06&bbox={bbox-epsg-3857}&width=768&height=564&srs=EPSG%3A3857&format=image%2Fpng&TRANSPARENT=TRUE'
                    ]                
                })
                _this.map.addLayer({
                    id: 'detail-image',
                    type: 'raster',
                    source:'detail-image',
                    layout: {
                        visibility: 'visible'
                    }
                })
                _this.map.addLayer({
                    id: 'detail-polygon',
                    type: 'fill',
                    source: 'detail-polygon',
                    layout: {},
                    paint: {
                        'fill-color': '#17a2b8',
                        'fill-opacity': 0.1
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

            _this.map_right = new mapboxgl.Map({
                container: 'detail-map-container-right',
                style: 'mapbox://styles/mapbox/satellite-streets-v11',
                center: [lat, lon],
                zoom: 15,
                interactive: false,
                attributionControl: false
            })
            _this.map_right.on('load', function () {
                _this.map_right.addSource("detail-polygon", _this.detailData)
                _this.map_right.addSource("detail-image", { 
                    type: 'raster',
                    'tiles': [
                        'http://10.75.68.56:8080/geoserver/raster_data/wms?service=WMS&version=1.1.0&request=GetMap&layers=raster_data%3Arice_monitor_result_op_2019_pred&bbox={bbox-epsg-3857}&width=768&height=564&srs=EPSG%3A3857&format=image%2Fpng&TRANSPARENT=TRUE'
                    ]                
                })
                _this.map_right.addLayer({
                    id: 'detail-image',
                    type: 'raster',
                    source:'detail-image',
                    layout: {
                        visibility: 'visible'
                    }
                })
                _this.map_right.addLayer({
                    id: 'detail-polygon',
                    type: 'fill',
                    source: 'detail-polygon',
                    layout: {},
                    paint: {
                        'fill-color': '#17a2b8',
                        'fill-opacity': 0
                    }
                })
                _this.map_right.addLayer({
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

            _this.map_right.removeLayer('detail-polygon')
            _this.map_right.removeLayer('outline')
            _this.map_right.removeSource('detail-polygon')

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

            _this.map_right.addSource("detail-polygon", _this.detailData)
            _this.map_right.addLayer({
                id: 'detail-polygon',
                type: 'fill',
                source: 'detail-polygon',
                layout: {},
                paint: {
                    'fill-color': '#17a2b8',
                    'fill-opacity': 0.5
                }
            })
            _this.map_right.addLayer({
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
            _this.map_right.fitBounds(bounds, {
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
        width 100%
        height 150px
    #detail-map-container-right
        width 100%
        height 150px
    #interval
        height 7px
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