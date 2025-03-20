<!-- 
Layer Controls 图层管理器 

    图层管理器是一个地图控制组件，负责控制地图中各图层的显示与隐藏、样式
    配置、显示顺序等。该组件处于“数据”与“地图”的中间层，可以通过直接读取
    “数据”（数据图层配置）或者读取地图中各图层的配置信息，控制配置信息来
    更新地图与配置信息状态。
-->

<template>
    <normal-window 
        id="layer-controls"
        v-show="visible"
        :width="280"
        :height="650"
        :draggable="true"
        :has-left-icon="true"
        :header-height="40"
        :header-title="'图层管理器'"
        :header-background-color="'var(--header-bg-color)'"
        :header-font-size="15"
        :content-background-color="'var(--content-bg-color)'"
        :isCollapse="isCollapse"
        :couldBeClosed="false">

        <div slot="left-icon" 
            class="header-icon" 
            style="padding-top: 7px"
            @click="handleClickIcon">
            <svg viewBox="0 0 64 64" width="23px" height="23px" class="data-ex-icons-layers " style="fill: currentcolor;"><path d="M50.88,43.52a3.2,3.2,0,0,1,0,5.86L34.56,56.52a6.42,6.42,0,0,1-5.13,0L13.12,49.37a3.2,3.2,0,0,1,0-5.86l4.62-2a6,6,0,0,0,1.48,1l2.16.95-7,3.05,16.32,7.14a3.19,3.19,0,0,0,2.56,0L49.6,46.44l-7-3.05,2.16-.95a6,6,0,0,0,1.48-.95Zm0-14.39a3.2,3.2,0,0,1,0,5.86L34.56,42.13a6.42,6.42,0,0,1-5.13,0L13.12,35a3.2,3.2,0,0,1,0-5.86l4.62-2a6,6,0,0,0,1.48,1l2.16.95-7,3.05L30.72,39.2a3.19,3.19,0,0,0,2.56,0L49.6,32.06l-7-3.05,2.16-.95a6,6,0,0,0,1.48-.95ZM13.12,20.6a3.2,3.2,0,0,1,0-5.86L29.44,7.6a6.39,6.39,0,0,1,5.13,0l16.32,7.14a3.2,3.2,0,0,1,0,5.86L34.56,27.74a6.39,6.39,0,0,1-5.13,0Z"></path></svg>
        </div>

        <div slot="content" class="content">
            <div
                class="clear-btn btn"
                @click="clearAllLayers">
                <span class="el-icon-table-lamp icon"></span>
                <span class="content">清除所有图层</span> 
            </div>

            <el-collapse 
                class="topics-wrapper"
                v-model="expandedTopic">
                <el-collapse-item 
                    class="topic"
                    v-for="(topic, id) in this.topics"
                    :key="id"
                    :name="id"
                    handle=".drag-el">
                    <template slot="title">
                        <!-- <i class="header-icon el-icon-rank" 
                        style="font-size: 13px; padding: 0 5px 0 0"></i>  -->
                        {{ topic.name }}
                    </template>
                    <draggable
                        class="list-group"
                        tag="ul"
                        handle=".drag-el"
                        v-model="topic.layerInfos"
                        v-bind="dragOptions"
                        @start="drag = true"
                        @end="updateLayersOrder">
                        <transition-group type="transition" :name="!drag ? 'flip-list' : null">
                            <li class="list-group-item"
                                v-for="(layerInfo, index) in topic.layerInfos"
                                :key="index + 1">
                                <div style="display: flex; align-items: center">
                                    <svg viewBox="0 0 64 64" width="23px" height="23px" class="data-ex-icons-vertdot drag-el" style="fill: currentcolor;"><rect x="35.01" y="48.31" width="6.44" height="6.44"></rect><rect x="35.01" y="35.43" width="6.44" height="6.44"></rect><rect x="35.01" y="22.55" width="6.44" height="6.44"></rect><rect x="35.01" y="9.67" width="6.44" height="6.44"></rect><rect x="22.13" y="48.31" width="6.44" height="6.44"></rect><rect x="22.13" y="35.43" width="6.44" height="6.44"></rect><rect x="22.13" y="22.55" width="6.44" height="6.44"></rect><rect x="22.13" y="9.67" width="6.44" height="6.44"></rect></svg>
                                    <span class="layer-name">{{ layerInfo.aliasName }}</span>
                                    <svg 
                                        @click="toggleLayerVisibility(layerInfo)"
                                        :class="{'data-ex-icons-eyeseen': true, 'visible-btn': true, 'is-visible': layerInfo.controls.visibility === 'visible'}"
                                        viewBox="0 0 64 64" width="28px" height="28px" data-tip="true" data-for="tooltip.hideLayer_uk67d48" currentItem="false" style="fill: currentcolor;"><path d="M55.25,35v-.09a1.86,1.86,0,0,0-.49-1,36.15,36.15,0,0,0-5.05-5,31.92,31.92,0,0,0-13.19-7A21.09,21.09,0,0,0,28,21.8a26.07,26.07,0,0,0-7.4,2.73,40.33,40.33,0,0,0-9.88,7.63c-.54.56-1.07,1.12-1.56,1.73a1.92,1.92,0,0,0,0,2.56,36.09,36.09,0,0,0,5.05,5,31.89,31.89,0,0,0,13.19,7,21.05,21.05,0,0,0,8.51.12,26.06,26.06,0,0,0,7.41-2.73,40.37,40.37,0,0,0,9.88-7.63c.54-.56,1.07-1.12,1.56-1.73a1.84,1.84,0,0,0,.49-1v-.19s0-.06,0-.09,0-.06,0-.09,0-.08,0-.09M32,44.51a9.35,9.35,0,1,1,9.28-9.35A9.31,9.31,0,0,1,32,44.51"></path><path d="M32,32.07a3.1,3.1,0,1,1-3.07,3.1A3.08,3.08,0,0,1,32,32.07"></path>
                                    </svg>
                                    <svg
                                        @click="toggleSettingsVisibility(layerInfo)"
                                        :class="{'data-ex-icons-eyeseen': true, 'visible-btn': true, 'is-visible': layerInfo.controls.showSettings}"
                                        viewBox="0 0 64 64" width="28px" height="28px" style="fill: currentcolor;"><rect x="28" y="44" width="8" height="8"></rect><rect x="28" y="28" width="8" height="8"></rect><rect x="28" y="12" width="8" height="8"></rect>
                                    </svg>
                                </div>
                                <div class="layer-settings"
                                    v-show="layerInfo.controls.showSettings">
                                    <colormap-selector
                                        class="colormap-selector"
                                        :curColormap="layerInfo.controls.colormap"
                                        v-show="layerInfo.type !== 'raster'"
                                        @changeColormap="changeColormap($event, layerInfo)">
                                    </colormap-selector>
                                    <layer-opacity-control
                                        :layer-info="layerInfo">
                                    </layer-opacity-control>
                                </div>
                                
                            </li>
                        </transition-group>
                    </draggable>
                </el-collapse-item>
            </el-collapse>
        </div>
    </normal-window>
