<script setup lang="ts">
  import * as utils from '../modules/utils';
  import styles from '../style.module.css';

  const props = defineProps<{ word: utils.Word }>();
</script>
<template>
  <div>
    <div :class="[styles.wordWrap]">
      <div>{{ props.word.word }}</div>
    </div>
  </div>
</template>
