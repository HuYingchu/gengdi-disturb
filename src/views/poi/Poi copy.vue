<!-- <template>
    <div id="poi-module">
        
        <div id="upload-wrapper" v-loading="showLoading">
            <el-button class="upload-btn"  type="primary"  @click="drawer = true">上传数据信息</el-button>
            <el-drawer
                :visible.sync="drawer"
                :direction="direction"
                :before-close="drawerClose"
                :append-to-body = "true"
                :modal-append-to-body = "false"
                size="45%"
                :withHeader = "false"
                class = "upload-drawer"
                style="position:absolute;min-height:1100px;"
            >
                <div class="upload-title">
                    请输入需要上传的点位信息
                </div>
                <div class="div-ruleform">
                    <el-form :model="uploadParams" :rules="rules" ref="ruleForm" label-width="100px" class="upload-ruleForm">
                        <div class="upload-item-wrapper">
                            <el-form-item prop="longitude" label='经度:' >
                                <el-input class="upload-input" v-model="uploadParams['longitude']" placeholder="请输入经度（必填）"></el-input>
                            </el-form-item>
                        </div>
                        <div class="upload-item-wrapper">
                            <el-form-item prop="latitude" label="纬度:">
                                <el-input class="upload-input" v-model="uploadParams['latitude']" placeholder="请输入纬度（必填）"></el-input>
                            </el-form-item>
                        </div>
                        <div class="upload-item-wrapper">
                            <el-form-item prop="area" label="种植面积:">
                                <el-input class="upload-input" v-model="uploadParams['area']" placeholder="请输入种植面积（必填）"></el-input>
                            </el-form-item>
                        </div>
                        <div class="upload-item-wrapper">
                            <el-form-item prop="point_class" label="措施类型:">
                                <el-select class="upload-input" clearable v-model="uploadParams['point_class']" placeholder="请选择措施类型（必填）">
                                    <el-option
                                        v-for="item, key in categoryOptions['point_class']"
                                        :key="key"
                                        :label="item"
                                        :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="upload-item-wrapper">
                            <el-form-item prop="farmer_name" label="农户名称:">
                                <el-input class="upload-input" v-model="uploadParams['farmer_name']" placeholder="请输入农户姓名"></el-input>
                            </el-form-item>
                        </div>
                        <div class="upload-item-wrapper">
                            <el-form-item prop="farmer_telephone" label="农户电话:">
                                <el-input class="upload-input" v-model="uploadParams['farmer_telephone']" placeholder="请输入农户电话"></el-input>
                            </el-form-item>
                        </div>
                        <div class="upload-item-wrapper">
                            <el-form-item prop="town" label="乡镇:">
                                <el-input class="upload-input" v-model="uploadParams['town']" placeholder="请输入乡镇"></el-input>
                            </el-form-item>
                        </div>
                        <div class="upload-item-wrapper">
                            <el-form-item prop="address" label="地址:">
                                <el-input class="upload-input" v-model="uploadParams['address']" placeholder="请输入具体地址"></el-input>
                            </el-form-item>
                        </div>
                        <div class="upload-item-wrapper">
                            <el-form-item prop="measure" label="物资种类:">
                                <el-input class="upload-input" v-model="uploadParams['measure']" placeholder="请输入物资种类"></el-input>
                            </el-form-item>
                        </div>
                        <div class="upload-item-wrapper">
                            <el-form-item prop="usage_per_mu" label="每亩用量:">
                                <el-input class="upload-input" v-model="uploadParams['usage_per_mu']" placeholder="请输入每亩用量"></el-input>
                            </el-form-item>
                        </div>
                        <div class="upload-item-wrapper">
                            <el-form-item prop="dispatch_quantity" label="配送数量:">
                                <el-input class="upload-input" v-model="uploadParams['dispatch_quantity']" placeholder="请输入配送数量"></el-input>
                            </el-form-item>
                        </div>
                        <div class="upload-item-wrapper">
                            <el-form-item prop="remark" label="备注:">
                                <el-input class="upload-input" v-model="uploadParams['remark']" placeholder="其他说明请写入备注"></el-input>
                            </el-form-item>
                        </div>
                    </el-form>
                    <el-button class="submit"  size="small" type="primary"  @click="submit(uploadParams)">上传数据至后台</el-button>
                </div>
                <div class="uploadsubmit">
                    <el-upload
                        class="upload-pic"
                        drag
                        ref="uploadPic"
                        :limit="1"
                        :on-change="handleProgress"
                        action = ""
                        :auto-upload="false"
                        >
                        <i class="el-icon-upload" ></i>
                        <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且最多只能上传1张</div>
                    </el-upload>
                </div>
            </el-drawer>
        </div>
        
        <div id="visualization-module">
            <div id="poi-container">
            <vector-layer
                v-for="(layerInfo, key) in layerInfos"
                :key="key"
                :layer-configs="layerInfo.layers"
                :visibility="layerInfo.controls.visibility === 'visible'">
            </vector-layer>
            
            <layer-controls class="layer-controls" :layer-infos ="layerInfos" :curLayerInfo="curLayerInfo"></layer-controls>

            <info-table  :visible-layer-infos="visibleLayerInfos"></info-table>

            <home-button></home-button>
            <map-legend :visible-layer-infos= "visibleLayerInfos"></map-legend>
            <zoom></zoom>
            </div>
        </div>
    </div>
