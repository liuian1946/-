<template>
    <div class="cartcontrol">
        <transition name="move">
            <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
                <span class="icon icon-minus-sign inner"></span>
            </div>
        </transition>
        <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
        <div class="cart-add icon icon-plus-sign" @click.stop.prevent="addCart"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    import Vue from 'vue';

    export default {
        props: {
            food: {   // 需要接受的是购买某个商品的个数
                type: Object
            }
        },
        created() {
//            console.log(this.food);
        },
        methods: {
            addCart(event) {
//                console.log('aaa');
                if (!event._constructed) {
                    return;
                }
                if (!this.food.count) {
                    Vue.set(this.food, 'count', 1);   // 用vue set出来的一个变量，可以不断的监听这个变量
//                    this.food.count = 1;
                } else {
                    this.food.count++;
                }
//                用$emit讲子组件的信息传递给父元素
                this.$emit('add', event.target); // 数量增加的时候，把这个事件的目标对象作为这个函数的参数传递
            },
            decreaseCart(event) {
                if (!event._constructed) {
                    return;
                }
                if (this.food.count) {
                    this.food.count--;
                }
            }

        }

    };

</script>

<style lang="stylus" rel="stylesheet/stylus">
    .cartcontrol
        .cart-decrease
            display:inline-block
            transition:all 0.4s linear
            &.move-enter-active
                opacity:1
                transform:translate3D(0,0,0)
            .inner
                font-size:24px
                transition:all 0.4s linear
                transform:rotate(0)
            &.move-enter,&.move-leave-to
                opacity:0
                transform:translate3D(24px,0,0)
                .inner
                    transform:rotate(180deg)

        .icon
            color:#28a4b0
            font-size:24px
            line-height:24px
            display:inline-block
        .cart-count
            display:inline-block
            vertical-align:top
            line-height:24px



</style>
