// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from './components/goods/goods';
import ratings from './components/ratings/ratings';
import seller from './components/seller/seller';
// ����һ��ģ�黯������ʹ������������ҪVue.use(vue-router)
Vue.use(VueRouter);
Vue.use(VueResource);
// ����·�ɵ������������import����,��Ҫ�õ���import�����Դ˲��ֽ��к���
// const goods = { template: '<div class="aa">aaaa</div>' };
// const ratings = { template: '<div>ratings</div>' };
// const sell = { template: '<div>seller</div>' };
// ����·�ɣ�ÿ��·��ӳ��һ�����
const routes = [
  { path: '/goods', component: goods },
  { path: '/ratings', component: ratings },
  { path: '/seller', component: seller }
];
// ·��ʵ��������router���ã�Ҳ���Դ���Ĳ���
const router = new VueRouter({
    // �ڵ����ʱ������ǩ���һ���࣬�������������¶���
    linkActiveClass: 'active',
    routes
});
// �����͹��ظ�ʵ�����ǵ�Ҫͨ��router���ò���ע��·�ɣ��Ӷ�����Ӧ�ö���·�ɹ���
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
