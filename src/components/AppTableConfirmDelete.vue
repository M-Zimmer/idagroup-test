<template>
  <div class='app-table-confirm-delete-root'>
    <div>Are you sure you want to <b>{{ `delete ${count !== 1 ? count + ' items?' : 'this item?'}` }}</b></div>
    <div class="app-table-confirm-delete-button-group">
      <button
        class='app-table-confirm-delete-button-cancel'
        v-on:click="onCancel"
      >
        Cancel
      </button>
      <button
        class='app-table-confirm-delete-button-confirm'
        v-on:click="onConfirm"
      >
        Confirm
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppTableConfirmDelete',
  props: {
    count: Number,
    onConfirm: Function,
    onCancel: Function
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.app-table-confirm-delete-root {
  position: absolute;
  background-color: white;
  -webkit-box-shadow: 0px 5px 10px -1px rgba(168,168,168,0.75);
  -moz-box-shadow: 0px 5px 10px -1px rgba(168,168,168,0.75);
  box-shadow: 0px 5px 10px -1px rgba(168,168,168,0.75);
  border-radius: 4px;
  right: 0;
  top: 48px;
  padding: 16px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
}

.app-table-confirm-delete-button-group {
  display: flex;
  width: 100%;
  margin-top: 12px;
  justify-content: center;
}

.app-table-confirm-delete-button-group *{
  margin: 0 8px;
  box-sizing: border-box;
  padding: 8px 16px;
  border-radius: 4px;
  box-shadow: 0px 0px 0px transparent;
  text-shadow: 0px 0px 0px transparent;
  border: 2px solid transparent;
}

.app-table-confirm-delete-button-cancel {
  border: 2px solid rgba(219, 219, 219, 0.7);
  background-color: transparent;
  color: rgba(0, 0, 0, 0.6);
}

.app-table-confirm-delete-button-confirm {
  border: 2px solid transparent;
  background-color: rgb(43, 175, 10);
  color: rgba(255, 255, 255, 0.8);
}
</style>
