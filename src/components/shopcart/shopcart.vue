<template>
    <div>
        <div class="shopcart">
        <div class="content" @click="toggleList">
            <div class="content-left">
                <div class="logo-wrapper">
                    <div class="logo" :class="{'highlight':totalCount>0}">
                        <span class="icon icon-shopping-cart" :class="{'highlight':totalCount>0}"></span>
                    </div>
                    <div class="num" v-show="totalCount>0">{{totalCount}}</div>
                </div>
                <div class="price" :class="{'highlight':totalCount>0}">￥{{totalPrice}}</div>
                <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
            </div>
            <!-- payClass是一个函数，是一个改变的状态 @click.stop.prevent表示是阻止事件冒泡-->
            <div class="content-right" :class="payClass" @click.stop.prevent="pay">
                <div class="pay">{{payDesc}}</div>
            </div>
        </div>
        <div class="ball-container">
            <div v-for="ball in balls">
                <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-eneter="afterDrop">
                    <div class="ball" v-show="ball.show">
                        <div class="inner inner-hook"></div>
                    </div>
                </transition>
            </div>
        </div>
        <transition name="fold">
            <div class="shopcart-list" v-show="listShow">
            <div class="list-header">
                <h1 class="title">购物车</h1>
                <span class="empty" @click="empty">清空</span>
            </div>
            <div class="list-content" ref="listContent">
                <ul>
                    <li v-for="food in selectFoods" class="food">
                        <span class="name">{{food.name}}</span>
                        <div class="price">
                            <span>￥{{food.price*food.count}}</span>
                        </div>
                        <div class="cartcontrol-wrapper">
                            <cartcontrol :food="food"></cartcontrol>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        </transition>
    </div>
        <transition>
            <div class="list-mask" v-show="listShow" @click="hideList"></div>
        </transition>

    </div>
</template>

<script type="text/ecmascript-6">
    import cartcontrol from '../../components/cartcontrol/cartcontrol';
    import BScroll from 'better-scroll';
    export default {
        props: {
            selectFoods: {
                type: Array,   // 当类型是数据或者是对象的时，默认的是一个函数的形式
                default() {
                    return [{
                            price: 10,
                            count: 1
                        }];
                }
            },
            deliveryPrice: {
                type: Number,
                default: 4
            },
            minPrice: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                balls: [
                {
                show: false
                },
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                }],
                dropBalls: [],
                fold: true
            };
        },
        computed: {   // 计算总价，商品的价钱*商品的数量
            totalPrice() {
                let total = 0;
                this.selectFoods.forEach((food) => {
                    total += food.price * food.count;
                });
                return total;
            },
            totalCount() {
                let count = 0;
                this.selectFoods.forEach((food) => {
                    count += food.count;
                });
                return count;
            },
//            注意，如果有变量的时，是可以用$加上反引号，类似与拼接字符串
//            右边计算价格，当总价等于0 的时候就是按照最低价格起送，当小于最低价格时们进行相减
//            其他状态，返回的是总价的状态，即是去结算
            payDesc() {
                if (this.totalPrice === 0) {
                    return `￥${this.minPrice}元起`;
                } else if (this.totalPrice < this.minPrice) {
                    let diff = this.minPrice - this.totalPrice;
                    return `还差￥${diff}元起送`;
                } else {
                    return '去结算';
                }
            },
            payClass() {
                if (this.totalPrice < this.minPrice) {
                    return 'no-enough';
                } else {
                    return 'enough';
                }
            },
//            展示列表时，如果数量小于1，fold表示的是折叠，为true，但是返回的是false，此时是隐藏
            listShow() {
                if (!this.totalCount) {
                    this.fold = true;
                    return false;
                }
                let show = !this.fold;  // 表示的是开关
                if (show) {
                    this.$nextTick(() => {
                        if (!this.scroll) {
                            this.scroll = new BScroll(this.$refs.listContent, {
                                click: true
                            });
                            console.log('aa');
                        } else {
                            this.scroll.refresh();
                        }
                    });
                }
                return show;
            }
        },
        methods: {
//            购物车飞入,el是点击的是对象，获取的是父页面传过来的target
            drop(el) {
                for (let i = 0; i < this.balls.length; i++) {
                    let ball = this.balls[i];
                    if (!ball.show) {
                        ball.show = true;
                        ball.el = el;
                        this.dropBalls.push(ball);
                        return;
                    }
                }
            },
            beforeDrop(el) {
                let count = this.balls.length;
                while (count--) {
                    let ball = this.balls[count];
                    if (ball.show) {
                        let rect = ball.el.getBoundingClientRect();    // 这个位置相对这个视图
                        let x = rect.left - 32;
                        let y = -(window.innerHeight - rect.top - 22);
                        el.style.display = '';
                        el.style.webkitTransform = `translate3d(0,${y}px,0)`;   // 如果有变量的时候，用的而是``同时变量需要用${}
                        el.style.transform = `translate3d(0,${y}px,0)`;
                        let inner = el.getElementsByClassName('inner-hook')[0];
                        inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                        inner.style.transform = `translate3d(${x}px,0,0)`;
                    }
                }
            },
            dropping(el, done) {
                /* eslint-disable no-unused-vars */
                let rf = el.offsetHeight;
                this.$nextTick(() => {
                    el.style.webkitTransform = 'translate3d(0,0,0)';
                    el.style.transform = 'translate3d(0,0,0)';
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = 'translate3d(0,0,0)';
                    inner.style.transform = 'translate3d(0,0,0)';
                    el.addEventListener('transitionend', done);
                });
            },
            afterDrop(el) {
                let ball = this.dropBalls.shift();
                if (ball) {
                    ball.show = false;
                    el.style.display = 'none';
                }
            },
            toggleList() {
                if (!this.totalCount) {
                    return;
                } else {
                    this.fold = !this.fold;
                }
            },
//            清空，把选中的商品数量进行清空
            empty() {
                this.selectFoods.forEach((food) => {
                    food.count = 0;
                });
            },
            hideList() {
                this.fold = true;   // 点击遮罩层的时候进项隐藏，用的是fold，而fold依赖的是listShow()这个函数
            },
            pay() {
                if (this.totalPrice < this.minPirce) {
                    return;
                }
                window.alert(`去支付${this.totalPrice}元`);
            }
        },
    components: {
        cartcontrol
    }
    };

