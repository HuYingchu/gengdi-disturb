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
        :header-height="35"
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
            <svg viewBox="0 0 64 64" width="23px" height="23px" class="data-ex-icons-layers " style="fill: currentcolor;">
                <path d="M50.88,43.52a3.2,3.2,0,0,1,0,5.86L34.56,56.52a6.42,6.42,0,0,1-5.13,0L13.12,49.37a3.2,3.2,0,0,1,0-5.86l4.62-2a6,6,0,0,0,1.48,1l2.16.95-7,3.05,16.32,7.14a3.19,3.19,0,0,0,2.56,0L49.6,46.44l-7-3.05,2.16-.95a6,6,0,0,0,1.48-.95Zm0-14.39a3.2,3.2,0,0,1,0,5.86L34.56,42.13a6.42,6.42,0,0,1-5.13,0L13.12,35a3.2,3.2,0,0,1,0-5.86l4.62-2a6,6,0,0,0,1.48,1l2.16.95-7,3.05L30.72,39.2a3.19,3.19,0,0,0,2.56,0L49.6,32.06l-7-3.05,2.16-.95a6,6,0,0,0,1.48-.95ZM13.12,20.6a3.2,3.2,0,0,1,0-5.86L29.44,7.6a6.39,6.39,0,0,1,5.13,0l16.32,7.14a3.2,3.2,0,0,1,0,5.86L34.56,27.74a6.39,6.39,0,0,1-5.13,0Z"></path>
            </svg>
        </div>

        <div slot="content" class="content">
            <div class="clear-btn btn" @click="clearAllLayers">
                <span class="el-icon-table-lamp icon"></span>
                <span class="content">清除所有图层</span> 
            </div>

            <el-collapse class="topics-wrapper" v-model="expandedTopic">
                <el-collapse-item class="topic" v-for="(topic, id) in this.topics" :key="id" :name="id" handle=".drag-el">
                    <template slot="title">
                        {{ topic.name }}
                    </template>
                    <draggable class="list-group" tag="ul" handle=".drag-el" v-model="topic.layerInfos" v-bind="dragOptions" @start="drag = true" @end="updateLayersOrder">
                        <transition-group type="transition" :name="!drag ? 'flip-list' : null">
                            <li class="list-group-item" v-for="(layerInfo, index) in topic.layerInfos" :key="index + 1">
                                <div style="display: flex; align-items: center">
                                    <svg viewBox="0 0 64 64" width="23px" height="23px" class="data-ex-icons-vertdot drag-el" style="fill: currentcolor;">
                                        <rect x="35.01" y="48.31" width="6.44" height="6.44"></rect>
                                        <rect x="35.01" y="35.43" width="6.44" height="6.44"></rect>
                                        <rect x="35.01" y="22.55" width="6.44" height="6.44"></rect>
                                        <rect x="35.01" y="9.67" width="6.44" height="6.44"></rect>
                                        <rect x="22.13" y="48.31" width="6.44" height="6.44"></rect>
                                        <rect x="22.13" y="35.43" width="6.44" height="6.44"></rect>
                                        <rect x="22.13" y="22.55" width="6.44" height="6.44"></rect>
                                        <rect x="22.13" y="9.67" width="6.44" height="6.44"></rect>
                                    </svg>
                                    <span class="layer-name">{{ layerInfo.aliasName }}</span>
                                    
                                    <svg @click="toggleLayerVisibility(layerInfo)"
                                        :class="{'data-ex-icons-eyeseen': true, 'visible-btn': true, 'is-visible': layerInfo.controls.visibility === 'visible'}"
                                        viewBox="0 0 1024 1024" width="40px" height="40px" style="fill: currentcolor;">
                                        <path v-if="layerInfo.controls.visibility === 'visible'" d="M726.976697 393.184142c-12.54369-12.447359-32.831716-12.320065-45.248112 0.25631L448.447252 629.248757l-103.26354-106.112189c-12.352748-12.703669-32.60809-12.927295-45.248112-0.639914-12.672705 12.320065-12.959978 32.60809-0.639914 45.248112l126.016611 129.503454c0.063647 0.096331 0.192662 0.096331 0.25631 0.192662 0.063647 0.063647 0.096331 0.192662 0.159978 0.25631 2.016073 1.983389 4.512082 3.19957 6.880796 4.544765 1.247144 0.672598 2.239699 1.792447 3.519527 2.303346 3.872168 1.599785 8.000645 2.399677 12.096439 2.399677 4.06483 0 8.12794-0.799892 11.967424-2.33603 1.247144-0.512619 2.208735-1.536138 3.392232-2.176052 2.399677-1.343475 4.895686-2.528692 6.944443-4.544765 0.063647-0.063647 0.096331-0.192662 0.192662-0.25631 0.063647-0.096331 0.159978-0.127295 0.25631-0.192662l256.223626-259.008628C739.647682 425.888563 739.520387 405.631501 726.976697 393.184142z" fill="#575B66"></path>
                                        <path v-else d="M832 928.00086l-640 0c-52.9288 0-96.00086-43.07206-96.00086-95.99914l0-640c0-52.9288 43.07206-96.00086 96.00086-96.00086l640 0c52.92708 0 95.99914 43.07206 95.99914 96.00086l0 640C928.00086 884.9288 884.9288 928.00086 832 928.00086zM192 160.00086c-17.632039 0-32.00086 14.368821-32.00086 32.00086l0 640c0 17.664722 14.368821 31.99914 32.00086 31.99914l640 0c17.664722 0 31.99914-14.336138 31.99914-31.99914l0-640c0-17.632039-14.336138-32.00086-31.99914-32.00086L192 160.00086z" fill="#575B66"></path>
                                    </svg>

                                    <svg
                                        @click="toggleSettingsVisibility(layerInfo)"
                                        :class="{'data-ex-icons-eyeseen': true, 'visible-btn': true, 'is-visible': layerInfo.controls.showSettings}"
                                        viewBox="0 0 64 64" width="28px" height="28px" style="fill: currentcolor;">
                                        <rect x="28" y="44" width="8" height="8"></rect>
                                        <rect x="28" y="28" width="8" height="8"></rect>
                                        <rect x="28" y="12" width="8" height="8"></rect>
                                    </svg>
                                </div>
                                <div class="layer-settings" v-show="layerInfo.controls.showSettings">
                                    <colormap-selector
                                        class="colormap-selector"
                                        :curColormap="layerInfo.controls.colormap"
                                        v-show="layerInfo.type !== 'raster'"
                                        @changeColormap="changeColormap($event, layerInfo)">
                                    </colormap-selector>
                                    <layer-opacity-control :layer-info="layerInfo"></layer-opacity-control>
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
import TMap from "../../../../components_copy/utils/tmap"
import NormalWindow from "../../../../components_copy/window/NormalWindow"
import colormaps from "../../../../components_copy/utils/colormap"
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
            const map = this.tmap.map;
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