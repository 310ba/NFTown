export default {
  // 为当前模块开启命名空间
  namespaced: true,

  // 模块的 state 数据
  state: () => ({
    // 每个商品的信息对象，都包含如下 6 个属性：
    // {NFT_id,NFT_name,NFT_price,NFT_count,NFT_small_logo,NFT_state }
    star: JSON.parse(uni.getStorageSync('star') || '[]')
  }),

  // 模块的 mutations 方法
  mutations: {
    addStar(state, nft) {
      // 根据提交的商品的Id，查询购物车中是否存在这件商品
      // 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
      const findResult = state.star.find((x) => x._id === nft._id)

      if (!findResult) {
        // 如果购物车中没有这件商品，则直接 push
        state.star.push(nft)
      } else {
        uni.showToast({
          title: '已经加入喜欢清单啦',
          icon: "none"
        });
      }
      this.commit('m_star/saveToStorage')
    },
    // 根据 Id 从购物车中删除对应的商品信息
    removeStarById(state, nft_id) {
      // 调用数组的 filter 方法进行过滤
      state.star = state.star.filter(x => x._id !== nft_id)
      // 持久化存储到本地
      this.commit('m_star/saveToStorage')
    },
    saveToStorage(state) {
      uni.setStorageSync('star', JSON.stringify(state.star))
    }
  },

  // 模块的 getters 属性
  getters: {},
}
