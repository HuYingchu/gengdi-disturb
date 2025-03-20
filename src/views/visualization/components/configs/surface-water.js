import colormaps from "../../../../components/utils/colormap"

const colormap = colormaps['30']
const visibility = 'none'
const opacity = 1

function render2(colormap) {
    return [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        "#69dcff",
        [
            'match',
            ['get', 'KIND_NAME'],
            '水库、湖泊', colormap[0],
            '河流', colormap[1],
            '海峡、海洋', colormap[2],
            '港口、海湾', colormap[3],
            /* other */ '#07f'
        ]
    ]
}

function legendRender2(colormap) {
    return {
        name: '地表水体类型',
        type: 'polygon',
        info: [
            ['水库、湖泊', colormap[0]],
            ['河流', colormap[1]],
            ['海峡、海洋', colormap[2]],
            ['港口、海湾', colormap[3]],
            ['其他', '#07f']
        ]
    }
}


export default {
    name: 'surface-water',
    aliasName: '江北区地表水',
    topicName: '基础地理图层',
    type: 'vector',
    layers: [{
        aliasName: '地表水体类型',
        hoverable: true,
        clickable: true,
        opacityAttr: 'fill-opacity',
        source: {
            type: 'vector',
            scheme: 'tms',
            tiles: [
                // 'http://120.27.157.10:8080/geoserver/gwc/service/tms/1.0.0/contaminated_sites%3Asurface-water-layer@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                // 'http://jbdispalydemo.natapp1.cc/geoserver/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_rivers@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                // 'http://10.75.68.56:8080/geoserver/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_rivers@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
                'http://10.75.68.56:8080/geoserver/gwc/service/tms/1.0.0/jiangbei_arable_land%3Ajb_rivers@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf',
            ],
            generateId: true
        },
        layer: {
            id: 'surface-water',
            type: 'line',
            source: 'surface-water',
            'source-layer': 'jb_rivers',
            minzoom: 9,
            maxzoom: 22,
            layout: {
                visibility: visibility
            },
            paint: {
                'line-color': render2(colormap),
                'line-opacity': opacity
            },
        },
        infoPanelConfig: {
            titleField: "NAME",
            alias: {
                // "KIND": "类别编码",
                // "KIND_NAME": "水体类型",
                'fname':'水体名称',
            }
        },
        colormapConfig: {
            colormap: colormap,
            colormapAttr: 'fill-color',
            render: render2
        },
        legendConfig: {
            render: legendRender2
        }
    }
    ],
    controls: {
        showSettings: false,
        visibility: visibility,
        colormap: colormap,
        opacity: opacity
    }
}