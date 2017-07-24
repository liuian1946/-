<template>
    <div class="ratingselect">
        <!-- -->
        <div class="rating-type border-1px">
            <span class="block positive" @click="select(2,$event)" :class="{'active':selectType===2}">{{desc.all}} <span class="count">{{ratings.length}}</span></span>
            <span class="block positive" @click="select(0,$event)" :class="{'active':selectType===0}">{{desc.positive}} <span class="count">{{positives.length}}</span></span>
            <span class="block negative" @click="select(1,$event)" :class="{'active':selectType===1}">{{desc.negative}} <span class="count">{{negatives.length}}</span></span>
        </div>
        <div class="switch" @click="toggleContent" :class="{'on':onlyContent}">
            <span class="icon icon-ok-circle">  </span><span class="text">只看有内容的评价</span>
        </div>
    </div>


</template>

<script type="text/ecmascript-6">
    const POSITIVE = 0;
    const NEGATIVE = 1;
    const ALL = 2;
    export default {
        props: {        // props是接受父元素传来的数据，此组件接受的是ratings，这个字段，rating是一个数组
            ratings: {
                type: Array,
                default() {
                    return [];
                }
            },
            selectType: {        // selectType 选中的类型，有ALL POSITIVE NEGATIVE三个，默认的是ALL,
                type: Number,
                default: ALL    // 默认的是选中全部
            },
            onlyContent: {     // 是否只看评价，默认的是不是
                type: Boolean,
                default: false
            },
            desc: {          // 是selctType不同状态下对应的内容，从父组件传过来的，默认的是全部，满意，不满意，但是父组件传过来的是全部，推荐，吐槽
                type: Object,
                default() {
                    return {
                        all: '全部',
                        positive: '满意',
                        negative: '不满意'
                    };
                }
            }
        },
        methods: {
            select(type, event) {   //   点击三个状态时，将type的值赋值selectType,type是函数传过来的参数，是状态，从而改变selectType的值
                                    //   改变状态的背景颜色，进行动态添加active这个类
                if (!event._constructed) {
                    return;
                }
                this.selectType = type;
                this.$emit('select', type);   //  因为父组件中需要监听这个函数，$emit是子传父 $emit('自定义的事件名'，'要传递的数据')
            },
            toggleContent() {
                if (!event._constructed) {
                    return;
                }
                this.onlyContent = !this.onlyContent;   // 非自身的
                this.$emit('toggle', this.onlyContent); // 父组件主要监听这个事件
            }
        },
        computed: {
            positives() {   // 计算不同rateType的长度，用的是filter过滤，是一个数组，可以用length计算长度
                return this.ratings.filter((rating) => {
                    return rating.rateType === POSITIVE;
                });
            },
            negatives() {
                return this.ratings.filter((rating) => {
                    return rating.rateType === NEGATIVE;
                });
            }
        }
    };

</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/min";

    .ratingselect
        .rating-type
            padding:18px 0;
            margin:0 18px
            border-1px(rgba(7,17,27.0.1))
            .block
                display:inline-block
                padding:8px 12px
                border-radius:1px
                margin-right:8px
                color:rgb(77,85,93)
                &.active
                    color:#fff
                .count
                    font-size:8px
                    margin-left:2px
                &.positive
                    background:rgba(0,160,220,0.2)
                    &.active
                        background:rgb(0,160,220)
                &.negative
                    background:rgba(77,85,93,0.2)
                    &.active
                        background:rgb(77,85,93)
        .switch
            line-height:24px
            font-size:24px
            padding:12px 18px
            border-bottom:1px solid rgba(7,17,27,0.1)
            color:rgb(147,153,159)
            &.on
                .icon
                    color:#00c850
            .icon
                display:inline-block
                vertical-align:top
                font-size:24px
                margin-right:4px
            .text
                vertical-align:top
                font-size:12px








</style>
