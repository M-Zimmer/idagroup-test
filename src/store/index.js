import Vue from 'vue'
import Vuex from 'vuex'
import { 
  SET_PRODUCTS, 
  DELETE_PRODUCTS, 
  SET_PRODUCT_DATA_STATUS,
  TOGGLE_MODAL,
  productDataStatusTypes } from './mutation-types'
import { getProducts, deleteProducts } from '../utils/request'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    productData: [],
    productDataStatus: productDataStatusTypes.UNKNOWN,
    modal: false
  },
  mutations: {
    [SET_PRODUCTS] (state, products) {
      state.productData = [...products];
    },
    [DELETE_PRODUCTS] (state, ids) {
      state.productData = state.productData.filter(
        (product) => 
          ids.findIndex((id) => id === product.id) === -1
      )
    },
    [SET_PRODUCT_DATA_STATUS] (state, status) {
      state.productDataStatus = status;
    },
    [TOGGLE_MODAL] (state) {
      state.modal = !state.modal;
    }
  },
  actions: {
    async loadProducts ({ commit }) {
      try {
        commit(SET_PRODUCT_DATA_STATUS, productDataStatusTypes.LOADING)
        commit(SET_PRODUCTS, await getProducts());
        commit(SET_PRODUCT_DATA_STATUS, productDataStatusTypes.LOADED)
      }
      catch (error) {
        console.error(error);
        commit(SET_PRODUCT_DATA_STATUS, productDataStatusTypes.ERROR)
      }
    },
    async deleteProducts ({ commit }, ids) {
      await deleteProducts();
      commit(DELETE_PRODUCTS, ids)
    },
    toggleModal ({ commit }) {
      commit(TOGGLE_MODAL);
    }
  },
  modules: {
  }
})
