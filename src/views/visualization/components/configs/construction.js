import colormaps from "@/components/utils/colormap";

const colormap = colormaps['100']; // 修改颜色映射
const initialVisibility = 'none'; // 默认可见性
const initialOpacity = 1; // 默认不透明度

// function legendRender1(colormap) {
//     return {
//         name: '地表异常连续观测数',
//         gradient: true // 增加标志以指示这是一个渐变条
//     };
// }

export default {
    name: 'construction',
    aliasName: '人类活动（测试）',
    topicName: '地表异常变化类型',
    type: 'raster',
    layers: [
        {
            aliasName: 'construction',
            opacityAttr: 'raster-opacity',
            source: {
                type: 'raster',
                tiles: [
                    'http://10.75.68.56:8080/geoserver/sccd/wms?service=WMS&version=1.1.0&request=GetMap&layers=sccd%3Adate_touying&bbox={bbox-epsg-3857}&width=768&height=710&srs=EPSG%3A3857&format=image%2Fpng&TRANSPARENT=TRUE',
                ],
            },
            layer: {
                id: 'construction',
                type: 'raster',
                source: 'construction',
                layout: {
                    visibility: initialVisibility
                },
                paint: {
                    'raster-opacity': initialOpacity
                },
            },
            // legendConfig: {
            //     render: (colormap) => legendRender1(colormap, true), // 使用渐变
            // },
            // minValue: 0,
            // maxValue: 8,
            // gradientColors: ['#1D1A48', '#4C2B5A','#F7D0A9','#FDE725','#C44D29'], // 自定义渐变颜色
            // useGradient: true, // 设置为使用渐变
        }
    ],
    controls: {
        showSettings: false,
        visibility: initialVisibility,
        opacity: initialOpacity
    },
    methods: {
        updateLayerOpacity(map) {
            const layerId = 'construction';
            const opacity = this.controls.opacity;
            map.setPaintProperty(layerId, 'raster-opacity', opacity);
        },
        toggleLayerVisibility(map) {
            const layerId = 'construction';
            const currentVisibility = this.controls.visibility === 'visible' ? 'none' : 'visible';
            map.setLayoutProperty(layerId, 'visibility', currentVisibility);
            this.controls.visibility = currentVisibility;
        },
        setOpacity(newOpacity) {
            this.controls.opacity = newOpacity;
            this.updateLayerOpacity(this.tmap.map);
        }
    }
};