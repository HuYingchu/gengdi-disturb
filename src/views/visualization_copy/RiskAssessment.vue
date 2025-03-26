<!-- <template>
    <div id = "assessment-param">
        <div id = "assessment-button"
            class="mapboxgl-ctrl mapboxgl-ctrl-group"
            @click="closeWindow">
            <button class="mapboxgl-ctrl-assessment-button" type="button" aria-label="Toggle assessment" title="Toggle assessment">
                <span class="mapboxgl-ctrl-icon" aria-hidden="true"></span>
            </button>
        </div>
        <div class = "param-container">
            <normal-window
            id="layer-controls"
            v-show ="visible"
            :width="900"
            :height="400"
            :draggable="true"
            :has-left-icon="true"
            :header-height="40"
            :header-title="headerTitle"
            :header-background-color="'var(--header-bg-color)'"
            :header-font-size="15"
            :content-background-color="'var(--content-bg-color)'"
            :could-be-closed="true"
            @closeWindow="closeWindow"
            :domId = "moduleId">
                <div slot= "content">
                    <el-form ref = "form" :model="point" label-width="60px" :rules="rules">
                        <div class = "sub-control-container">
                            <div class="content">
                                <!-- <el-row style="margin-bottom:10px">
                                    <el-col :span="8">
                                        <el-form-item label="经度" prop="longitude">
                                            <el-input v-model="point.longitude"/>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="纬度" prop="latitude">
                                            <el-input v-model="point.latitude"/>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="pH值" prop="ph">
                                            <el-input v-model="point.ph"/>
                                        </el-form-item>
                                    </el-col>
                                </el-row> -->
                                <el-row style="margin-bottom:10px">
                                    <el-col :span="12">
                                        <el-form-item label="请选择遥感影像输入格式：" label-width="180px" prop="">
                                            <el-select v-model="point.nydlx" placeholder="请选择输入格式">
                                                <el-option key="WJJ" label="文件夹" value="文件夹"></el-option>
                                                <el-option key="WJDZ" label="文件地址" value="文件地址"></el-option>
                                            </el-select>                                            
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="遥感影像（文件夹）地址：" label-width="180px">
                                            <el-input v-model="point.village" placeholder="请输入地址"/>
                                        </el-form-item>
                                    </el-col>   
                                </el-row>
                                <el-row style="margin-bottom:10px">
                                    <el-col :span="12">
                                        <el-form-item label="请选择矢量文件输入格式：" label-width="180px" prop="">
                                            <el-select v-model="point.shp" placeholder="请选择输入格式">
                                                <el-option key="WJJ" label="文件夹" value="文件夹"></el-option>
                                                <el-option key="WJDZ" label="文件地址" value="文件地址"></el-option>
                                            </el-select>                                            
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="矢量文件（文件夹）地址：" label-width="180px">
                                            <el-input v-model="point.cd_level" placeholder="请输入地址"/>
                                        </el-form-item>
                                    </el-col>  
                                </el-row>
                                <el-row style="margin-bottom:10px">
                                    <el-col :span="12">
                                        <el-form-item label="影像是否需要拼接：" label-width="180px">
                                            <el-radio-group v-model="isMerging">
                                                <el-radio label="是">是</el-radio>
                                                <el-radio label="否">否</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="机器学习方法：" label-width="180px">
                                            <el-select v-model="point.mlearning" placeholder="请选择方法">
                                                <el-option key="WJJ" label="Random Forest" value="Random Forest"></el-option>
                                                <el-option key="WJDZ" label="CART" value="CART"></el-option>
                                                <el-option key="WJDZ" label="XGBoost" value="XGBoost"></el-option>
                                            </el-select>   
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row style="margin-bottom:10px">                   
                                    <el-col :span="20">
                                        <el-form-item label="输出TIF保留路径： " label-width="180px">
                                            <el-input v-model="point.hg_level" placeholder="请输入地址"/>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row style="margin-bottom:10px">
                                    <!-- <el-col :span="8">
                                        <el-form-item label="铅 类别" label-width="80px">
                                            <el-input v-model="point.pb_level"/>
                                        </el-form-item>
                                    </el-col>                                    
                                    <el-col :span="8">
                                        <el-form-item label="铬 类别" label-width="80px">
                                            <el-input v-model="point.cr_level"/>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="综合五项类别" label-width="120px">
                                            <el-input v-model="point.zh5_level"/>
                                        </el-form-item>
                                    </el-col> -->
                                </el-row>
                            </div>
                        </div>
                        <div class = "sub-button-container">
                            <div class = "content" >
                                <el-button type="primary" @click="assessShp">判断shp范围是否超过藏东南区域</el-button>
                                <el-button type="primary" @click="setWork">执行任务</el-button>
                            </div>
                        </div>
                    </el-form>
                </div>
            </normal-window>
        </div>

        <!-- 点击执行任务后，页面生成的div -->
         <div class="work">
            <normal-window
            id="work-layer"
            v-show ="workVisible"
            :width="1200"
            :height="590"
            :draggable="true"
            :has-left-icon="true"
            :header-height="40"
            :header-title="resultTitle"
            :header-background-color="'var(--header-bg-color)'"
            :header-font-size="15"
            :content-background-color="'var(--content-bg-color)'"
            :could-be-closed="true"
            @closeWindow="setWork">
                <div slot= "content">
                    <div class="result-container">
                        <div>
                            <img src="./images/random-forest-pic.png" alt="Random forest result" style="max-height: 494px; height: auto;" />
                        </div>
                        <div>
                            <img src="./images/result-map.png" alt="Map result" style="max-width: 700px; height: auto;" />
                        </div>
                    </div>
                </div>
            </normal-window>
         </div>
    </div>
