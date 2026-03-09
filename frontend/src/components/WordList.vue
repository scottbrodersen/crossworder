<script setup lang="ts">
  import { QInput } from 'quasar';
  import * as utils from '../modules/utils';
  import styles from '../style.module.css';
  import Word from './Word.vue';

  const props = defineProps<{
    wordList: Array<utils.Word>;
    clueList: utils.Clues;
  }>();
</script>
<template>
  <div>
    <div :class="[styles.clueListWrap]">
      <div
        v-for="(word, key) in wordList"
        :key="key"
        :class="[styles.clueListItem]"
      >
        <div :class="[styles.clueNumber]">{{ word.number }}</div>

        <div :class="[styles.clue]">
          <q-input
            v-model="props.clueList[word.number]"
            borderless
            dense
            autogrow
          />
        </div>
        <div>
          <word :word="word" />
        </div>
      </div>
    </div>
  </div>
</template>