</template>

<script>
import TMap from "./utils/tmap2"
import layerInfos from "./components/configscopy"
import VectorLayer from './components/layers/VectorLayer'
import LayerControls from "./components/controls/LayerControls.vue"
import InfoTable from "./components/controls/infoTable"
import Fullscreen from "../../components/map-widgets/Fullscreen"
import Zoom from "./components/controls/Zoom"
import HomeButton from "./components/controls/HomeButton"
import MapLegend from "./components/controls/Legend"
import { StackedDomList } from "../../components/utils/controlutils";
import mapboxgl from "mapbox-gl"
import axios from "axios"


export default {
    components:{
        VectorLayer,
        LayerControls,
        Fullscreen,
        Zoom,
        HomeButton,
        MapLegend,
        InfoTable
    },

    data(){
        return {
            drawer:false,
            direction:'ttb',//抽屉打开方向从上往下
            attr:{},
            layerInfos:layerInfos,
            curLayerInfo:layerInfos[0],
            emptyLayerInfo: {
                name:'请选择',
                layers:[],
                controls:{},
                tmap:null,
                
            },
 
            // uploadParams:{},
            picture:'',
            uploadParams:{
                longitude : '',
                latitude: '',
                farmer_name: '',
                farmer_telephone:'',
                town:'',
                address:'',
                area:'',
                measure:'',
                usage_per_mu:'',
                dispatch_quantity:'',
                remark:'',
                point_class:'',

            },
            rules:{
                longitude: [{required:true,message:'经度不能为空',trigger:'blur'}],
                latitude: [{required:true,message:'纬度不能为空', trigger:'blur'}],
                area: [{required:true,message:'种植面积不能为空', trigger:'blur'}],
                point_class:[{required:true,message:'措施类型不能为空', trigger:'blur'}]

            },
            categoryOptions:{
                'point_class':['1-治理措施','2-试验田块']
            },
            fileList:[],
            
            showLoading: false,
            detailVisible:'hidden',
        }
    },

    mounted(){
        const _this = this
        _this.initStackedDomList()
        _this.tmap = TMap.getInstance()
        const map = _this.tmap.map;
        map.loadImage('http://localhost:8083/static/img/triangle-icon.png',(error,image) => {
            if(error) throw error;
            map.addImage('triangle-icon',image,{'sdf':true})
        })
        map.loadImage('http://localhost:8083/static/img/circle-icon.png',(error,image) => {
            if(error) throw error;
            map.addImage('circle-icon',image,{'sdf':true})
        })
        
        const fullscreenControl = new mapboxgl.FullscreenControl()
        setTimeout(() => {
            if (_this.currentTabComponent === 'poi') {

                TMap.getInstance().map.resize()
            }
        }, 300)
        map.addControl(fullscreenControl)
    },
    beforeDestroy(){
        TMap.destroy()
    },
    computed: {
        visibleLayerInfos(){
            const _this = this
            return _this.layerInfos.filter(layerInfo =>{
                return layerInfo.controls.visibility === 'visible'
            })
        }
    },
    methods:{
        initStackedDomList() {
          const domList = document.getElementsByClassName('stacked-dom')
          this.stackedDomList = new StackedDomList(domList, 150, "mousedown")
        },
        changeCurLayerInfo(layerName) {
            const _this = this

            _this.curLayerInfo = _this.emptyLayerInfo
            _this.layerInfos.forEach(layerInfo => {
                if (layerInfo.name === layerName) {
                    _this.curLayerInfo = layerInfo
                }
            })
        },
        handleProgress(file){
            const _this = this;
            const filename = file.name;
            _this.uploadParams['picture_name'] = filename;
            _this.fileList = []
            this.file = file.raw;
            const reader = new FileReader()
            const base64 = reader.readAsDataURL(this.file);
            reader.onload = e =>{
                //读取到的图片base64 数据编码
                const fileBase = e.target.result;
                // console.log("fileBase",fileBase)
                _this.fileList.push(fileBase)
                // _this.uploadParams['picture'] = _this.fileList[0] 
                _this.picture = _this.fileList[0]
            }
            
        },
        submit(params){
            this.$confirm('该操作将上传现有参数，请仔细检查数据格式! 是否继续？','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'warning'
            }).then(() =>{
                this.submitUpload(params)
            }).catch((err) => {
                console.log(err)
                this.$message({
                    type:'info',
                    message:'上传中断'
                })
            })
        },
        submitUpload(params){
            const _this = this;
            //组合 url 和上传参数
            const baseUrl = '/api/measure/upload_items'
            const poiInfo = {
                'longitude' : parseFloat(_this.uploadParams['longitude']),
                'latitude': parseFloat(_this.uploadParams['latitude']),
                'area': parseFloat(_this.uploadParams['area']),
                'point_class':_this.uploadParams['point_class']=="1-治理措施"?1:2,
                'farmer_name' : _this.uploadParams['farmer_name'],
                'farmer_telephone': _this.uploadParams['farmer_telephone'],
                'town': _this.uploadParams['town'],
                'address' : _this.uploadParams['address'],
                'measure' : _this.uploadParams['measure'],
                'usage_per_mu' : _this.uploadParams['usage_per_mu'],
                'dispatch_quantity' : _this.uploadParams['dispatch_quantity'],
                'remark': _this.uploadParams['remark'],
                'picture_name': _this.uploadParams['picture_name'],

            }
            // console.log(_this.uploadParams)
            if( !_this.uploadParams['longitude'] || !_this.uploadParams['latitude'] || !_this.uploadParams['area'] || !_this.uploadParams['point_class']){
                _this.$message({
                    message:'请正确输入经度、纬度、种植面积和措施类型信息',
                    type:'warning'
                })
                return 0;
            }
            // const uploadUrl = _this.concatUrlParams(baseUrl,uploadParam)
            const uploadParam ={
                poiInfo,
                'picture':_this.picture
            }
            // console.log(uploadUrl)
            //上传数据
            // console.log('uploadParam',uploadParam)
            axios.post(baseUrl,uploadParam).then((res) => {
                const resData = res.data
                if(resData.status === 0){
                    console.log("数据上传成功")
                    for(let key in _this.uploadParams){
                        _this.uploadParams[key] = "";
                    }
                    
                    _this.$message({
                        message:'数据上传成功',
                        type:'success'
                    })
                }else{
                    console.log("上传数据失败")
                    _this.$message({
                    message: '上传数据失败，请仔细检查数据格式',
                    type: 'error'
                })
                }
            }).catch((err) =>{
                console.log(err);
                _this.$message({
                    message: '上传数据失败，请检查网络后重试',
                    type: 'error'
                })
            })
        },
        concatUrlParams(baseUrl,uploadParam){
            let uploadUrl = baseUrl + '?'
            for (let key in uploadParam){
                uploadUrl += `${key}=${uploadParam[key]}&`
            }
            return uploadUrl.slice(0, -1)
        },
        drawerClose(done){
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        }
    }
}

