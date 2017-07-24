<template>
    <transition name="move">
        <div v-show="showFlag" class="food" ref="food">
            <div class="food-content">
                <div class="image-header">
                    <img :src="food.image"/>
                    <div class="back" @click="hide">
                        <i class="icon icon-angle-left"></i>
                    </div>
                </div>
                <div class="content">
                    <h1 class="title">{{food.name}}</h1>
                    <div class="detail">
                        <span class="sell-count">月售{{food.sellCount}}份</span>
                        <span class="rating">好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                        <span class="now">￥{{food.price}}</span>
                        <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                        <cartcontrol :food="food"></cartcontrol>
                    </div>
                    <transition class="fade">
                        <div class="buy" @click="addFirst" v-show="!food.count || food.count===0">加入购物车</div>
                    </transition>
                </div>
                <split v-show="food.info"></split>
                <div class="info" v-show="food.info">
                    <h1 class="title">商品详情</h1>
                    <p class="text" >{{food.info}}</p>
                </div>
                <split></split>
                <div class="rating">
                    <h1 class="title">商品评价</h1>
                    <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings" @select="selectRating" @toggle="toggleContent"></ratingselect>
                    <div class="rating-wrapper">
                        <ul v-show="food.ratings && food.ratings.length">
                            <!-- needShow传的两个参数一个是点击的满意度，一个是内容 ，这个函数用于点击的时候关联下面的内容-->
                            <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
                                <div class="user">
                                    <span class="name">{{rating.username}}</span>
                                    <img width="12" height="12" :src="rating.avatar" class="avatar">
                                </div>
                                <div class="time">{{rating.rateTime | formatDate}}</div>
                                <!-- 转化时间戳，需要进行的是过滤，方法就是在后面添加一个 |-->
                                <p class="text">
                                    <span :class="{'icon-thumbs-up':rating.rateType===0,'icon-thumbs-down':rating.rateType===1}"></span>{{rating.text}}
                                </p>
                            </li>
                        </ul>
                        <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>



                    </div>
                </div>


            </div>
        </div>
    </transition>

</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import Vue from 'vue';
    import {formatDate} from '../../common/js/date';  // 带{}这个是因为子组件中export function，里面可以添加多个函数，就是多个模块
    import cartcontrol from '../../components/cartcontrol/cartcontrol';
    import split from '../../components/split/split';
    import ratingselect from '../../components/ratingselect/ratingselect';
//    const POSITYPE = 0;
//  const NEGTIVE = 1;
    const ALL = 2;
    export default {
        props: {
            food: {
                type: Object
            }
        },
        data() {     //  data是当前组件监听的一些数据，需要用：名称=’监听的数据‘形式传给子组件，子组件用prop接受
            return {
                showFlag: false,
                selectType: ALL,
                onlyContent: true,
                desc: {
                    all: '全部',
                    positive: '推荐',
                    negative: '吐槽'
                }

            };
        },
//        在组件时，父组件是可以调用子组件的方法的
//    函数的命名，如果是外部可以访问的直接用函数名，如果是私有的需要在前面添加一个_
        methods: {
            show() {
                this.showFlag = true;
                this.selectType = ALL;
                this.onlyContent = true;
                this.$nextTick(() => {  // 必须使用$nextTick，因为保证dom是被渲染后的
                    if (!this.scroll) {
                        this.scroll = new BScroll(this.$refs.food, {
                            click: true
                        });
                    } else {
                        this.scroll.refresh();
                    }
                });
            },
            hide() {
                this.showFlag = false;
            },
            addFirst(event) {
                if (!event._constructed) {
                    return;
                }
                console.log('aa');
                console.log(event.target);
                this.$emit('add', event.target);
                Vue.set(this.food, 'count', 1);  // 意思是把count设置为1
            },
            needShow(type, text) {
                if (this.onlyContent && !text) {  // 如果是显示内容，而且没有内容时，返回的是false,即是给隐藏
                    return false;
                }
                if (this.selectType === ALL) {   // 如果类型是全部时，返回的都是true
                    return true;
                } else {
                    return type === this.selectType; // 其他的是选中的类型复制给type
                }
            },
            selectRating(type) {
                this.selectType = type;
                this.$nextTick(() => {
                    this.scroll.refresh();
                });
            },
            toggleContent() {
                this.onlyContent = !this.onlyContent;
                this.$nextTick(() => {  // 在dom更新之后刷新页面，重新加载scroll
                    this.scroll.refresh();  // 重新加载DOM之后进行scroll
                });
            }

        },
        filters: {
            formatDate(time) {
                let date = new Date(time);   // 把时间戳转化成date类型的对象
                return formatDate(date, 'yyyy-MM-dd hh:mm');
            }
        },
        components: {
            cartcontrol, split, ratingselect
        }
    };

