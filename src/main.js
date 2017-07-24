// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from './components/goods/goods';
import ratings from './components/ratings/ratings';
import seller from './components/seller/seller';
// 对于一个模块化工程中使用他，必须需要Vue.use(vue-router)
Vue.use(VueRouter);
Vue.use(VueResource);
// 定义路由的组件，可以是import进行,需要用的是import，所以此部分进行忽略
// const goods = { template: '<div class="aa">aaaa</div>' };
// const ratings = { template: '<div>ratings</div>' };
// const sell = { template: '<div>seller</div>' };
// 定义路由，每个路由映射一个组件
const routes = [
  { path: '/goods', component: goods },
  { path: '/ratings', component: ratings },
  { path: '/seller', component: seller }
];
// 路由实例化，穿router配置，也可以传别的参数
const router = new VueRouter({
    // 在点击的时候会给标签添加一个类，对这个类进行重新定义
    linkActiveClass: 'active',
    routes
});
// 创建和挂载根实例，记得要通过router配置参数注入路由，从而整个应用都有路由功能
// new Vue({
//    template: '<App/>',
//    components: { App, goods, ratings, seller },
//  router
// }).$mount('#app');
// router.push('/goods');

/* eslint-disable no-new */
new Vue({
        el: '#app',
        router,
        render: h => h(App)
});
