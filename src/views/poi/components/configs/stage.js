import colormaps from "../../../../components/utils/colormap"

const colormap = colormaps['28']
const visibility = 'visible'
const opacity = 1

function render1(colormap) {
    return [
        'match',
        ['get', 'stage'],
        1, colormap[0],
        2, colormap[1],
        3, colormap[2],
        4, colormap[3],
        5, colormap[4],
        6, colormap[5],
        7, colormap[6],
        /* other */ '#ccc'
    ]
}

function legendRender1(colormap) {
    return {
        name: '耕地土壤质量类别',
        type: 'polygon',
        info: [
            ['1-阶段1', colormap[0]],
            ['2-阶段2', colormap[1]],
            ['3-阶段3', colormap[2]],
            ['4-阶段4', colormap[3]],
            ['5-阶段5', colormap[4]],
            ['6-阶段6', colormap[5]],
            ['7-阶段7', colormap[6]],
            // ['其他', '#ccc']
        ]
    }
}

export default {
    name: 'stagejx',
    aliasName: '嘉兴耕地阶段与置信度',
    topicName: '江北区类别划分成果',
    type: 'vector',
    layers: [{
        aliasName: 'stagejx',
        hoverable: false,
        clickable: false,
        opacityAttr: 'line-opacity',
        before: 'measure_info',
        source: {
            // type: 'geojson',
            // data: '/api/JBLBHF.geojson',
            // generateId: true
            type: 'vector',
            scheme: 'tms',
            tiles: [
                // 'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_classify@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                // 'http://jbdispalydemo.natapp1.cc/geoserver/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_classify@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                // 'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_classify@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/sccd%3Astagejx@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf'
            ],
            generateId: true
        },
        layer: {
            id: 'stagejx',
            type: 'line',
            source: 'stagejx',
            'source-layer': 'stagejx',
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
        aliasName: '嘉兴耕地阶段与置信度',
        hoverable: true,
        clickable: true,
        opacityAttr: 'fill-opacity',
        before: 'stagejx',
        source: {
            // type: 'geojson',
            // data: '/api/JBLBHF.geojson',
            // generateId: true
            type: 'vector',
            scheme: 'tms',
            tiles: [
                // 'http://120.27.157.10:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_classify@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                // 'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_classify@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                // 'http://jbdispalydemo.natapp1.cc/geoserver/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_classify@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                // 'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_classify@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                // 'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_classify@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/sccd%3Astagejx@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf'
            ],
            generateId: true
        },
        layer: {
            id: 'stagejx',
            type: 'fill',
            source: 'stagejx',
            'source-layer': 'stagejx',
            layout: {
                visibility: visibility
            },
            paint: {
                'fill-color': render1(colormap),
                'fill-opacity': opacity
            },
        },
        // infoPanelConfig: {
        //     title: '嘉兴耕地阶段与置信度',
        //     alias: {
        //         "stage": "阶段",
        //         "confidence" : "置信度"
        //     },
        //     img_alias: {
        //         "picture_name":"图片名称"
        //     }
        // },
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