</script>

<style lang="stylus" scoped>

.el-drawer__header{
    height:0px;
    padding:0px;
    margin:0px;
}
.el-drawer__body{
    .upload-title{
            font-size:24px;
            margin: 10px 10px 20px 30px;
            color:#555;
        }
    .div-ruleform{
            width:85%;
            
            .upload-ruleForm{
                height:100%;
                width:100%;
                .upload-item-wrapper{
                    width:28%;
                    float:left;
                    margin: 5px 5px 5px 5px;
                }
            }
            .submit{
                height:40px;
                // width:;
                float:right;
                font-size:15px;
                display:inline-block;
                margin: 5px -80px 0 0;
                z-index:11;
            }
        }

        .upload-pic{
            position:absolute;
            top:45px;
            left:76%;
            
           .el-upload-list{
                    width:20%;
                }
            
        }
}

#poi-module{
    height: 100%;
    position: relative;
    
    #upload-wrapper{
        z-index:11;
        position: relative;
        .upload-btn{
            position:absolute;
            top:20px;
            left:160px;
            font-size:13px;
        }
        .el-drawer__header{
            font-size:24px;
            color:#555;
        }
        
        .div-ruleform{
            width:85%;
            
            
        }
    }
    
    #visualization-module{

        position:relative;
        width:100%;
        height: 100%;
        // min-height:800px;
        #poi-container{
            width:100%;
            height:100%;
            background-color:#000;
            position:relative;
            z-index:1;
            
            #info-panel{
                z-index:20;
                position:absolute;
                top:200px;
                left:50%
            }    
        }
    }
}

</style> -->