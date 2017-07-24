<template>
    <div>
        <div class="goods">
            <div class="menu-wrapper" ref="menuwrapper">
                <ul>
                    <li v-for="(item,index) in goods" class="menu-item"  @click="selectMenu(index,$event)" :class="{'current':currentIndex === index}">
                        <span class="text border-1px">
                            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
                            {{item.name}}
                        </span>
                    </li>
                </ul>
            </div>
            <div class="food-wrapper" ref="foodswrapper">
                <ul>
                    <li v-for="item in goods" class="foods-list food-list-hook">
                        <h1 class="title">{{item.name}}</h1>
                        <ul>
                            <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
                                <div class="icon">
                                    <img :src="food.icon" alt=""/>
                                </div>
                                <div class="content">
                                    <h2 class="name">{{food.name}}</h2>
                                    <p class="des">{{food.description}}</p>
                                    <div class="extra">
                                        <span class="count">月售{{food.sellCount}}份</span>
                                        <span>好评率{{food.rating}}%</span>
                                        <!--<span>{{seller.deliveryPrice}}</span>-->
                                        <!--<span>{{seller.deliveryPrice}}</span>-->
                                    </div>
                                    <div class="price">
                                        <span class="now">￥{{food.price}}</span>
                                        <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                                    </div>
                                    <div class="cartcontrol-wrapper">
                                        <!-- add是子元素传递过来的数据，这里利用与监听，同时调用addFood这个方法-->
                                        <cartcontrol :food="food" @add="addFood"></cartcontrol>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>

            </div>
            <shopcart  ref="shopcart" :select-foods="selectFoods" :delivery-Price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
        </div>
        <food :food="selectedFood" ref="food"></food>
    </div>
</template>

<!--数据交互的重点：1.通过在文中定义一个ref，用this.$ref+ref定义的元素，就获得了这个DOM-->
<!--                 2.计算与DOM相关的内容是，用是$nextTick(() =>{}),DOM发生改变是在nextTick这个回调的函数之后 ，在这里面进行想关的数据渲染 -->
<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import shopcart from '../../components/shopcart/shopcart';
    import cartcontrol from '../../components/cartcontrol/cartcontrol';
    import food from '../../components/food/food';
    const ERR_OK = 0;
    export default {
        props: {
            seller: {
                type: Object
            }
        },
        data() {    // data里面检测的数据不要与方法中的函数名相同，因为变量和函数名都可以用this进行访问的到
            return {
                goods: [],
                listHeight: [],
                scrollY: 0,
                selectedFood: {}
            };
        },
        computed: {
//             左边与右边的进行映射，这个是滑动的时的索引
            currentIndex() {
                for (let i = 0; i < this.listHeight.length; i++) {
                    let height1 = this.listHeight[i];
                    let height2 = this.listHeight[i + 1];
                    if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
//                        console.log(i);
                        return i;  // 如果落在这个区间内，返回的就是当前的索引
                    }
                }
                return 0;
            },
//            选择的商品，把每个列表进行循环，找到列表对应的商品，如果该商品
//            对应的数量大于1时，就将该商品添加到foods
            selectFoods() {
                let foods = [];
                this.goods.forEach((good) => {
                    good.foods.forEach((food) => {
                        if (food.count) {
                            foods.push(food);
                        }
                    });
                });
                return foods;
            }
        },
        created() {
            this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
            this.$http.get('./api/goods').then((response) => {
                response = response.body;
                if (response.errno === ERR_OK) {
                    this.goods = response.data;
//                    vue的一个接口，在nextTick时对initScroll进行初始化，给予一个高度
                    this.$nextTick(() => {
                        this._initScroll();
                        this._calculateHeight();
                    });
                }
            });
        },
        methods: {
//            点击左边的与右边的菜单栏对应
            selectMenu(index, event) {
//                pc的时具有下面的事件，用return阻止这个事件
                if (!event._constructed) {
                    return;
                }
                let foodList = this.$refs.foodswrapper.getElementsByClassName('food-list-hook');
                let el = foodList[index];
                this.foodsScroll.scrollToElement(el, 1000); // scrollToElement具有动画的效果，可以滑到某一个元素scrollToElement(el,time,offsetX,offsetY,easimg)
//                console.log(index);
            },
//            通过点击的li，从而控制food组件的显示与隐藏，父组件调用子组件的方法
//            就是在组件中ref=“名称”，然后再es6中用this.$ref.名称.'调用的内容'即可获取到组件内的相关信息
            selectFood(food, event) {
                if (!event._constructed) {
                    return;
                }
                this.selectedFood = food;
                this.$refs.food.show();
            },
            _initScroll() {
                this.menuScroll = new BScroll(this.$refs.menuwrapper, {
                    click: true   // 因为默认的阻止了默认事件,默认的时候在pc端就点击了一次
                });
                this.foodsScroll = new BScroll(this.$refs.foodswrapper, {
                    click: true,
                    probeType: 3   // 3的时候表示滚动时进行监听位置
                });
                this.foodsScroll.on('scroll', (pos) => {
                    this.scrollY = Math.abs(Math.round(pos.y)); // round是取整，abs取的是绝对值，为正整数
                });
            },
//            调用子组件，购物车飞入的函数，需要获取的是加入购物车的哪个按钮的位置
//            把子组件传给父组件，然后再调用子组件，用的是ref
            _drop(target) {
                this.$nextTick(() => {   // 异步加载体验优化，异步执行落下动画
                    this.$refs.shopcart.drop(target);       // 获取子元素的dom对象，并将数据参数参数传递给子元素
                });
            },
            addFood(target) {
                this._drop(target);   // 把子元素传过来的参数，传给_drop这个函数和
            },
//            计算每个区间的高度
            _calculateHeight() {
                let foodList = this.$refs.foodswrapper.getElementsByClassName('food-list-hook'); // 定义一个变量获取到DOM类似的元素
                let height = 0;
                this.listHeight.push(height);
                for (let i = 0; i < foodList.length; i++) {
                    let item = foodList[i];  // 获取每一个footList
                    height += item.clientHeight; // 通过clientHeight获取每一块的高度，进行累加
                    this.listHeight.push(height); // 对于每一次的累加都进行push放在这个数组中
                }
            }
        },
        components: {
            shopcart, cartcontrol, food
        }
    };

