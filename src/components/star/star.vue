<template>
    <div class="star":class="starType">
    <!-- 因为里面的类是改变的，图片不同，绑定的是不同的类，用的是动态的class-->
        <span v-for="itemClass in itemClasses" class="star-item" :class="itemClass"></span>
    </div>

</template>

<script type="text/ecmascript-6">
//  定义的常量需要在外面，用的是const
    const LENGTH = 5;  // 星的长度是5
    const CLS_ON = 'on';
    const CLS_HALF = 'half';
    const CLS_OFF = 'off';
    export default{
      props: {
        size: {
            type: Number
        },
        score: {
            type: Number
        }
      },
      computed: {
        starType() {
            return ' star-' + this.size;
        },
        // 下面的js操作的是将动态的类替换成on，half，off
        // 重点：分数的四舍五入，方法是x2，然后再除以2，判断x2的的向下取整是否还有余数，如果有余数就是半颗心，再不够星的长度下填补的是空白的星
        itemClasses() {
            let result = [];  // itemClass是一个数组
            let score = Math.floor(this.score * 2) / 2;  // 四舍五入，拿数*2，大于5的进一，小于5的舍去，然后是Math.floor()进行向下取整
            let hasDecimal = score % 1 !== 0;  // 判断是否有余数
            let integer = Math.floor(score);  // 对数进行向下取整
            for (let i = 0; i < integer; i++) {   // 对整数的部分进行循环，整数是满星
                result.push(CLS_ON);
            }
            if (hasDecimal) {    //  对余数部分是一半
                result.push(CLS_HALF);
            }
            while (result.length < LENGTH) {   // 如果长度不足5颗星时，填补的是空白的星
                result.push(CLS_OFF);
            }
//            console.log(result);
            return result;
        }
      }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '../../common/stylus/min.styl'
    .star
        font-size:0
        .star-item
            display:inline-block
            background-repeat:no-repeat
        &.star-48
            .star-item
                width:20px
                height:20px
                margin-right:22px
                background-size:20px 20px
                &:last-child
                    margin-right:0
                &.on
                    bg-image("star48_on")
                &.half
                   bg-image("star48_half")
                &.off
                   bg-image("star48_off")

        &.star-36
            .star-item
                width:15px
                height:15px
                margin-right:6px
                background-size:15px 15px
                &:last-child
                    margin-right:0
                &.on
                    bg-image("star36_on")
                &.half
                   bg-image("star36_half")
                &.off
                   bg-image("star36_off")

        &.star-24
            .star-item
                width:10px
                height:10px
                margin-right:3px
                background-size:10px 10px
                &:last-child
                    margin-right:0
                &.on
                    bg-image("star24_on")
                &.half
                   bg-image("star24_half")
                &.off
                   bg-image("star24_off")

</style>
