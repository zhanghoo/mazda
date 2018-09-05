import router from '@/router'
import cache from '@/utils/cache'

// 登录验证，权限验证
router.beforeEach((to, from, next) => {
    // 是否需要登录
    if (to.matched.some(record => record.meta.login)) {
        if (cache.getToken()) {
            if (to.path === '/login') {
                next('/')
            } else {
                next()
            }
        } else {
            next({ path: '/login', query: { redirect: to.fullPath } })
        }
        next()
    } else {
        if (to.path === '/login' && cache.getToken()) {
            next('/')
        } else {
            next()
        }
    }
})
