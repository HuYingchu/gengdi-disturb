<template>
    <div id="login-page">
        <div class="login-frame">
            <div class="login-background"></div>
            <div class="login-wrap" v-loading="showLoading">
                <div class="header">账号注册</div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" label-position="left" class="demo-ruleForm">
                    <div v-if="!isFormValid">
                        <span class="error-info">{{ errInfo }}</span>
                    </div>
                    <el-form-item prop="username" label="用户名">
                        <el-input prefix-icon="el-icon-user" v-model="ruleForm.username" placeholder="账号" ></el-input>
                    </el-form-item>
                    <el-form-item prop="password" label="密码">
                        <el-input prefix-icon="el-icon-lock" type="password" placeholder="密码" v-model="ruleForm.password"></el-input>
                    </el-form-item>
                    <el-form-item prop="confirmpass" label="确认密码">
                        <el-input prefix-icon="el-icon-lock" type="password" placeholder="请再次确认密码" v-model="ruleForm.confirmpass"></el-input>
                    </el-form-item>
                    <div class="register" @click="handleLogin">返回登录界面</div>
                    <div class="login-btn">
                        <div class="btn" type="primary" @click="register('ruleForm')" @keyup.enter="register('ruleForm')">注册</div>
                    </div>
                    
                </el-form>
                <div class="footer"> @2021 浙江大学遥感与信息技术研究所</div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"

export default {
    name: "Register",
    
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
                confirmpass: '',
                // validate: ''
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                confirmpass: [{ required: true, message: '请再次确认密码', trigger: 'blur' }]
            },
            showLoading: false
        }
    },
    mounted() {
        const _this = this
        // _this.refreshCode()
    },
    methods: {
        register(formName){
            const _this = this
            _this.$refs[formName].validate((valid) => {
                if(!valid){
                    console.log("表单验证错误")
                    return false
                }
            })
            if(_this.ruleForm['password']!=_this.ruleForm['confirmpass']){
                _this.$message({
                    message:'两次密码输入不一致，请重新输入',
                    type:'warning'
                })
                _this.ruleForm['password'] = ''
                _this.ruleForm['confirmpass'] = ''
                return false
            }

            const uploadParams = {
                'username': _this.ruleForm['username'],
                'password': _this.ruleForm['password']
            }
            _this.showLoading = true
            _this.$axios.post('/api/user/register',uploadParams)
            .then((res) => {
                const resData = res.data;
                if(resData.status === 0 ){
                    console.log("注册成功")
                    _this.$message({
                        message:'恭喜您，账户注册成功',
                        type:'success'
                    })
                    _this.$router.push('/login')
                }
                else if(resData.status === 1){
                    console.log("注册失败，该账号已存在")
                    _this.$message({
                        message:'该账号已存在，请重新注册',
                        type:'error'
                    })
                    for(let key in _this.ruleForm){
                        _this.ruleForm[key] = ''
                    }
                    _this.showLoading = false

                }
            }).catch(err =>{
                _this.showLoading = false
                _this.$message({
                    message: '注册失败，请检查网络后重试',
                    type: 'error'
                })
            })
        },
        
        handleLogin() {
            this.$router.push('/login')
        },
        
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
            background-image url('../../../assets/images/login-background.jpg')
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