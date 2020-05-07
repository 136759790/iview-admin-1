export default {
    state: {
      tenant_id:'',
    },
    mutations: {
      setTenantId (state, tenant_id) {
        state.tenant_id = tenant_id
      },
    },
    getters: {
      tenant_id: state => state.tenant_id,
    },
    actions: {
      
    }
  }
  