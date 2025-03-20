import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/Login'
import Home from "../views/home/Home"
import Visualization from "../views/visualization/Visualization"
import store from '../store/store'
import axios from "axios";
import Register from '../views/login/components/Register'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login',
        meta: {
            requireAuth: false
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            requireAuth: false
        }
    },
    {
        path:'/register',
        name:'register',
        component: Register,
        meta:{
            requireAuth: false
        }
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: {
            requireAuth: false
        }
    },
    {
        path: '/visualization',
        name: 'Visualization',
        component: Visualization,
        meta: {
            requireAuth: false
        }
    },
]

const router = new VueRouter({
    routes
})


// vue-router 与 vuex 配合鉴权
// router.beforeEach((to, from, next) => {
//     // !! 不能根据浏览器中的 localStorage 去看是否已经登录，因为用户可以修改 localStorage 中的信息
//     // 需要从后端获取当前用户的 session 是否处于登录状态
//     axios.get("/api/user/is_login")
//         .then((res) => {
//             const logined = res.data.data && res.data.data.isLogin ? res.data.data.isLogin : false;
//             console.log("当前登录状态: ", res.data.data.isLogin)
//             if (logined) {
//                 // 已登录后，如果访问登录页面，跳转到首页
//                 if (to.path === '/login') {
//                     console.log("asdf")
//                     next({
//                         path: '/home'
//                     })
//                     console.log("fdsa")
//                 } else {
//                     next()
//                 }
//             } else {
//                 // 没登录
//                 if (to.meta.requireAuth) {
//                     next({
//                         path: '/login'
//                     })
//                 } else {
//                     next()
//                 }
//             }
//         })
// })

// router.afterEach(route => {
//     window.scroll(0, 0);
// });

export default router
