<!-- <template>
    <div id = "area-assessment-param">
        <div id = "area-assessment-button"
            class="mapboxgl-ctrl mapboxgl-ctrl-group"
            @click="closeWindow">
            <button class="mapboxgl-ctrl-area-assessment-button" type="button" aria-label="Toggle area assessment" title="Toggle area assessment">
                <span class="mapboxgl-ctrl-icon" aria-hidden="true"></span>
            </button>
        </div>
        <div class = "param-container">
            <normal-window
            id="layer-controls"
            v-show ="visible"
            :width="600"
            :height="650"
            :draggable="true"
            :has-left-icon="true"
            :header-height="40"
            :header-title="headerTitle"
            :header-background-color="'var(--header-bg-color)'"
            :header-font-size="15"
            :content-background-color="'var(--content-bg-color)'"
            :could-be-closed="true"
            @closeWindow="closeWindow"
            :domId = "moduleId">
                <div slot= "content">
                    <div style="width:100%;height:300px;margin-bottom:10px">
                        <div id="detail-map-container" style="height:100%"></div>
                    </div>
                    <el-form ref = "form" :model="area" label-width="60px">
                        <div class = "sub-control-container">
                            <div class="content">
                                <el-row style="margin-bottom:10px">
                                    <el-form-item label="农用地环境质量评价遵循原则" label-width="210px">
                                        <el-input v-model="assessmentRule" style="text-align:center"/>
                                    </el-form-item>              
                                </el-row>
                                <el-row style="margin-bottom:10px">
                                    <el-col :span="12">
                                        <el-form-item label="镉 类别" label-width="80px">
                                            <el-input v-model="area.cd_level"/>
                                        </el-form-item>
                                    </el-col>                                    
                                    <el-col :span="12">
                                        <el-form-item label="汞 类别" label-width="80px">
                                            <el-input v-model="area.hg_level"/>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row style="margin-bottom:10px">
                                    <el-col :span="12">
                                        <el-form-item label="砷 类别" label-width="80px">
                                            <el-input v-model="area.as_level"/>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="铅 类别" label-width="80px">
                                            <el-input v-model="area.pb_level"/>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row style="margin-bottom:10px">                                 
                                    <el-col :span="12">
                                        <el-form-item label="铬 类别" label-width="80px">
                                            <el-input v-model="area.cr_level"/>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="综合五项类别" label-width="120px">
                                            <el-input v-model="area.zh5_level"/>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <div class = "sub-button-container">
                            <div class = "content" >
                                <el-button type="primary" @click="AreaAssessment">环境质量类别划分</el-button>
                                <el-button type="primary">农用地数据添加</el-button>
                                <el-upload
                                    class= "upload"
                                    action= ""
                                    :multiple="false"
                                    :show-file-list="false"
                                    :file-list="fileList"
                                    :http-request="handleGeoJSON">
                                    <el-button type="primary" style="margin-left:10px;margin-bottom:2px">农用地 GeoJSON 上传</el-button>
                                </el-upload>
                            </div>
                        </div>
                    </el-form>
                </div>
            </normal-window>
        </div>
    </div>
</template>

<script>
import NormalWindow from '../../components/window/NormalWindow.vue'
import TMap from "../../components/utils/tmap"
import {registerDomControl} from '../../components/utils/controlutils'
import mapboxgl from 'mapbox-gl'
import * as turf from '@turf/turf'
import WKT from "terraformer-wkt-parser"
import axios from 'axios'

