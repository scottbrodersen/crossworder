<script setup lang="ts">
  import * as utils from '../modules/utils';
  import { QBtn } from 'quasar';

  const props = defineProps<{ content: string }>();

  const saveFileToFileSystem = async () => {
    try {
      const fileBlob = new Blob([props.content], { type: 'text/plain' });

      // Show the save file picker
      const handle = await window.showSaveFilePicker({
        suggestedName: utils.state.fileName,
        types: [
          {
            description: 'Text File',
            accept: { 'text/plain': ['.txt'] },
          },
        ],
      });

      // write the contents
      const writable = await handle.createWritable();
      await writable.write(fileBlob);
      await writable.close();
      console.log('File saved successfully!');

      const file = await handle.getFile();
      utils.state.fileName = file.name;
    } catch (err) {
      console.error('Error saving file:', err);
    }
  };
</script>
<template>
  <div><q-btn label="Save" @click="() => saveFileToFileSystem()" /></div>
</template>
