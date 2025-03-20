<template>
    <div id="login-page">
        <div class="login-frame">
            <div class="login-background"></div>
            <div class="login-wrap" v-loading="showLoading">
                <div class="header">我的登录界面</div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px" label-position="left" class="demo-ruleForm">
                    <div v-if="!isFormValid">
                        <span class="error-info">{{ errInfo }}</span>
                    </div>
                    <el-form-item prop="username" label="用户名">
                        <el-input prefix-icon="el-icon-user" v-model="ruleForm.username" placeholder="账号" ></el-input>
                    </el-form-item>
                    <el-form-item prop="password" label="密码">
                        <el-input prefix-icon="el-icon-lock" type="password" placeholder="密码" v-model="ruleForm.password"></el-input>
                    </el-form-item>
                    <el-form-item  prop="validate" label="验证码">
                        <el-input v-model="ruleForm.validate" class="validate-code" placeholder="验证码" @keyup.enter.native="login('ruleForm')"></el-input>
                        <div class="code" @click="refreshCode">
                            <s-identify :identifyCode="identifyCode" :font-size-min="24"></s-identify>
                        </div>
                        <div v-if="isIdentifyCodeError">
                            <span class="error-info">{{ identifyCodeErrorInfo }}</span>
                        </div>
                    </el-form-item>
                    <!-- <div class="register" @click="handleRegister">注册账号</div> -->
                    <div class="login-btn">
                        <!-- <div class="btn" type="primary" @click="login('ruleForm')" >登录</div> -->
                        <div class="btn" type="primary" @click="login_true()" >登录</div>
                        <div class="btn" type="primary" >注册</div>
                    </div>
                </el-form>
                <div class="footer"> @2021 浙江大学遥感与信息技术研究所</div>
            </div>
        </div>
    </div>
</template>

<script>
import { login } from '../../components/utils/service'
import SIdentify from "./components/Identify"

export default {
    name: "Login",
    components: {
        SIdentify
    },
    data() {
        return {
            identifyCodes: "1234567890",
            identifyCode: '',
            isFormValid : true,
            isIdentifyCodeError:false,
            identifyCodeErrorInfo: '',
            ruleForm: {
                username: '',
                password: '',
                validate: ''
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                validate: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
            },
            showLoading: false
        }
    },
    mounted() {
        const _this = this
        _this.refreshCode()
    },
    methods: {
        login_true() {
            this.$router.push('/home')
        },
        login(formName) {
            const _this = this

            _this.$refs[formName].validate((valid) => {
                if (!valid) {
                    console.log("表单验证错误")
                    return false
                }

                if (_this.identifyCode !== _this.ruleForm.validate) {
                    _this.isIdentifyCodeError = true
                    _this.identifyCodeErrorInfo = '验证码错误'
                    return false
                }

                _this.isIdentifyCodeError = false
                _this.showLoading = true
                login(_this.ruleForm).then((resData) => {
                    const isLogined = resData.success
                    if (!isLogined) {
                        _this.isFormValid = false
                        _this.errInfo = '用户名或密码错误'
                        _this.showLoading = false
                    } else {
                        const username = resData.data.username
                        _this.$store.commit("changeLoginStatus", true)
                        localStorage.setItem("loginStatus", "logined")
                        localStorage.setItem("username", username)
                        console.log("login status", _this.$store.state.isLogin)
                        _this.$router.push('/home')
                    }
                }).catch(err => {
                    _this.showLoading = false
                    _this.$message({
                        message: '登录失败，请检查网络后重试',
                        type: 'error'
                    })
                })
            })
        },
        handleRegister() {
            this.$router.push('/register')
        },
        randomNum(min, max) {
            return Math.floor(Math.random() * (max - min) + min)
        },
        refreshCode() {
            this.makeCode(4)
        },
        makeCode(codeLen) {
            this.identifyCode = ""
            for (let i = 0; i < codeLen; i++) {
                this.identifyCode += this.identifyCodes[
                    this.randomNum(0, this.identifyCodes.length)
                ]
            }
            console.log(this.identifyCode)
        }
    }
}
</script>

<style scoped lang="stylus">
#login-page
    width 100%
    height 100%
    overflow hidden
    background-color #e9ecf0
    .login-frame
        position relative
        width 850px
        height 480px
        margin 200px auto
        background-color #fff
        border-radius 5px
        overflow hidden
        box-shadow 0 2px 5px #bbb
        .login-background
            position absolute
            left 0
            width 50%
            height 100%
            background-image url('../../assets/images/login-background.jpg')
            background-size 100%
            background-repeat no-repeat
            background-position center center
        .login-wrap
            position absolute
            right 0
            top 0
            width 50%
            height 100%
            background #fff
            border-left 1px solid #eee
            .header
                position relative
                padding-top 50px
                width 100%
                text-align center
                font-size 23px
                color var(--darkest)
            .demo-ruleForm
                width 370px
                margin 50px auto
            .ms-login
                width 55%
                background #fff
            .ms-login span
                color red
            .login-btn
                width 80%
                height 36px
                border-radius 5px
                margin 50px auto
                .btn
                    font-size 16px
            .code
                width 112px
                height 35px
                border 1px solid #ccc
                float right
                border-radius 2px
            .validate-code
                width 136px
                float left
                margin-right 10px
            .register
                font-size 14px
                line-height 20px
                color #999
                cursor pointer
                float right
            .register:hover
                color #20b2aa
            .footer
                position absolute
                bottom 10px
                width 100%
                text-align center
                color #a7a6a6
                font-size 12px
            .error-info
                display block
                width 150px
                height 25px
                color orangered
                font-size 14px


</style>