export default {
    components: {NormalWindow},
    name: "AssessmentParam",
    props: {
        moduleId : {
            type: String,
            required: true
        },
    },
    data() {
        return {
            tmap: null,
            visible: false,
            headerTitle: "农用地土壤环境类别评价",
            area: {
                cd_level: "",
                hg_level: "",
                as_level: "",
                pb_level: "",
                cr_level: "",
                zh5_level: "",
            },
            fileList: [],
            detailData: {
                "type": "geojson",
                "data": null
            },
            lon: 29.99139016092721,
            lat: 121.452800712982594,
            map: null,
            buffer: {
                "type": "geojson",
                "data": null
            },
            firstOpen: true,
            assessmentRule: "",
            firstAddGeoJSON: true
        }
    },
    mounted() {
        const _this = this
        _this.tmap = TMap.getInstance()
        const map = _this.tmap.map
        map.addControl(registerDomControl("area-assessment-button"))
    },
    watch: {
        detailData() {
            console.log("change detail", this.detailData)
            this.refreshMap()
        }
    },
    methods: {
        closeWindow() {
            const _this = this
            if (_this.firstOpen) {
                _this.firstOpen = !_this.firstOpen
                _this.initMap()
            }
            _this.visible = !_this.visible
            setTimeout(() => {
                _this.map.resize()
            }, 10)
        },
        handleGeoJSON({file}) {
            // console.log("handleGeoJSON")
            let reader = new FileReader()
            const _this = this
            reader.readAsText(file, 'utf-8');
            reader.onload = function() {
                const GeoJSON = JSON.parse(reader.result)
                if (GeoJSON.type == "FeatureCollection") {
                    _this.detailData["data"] = GeoJSON["features"][0]
                    // console.log("FeatureCollection", GeoJSON["features"][0])
                } else {
                    _this.detailData["data"] = GeoJSON
                    // console.log("Feature/Polygon", GeoJSON)
                }
                _this.refreshMap()
                _this.firstAddGeoJSON = false;
            }
        },
        initMap() {
            const _this = this

            _this.map = new mapboxgl.Map({
                container: 'detail-map-container',
                style: 'mapbox://styles/mapbox/satellite-streets-v11',
                center: [this.lat, this.lon],
                zoom: 12,
                interactive: false,
                attributionControl: false
            })

            _this.map.on('load', function () {

                _this.map.addSource("soil_points", {
                    type: 'vector',
                    scheme: 'tms',
                    tiles: [
                        'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_soilpoint@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                    ],
                    generateId: true
                    }
                )
                _this.map.addSource("arable-land", {
                    type: 'vector',
                    scheme: 'tms',
                    tiles: [
                        'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_classify@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                    ],
                    generateId: true
                    }
                )

                _this.map.addLayer({
                    id: 'arable-land',
                    type: 'fill',
                    source: 'arable-land',
                    'source-layer': 'jb_classify',
                    layout: {
                        visibility: 'visible'
                    },
                    paint: {
                        'fill-color': [
                            'match',
                            ['get', 'zh5_level'],
                            1, '#8BC34A',
                            2, '#FBC02D',
                            3, '#F44336',
                            /* other */ '#ccc'
                        ],
                        'fill-opacity': 1
                    },
                })

                _this.map.addLayer({
                    id: 'arable-land-outline',
                    type: 'line',
                    source: 'arable-land',
                    'source-layer': 'jb_classify',
                    layout: {
                        visibility: 'visible'
                    },
                    paint: {
                        'line-color': '#eee',
                        'line-opacity': 1,
                        'line-width': 0.5
                    }
                })

                _this.map.addLayer({
                    id: 'soil_points',
                    type: 'circle',
                    source: 'soil_points',
                    'source-layer': 'jb_soilpoint',
                    layout: {
                        visibility: 'visible'
                    },
                    paint: {
                        'circle-radius': 8,
                        'circle-stroke-color': '#69dcff',
                        'circle-stroke-width': [
                            'case',
                            ['boolean', ['feature-state', 'hover'], false],
                            2, 0
                        ],
                        'circle-color': [
                            'match',
                            ['get', 'zh5_level'],
                            "1", '#4caf50',
                            "2", '#FBA665',
                            "3", '#D32F2F',
                            /* other */ '#ccc'
                        ],
                        'circle-opacity': 1
                    }
                })      
            })
        },
        refreshMap() {
            const _this = this

            // 不是第一次添加才需要删除旧图层
            if (!_this.firstAddGeoJSON) {
                _this.map.removeLayer('buffer-outline')
                _this.map.removeLayer('buffer')
                _this.map.removeSource('buffer')
                _this.map.removeLayer('outline')
                _this.map.removeSource('detail-polygon')
            }

            // 创建缓冲区
            const feature = turf.feature(_this.detailData.data.geometry)
            _this.buffer.data = turf.buffer(feature, 0.2, { units: "kilometers" });

            // 添加缓冲区
            _this.map.addSource("buffer", _this.buffer)
            _this.map.addLayer({
                id: 'buffer',
                type: 'fill',
                source: 'buffer',
                layout: {},
                paint: {
                    'fill-color': '#17a2b8',
                    'fill-opacity': 0.1
                }
            })
            _this.map.addLayer({
                'id': 'buffer-outline',
                'type': 'line',
                'source': 'buffer',
                'layout': {},
                'paint': {
                    'line-color': '#33cccc',
                    'line-width': 2
                }
            })

            // 添加上传的矢量图层
            _this.map.addSource("detail-polygon", _this.detailData)
            _this.map.addLayer({
                'id': 'outline',
                'type': 'line',
                'source': 'detail-polygon',
                'layout': {},
                'paint': {
                    'line-color': '#33cccc',
                    'line-width': 2
                }
            })        

            // map resize
            const bbox = turf.bbox(_this.buffer.data);
            _this.map.fitBounds(bbox, {
                padding: 50,
                animate: false
            })
        },
        AreaAssessment(params) {
            const _this = this
            // 组合 url 和查询参数
            const baseUrl = "/api/risk/land"
            const queryParam = {
                'WKT_text': WKT.convert(this.detailData.data.geometry),
                ...params
            }
            const queryUrl = _this._concatUrlParams(baseUrl, queryParam)
            // 获取数据
            axios.get(queryUrl).then((res) => {
                const resData = res.data
                // console.log("resData", resData)
                if (0 === resData.status) {
                    // 获取数据成功
                    // console.log("data", resData["data"])
                    _this.assessmentRule = resData["msg"]
                    _this.area.cd_level = _this.getLevelName(resData["data"]["cdLevel"])
                    _this.area.hg_level = _this.getLevelName(resData["data"]["hgLevel"])
                    _this.area.as_level = _this.getLevelName(resData["data"]["asLevel"])
                    _this.area.pb_level = _this.getLevelName(resData["data"]["pbLevel"])
                    _this.area.cr_level = _this.getLevelName(resData["data"]["crLevel"])
                    _this.area.zh5_level = _this.getLevelName(resData["data"]["zh5Level"])
                } else {
                    _this.$message({
                        message: '数据为空',
                        type: 'warning'
                    })
                }
            }, (err) => {
                _this.$message({
                    message: '获取数据失败，请检查网络后重试',
                    type: 'error'
                })
                console.log(err)
            })
        },
        _concatUrlParams(baseUrl, queryParam) {
            let queryUrl = baseUrl + '?'
            for (let key in queryParam) {
                queryUrl += `${key}=${queryParam[key]}&`
            }
            return queryUrl.slice(0, -1)
        },
        getLevelName(level) {
            if (level == 1) {
                return "优先保护类"
            } else if (level == 2) {
                return "安全利用类"
            } else {
                return "严格管控类"
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
#area-assessment-button
    .mapboxgl-ctrl-area-assessment-button
         .mapboxgl-ctrl-icon
            background-image url("~@/assets/images/layer-controls.svg")

#layer-controls
    position absolute
    left 30%
    top 20%
    z-index 10

    >>> .el-form-item
        margin 0
        padding 0px

    .sub-control-container
        .header
            text-align left
            padding 10px 20px
        .content
            font-size 13ox
            line-height 40px

    .sub-button-container
        .content
            display flex
            justify-content center
            align-items center
            text-align center
            margin 25px
            line-height 40px
            >>> .el-button
                font-size 14px
                width 180px
</style> -->