</template>

<script>
import draggable from 'vuedraggable'
import TMap from "../../utils/tmap2"
import NormalWindow from "../../../../components/window/NormalWindow"
import colormaps from "../../../../components/utils/colormap"
import ColormapSelector from './ColormapSelector'
import LayerOpacityControl from "./LayerOpacityControl"

export default {
    components: {
        draggable,
        NormalWindow,
        ColormapSelector,
        LayerOpacityControl
    },
    props: {
        layerInfos: {
            type: Array,
            required: true
        },
        curLayerInfo: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            tmap: null,
            isCollapse: false,
            visible: true,
            expandedTopic: [0, 1, 2],
            drag: false,
            colormaps: colormaps
        }
    },
    computed: {
        /**
         * 专题列表
         * @rtype [{
         *      id: 0,
         *      name: topicName,
         *      layers: [ ...layer infos of this topic ] 
         * }, {...}]
         */
        topics() {
            const topicNames = []
            for (let layerInfo of this.layerInfos) {
                const topicName = layerInfo.topicName
                if (!topicNames.includes(topicName)) {
                    topicNames.push(topicName)
                }
            }
            const topics = []
            for (const [index, topicName] of topicNames.entries()) {
                topics.push({
                    id: index,
                    name: topicName,
                    layerInfos: this.layerInfos.filter((layerInfo) => {
                        return (layerInfo.topicName == topicName)
                    })
                })
            }
            return topics
        },
        dragOptions() {
            return {
                animation: 200,
                group: "description",
                ghostClass: "ghost"
            };
        }
    },
    mounted() {
        const _this = this
        _this.tmap = TMap.getInstance()
        _this.tmap.map.on('load', function() {
            _this.updateLayersOrder()
        })
    },
    methods: {
        /**
         * 点击图层管理器图标后折叠管理器面板
         * @rtype null
         */
        handleClickIcon() {
            this.isCollapse = !this.isCollapse
        },
        /**
         * 控制图层显示与隐藏
         * @rtype null
         */
        toggleLayerVisibility(layerInfo) {
            const _this = this
            const map = _this.tmap.map;
            const visibility = layerInfo.controls.visibility === "visible"? "none" : "visible"
            for (let layerConfig of layerInfo.layers) {
                map.setLayoutProperty(layerConfig.layer.id, 'visibility', visibility)
                layerConfig.layer.layout.visibility = visibility
            }
            layerInfo.controls.visibility = visibility
            this.updateLayersOrder()
        },
        /**
         * 控制图层设置显示与隐藏
         * @rtype null
         */
        toggleSettingsVisibility(layerInfo) {
            layerInfo.controls.showSettings = !layerInfo.controls.showSettings
        },
        /**
         * 隐藏所有图层
         * @rtype null
         */
        clearAllLayers() {
            const map = this.tmap.map;
            this.layerInfos.forEach(layerInfo => {
                layerInfo.layers.forEach(layerConfig => {
                    map.setLayoutProperty(layerConfig.layer.id, 'visibility', 'none')
                    layerConfig.layer.layout.visibility = 'none'
                })
                layerInfo.controls.visibility = 'none'
            })
        },
        /**
         * 更新图层的显示顺序
         * 根据图层控制器中各图层的顺序，更改地图组件中各图层的显示顺序
         * @rtype null
         */
        updateLayersOrder() {
            const _this = this
            const map = _this.tmap.map

            const orderedLayerConfigs = []
            _this.topics.forEach(topic => {
                topic.layerInfos.forEach(layerInfo => {
                    layerInfo.layers.forEach(layerConfig => {
                        orderedLayerConfigs.push(layerConfig)
                    })
                })
            })
            for (let i=1; i<orderedLayerConfigs.length; i++) {
                const beforeLayerId = orderedLayerConfigs[i-1].layer.id
                const curLayerId = orderedLayerConfigs[i].layer.id
                map.moveLayer(curLayerId, beforeLayerId)
            }
            _this.drag = false
        },
        changeColormap(colormap, layerInfo) {
            const _this = this
            const map = _this.tmap.map
            layerInfo.layers.forEach(layerConfig => {
                const attr = layerConfig.colormapConfig.colormapAttr
                const newColormapConfig = layerConfig.colormapConfig.render(colormap)
                map.setPaintProperty(
                    layerConfig.layer.id,
                    attr, newColormapConfig
                )
                layerConfig.layer.paint[attr] = newColormapConfig
                layerConfig.colormapConfig.colormap = colormap
            })
            layerInfo.controls.colormap = colormap
        },
    }
}
</script>

