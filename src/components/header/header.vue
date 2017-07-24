<template>
    <div class="header">
        <div class="content-wrapper">
          <div class="avatar">
               <img width="64" height="64" :src="seller.avatar">
          </div>
          <div class="content">
                <div class="title">
                    <span class="brand"></span>
                    <span class="name">{{seller.name}}</span>
                </div>
                <div class="description">
                    {{seller.description}}/{{seller.deliveryTime}}分钟送达
                </div>
                <div v-if="seller.supports" class="support">
                <!-- :class根据是获取的type来确定classMap数组的下标，从而替换类  -->
                    <span class="icon" :class="classMap[seller.supports[0].type]"></span>
                    <span class="text">{{seller.supports[0].description}}</span>
                </div>
          </div>
          <div class="support-count" v-if="seller.supports"  @click="showDetail">
                <span class="count">
                    {{seller.supports.length}}个
                </span>
                <i class="icon icon-angle-right"></i>
          </div>
        </div>
        <div class="bulletin-wrapper" @click="showDetail">
            <span class="bulletin-title"></span>
            <span class="bulletin-text">{{seller.bulletin}}</span>
            <i class="icon icon-angle-right"></i>
        </div>
        <div class='background-color'></div>
        <transition name="fade">
            <div class='detail' v-show='detailShow'>
            <!-- 下面是sticky footer布局，cleatfix是清除浮动-->
                <div class="detail-wrapper clearfix">
                    <div class="detail-main">
                        <h1 class="name">{{seller.name}}</h1>
                        <div class="star-wrapper">
                            <star :size="48" :score="seller.score"></star>
                        </div>
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">优惠信息</div>
                            <div class="line"></div>
                        </div>
                        <ul v-if="seller.supports" class="supports">
                            <li class="support-item" v-for="item in seller.supports">
                                <span class="icon" :class="classMap[item.type]"></span>
                                <span class="text">{{item.description}}</span>
                            </li>
                        </ul>
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">商家公告</div>
                            <div class="line"></div>
                        </div>
                        <div class="bulletin">
                            <p class="content">{{seller.bulletin}}</p>
                        </div>


                    </div>
                </div>
                <!-- 底部层，上面的是内容层-->
                <div class="detail-close" @click="hideDetail">
                    <i class="icon icon-remove"></i>
                </div>
            </div>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
    import star from '../../components/star/star.vue';
    export default {
    // 通过props接受传出来的seller
        props: {
            seller: {
                type: Object
            }
        },
        // data()是一个函数，里面返回是object，在vue进行实例化的时候，会对data这里面
        // 这里面的变量进行编译，这个变量变化时dom会进行发生改变
        data() {
            return {
                detailShow: false
            };
        },
        // 当点击的时候调用showDetail这个函数的时，会改变detailShow这个对象，从而改变了Dom
        methods: {
            showDetail() {
                this.detailShow = true;
            },
            hideDetail() {
                this.detailShow = false;
            }
        },
        created() {
            this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
        },
        components: {
            star
        }

    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '../../common/stylus/min.styl';
    .header
        color:white
        background-color:#999
        .content-wrapper
            padding:24px 12px 18px 24px
            font-size:0
            position:relative
            .avatar
                display:inline-block
                margin-right:16px
                vertical-align:top
                img
                    border-radius:2px
            .content
                font-size:14px
                display:inline-block
                .title
                    margin:2px 0 8px 0
                    .brand
                        width:30px
                        height:18px
                        display:inline-block
                        vertical-align:top
                        bg-image('brand')
                        background-size:30px 18px
                        background-repeat:no-repeat
                    .name
                        font-size:16px
                        font-weight:bold
                        line-height:18px
                        margin-left:6px
                .description
                    font-size:12px
                    line-height:12px
                    margin:8px 0 10px 0
                .support
                    .icon
                        width:12px
                        height:12px
                        display:inline-block
                        vertical-align:top
                        background-size:12px 12px
                        margin-right:4px
                        background-repeat:no-repeat
                        &.decrease
                            bg-image('decrease_1')
                        &.discount
                            bg-image('discount_1')
                        &.guarantee
                            bg-image('guarantee_1')
                        &.invoice
                            bg-image('invoice_1')
                        &.special
                            bg-image('special_1')
                    .text
                        line-height:12px
                        font-size:10px
                        vertical-align:top
            .support-count
                position:absolute
                right:12px
                bottom:18px
                padding:0 8px
                height:24px
                line-height:24px
                font-size:10px
                background-color:rgba(0.0.0.0.2)
                text-align:center
                border-radius:14px
        .bulletin-wrapper
            height:28px
            line-height:28px
            padding:0 22px 0 12px
            white-space:nowrap
            overflow:hidden
            text-overflow:ellipsis
            position:relative
            background-color:rgba(7,17.27.0.2)
            .bulletin-title
                bg-image('bulletin')
                width:22px
                height:12px
                margin-right:4px
                background-repeat:no-repeat
                background-size:22px 12px
                display:inline-block
            .icon
                position:absolute
                font-size:10px
                right:12px
                bottom:9px

        .detail
            position:fixed;
            z-index:100
            top:0
            left:0
            width:100%
            height:100%
            overflow:auto
            background-color:rgba(7,17,27,0.8)
            transition: all 0.5s;
            &.fade-enter
                opacity:0
                background-color:rgba(7,17,27,0)
            &.fade-enter-active
                transition:all 2s
                background-color:rgba(7,17,27,0.8)
            .detail-wrapper
                width:100%
                min-height:100%
                .detail-main
                    padding-top:64px
                    //对于sticky footer布局下面一定是要有padding，包括footer的内容
                    padding-bottom:64px
                    .name
                        line-height:16px
                        text-align:center
                        font-size:16px
                        font-weight:700
                    .star-wrapper
                        margin-top:18px;
                        text-align:center
                        padding:2px 0
                    .title
                        display:flex
                        width:80%
                        margin:28px auto 24px auto
                        .line
                            flex:1
                            position:relative
                            top:-6px
                            border-bottom:1px solid rgba(255,255,255,0.2)
                        .text
                                padding: 0 12px
                                font-size:12px
                                font-weight:700
                    .supports
                        width:80%
                        margin:0 auto
                        .support-item
                            padding:0 12px
                            margin-bottom:12px
                            font-size:0
                            &:last:child
                                margin-bottom:0
                            .icon
                                display:inline-block
                                margin-right:6px
                                vertical-align:top
                                background-repeat:no-repeat
                                width:16px
                                height:16px
                                background-size:16px 16px
                                &.decrease
                                   bg-image('decrease_2')
                                &.discount
                                    bg-image('discount_2')
                                &.guarantee
                                    bg-image('guarantee_2')
                                &.invoice
                                    bg-image('invoice_2')
                                &.special
                                   bg-image('special_2')
                            .text
                                line-height:12px
                                font-size:12px
                    .bulletin
                        width:80%
                        margin:0 auto
                        .content
                            padding:0 12px
                            font-size:12px
                            font-weight:200
                            color:white
                            line-height:24px

            .detail-close
                position:relative
                width:32px
                height:32px
                margin:-64px auto 0 auto
                clear:both
                font-size:32px

</style>
