import colormaps from "../../../../components/utils/colormap"

const colormap = colormaps['28']
const visibility = 'visible'
const opacity = 1

function render1(colormap) {
    return [
        'match',
        ['to-number', ['get', 'stage']],  // 将stage转换为数字
        1, colormap[0],
        2, colormap[1],
        3, colormap[1],
        4, colormap[2],
        5, colormap[3],
        6, colormap[3],
        7, colormap[0],
        '#000'
    ]
}

// function legendRender1(colormap) {
//     return {
//         name: '作物阶段',
//         type: 'polygon',
//         info: [
//             ['萌发期', colormap[0]],
//             ['返青初期', colormap[1]],
//             ['返青盛期', colormap[2]],
//             ['成熟期', colormap[3]],
//             ['衰老初期', colormap[4]],
//             ['衰老盛期', colormap[5]],
//             ['休眠期', colormap[6]],
//         ]
//     }
// }

function legendRender1(colormap) {
    return {
        name: '作物阶段',
        type: 'polygon',
        info: [
            ['休眠期', colormap[0]],
            ['返青期', colormap[1]],
            ['成熟期', colormap[2]],
            ['衰老期', colormap[3]],
            ['休眠期', colormap[0]],
        ]
    }
}

export default {
    name: 'stage',
    aliasName: '海盐县',
    topicName: '浙江省耕地情况',
    type: 'vector',
    layers: [{
        aliasName: 'stage',
        hoverable: false,
        clickable: false,
        opacityAttr: 'line-opacity',
        source: {
            type: 'vector',
            scheme: 'tms',
            tiles: [
                'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/sccd%3Ahaiyan_category@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf'
            ],
            generateId: true
        },
        layer: {
            id: 'stage-outline',
            type: 'line',
            source: 'stage-outline',
            'source-layer': 'haiyan_category',
            layout: {
                visibility: visibility
            },
            paint: {
                'line-color': [
                    'case',
                    ['boolean', ['feature-state', 'selected'], false],
                    '#ff0000',  // 选中时的边框颜色（红色）
                    '#666'      // 默认边框颜色
                ],
                'line-width': [
                    'case',
                    ['boolean', ['feature-state', 'selected'], false],
                    6,          // 选中时的边框宽度
                    0.5           // 默认边框宽度
                ],
                'line-opacity': opacity
            }
        },
        colormapConfig: {
            colormap: colormap,
            colormapAttr: 'line-color',
            render: () => '#666'
        }
    },{
        aliasName: '耕地信息',
        hoverable: true,
        clickable: true,
        opacityAttr: 'fill-opacity',
        before: 'stage-outline',
        source: {
            type: 'vector',
            scheme: 'tms',
            tiles: [
                'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/sccd%3Ahaiyan_category@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf'
            ],
            generateId: true
        },
        layer: {
            id: 'stage',
            type: 'fill',
            source: 'stage',
            'source-layer': 'haiyan_category',
            layout: {
                visibility: visibility
            },
            paint: {
                'fill-color': render1(colormap),
                'fill-opacity': opacity
            },
        },
        colormapConfig: {
            colormap: colormap,
            colormapAttr: 'fill-color',
            render: render1
        },
        legendConfig: {
            render: legendRender1
        },
        infoPanelConfig: {
            title: '耕地信息',
            alias: {
                "stage": "生长阶段",
                "confidence": "置信度",
                "lasttime": "最近观测时间",
                "rotation":"当前复种指数",
                "category":"种植类型",
            }
        }
    }],
    controls: {
        visibility: visibility,
        colormap: colormap,
        opacity: opacity,
        showSettings: false
    }
}