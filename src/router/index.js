import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import Users from '@/components/user/Users.vue'
import Category from '@/components/product/Category.vue'
import Product from '@/components/product/Product.vue'
import Order from '@/components/order/Order.vue'
import OrderDetail from '@/components/order/OrderDetail.vue'
import Druid from '@/components/druid/Druid.vue'
import Interface from '@/components/druid/Interface.vue'
import Menu from '@/components/menu/Menu.vue'
import Permission from '@/components/permission/Permission.vue'

Vue.use(Router)

const router = new Router({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children:
                [
                    { path: '/welcome', component: Welcome },
                    { path: '/user', component: Users },
                    { path: '/menu', component: Menu },
                    { path: '/permission', component: Permission },
                    { path: '/category', component: Category },
                    { path: '/product', component: Product },
                    { path: '/order', component: Order },
                    { path: '/order_detail', component: OrderDetail },
                    { path: '/druid', component: Druid },
                    { path: '/interface', component: Interface }
                ]
        }

    ]
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next()
    const tokenStr = window.sessionStorage.getItem("token")
    if (!tokenStr) return next('/login')
    next()
})


export default router
