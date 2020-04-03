<template>
    <table class='app-table-grid-root'>
      <thead class="app-table-grid-head">
        <tr>
          <td class='app-table-grid-checkbox-cell'>
            <input 
              type="checkbox"
              v-on:change="onSelectAllToggle($event.target.checked)"
              v-bind:checked="
                data.length && data.every(
                  (product) => selectedIds.findIndex((id) => product.id === id) !== -1
                )
              "
            />
          </td>
          <td
            v-for="col of columns" 
            v-bind:key="col.propertyName">
            <button
              v-bind:class=
                "[sortBy.propertyName === col.propertyName ? 'app-table-grid-button-sorted-by' : '', 
                'app-table-grid-button']"
              v-bind:disabled="sortBy.propertyName !== col.propertyName"
              v-on:click="onReverseSortToggle(); reversed = !reversed;"  
            >
              <span>{{ col.displayName }}</span>
              <span
                class='app-table-grid-button-arrow'
                v-if="sortBy.propertyName === col.propertyName"
              >
                {{ reversed ? ' \u2193' : ' \u2191' }}
              </span>
            </button>
          </td>
        </tr>
      </thead>
      <tbody class='app-table-grid-body'>
        <tr 
          v-for="product of data" 
          v-bind:key="product.id"
        >
          <td class='app-table-grid-checkbox-cell'>
            <input 
              type="checkbox"
              v-on:change="onSelectItemToggle(product.id, $event.target.checked)"
              v-bind:checked="selectedIds.find((val) => val === product.id) ? true : false"
            />
          </td>
          <td 
            v-for="col of columns" 
            v-bind:key="product.id + col.propertyName">
            {{ product[col.propertyName] }}
            <span
              class='app-table-grid-delete-item'
              v-if="col.propertyName === columns[columns.length - 1].propertyName"
              v-on:click="onDeleteClicked(product.id)"
            >{{'\u00D7 delete'}}
            </span>
            <AppTableConfirmDelete
              v-if="col.propertyName === columns[columns.length - 1].propertyName && product.id === pendingDeletionId"
              v-bind:count="1"
              v-bind:onConfirm="onConfirm"
              v-bind:onCancel="onCancel"
            />
          </td>
        </tr>
      </tbody>
    </table>
</template>

<script>
import AppTableConfirmDelete from './AppTableConfirmDelete'

export default {
  name: 'AppTableGrid',
  components: {
    AppTableConfirmDelete
  },
  data() {
    return {
      reversed: false,
      pendingDeletionId: null
    }
  },
  props: {
    data: Array,
    selectedIds: Array,
    columns: Array,
    sortBy: Object,
    onReverseSortToggle: Function,
    onSelectItemToggle: Function,
    onSelectAllToggle: Function,
    onDeleteItem: Function,
    onToggleModal: Function,
  },
  methods: {
    onDeleteClicked(id) {
      this.pendingDeletionId = id;
      this.onToggleModal();
    },
    onConfirm() {
      this.onDeleteItem(this.pendingDeletionId);
      this.pendingDeletionId = null;
      this.onToggleModal();
    },
    onCancel() {
      this.pendingDeletionId = null;
      this.onToggleModal();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
td {
  position: relative;
  max-width: 75px;
  font-size: 0.9em;
}

@media only screen and (max-width: 1080px) {
  td {
    max-width: initial;
  }
}

.app-table-grid-root {
  background-color: transparent;
  border-spacing: 0;
}

.app-table-grid-button {
  background: transparent;
  margin: 0;
  padding: 0;
  box-shadow: 0px 0px 0px transparent;
  border: 0px solid transparent;
  text-shadow: 0px 0px 0px transparent;
  font-size: 1em;
  font-weight: bold;
  color: black;
}

.app-table-grid-button-arrow {
  color: black;
  font-size: 1.6em;
}

.app-table-grid-button-sorted-by {
  color: rgb(0, 201, 0);
}

.app-table-grid-button-sorted-by:hover {
  cursor: pointer;
}

.app-table-grid-head tr {
  background-color: white;
}

.app-table-grid-head td, .app-table-grid-body td{
  padding: 16px;
}

.app-table-grid-head td {
  box-sizing: border-box;
  padding-top: 18px;
  border-bottom: 2px solid rgb(248, 248, 248);
}

.app-table-grid-body tr:nth-child(even) {
  background-color:rgb(248, 248, 248)
}

.app-table-grid-body tr:nth-child(odd) {
  background-color:white
}

.app-table-grid-body tr td:last-child {
  position: relative;
  padding-right: 150px;
}

.app-table-grid-body tr:hover {
  background-color:rgba(94, 255, 156, 0.075)
}

.app-table-grid-checkbox-cell {
  text-align: center;
}

.app-table-grid-delete-item {
  cursor: pointer;
  font-size: 1.25em;
  color: rgba(0, 0, 0, 0.5);
  display: none;
  position: absolute;
  right: 0;
  margin-right: 32px;
  padding: 0 16px;
}

.app-table-grid-body tr:hover .app-table-grid-delete-item{
  display: initial;
}

@media only screen and (max-width: 830px) {
  td {
    font-size: 0.7em;
  }

  .app-table-grid-button {
    font-size: 0.8em;
  }

  .app-table-grid-button-arrow {
    font-size: 1.2em;
  }
}
</style>