<style lang="stylus" scoped>
#layer-controls
    position absolute
    left 15px
    top 15px
    z-index 10
    .header-icon
        cursor pointer
    .topics-title
        color var(--header-color)
        font-size 20px
        font-weight 300
        letter-spacing 1.25px
        margin-bottom 25px
    .clear-btn
        width 81px
        .icon
            color var(--icon-color)
            padding 0 5px 0 0
            display none
    .topic
        background-color var(--collapse-item-bg-color)
    >>> .el-collapse
        border none
    >>> .el-collapse-item
        border-radius 0px
    >>> .el-collapse-item__header
        margin-top 5px
        padding 0 12px
        // height 30px
        color var(--content-color)
        background-color transparent
        font-weight normal
        border-left 3px solid transparent
        border-bottom 0
        transition all .2s ease-in-out
    >>> .el-collapse-item__header:hover,
    >>> .el-collapse-item__header.is-active
        background-color var(--collapse-item-hover-bg-color)
        border-left-color var(--tag-color)
    >>> .el-collapse-item__wrap
        background-color transparent
        border-bottom 0
        padding-bottom 10px
    >>> .el-collapse-item__content
        padding 0
        background-color transparent
        color var(--content-color)
        .list-group-item
            box-sizing border-box
            display block
            width 100%
            margin 5px auto
            padding 0px 12px
            font-size 13px
            line-height 40px
            position relative
            .layer-name
                display inline-block
                width 100%
            .layer-settings
                padding 12px
                //background-color: #fff
                //border 1px solid #fff
        .list-group-item:hover
            transition 0.2s all ease-in-out
            background-color var(--collapse-subitem-hover-bg-color)
    >>> .el-switch
        float right
        padding-top 5px
    .drag-el
        padding 0 10px 0 5px
        cursor move
    .visible-btn
        padding 0 5px
        color var(--inactive-color)
        cursor pointer
        transition all 0.2s ease-in-out
    .visible-btn.is-visible
        color var(--green)


.flip-list-move
    transition transform 0.2s
.no-move
    transition transform 0s
.ghost
    opacity: 0.5
    background #c8ebfb
.list-group
    min-height 20px
.list-group-item i
    cursor pointer

</style>