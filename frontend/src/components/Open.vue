<script setup lang="ts">
  import { QFile } from 'quasar';
  import { ref } from 'vue';

  const emits = defineEmits(['fileLoad']);
  const file = ref();

  const content = ref<string | ArrayBuffer | null>('');

  const read = () => {
    const reader = new FileReader();
    reader.onload = () => {
      content.value = reader.result;
      emits('fileLoad', content.value);
    };
    reader.onerror = () => {
      console.log('Error reading the file. Please try again.', 'error');
    };
    reader.readAsText(file.value);
  };
</script>
<template>
  <div>
    <q-file
      v-model="file"
      label="Open"
      :multiple="false"
      filled
      dense
      style="max-width: 300px"
      accept=".txt"
      @update:model-value="() => read()"
    />
  </div>
</template>
