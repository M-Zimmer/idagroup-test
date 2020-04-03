<template>
  <div class='app-table-root'>
    <AppTableControls
      class="app-table-controls"
      :count="this.productData.length"
      :selectedColumns="this.selectedColumns"
      :selectedPagination="this.selectedPagination"
      :selectedIds="this.selectedIds"
      :sortBy="this.sortBy"
      :totalPages="this.totalPages"
      :currentPage="this.currentPage"
      :onSortByChange="this.onSortByChange"
      :onDelete="this.onDeleteMultiple"
      :onPaginationChange="this.onPaginationChange"
      :onPageChange="this.onPageChange"
      :onSelectedColumnsChange="this.onSelectedColumnsChange"
      :onToggleModal="this.onToggleModal"/>
    <AppTableGrid
      class="app-table-grid" 
      :data="this.currentData"
      :selectedIds="this.selectedIds"
      :sortBy="this.sortBy"
      :columns="this.selectedColumns"
      :onDeleteItem="this.onDeleteSingle"
      :onReverseSortToggle="this.onReverseSortToggle"
      :onSelectAllToggle="this.onSelectAllToggle"
      :onSelectItemToggle="this.onSelectItemToggle"
      :onToggleModal="this.onToggleModal"/>
    <div v-if="productDataStatus === productDataStatusTypes.ERROR">
      Unable to retrieve product data, please refresh the page to try again.
    </div>
    <div 
      class="app-table-modal"
      v-if="modal"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import AppTableControls, { columns, pagination } from './AppTableControls.vue'
import AppTableGrid from './AppTableGrid.vue'
import { productDataStatusTypes } from '../store/mutation-types'

export default {
  name: 'AppTable',
  components: {
    AppTableControls,
    AppTableGrid
  },
  data() {
    return {
      sortBy: columns[0],
      sortReversed: false,
      currentPage: 0,
      selectedPagination: pagination[0],
      selectedColumns: columns.slice(),
      selectedIds: [],
      productDataStatusTypes
    }
  },
  computed: { 
    ...mapState([
      'productData',
      'productDataStatus',
      'modal'
    ]),
    totalPages () {
      const { productData = [] } = this;
      return Math.ceil(productData.length / this.selectedPagination);
    },
    sortedData () {
      const targetProperty = this.sortBy.propertyName;
      let sorted = this.productData.slice();
      sorted.sort(sortByProperty(targetProperty));
      if (this.sortReversed)
        sorted = sorted.reverse();
      return sorted;
    },
    currentData () {
      const { selectedPagination, currentPage, sortedData } = this;
      const offset = currentPage * selectedPagination;
      return sortedData.slice(offset, offset + selectedPagination);
    }
  },
  methods: {
    onReverseSortToggle () {
      this.sortReversed = !this.sortReversed;
    },
    onSelectItemToggle (newId, flag) {
      if (flag) {
        this.selectedIds.push(newId);
      }
      else {
        const index = this.selectedIds.findIndex((curId) => curId === newId);
        this.selectedIds.splice(index, 1);
      }
    },
    onSelectAllToggle (flag) {
      // if the select all checkbox is checked, push the ids from currentData
      // but only if they haven't been pushed before;
      // otherwise filter out any ids from currentData that have been selected before
      if (flag) {
        this.currentData.forEach((row) => {
          if (!this.selectedIds.find((id) => id === row.id)) {
            this.selectedIds = [...this.selectedIds, row.id];
          }
        })
      }
      else this.selectedIds = this.selectedIds.filter((id) => !this.currentData.find((product) => product.id === id) ? true : false)
    },
    onSortByChange (column) {
      this.sortBy = column;
      this.selectedIds = [];
    },
    async onDeleteMultiple () {
      try{
        await this.deleteProducts(this.selectedIds);
        if (this.currentPage > this.totalPages - 1)
          this.currentPage = this.totalPages - 1;
        this.selectedIds = [];
      }
      catch (error) {
        alert(JSON.stringify(`Unable to delete items, please try again. Error - ${error.error}`));
        console.error(error)
      }
    },
    async onDeleteSingle (id) {
      try{
        await this.deleteProducts([id]);
        if (this.currentPage > this.totalPages - 1)
          this.currentPage = this.totalPages - 1;
        this.selectedIds = this.selectedIds.filter((sel) => sel !== id);
      }
      catch (error) {
        alert(JSON.stringify(`Unable to delete item, please try again. Error - ${error.error}`));
        console.error(error)
      }
    },
    onPaginationChange (pagination) {
      this.selectedPagination = Number(pagination);
      // adjust selectedIds to only fit the new pagination range
      // after the DOM update;
      // also make sure to set currentPage to the last page
      // if the number of pages has decreased
      // and currentPage is out of range
      Vue.nextTick(() => {
        this.selectedIds = this.selectedIds.filter(
          (id) => this.currentData.findIndex((product) => product.id === id) !== -1
        )
        if (this.currentPage > this.totalPages - 1)
          this.currentPage = this.totalPages - 1;
      })
    },
    onPageChange (page) {
      this.currentPage = page;
    },
    onSelectedColumnsChange (columns) {
      this.selectedColumns = columns;
    },
    onToggleModal () {
      this.toggleModal();
    },
    ...mapActions([
      'loadProducts',
      'deleteProducts',
      'toggleModal'
    ]),
  },
  created() {
    this.loadProducts();
  }
}

const sortByProperty = (prop) => {
  return (a, b) => {
    if (a[prop] < b[prop]) return -1
    else if (a[prop] > b[prop]) return 1;
    else return 0;
  }
}

</script>

<style scoped>
.app-table-root {
  position: relative;
  min-width: 610px;
}
.app-table-controls {
  width: 100%;
}
.app-table-grid {
  width: 100%;
  min-width: 450px;
  z-index: 9997;
}
.app-table-modal {
  background-color: rgba(0, 0, 0, 0.1);
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 9998;
}
@media only screen and (max-width: 1420px) {
  .app-table-root {
    min-width: 660px;
  }
}
@media only screen and (max-width: 830px) {
  .app-table-root {
    overflow-x: hidden;
  }
}
</style>
