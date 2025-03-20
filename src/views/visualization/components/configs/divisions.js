import colormaps from "../../../../components/utils/colormap"

const colormap = colormaps['44']
const visibility = 'none'
const opacity = 0.43

function render1(colormap) {
    return [
        'match',
        ['get', 'fname'],
        '慈城镇', colormap[0],
        '洪塘街道', colormap[1],
        '庄桥街道', colormap[2],
        '江北区所辖街道', colormap[3],
        /* other */ '#ccc'
    ]
}

function legendRender1(colormap) {
    return {
        name: '江北区乡镇区划',
        type: 'polygon',
        info: [
            ['慈城镇', colormap[0]],
            ['洪塘街道', colormap[1]],
            ['庄桥街道', colormap[2]],
            ['江北区所辖街道', colormap[3]],
            ['其他', '#ccc']
        ]
    }
}

export default {
    name: 'divisions',
    aliasName: '江北区乡镇/街道',
    topicName: '基础地理图层',
    type: 'vector',
    layers: [{
        aliasName: '江北区乡镇/街道',
        hoverable: true,
        clickable: true,
        opacityAttr: 'fill-opacity',
        before: 'arable-land',
        source: {
            type: 'vector',
            scheme: 'tms',
            tiles: [
                // 'http://120.27.157.10:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_divisions@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                // 'http://jbdispalydemo.natapp1.cc/geoserver/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_divisions@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                // 'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_divisions@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_divisions@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
            ],
            generateId: true
        },
        layer: {
            id: 'divisions',
            type: 'fill',
            source: 'divisions',
            'source-layer': 'jb_divisions',
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
            title: '江北区乡镇/街道',
            alias: {
                "fname": "乡镇/街道名称",
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