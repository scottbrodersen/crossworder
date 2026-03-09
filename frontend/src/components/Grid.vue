<script setup lang="ts">
  import * as utils from '../modules/utils';
  import { ref } from 'vue';
  import { QBtn } from 'quasar';
  import Cell from './Cell.vue';
  import styles from '../style.module.css';
  import Open from './Open.vue';
  import Save from './Save.vue';
  import WordList from './WordList.vue';
  import Identification from './Identification.vue';

  const props = defineProps<{ dimension: number }>();
  utils.state.dimension = props.dimension;

  const grid = ref<utils.Grid>(new utils.Grid(props.dimension));

  const onCellUpdate = (val: string, row: number, col: number) => {
    grid.value.grid[row][col].value = val;
    grid.value.generateNumbers();
  };

  const importFileContent = (content: string) => {
    grid.value.importText(content);
    grid.value.generateNumbers();
  };

  const generateLists = () => {
    grid.value.generateAcrossWords();
    grid.value.generateAcrossClues();
    grid.value.generateDownWords();
    grid.value.generateDownClues();
  };

  const updateID = (id: utils.Identification) => {
    grid.value.id.name = id.name;
    grid.value.id.street = id.street;
    grid.value.id.city = id.city;
    grid.value.id.email = id.email;
  };
</script>
<template>
  <div>
    <div :class="[styles.buttonList]">
      <div><Open @fileLoad="(content) => importFileContent(content)" /></div>
      <div><Save :content="grid.exportText()" /></div>
      <div>
        <q-btn label="generate Clue List" @click="generateLists()" />
      </div>
    </div>
    <div :class="[styles.identification]">
      <Identification
        :readOnly="false"
        :id="grid.id"
        @update="
          (id) => {
            updateID(id);
          }
        "
      />
    </div>
    <div :class="[styles.gridWrap]">
      <div
        v-for="(row, rowindex) in grid.grid"
        :key="rowindex"
        :class="[styles.gridRow]"
      >
        <Cell
          v-for="(col, colindex) in row"
          :key="colindex"
          :cell="col"
          :row="rowindex"
          :col="colindex"
          @updated="(value) => onCellUpdate(value, rowindex, colindex)"
          :class="[styles.gridCell]"
          :id="`${rowindex}${colindex}`"
        />
      </div>
    </div>

    <div>
      <div :class="[styles.listTitle]">ACROSS</div>
      <WordList :word-list="grid.acrossList" :clue-list="grid.acrossClues" />
      <div :class="[styles.listTitle]">DOWN</div>
      <WordList :word-list="grid.downList" :clue-list="grid.downClues" />
    </div>
  </div>
</template>
