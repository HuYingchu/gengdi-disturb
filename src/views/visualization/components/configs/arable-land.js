import colormaps from "../../../../components/utils/colormap"

const colormap = colormaps['99']
const visibility = 'none'
const opacity = 1

function render1(colormap) {
    return [
        'match',
        ['get', 'zh5_level'],
        1, colormap[0],
        2, colormap[1],
        3, colormap[2],
        /* other */ '#ccc'
    ]
}

function legendRender1(colormap) {
    return {
        name: '耕地土壤质量类别',
        type: 'polygon',
        info: [
            ['1-优先保护类', colormap[0]],
            ['2-安全利用类', colormap[1]],
            ['3-严格管控类', colormap[2]],
            // ['其他', '#ccc']
        ]
    }
}

export default {
    name: 'arable-land',
    aliasName: '江北区耕地',
    topicName: '江北区类别划分成果',
    type: 'vector',
    layers: [{
        aliasName: '江北区耕地边界',
        hoverable: false,
        clickable: false,
        opacityAttr: 'line-opacity',
        before: 'soilpoint',
        source: {
            // type: 'geojson',
            // data: '/api/JBLBHF.geojson',
            // generateId: true
            type: 'vector',
            scheme: 'tms',
            tiles: [
                // 'http://jbdispalydemo.natapp1.cc/geoserver/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_classify@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                // 'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_classify@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_classify@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
            ],
            generateId: true
        },
        layer: {
            id: 'arable-land-outline',
            type: 'line',
            source: 'arable-land-outline',
            'source-layer': 'jb_classify',
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
        aliasName: '江北区耕地',
        hoverable: true,
        clickable: true,
        opacityAttr: 'fill-opacity',
        before: 'arable-land-outline',
        source: {
            // type: 'geojson',
            // data: '/api/JBLBHF.geojson',
            // generateId: true
            type: 'vector',
            scheme: 'tms',
            tiles: [
                // 'http://120.27.157.10:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_classify@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                // 'http://jbdispalydemo.natapp1.cc/geoserver/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_classify@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                // 'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_classify@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_classify@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
            ],
            generateId: true
        },
        layer: {
            id: 'arable-land',
            type: 'fill',
            source: 'arable-land',
            'source-layer': 'jb_classify',
            layout: {
                visibility: visibility
            },
            paint: {
                'fill-color': render1(colormap),
                'fill-opacity': opacity
            },
        },
        infoPanelConfig: {
            // titleField: "gdbm",
            title: '江北区耕地',
            alias: {
                "lbbm": "类别编码",
                "nzwlx": "农作物类型",
                "sffny": "是否非农用",
                "zh5_level": "质量类别",
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