</template>

<script>
import axios from 'axios';
import { registerDomControl } from '../../components_copy/utils/controlutils';
import TMap from "../../components_copy/utils/tmap";
import NormalWindow from '../../components_copy/window/NormalWindow.vue';

export default {
    components: {NormalWindow},
    name: "AssessmentParam",
    props: {
        moduleId : {
            type: String,
            required: true
        },
    },
    data() {
        return {
            resultTitle:'土地覆盖细化分类结果',
            isMerging:'',
            tmap: null,
            visible: false,
            workVisible:false,
            headerTitle: "土地覆盖细化分类模块",
            point: {
                longitude: '',
                latitude: '',
                nydlx: '',
                mlearning:'',
                shp:'',
                ph: '',
                town: '',
                country: '',
                village: '',
                cd_value: '',
                hg_value: '',
                as_value: '',
                pb_value: '',
                cr_value: '',
                cd_level: "",
                hg_level: "",
                as_level: "",
                pb_level: "",
                cr_level: "",
                zh5_level: "",

            },
            rules: {
                longitude: [
                    { required: true, message: '请输入点位经度', trigger: 'blur' },
                ],
                latitude: [
                    { required: true, message: '请输入点位维度', trigger: 'blur' },
                ],
                ph: [
                    { required: true, message: '请输入点位pH', trigger: 'blur' },
                ],
                nydlx: [
                    { required: true, message: '请选择耕地类型', trigger: 'change' },
                ],
                cd_value: [
                    { required: true, message: '请输入样点镉含量', trigger: 'blur' },
                ],
                hg_value: [
                    { required: true, message: '请输入样点汞含量', trigger: 'blur' },
                ],
                as_value: [
                    { required: true, message: '请输入样点砷含量', trigger: 'blur' },
                ],
                pb_value: [
                    { required: true, message: '请输入样点铅含量', trigger: 'blur' },
                ],
                cr_value: [
                    { required: true, message: '请输入样点铬含量', trigger: 'blur' },
                ],
            }
        }
    },
    mounted() {
        const _this = this
        _this.tmap = TMap.getInstance()
        const map = _this.tmap.map
        map.addControl(registerDomControl("assessment-button"))
    },
    methods: {
        setWork() {
            this.visible = !this.visible
            this.workVisible = !this.workVisible
        },
        assessShp() {
            alert('shp范围已超过藏东南区域！请输入正确的shp范围！')
        },
        closeWindow() {
            this.visible = !this.visible
        },
        PointAssessment(params) {
            const _this = this
            // 组合 url 和查询参数
            const baseUrl = "/api/risk/point"
            const queryParam = {
                'nydlx': _this.point.nydlx,
                'ph': _this.point.ph,
                'cd_value': _this.point.cd_value,
                'hg_value': _this.point.hg_value,
                'as_value': _this.point.as_value,
                'pb_value': _this.point.pb_value,
                'cr_value': _this.point.cr_value,
                ...params
            }
            const queryUrl = _this._concatUrlParams(baseUrl, queryParam)
            // 获取数据
            axios.get(queryUrl).then((res) => {
                const resData = res.data
                console.log("resData", resData)
                if (0 === resData.status) {
                    // 获取数据成功
                    // console.log("data", resData["data"])
                    _this.point.cd_level = _this.getLevelName(resData["data"]["cdLevel"])
                    _this.point.hg_level = _this.getLevelName(resData["data"]["hgLevel"])
                    _this.point.as_level = _this.getLevelName(resData["data"]["asLevel"])
                    _this.point.pb_level = _this.getLevelName(resData["data"]["pbLevel"])
                    _this.point.cr_level = _this.getLevelName(resData["data"]["crLevel"])
                    _this.point.zh5_level = _this.getLevelName(resData["data"]["zh5Level"])
                } else {
                    _this.$message({
                        message: '数据为空',
                        type: 'warning'
                    })
                }
            }, (err) => {
                _this.$message({
                    message: '获取数据失败，请检查网络后重试',
                    type: 'error'
                })
                console.log(err)
            })
        },
        _concatUrlParams(baseUrl, queryParam) {
            let queryUrl = baseUrl + '?'
            for (let key in queryParam) {
                queryUrl += `${key}=${queryParam[key]}&`
            }
            return queryUrl.slice(0, -1)
        },
        getLevelName(level) {
            if (level == 1) {
                return "优先保护类"
            } else if (level == 2) {
                return "安全利用类"
            } else {
                return "严格管控类"
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
#assessment-button
    .mapboxgl-ctrl-assessment-button
         .mapboxgl-ctrl-icon
            background-image url("~@/assets/images/interpolate.svg")

#layer-controls
    position absolute
    left 30%
    top 20%
    z-index 10

    >>> .el-form-item
        margin 0
        padding 0px

    .sub-control-container
        .header
            text-align left
            padding 10px 20px
        .content
            font-size 13ox
            line-height 40px

    .sub-button-container
        .content
            display flex
            justify-content center
            align-items center
            text-align center
            margin 25px
            line-height 40px
            >>> .el-button
                font-size 14px
                width 250px

#work-layer
    position absolute
    left 18%
    top 2%
    z-index 10
    .result-container
        display flex
        align-items center
        justify-content center
</style> -->