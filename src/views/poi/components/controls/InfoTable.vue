<template>
    <div class="info-window" id="info-panel" ref="info-panel" :style="panelStyle">
        <div class="info-window-header" @mousedown="startDrag">
            <button class="toggle-btn">
                <svg viewBox="0 0 64 64" width="23px" height="20px" class="data-ex-icons-layers" style="fill: #00BFFF; stroke: none">
                    <path d="M50.88,43.52a3.2,3.2,0,0,1,0,5.86L34.56,56.52a6.42,6.42,0,0,1-5.13,0L13.12,49.37a3.2,3.2,0,0,1,0-5.86l4.62-2a6,6,0,0,0,1.48,1l2.16.95-7,3.05,16.32,7.14a3.19,3.19,0,0,0,2.56,0L49.6,46.44l-7-3.05,2.16-.95a6,6,0,0,0,1.48-.95Zm0-14.39a3.2,3.2,0,0,1,0,5.86L34.56,42.13a6.42,6.42,0,0,1-5.13,0L13.12,35a3.2,3.2,0,0,1,0-5.86l4.62-2a6,6,0,0,0,1.48,1l2.16.95-7,3.05L30.72,39.2a3.19,3.19,0,0,0,2.56,0L49.6,32.06l-7-3.05,2.16-.95a6,6,0,0,0,1.48-.95ZM13.12,20.6a3.2,3.2,0,0,1,0-5.86L29.44,7.6a6.39,6.39,0,0,1,5.13,0l16.32,7.14a3.2,3.2,0,0,1,0,5.86L34.56,27.74a6.39,6.39,0,0,1-5.13,0Z"></path>
                </svg>
            </button>
            <span class="title">{{ currentPanelTitle }}</span>
            <div class="quit-btn">
                <div class="el-icon-close detail-window-close-btn" @click="closePanel"></div>
            </div>
        </div>
        <div class="info-window-content" v-for="(infoPanelDataSource, index) in infoPanelDataSources" :key="index" v-show="infoPanelDataSource.visible">
            <div v-if="infoPanelDataSource.layerId == 'stage' && Object.keys(infoPanelDataSource.data).length > 0">
                <table class="grid-table">
                    <!-- <thead>
                        <tr>
                            <th colspan="2">基本信息</th>
                        </tr>
                    </thead> -->
                    <tbody>
                        <!-- 位置信息 -->
                        <tr>
                            <td>经度</td>
                            <td>{{ infoPanelDataSource.data['经度'] }}</td>
                        </tr>
                        <tr>
                            <td>纬度</td>
                            <td>{{ infoPanelDataSource.data['纬度'] }}</td>
                        </tr>
                        <!-- 土壤信息 -->
                        <tr>
                            <td>类别</td>
                            <td>{{ infoPanelDataSource.data['类别'] }}</td>
                        </tr>
                        <tr>
                            <td>置信度</td>
                            <td>{{ infoPanelDataSource.data['置信度'] }}</td>
                        </tr>
                        <!-- 预留更多信息行 -->
                        <tr>
                            <td>作物类型</td>
                            <td>待添加</td>
                        </tr>
                        <tr>
                            <td>灾害类型</td>
                            <td>待添加</td>
                        </tr>
                        <tr>
                            <td>预测产量</td>
                            <td>待添加</td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import TMap from "../../utils/tmap2"
import mapboxgl from "mapbox-gl"