</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/min";
    .food
        position:fixed
        width:100%
        left:0
        top:0
        bottom: 48px
        z-index:30
        background:#fff
        &.move-enter-active,&.move-leave-active
            transition:all 0.2s linear
        &.move-enter,&.move-leave-active
            transform:translate3d(100%,0,0)
        .image-header
            position:relative
            width:100%
            height:0
            padding-top:100%   /* 对于一个height是0，padding-top:100%意思是高度就是宽度的100%,表现的是一个正方形*/
            img
                position:absolute
                top:0
                left:0
                width:100%
                height:100%
            .back
                position:absolute
                top:10px
                left:0
                .icon
                    display:block
                    padding:10px
                    font-size:20px
                    color:#fff
        .content
            padding:18px
            position:relative
            .title
                line-height:15px
                margin-bottom:8px
                font-size:14px
                font-weight:700
                color:rgb(7,17,27)
            .detail
                font-size:10px
                margin-bottom:18px
                line-height:10px
                .sell-count,.rating
                    margin-right:12px
                    color:rgb(147,153,159)
            .price
                font-weight:700
                font-size:14px
                line-height:24px
                .now
                    color:rgb(240,20,20)
                .old
                    color:rgb(147,153,159)
                    font-size:10px
                    text-decoration:line-through
        .cartcontrol-wrapper
            position:absolute
            right:12px
            bottom:18px
        .buy
            position:absolute
            right:12px
            bottom:18px
            z-index:10
            height:24px
            line-height:24px
            padding:0 12px
            box-sizing:border-box
            font-size:10px
            border-radius:12px
            color:#fff
            background:rgb(0,160,220)
            &.fade-enter-active,&.fade-leave-active
                transition:all 0.2s
                opacity:0
            &.fade-enter,&.fade-leave-active
                opacity:0
        .info
            padding:18px
            .title
                line-height:14px
                margin-bottom:6px
                font-size:14px
                color:rgb(7,17,27)
            .text
                font-size:12px
                line-height:24px
                padding0 8px
                color:rgb(77,85,93)
        .rating
            padding-top:18px
            .title
                margin-left:18px
                font-size:14px
                color:rgb(7,17,27)
            .rating-wrapper
                padding:0 18px
                .rating-item
                    position:relative
                    padding:16px 0
                    border-1px(rgba(7,17,27,0.1))
                    .user
                        position:absolute
                        right:0
                        top:16px
                        line-height:12px
                        font-size:0
                        .name
                            display:inline-block
                            vertical-align:top
                            font-size:10px
                            margin-right:6px
                            color:rgb(147,153,259)
                        .avatar
                            border-radius:50%
                    .time
                        font-size:10px
                        color:rgb(147,153,259)
                        line-height:12px
                        margin-bottom:6px
                    .text
                        line-height:16px
                        font-size:12px
                        color:rgb(7,17,27)
                        .icon-thumbs-up,.icon-thumbs-down
                            margin-right:4px
                            line-height:16px
                            font-size:12px
                        .icon-thumbs-up
                            color:rgb(0,160,220)
                        .icon-thumbs-down
                            color:rgb(147,153,159)
                .no-rating
                    color:rgb(147,153,150)
                    padding:16px 0
</style>
