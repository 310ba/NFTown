<script>
  import uniIdPageInit from '@/uni_modules/uni-id-pages/init.js';
  export default {
    onLaunch: async function() {
      console.log('App Launch')
      await uniIdPageInit()
    },
    onShow: function() {
      console.log('App Show');
    },
    onHide: function() {
      console.log('App Hide')
    },
  }
</script>

<style lang="scss">
  @import  "uview-ui/index.scss";
  @import url("/static/font/stylesheet.css");
  /*每个页面公共css */
  page {
    background-color: #f5f5f5;
  }
</style>
