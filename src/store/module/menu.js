export default {
    state: {
      shopId:''
    },
    mutations: {
      setShopID (state, shopId) {
        state.shopId = shopId
      },
    },
    getters: {
      shopId: state => state.shopId,
    },
    actions: {
      
    }
  }
  