</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/min.styl";
    .shopcart
        position:fixed
        bottom:0
        left:0
        z-index:50
        width:100%
        height:48px
        .content
            height:100%
            display:flex
            background:#141d27
            .content-left
                flex:1
                .logo-wrapper
                    display:inline-block
                    position:relative
                    margin-left:18px
                    padding:6px
                    top:-10px
                    width:56px
                    height:56px
                    box-sizing:border-box
                    border-radius:50%
                    background:#141d27
                    .logo
                        width:100%
                        height:100%
                        border-radius:50%
                        background:#2b343c
                        text-align:center
                        &.highlight
                            background:rgb(0,160,220)
                        .icon
                            font-size:24px
                            color:#80858a
                            line-height:44px
                            &.highlight
                                color:#ffffff
                    .num
                        position:absolute
                        top:0
                        right:0
                        width:24px
                        height:16px;
                        line-height:16px
                        text-align:center
                        border-radius:16px
                        font-size:9px
                        font-weight:700
                        background:rgb(240,20,20)
                        box-shadow:0 4px 8px 0 rgba(0,0,0,0.4)
                        color:#ffffff
                .price
                    display:inline-block
                    vertical-align:top
                    font-size:16px
                    margin-top:12px
                    line-height:24px
                    box-sizing:border-box
                    padding-right:12px
                    font-weight:700
                    color:rgb(255,255,255,0.4)
                    border-right:1px solid rgb(255,255,255,0.1)
                    &.highlight
                        color:#ffffff
                .desc
                    display:inline-block
                    vertical-align:top
                    font-weight:700
                    color:rgb(255,255,255,0.4)
                    line-height:24px
                    font-size:16px
                    margin-top:12px
            .content-right
                flex:0 0 105px
                width:105px
                background:#2b333b
                &.not-enough
                    background:#2b333b
                &.enough
                    background:#00b43c
                    color:#ffffff

                .pay
                    font-size:12px
                    line-height:24px
                    text-align:center
                    color:rgb(255,255,255,0.4)
                    margin-top:12px
        .ball-container
            .ball
                position:fixed
                left:32px
                bottom:22px
                z-index:200
                &.drop-enter-active
                    transition:all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
                    .inner
                        width:16px;
                        height:16px
                        border-radius:50%
                        background:#28a4b0
                        transition:all 0.4s linear
        .shopcart-list
            position:absolute
            /*bottom:48px*/
            top:0
            z-index:-1
            left:0
            width:100%
            transform:translate3d(0,-100%,0)
            &.fold-enter-active,&.fold-leave-active
                transition:all 0.5s
            &.fold-enter,&.fold-leave-active
                transform:translate3d(0,0,0)
            .list-header
                height:40px
                line-height:40px
                padding:0 18px
                background-color:#f3f5f7
                border-bottom:1px solid rgba(7,17,27,0.1)
                .title
                    float:left
                    font-size:14px
                    color:rgb(7,17,27)
                .empty
                    float:right
                    font-size:12px
                    color:rgb(0,160,220)
            .list-content
                padding:0 18px
                max-height:217px
                background-color:#ffffff
                overflow:hidden
                .food
                    position:relative
                    padding:12px 0
                    box-sizing:border-box
                    border-1px(rgba(7,17,27,0.1))
                    .name
                        line-height:24px
                        font-size:14px
                        color:rgb(7,17,27)
                    .price
                        position:absolute
                        right:90px
                        bottom:12px
                        line-height:24px
                        font-size:14px
                        color:red
                        font-weight:700
                    .cartcontrol-wrapper
                        position:absolute
                        right:0
                        bottom:16px
    .list-mask
        position:fixed
        left:0
        top:0
        width:100%
        height:100%
        z-index:40
        backdrop-filter: blur(10px)
        background:rgba(7,17,27,0.6)
        opacity:1
        &.list-enter-active， &.fade-leave-active
            transition:all 0.5s
        &.list-enter,&list-leave-active
            opacity:0
            background:rgba(7,17,27,0)

</style>
