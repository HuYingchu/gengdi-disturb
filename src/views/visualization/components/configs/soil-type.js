import colormaps from "../../../../components/utils/colormap"

const colormap = colormaps['14']
const visibility = 'none'
const opacity = 0.43

function render1(colormap) {
    return [
        'match',
        ['get', 'soilgroups'],
        '红壤', colormap[0],
        '水稻土', colormap[1],
        '粗骨土', colormap[2],
        '其他', colormap[3],
        /* other */ '#ccc'
    ]
}

function legendRender1(colormap) {
    return {
        name: '江北区土壤类型',
        type: 'polygon',
        info: [
            ['红壤', colormap[0]],
            ['水稻土', colormap[1]],
            ['粗骨土', colormap[2]],
            ['其他', colormap[3]],
        ]
    }
}

export default {
    name: 'soiltype',
    aliasName: '江北区土壤类型',
    topicName: '基础地理图层',
    type: 'vector',
    layers: [{
        aliasName: '江北区土壤类型',
        hoverable: false,
        clickable: false,
        opacityAttr: 'line-opacity',
        before: 'arable-land',
        source: {
            type: 'vector',
            scheme: 'tms',
            tiles: [
                // 'http://120.27.157.10:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_soiltype@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                // 'http://jbdispalydemo.natapp1.cc/geoserver/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_soiltype@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                // 'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_soiltype@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_soiltype@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
            ],
            generateId: true
        },
        layer: {
            id: 'soiltype-outline',
            type: 'line',
            source: 'soiltype-outline',
            'source-layer': 'jb_soiltype',
            layout: {
                visibility: visibility
            },
            paint: {
                'line-color': '#eee',
                'line-opacity': opacity,
                'line-width': 0.5
            }
        },
        colormapConfig: {
            colormap: colormap,
            colormapAttr: 'line-color',
            render: () => '#eee'
        }
    },{
        aliasName: '江北区土壤类型',
        hoverable: true,
        clickable: true,
        opacityAttr: 'fill-opacity',
        before: 'soiltype-outline',
        source: {
            type: 'vector',
            scheme: 'tms',
            tiles: [
                // 'http://jbdispalydemo.natapp1.cc/geoserver/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_soiltype@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                // 'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_soiltype@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_soiltype@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
            ],
            generateId: true
        },
        layer: {
            id: 'soiltype',
            type: 'fill',
            source: 'soiltype',
            'source-layer': 'jb_soiltype',
            layout: {
                visibility: visibility
            },
            paint: {
                'fill-color': render1(colormap),
                'fill-opacity': opacity
            },
        },
        infoPanelConfig: {
            // titleField: "fname",
            title: '江北区土壤类型',
            alias: {
                'soilspecie': '土壤种类',
                'soilgroups': '土类',
                'subgroups': '亚类'
            }
        },
        colormapConfig: {
            colormap: colormap,
            colormapAttr: 'fill-color',
            render: render1
        },
        legendConfig: {
            render: legendRender1
        }
    }],
    controls: {
        showSettings: false,
        visibility: visibility,
        colormap: colormap,
        opacity: opacity
    }
}