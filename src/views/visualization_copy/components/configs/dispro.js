import colormaps from "@/components/utils/colormap";

const colormap = colormaps['100']; // 修改颜色映射
const initialVisibility = 'none'; // 默认可见性
const initialOpacity = 1; // 默认不透明度

function legendRender1(colormap) {
    return {
        name: '地表异常事件置信度',
        gradient: true, // 标记为渐变图例
    };
}

export default {
    name: 'dispro',
    aliasName: '地表异常事件置信度',
    topicName: '地表异常特征',
    type: 'raster',
    layers: [
        {
            aliasName: 'dispro',
            opacityAttr: 'raster-opacity', 
            source: {
                type: 'raster',
                tiles: [
                    'http://10.75.68.56:8080/geoserver/sccd/wms?service=WMS&version=1.1.0&request=GetMap&layers=sccd%3Adispro&bbox={bbox-epsg-3857}&width=768&height=710&srs=EPSG%3A3857&format=image%2Fpng&TRANSPARENT=TRUE',
                ],
            },
            layer: {
                id: 'dispro',
                type: 'raster',
                source: 'dispro',
                layout: {
                    visibility: initialVisibility // 默认可见
                },
                paint: {
                    'raster-opacity': initialOpacity // 设置初始透明度
                },
            },
            legendConfig: {
                render: (colormap) => legendRender1(colormap, true), // 使用渐变
            },
            minValue: 0,
            maxValue: 100,
            gradientColors: ['#1D1A48', '#4C2B5A','#F7D0A9','#FDE725','#C44D29'], // 自定义渐变颜色
            useGradient: true, // 设置为使用渐变
        }
    ],
    controls: {
        showSettings: false,
        visibility: initialVisibility,
        opacity: initialOpacity // 默认不透明度
    },
    methods: {
        updateLayerOpacity(map) {
            const layerId = 'dispro'; // 图层 ID
            const opacity = this.controls.opacity; // 获取当前不透明度
            map.setPaintProperty(layerId, 'raster-opacity', opacity); // 更新图层透明度
        },
        toggleLayerVisibility(map) {
            const layerId = 'dispro';
            const currentVisibility = this.controls.visibility === 'visible' ? 'none' : 'visible';
            map.setLayoutProperty(layerId, 'visibility', currentVisibility); // 切换可见性
            this.controls.visibility = currentVisibility; // 更新控件状态
        },
        setOpacity(newOpacity) {
            this.controls.opacity = newOpacity; // 更新控件的不透明度值
            this.updateLayerOpacity(this.tmap.map); // 更新地图上图层的透明度
        }
    }
};