import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    /* User */
    userName: null,
    userAvatar: null,

    /* NavBar */
    isNavBarVisible: true,

    /* FooterBar */
    isFooterBarVisible: true,

    /* Aside */
    isAsideVisible: true,
    isAsideMobileExpanded: false,

    /* Dark mode */
    isDarkModeActive: false,

    couponTypes: [],
    stats: {
      unused: 420,
      claimed: 1337,
      balance: 69
    },
    isLoading: true
  },
  mutations: {
    /* A fit-them-all commit */
    basic(state, payload) {
      state[payload.key] = payload.value
    },

    /* User */
    user(state, payload) {
      if (payload.name) {
        state.userName = payload.name
      }
      if (payload.avatar) {
        state.userAvatar = payload.avatar
      }
      state.isLoading = false
    },

    /* Aside Mobile */
    asideMobileStateToggle(state, payload = null) {
      const htmlClassName = 'has-aside-mobile-expanded'

      let isShow

      if (payload !== null) {
        isShow = payload
      } else {
        isShow = !state.isAsideMobileExpanded
      }

      if (isShow) {
        document.documentElement.classList.add(htmlClassName)
      } else {
        document.documentElement.classList.remove(htmlClassName)
      }

      state.isAsideMobileExpanded = isShow
    },

    couponTypes(state, payload) {
      let toAdd = payload.length
      for (let i = 0; i < (4 - (toAdd % 4)) % 4; i++) payload.push({})
      state.couponTypes = payload
    },

    setLoading(state, payload = false) {
      state.isLoading = payload
    }
  },
  actions: {
    getUsername({ commit }) {
      axios()
    },
    getCouponTypes({ commit }) {
      axios('/couponTypes').then(({ data }) => {
        commit("couponTypes", data)
      }).catch(() => {
        $buefy.snackbar.open({
          message: "Unable to fetch Coupon Types",
          queue: false,
          type: 'is-danger'
        });
      })
    },
    async init({ commit }) {
      console.log(1)
      if (!localStorage.token) {
        commit('user', {
          name: null
        })
        return
      }
      axios.defaults.headers.common['Authorization'] = localStorage.token
      try {
        const { data } = await axios.get('/me')
        commit('user', data)
      } catch (err) {
        $buefy.snackbar.open({
          message: "Unable to fetch user!",
          queue: false,
          type: 'is-danger'
        });
      }
    }
  },
  modules: {
  }
})
