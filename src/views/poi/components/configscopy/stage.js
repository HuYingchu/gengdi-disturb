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
        3, colormap[2],
        4, colormap[3],
        5, colormap[4],
        6, colormap[5],
        7, colormap[6],
        '#ccc'
    ]
}

function legendRender1(colormap) {
    return {
        name: '耕地土壤质量类别',
        type: 'polygon',
        info: [
            ['萌发期', colormap[0]],
            ['返青初期', colormap[1]],
            ['返青盛期', colormap[2]],
            ['成熟期', colormap[3]],
            ['衰老初期', colormap[4]],
            ['衰老盛期', colormap[5]],
            ['休眠期', colormap[6]],
        ]
    }
}

export default {
    name: 'stage',
    aliasName: '部分嘉善县',
    topicName: '浙江省耕地监控',
    type: 'vector',
    layers: [{
        aliasName: '江北区耕地边界',
        hoverable: false,
        clickable: false,
        opacityAttr: 'line-opacity',
        source: {
            type: 'vector',
            scheme: 'tms',
            tiles: [
                'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/sccd%3Astagejx@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf'
            ],
            generateId: true
        },
        layer: {
            id: 'stage-outline',
            type: 'line',
            source: 'stage-outline',
            'source-layer': 'stagejx',
            layout: {
                visibility: visibility
            },
            paint: {
                'line-color': '#666',
                'line-opacity': opacity,
                'line-width': 1
            }
        },
        colormapConfig: {
            colormap: colormap,
            colormapAttr: 'line-color',
            render: () => '#666'
        }
    },{
        aliasName: '江北区耕地',
        hoverable: true,
        clickable: true,
        opacityAttr: 'fill-opacity',
        before: 'stage-outline',
        source: {
            type: 'vector',
            scheme: 'tms',
            tiles: [
                'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/sccd%3Astagejx@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf'
            ],
            generateId: true
        },
        layer: {
            id: 'stage',
            type: 'fill',
            source: 'stage',
            'source-layer': 'stagejx',
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
            title: '江北区耕地',
            alias: {
                "stage": "类别",
                "confidence": "置信度"
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