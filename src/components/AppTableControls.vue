<template>
  <div class='app-table-controls-root'>
    <div class='app-table-controls-sortby-group'>
      <b>Sorting by:</b>
      <button
        v-bind:class='[`app-table-controls-button`,
          col.propertyName === sortBy.propertyName ?
            `app-table-controls-button-active` : 
            `app-table-controls-button-inactive`
        ]'
        v-for="col of selectedColumns"
        v-bind:key="col.propertyName" 
        v-on:click="onSortByChange(col)"
      >
        {{ col.displayName }}
      </button>
    </div>
    <div class='app-table-controls-display-group'>
      <button
        class='
          app-table-controls-button 
          app-table-controls-button-active 
          app-table-controls-display-delete'
        v-on:click="onDeleteClicked"
        v-bind:disabled="!selectedIds.length"
      >
        {{ `Delete ${selectedIds.length > 0 ? `(${selectedIds.length})` : ''}` }}
      </button>
      <AppTableConfirmDelete
        class="app-table-controls-delete-popup"
        v-if="pendingDeletion"
        v-bind:count="selectedIds.length"
        v-bind:onConfirm="onConfirm"
        v-bind:onCancel="onCancel"
      />
      <AppTableControlsSelector
        popupStyle="min-width: 20px"
        v-bind:multiple="false"
        v-bind:options="pagination"
        v-bind:selectedOptions="[{displayName: selectedPagination, propertyName: selectedPagination}]"
        v-bind:onSelectedChange="handlePaginationChange"
        v-bind:labelFormat="selectPaginationLabel"
      />
      <button
        class='app-table-controls-button app-table-controls-display-page-change'
        v-on:click="onPageChange(currentPage - 1)"
        v-bind:disabled="currentPage <= 0"
      >
        {{ '\u02C2' }}
      </button>
      <span 
        class="app-table-controls-display-item-count"
        v-if="count">
        <b>{{ `${offset + 1}-${(offset + selectedPagination) > count ? count : offset + selectedPagination}` }}</b>
        <span>of</span>
        <b>{{ `${count}` }}</b>
      </span>
      <span v-if="!count">
        N/A
      </span>
      <button
        class='app-table-controls-button app-table-controls-display-page-change'
        v-on:click="onPageChange(currentPage + 1)"
        v-bind:disabled="currentPage >= totalPages - 1"
      >
        {{ '\u02C3' }}
      </button>
      <AppTableControlsSelector
        v-bind:multiple="true"
        v-bind:options="columns"
        v-bind:selectedOptions="selectedColumns"
        v-bind:onSelectedChange="onSelectedColumnsChange"
        v-bind:labelFormat="selectColumnLabel"
      />
    </div>
  </div>
</template>

<script>
import AppTableControlsSelector from './AppTableControlsSelector'
import AppTableConfirmDelete from './AppTableConfirmDelete'

export const columns = [
  {
    displayName: 'Product(100g serving)',
    propertyName: 'product'
  },
  {
    displayName: 'Calories',
    propertyName: 'calories'
  },
  {
    displayName: 'Fat (g)',
    propertyName: 'fat'
  },
  {
    displayName: 'Carbs (g)',
    propertyName: 'carbs'
  },
  {
    displayName: 'Protein (g)',
    propertyName: 'protein'
  },
  {
    displayName: 'Iron (%)',
    propertyName: 'iron'
  }
]

export const pagination = [10, 15, 20]

