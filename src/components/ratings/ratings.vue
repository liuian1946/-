<template>
    <div class="ratings">
        <div class="ratings-content">
            <div class="overview">
                <div class="overview-left">
                    <h1 class="score">{{seller.score}}</h1>
                    <div class="title">综合评分</div>
                    <div class="rank">高于周边商家{{seller.rankRate}}%</div>
                </div>
                <div class="overview-right">
                    <div class="score-wrapper">
                        <span class="title">服务态度</span>
                        <star :size="36" :score="seller.serviceScore"></star>
                        <span class="score">{{seller.serviceScore}}</span>
                    </div>
                    <div class="score-wrapper"><span class="title">商品评分</span>
                        <star :size="36" :score="seller.foodScore"></star>
                        <span class="score">{{seller.foodScore}}</span>
                    </div>
                    <div class="delivery-wrapper">
                        <span class="title">送达时间</span>
                        <span class="delivery">{{seller.deliveryTime}}</span>
                    </div>
                </div>
            </div>
            <split></split>
            <ratingselect :select-type="selectType" :only-content="onlyContent" :ratings="ratings"  @select="selectRating" @toggle="toggleContent"></ratingselect>
            <div class="rating-wrapper">
                <ul>
                    <li v-for="rating in ratings" class="rating-item" v-show="needShow(rating.rateType,rating.text)">
                        <div class="avatar">
                            <img width="28" height="28" :src="rating.avatar"/>
                        </div>
                        <div class="content">
                            <h1 class="name">{{rating.username}}</h1>
                            <div class="star-wrapper">
                                <star :size="24" :score="rating.score"></star>
                                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
                            </div>
                            <p class="text">{{rating.text}}</p>
                            <div class="recommend" v-show="rating.recommend.length">
                                <span class="icon icon-thumbs-up"></span>
                                <span v-for="item in rating.recommend" class="item">{{item}}</span>
                            </div>
                            <div class="time">
                                {{rating.rateTime | formatDate}}
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import star from '../../components/star/star';
    import split from '../../components/split/split';
    import ratingselect from '../../components/ratingselect/ratingselect';
    import {formatDate} from '../../common/js/date.js';
    const ALL = 2;
    const ERR_OK = 0;
    export default {
        props: {
            seller: {
                type: Object
            }
        },
        data() {
            return {
                ratings: [],
                selectType: ALL,
                onlyContent: true
            };
        },
        created() {
            this.$http.get('/api/ratings').then((response) => {
                response = response.body;
                if (response.errno === ERR_OK) {
                    this.ratings = response.data;
                    this.$nextTick(() => {
                        this.scroll = new BScroll(this.$refs.ratings, {
                            click: true
                        });
                    });
//                    console.log(response.data);
                }
            });
        },
        methods: {
            selectRating(type) {
                this.selectType = type;
                this.$nextTick(() => {
                    this.scroll.refresh();
                });
            },
            toggleContent() {
                alert('aaa');
                this.onlyContent = !this.onlyContent;
                this.$nextTick(() => {  // 在dom更新之后刷新页面，重新加载scroll
                    this.scroll.refresh();  // 重新加载DOM之后进行scroll
                });
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
            }
        },
        filters: {
            formatDate(time) {
                let date = new Date(time);   // 把时间戳转化成date类型的对象
                return formatDate(date, 'yyyy-MM-dd hh:mm');
            }
        },
        components: {
            star, split, ratingselect
        }

    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/min.styl";
    .ratings
        height:100%
        position:absolute
        top:174px
        bottom:0
        left:0
        width:100%
        overflow:hidden
        .overview
            display:flex
            padding:18px 0
            .overview-left
                flex:0 0 137px
                padding-bottom:6px 0
                width:137px
                border-right:1px solid rgba(7,17,27,0.1)
                text-align:center
                @media only screen and (max-width:320px)
                    flex:0 0 120px
                    width:120px
                .score
                    font-size:24px
                    line-height:28px
                    color:rgb(255,253,0)
                    margin-bottom:6px
                .title
                    margin-bottom:8px
                    line-height:12px
                    font-size:12px
                    color:rgb(7,17,27)
                .rank

                    line-height:10px
                    font-size:10px
                    color:rgb(147,153,159)
            .overview-right
                flex:1
                padding:6px 0 6px 24px
                @media only screen and (max-width:320px)
                    padding-left:6px
                .score-wrapper
                    line-height:18px
                    margin-bottom:8px
                    .title
                        font-size:12px
                        color:rgb(7,17,27)
                        display:inline-blcok
                        line-height:18px
                    .star
                        display:inline-block
                        vertical-align:top
                        margin:0 12px
                        @media only screen and (max-width:320px)
                            margin:0
                    .score
                        font-size:12px
                        vertical-align:top
                        color:rgb(255,153,0)
                        vertical-align:top
                        line-height:18px

                    .delivery-wrapper
                        .title
                            font-size:12px
                            color:rgb(7,17,27)
                            line-height:18px
                        .delivery
                            margin-left:12px
                            font-size:12px
                            color:rgb(147,153,159)
        .rating-wrapper
            padding:0 18px
            .rating-item
                display:flex
                padding:18px 0
                border-1px(rgba(7,17,27,0.1))
                .avatar
                    flex:0 0 28px
                    width:28px
                    margin-right:12px
                    img
                        border-radius:50%
                .content
                    position:relative
                    flex:1
                    .name
                        line-height:12px
                        margin-bottom:4px
                        font-size:10px
                        color:rgb(7,16,27)
                    .star-wrapper
                        margin-bottom:6px
                        .star
                            display:inline-block
                            margin-right:6px
                            vertical-align:top
                        .delivery
                            display:inline-block
                            vertical-align:top
                            line-height:12px
                    .text
                        line-height:18px
                        margin-bottom:8px
                        color:rgb(7,17,27)
                        font-size:12px
                    .recommend
                        line-height:16px
                        .icon-thumbs-up, .item
                            display:inline-block
                            margin:0 8px 4px 0
                            font-size:9px
                            color:#28a4b0
                        .icon-thumbs-up
                            color:#28a4b0
                        .item
                            padding:0 6px
                            border:1px solid rgba(7,17,27,0.1)
                            border-radius:1px
                            color:rgb(147,153,159)
                            background:#fff
                    .time
                        position:absolute
                        top:0
                        right:0
                        line-height:12px








</style>