export default {
    name: 'InfoTable',
    props: {
        visibleLayerInfos: {
            type: Array,
            required: true
        },
        initialPosition: {  // 需要加逗号分隔不同的 props
            type: Object,
            default: () => ({ x: 300, y: 15 }) // 与 InfoWindow 相同的默认位置
        }
    },
    data() {
        return {
            tmap: null,
            detailVisible: 'hidden',
            loading: false,
            infoPanelDataSources: [],
            position: this.initialPosition,
            dragging: false,
            dragOffset: { x: 0, y: 0 },
            isFirstShow: true, // 用于判断是否是首次显示
            selectedFeatureId: null // 跟踪选中的地块
        }
    },

    computed: {
        panelStyle() {
            return {
                visibility: this.detailVisible,
                left: this.position.x + 'px',
                top: this.position.y + 'px'
            }
        },
        currentPanelTitle() {
            return (this.infoPanelDataSources[0] && this.infoPanelDataSources[0].name) || '特征信息'
        }
    },

    mounted() {
        // 确保在 map 加载完成后再注册事件
        this.tmap = TMap.getInstance()
        const map = this.tmap.map
        
        if (map.loaded()) {
            this.registerInfoPanel()
        } else {
            map.on('load', () => {
                this.registerInfoPanel()
            })
        }
    },
    methods: {
        startDrag(event) {
            this.dragging = true;
            this.dragOffset.x = event.clientX - this.position.x;
            this.dragOffset.y = event.clientY - this.position.y;
            window.addEventListener('mousemove', this.onDrag);
            window.addEventListener('mouseup', this.stopDrag);
        },

        onDrag(event) {
            if (this.dragging) {
                this.position = {
                    x: event.clientX - this.dragOffset.x,
                    y: event.clientY - this.dragOffset.y
                };
            }
        },

        stopDrag() {
            this.dragging = false;
            window.removeEventListener('mousemove', this.onDrag);
            window.removeEventListener('mouseup', this.stopDrag);
        },

        registerInfoPanel() {
            const map = this.tmap.map
            
            // 遍历所有可见图层
            this.visibleLayerInfos.forEach(layerInfo => {
                layerInfo.layers.forEach(layerConfig => {
                    const layerId = layerConfig.layer.id
                    const infoPanelConfig = layerConfig.infoPanelConfig

                    if (!layerConfig.clickable) {
                        return
                    }

                    // 先移除已存在的事件监听器
                    map.off('mousemove', layerId)
                    map.off('mouseleave', layerId)
                    map.off('click', layerId)

                    // 添加鼠标悬停效果
                    map.on('mousemove', layerId, (e) => {
                        map.getCanvas().style.cursor = 'pointer'
                    })
                    
                    map.on('mouseleave', layerId, (e) => {
                        map.getCanvas().style.cursor = ''
                    })

                    // 添加点击事件
                    // 添加点击事件
                    map.on('click', layerId, (e) => {
                        const feature = e.features[0]
                        if (!feature) return

                        // 如果之前有选中的地块，恢复其样式
                        if (this.selectedFeatureId) {
                            map.setFeatureState(
                                { 
                                    source: 'stage-outline',  // 修改：使用线条图层的 source
                                    sourceLayer: 'stagejx',
                                    id: this.selectedFeatureId 
                                },
                                { selected: false }
                            )
                        }

                        // 设置新选中地块的样式
                        this.selectedFeatureId = feature.id
                        map.setFeatureState(
                            { 
                                source: 'stage-outline',  // 修改：使用线条图层的 source
                                sourceLayer: 'stagejx',
                                id: this.selectedFeatureId 
                            },
                            { selected: true }
                        )

                        this.updateInfoPanelPosition(e)
                        this.updateInfoPanelInfo(feature, layerId, infoPanelConfig)
                        this.detailVisible = 'visible'
                    })
                })
            })
        },
        closePanel() {
            this.detailVisible = 'hidden'
            this.infoPanelDataSources = []
            this.isFirstShow = true

            // 清除选中状态
            if (this.selectedFeatureId) {
                this.visibleLayerInfos.forEach(layerInfo => {
                    layerInfo.layers.forEach(layerConfig => {
                        const layerId = layerConfig.layer.id
                        this.tmap.map.setFeatureState(
                            { source: layerId, id: this.selectedFeatureId },
                            { selected: false }
                        )
                    })
                })
                this.selectedFeatureId = null
            }

            if (this.tmap && this.tmap.map) {
                this.tmap.map.getCanvas().style.cursor = ''
            }
        },
        updateInfoPanelPosition(evt) {
            
            // 只在第一次显示时设置 detailVisible
            if (this.isFirstShow) {
                this.isFirstShow = false
            }
            this.detailVisible = 'visible'
        },

        closePanel() {
            this.detailVisible = 'hidden'
            this.infoPanelDataSources = []
            this.isFirstShow = true
            if (this.tmap && this.tmap.map) {
                this.tmap.map.getCanvas().style.cursor = ''
            }
        },

        updateInfoPanelInfo(feature, layerId, infoPanelConfig) {
            if (layerId !== 'stage') return

            const properties = feature.properties
            const alias = infoPanelConfig.alias || {}
            const data = {}
            
            // 生长阶段映射表
            const stageMap = {
                '1': '萌发期',
                '2': '返青初期',
                '3': '返青盛期',
                '4': '成熟期',
                '5': '衰老初期',
                '6': '衰老盛期',
                '7': '休眠期'
            }

            // 先添加经纬度信息
            if (feature.geometry && feature.geometry.coordinates) {
                // 如果是多边形，取中心点
                let center
                if (feature.geometry.type === 'Polygon') {
                    const coordinates = feature.geometry.coordinates[0]
                    const sumX = coordinates.reduce((sum, coord) => sum + coord[0], 0)
                    const sumY = coordinates.reduce((sum, coord) => sum + coord[1], 0)
                    center = [
                        (sumX / coordinates.length).toFixed(4),
                        (sumY / coordinates.length).toFixed(4)
                    ]
                } else {
                    center = feature.geometry.coordinates
                }
                data['经度'] = center[0]
                data['纬度'] = center[1]
            }
            
            // 添加其他属性
            for (let key in properties) {
                if (alias[key]) {
                    let value = properties[key]
                    if (key === 'stage') {
                        value = stageMap[value]
                    } else if (key === 'confidence') {
                        value = Number(value).toFixed(2)
                    }
                    data[alias[key]] = value
                }
            }
            
            this.infoPanelDataSources = [{
                layerId: layerId,
                name: infoPanelConfig.title || '特征信息',
                visible: true,
                data: data
            }]
        }
    }
}
</script>

<style scoped>
.info-window {
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    /* font-size: 14px; */
}

.info-window-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: move;
    background: #f1f1f1;
    padding: 5px;
    border-bottom: 1px solid #ccc;
}

.title {
    flex: 1;
    text-align: center;
    /* 标题字体大小 */
    font-size: 16px;
    /* font-weight: bold; */
}

.toggle-btn {
    margin-right: 10px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
}

.info-window-content {
    margin: 10px 0;
    transition: max-height 0.3s ease, opacity 0.3s ease;
    overflow: hidden;
}

.grid-table {
    border-collapse: collapse;
    width: 100%;
}

.grid-table tr:nth-child(odd) {
    background-color: #E0F7FA;
}

.grid-table tr:nth-child(even) {
    background-color: #B2EBF2;
}

.grid-table td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: left;
    color: #333;
    /* 表格内容字体大小 */
    font-size: 15px; 
}

/* 如果需要不同的列使用不同的字体大小 */
/* .grid-table td:first-child {
    font-size: 13px;  // 第一列（标签）
}
.grid-table td:last-child {
    font-size: 14px;  // 第二列（值）
} */

.detail-window-close-btn {
    cursor: pointer;
    padding: 5px;
    color: #666;
    /* 关闭按钮字体大小 */
    /* font-size: 16px; */
}

.detail-window-close-btn:hover {
    color: #000;
}
</style>