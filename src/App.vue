<template>
  <div id="app">
      <v-header :seller="seller"></v-header>
      <div class="tab">
          <div class="tab-item">
          <!-- 使用router-link组件导航，通过to指定链接，router-link会默认生成一个链接-->
             <router-link to="/goods">商品</router-link>
          </div>
          <div class="tab-item">
             <router-link to="/ratings">评论</router-link>
          </div>
          <div class="tab-item">
             <router-link to="/seller">商家</router-link>
          </div>
      </div>
      <!-- 理由出口，路由匹配的组件都是渲染在这里 -->
      <router-view :seller="seller"></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
    import header from './components/header/header.vue';
    // 定义一个ERR_OK状态码是否返回的数据成功
    const ERR_OK = 0;
    export default{
        data() {
            return {
                seller: {}
            };
        },
        // 在实例化的时有一个生命周期，有一个钩子是created()
        created() {
        // $http是vue-resource中是数据交换中，用的是get的方法，获取的数据通过api+接口的形式
        // 发送请求之后用的是then 的方法，这是请求成功的条件下，对数据进行处理
            this.$http.get('/api/seller').then((response) => {
            // 获取数据，因为是兑对象，所以用的是body，json()获取的是promise形式的
                response = response.body;
                if (response.errno === ERR_OK) {
                    this.seller = response.seller;
//                    console.log(response);
//                    console.log(response.seller.avatar);
                }
            });
        },
        components: {
            'v-header': header
        }
    };

</script>

<style lang='stylus' rel="stylesheet/stylus">
    #app
        .tab
            display:flex
            border-bottom:1px solid rgba(7,17,27,0.1)
            width:100%
            height:40px
            line-height:40px
            .tab-item
                flex:1
                text-align:center
                & > a
                    display:block
                    font-size:14px
                    color:rgb(77,85,93)
                    &.active
                        color:#f01414

</style>