export default {
  name: 'AppTableControls',
  components: {
    AppTableControlsSelector,
    AppTableConfirmDelete
  },
  data() {
    return {
      pagination: pagination.map((p) => {return {displayName: p, propertyName: p}}),
      columns,
      pendingDeletion: false
    }
  },
  props: {
    count: Number,
    selectedColumns: Array,
    selectedPagination: Number,
    selectedIds: Array,
    sortBy: Object,
    totalPages: Number,
    currentPage: Number,
    onSortByChange: Function,
    onDelete: Function,
    onPaginationChange: Function,
    onPageChange: Function,
    onSelectedColumnsChange: Function,
    onToggleModal: Function,
  },
  computed: {
    offset() {
      return this.currentPage * this.selectedPagination;
    }
  },
  methods: {
    selectColumnLabel(selection) {
      const columnFormat = selection.length !== 1 ? 'columns' : 'column'
      return `${selection.length} ${columnFormat} selected`;
    },
    selectPaginationLabel(selection) {
      const pagination = selection[0];
      return `${pagination.displayName} per page`
    },
    handlePaginationChange(selection) {
      this.onPaginationChange(selection[0].propertyName);
    },
    onDeleteClicked() {
      this.pendingDeletion = true;
      this.onToggleModal();
    },
    onConfirm() {
      this.onDelete();
      this.pendingDeletion = false;
      this.onToggleModal();
    },
    onCancel() {
      this.pendingDeletion = false
      this.onToggleModal();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.app-table-controls-root {
  display: flex;
  padding: 16px 0;
}

.app-table-controls-sortby-group {
  flex: 1;
  display: flex;
  align-items: center;
}

.app-table-controls-display-group {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
}

.app-table-controls-sortby-group *:first-child {
  margin: 0px 4px 0px 0px;
  font-size: 0.95em;
  padding-left: 0;
  text-align: start;
}

.app-table-controls-sortby-group * {
  margin: 0px 0px;
  padding: 8px;
}

.app-table-controls-button {
  box-sizing: border-box;
  padding: 8px 8px;
  border-radius: 4px;
  box-shadow: 0px 0px 0px transparent;
  border: 2px solid transparent;
  text-shadow: 0px 0px 0px transparent;
}

.app-table-controls-button-active {
  background-color: rgb(43, 175, 10);
  color: rgba(255,255,255,0.8);
  cursor: default;
}

.app-table-controls-button-inactive {
  background-color: transparent;
}

.app-table-controls-button-inactive:hover {
  background-color: transparent;
  border: 2px solid rgba(43, 175, 10, 0.3);
  cursor: pointer;
}

.app-table-controls-display-group * {
  margin: 0px 8px;
}

.app-table-controls-display-group *:first-child {
  margin: 0px 8px 0px 0px;
}

.app-table-controls-display-group *:last-child {
  margin: 0px 0px 0px 8px;
}

.app-table-controls-display-item-count {
  margin: 0;
  padding: 0;
  font-size: 0.9em;
}

.app-table-controls-display-item-count *{
  margin: 0;
  padding: 0;
}

.app-table-controls-display-page-change {
  border: 2px solid rgba(219, 219, 219, 0.7);
  padding: 8px 0;
  min-width: 36px;
  text-align: center;
  cursor: pointer;
}

.app-table-controls-display-page-change[disabled] {
  background-color: transparent;
  border: 2px solid rgba(219, 219, 219, 0.2);
  color: rgba(0,0,0,0.1);
  cursor: default;
}

.app-table-controls-display-delete {
  padding: 8px 16px;
  min-width: 36px;
  text-align: center;
  cursor: pointer;
}

.app-table-controls-display-delete[disabled] {
  background-color: transparent;
  border: 2px solid rgba(219, 219, 219, 0.2);
  color: rgba(0,0,0,0.1);
  cursor: default;
}

.app-table-controls-delete-popup {
  left: 0; right:unset;
}

@media only screen and (max-width: 1420px) {
  .app-table-controls-root {
    flex-direction: column;
  }
  .app-table-controls-sortby-group {
    justify-content: center;
    margin-bottom: 8px;
  }
  .app-table-controls-display-group {
    justify-content: center;
    margin-top: 8px;
  }
}

@media only screen and (max-width: 830px) {
  .app-table-controls-root {
    flex-direction: row;
  }

  .app-table-controls-sortby-group {
    flex-direction: column;
  }

  .app-table-controls-display-group {
    flex-direction: column;
  }

  .app-table-controls-display-group *:first-child {
    margin: 0 0 4px 0;
  }

  .app-table-controls-display-group *{
    margin: 4px 0 4px 0;
  }

  .app-table-controls-display-group *:last-child {
    margin: 4px 0 0 0;
  }

  .app-table-controls-display-item-count *{
    padding: 4px;
  }
}
</style>
