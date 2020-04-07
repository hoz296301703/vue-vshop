<template>
    <div>
        <page/>
        <navigate />
    </div>
</template>

<script>
import navigate from '../components/footer/navigate.vue'// 底部标题栏
import page from './page/page.vue'// 首页

export default {
    components:{
        page,
        navigate
    }
}
</script>
<style>

</style>