</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/min.styl";
    .goods
        display:flex
        position:absolute
        top:174px
        width:100%
        bottom:46px
        overflow:hidden
        .menu-wrapper
            flex:0 0 80px
            width:80px
            background-color:#f3f5f7
            .menu-item
                display:table
                height:54px
                width:56px
                line-height:14px
                padding:0 12px
                &.current
                    position:relative
                    margin-top:-1px
                    z-index:10
                    background:#ffffff
                    font-weight:700
                    .text
                        border-none()

                .icon
                    display:inline-block
                    vertical-align:middle
                    width:12px
                    height:12px
                    background-size:12px 12px
                    background-repeat:no-repeat
                    &.decrease
                        bg-image("decrease_3")
                    &.discount
                        bg-image("discount_3")
                    &.guarantee
                        bg-image("guarantee_3")
                    &.invoice
                        bg-image("invoice_3")
                    &.special
                        bg-image("special_3")
                .text
                    display:table-cell
                    width:56px
                    vertical-align:middle
                    font-size:12px
                    border-1px(rgba(7,17,27,0.1))
        .food-wrapper
            flex:1
            .foods-list
                .title
                    padding-left:14px
                    height:26px
                    line-height:26px
                    background-color:#f3f5f7
                    padding-left:14px
                    font-size:12px
                    border-left:2px solid #d9dde1
                    color:rgb(147,153,159)
                .food-item
                    display:flex
                    margin:18px
                    margin-bottom:0
                    padding-bottom:18px
                    border-1px(rgba(7,17,27,0.1))
                    &:last-child
                        border-none()
                    .icon
                        flex:0 0 50px
                        margin-right:10px
                        img
                            width:57px
                            height:57px
                    .content
                        flex:1
                        .name
                            font-size:14px
                            color:rgb(7,17,27)
                            line-height:14px
                            height:14px
                            margin-top:2px
                        .des
                            margin:8px 0
                            line-height:12px
                  .des,.extra
                            font-size:10px
                            color:rgb(147,153,159)
                        .extra
                            line-height:10px
                            .count
                                margin-right:10px
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
                            right:0
                            bottom:12px

</style>
