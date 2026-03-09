<script setup lang="ts">
  import styles from '../style.module.css';
  import Grid from './Grid.vue';
</script>

<template>
  <div :class="[styles.title]">Crossworder</div>
  <div><Grid :dimension="15" /></div>
</template>
