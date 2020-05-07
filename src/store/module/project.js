export default {
    state: {
      id:'',
    },
    mutations: {
      setProjectId (state, id) {
        state.id = id
      },
    },
    getters: {
      project_id: state => state.id,
    },
    actions: {
      
    }
  }
  