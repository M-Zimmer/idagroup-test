<template>
  <div 
    class='app-table-controls-selector-root'
  >
    <div
      class='app-table-controls-selector-label'
      v-on:click='showOptions = !showOptions'>
      {{ labelFormat(selectedOptions) + ' \u02C5' }}
    </div>
    <div
      class='app-table-controls-selector-popup'
      v-bind:style="popupStyle"
      v-if='showOptions'
    >
      <div v-if="multiple">
        <input
          type="checkbox"
          name="selectall"
          v-on:change="toggleSelectionAll($event.target.checked)"
          v-bind:checked="
            options.every(
              (option) => selectedOptions.find((val) => option.propertyName === val.propertyName) ? true : false
            )"
        />
        <label for="selectall">Select All</label>
      </div>
      <div
        v-for="item of options"
        v-bind:key='item.propertyName'
        v-on:click="!multiple ? selectSingle(item) : null"
      >
        <input
          type="checkbox"
          v-if="multiple"
          v-bind:name="item.propertyName"
          v-on:change="toggleSelection(item, $event.target.checked)"
          v-bind:checked="
            selectedOptions.find(
              (option) => option.propertyName === item.propertyName
            ) ? true : false"
        />
        <label v-bind:for="item.propertyName">{{ item.displayName }}</label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppTableControlsSelector',
  data() {
    return {
      showOptions: false
    }
  },
  props: {
    popupStyle: String,
    multiple: Boolean,
    options: Array,
    selectedOptions: Array,
    onSelectedChange: Function,
    labelFormat: Function,
  },
  methods: {
    toggleSelectionAll(flag) {
      if (flag) {
        this.onSelectedChange(this.options);
      }
      else {
        this.onSelectedChange([]);
      }
    },
    toggleSelection(item, flag) {
      const newSelectedOptions = this.selectedOptions.slice();
      if (flag) {
        newSelectedOptions.push(item);
      }
      else {
        const index = this.selectedOptions.findIndex(
          (option) => option.propertyName === item.propertyName
        );
        newSelectedOptions.splice(index, 1);
      }
      this.onSelectedChange(newSelectedOptions);
    },
    selectSingle(item) {
      this.onSelectedChange([item]);
      this.showOptions = !this.showOptions;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.app-table-controls-selector-root {
  position: relative;
  background-color: whitesmoke;
  border: 2px solid rgba(219, 219, 219, 0.7);
  border-radius: 4px;
  cursor: default;
}

.app-table-controls-selector-label {
  box-sizing: border-box;
  padding: 7px 15px;
  font-size: 0.9em;
  color:rgba(84,84,84,0.95);
}

.app-table-controls-selector-popup {
  position: absolute;
  background-color: white;
  -webkit-box-shadow: 0px 5px 10px -1px rgba(168,168,168,0.75);
  -moz-box-shadow: 0px 5px 10px -1px rgba(168,168,168,0.75);
  box-shadow: 0px 5px 10px -1px rgba(168,168,168,0.75);
  border-radius: 4px;
  min-width: 200px;
  max-height: 250px;
  overflow-y: auto;
  top: 32px;
  z-index: 9999;
}

.app-table-controls-selector-popup * {
  padding: 8px;
  line-height: 1.5em;
}

.app-table-controls-selector-popup *:hover {
  background-color: rgb(231, 229, 229);
  cursor: pointer;
}

.app-table-controls-selector-popup-item label {
  padding-left: 8px;
}
</style>
