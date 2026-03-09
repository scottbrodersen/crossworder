<script setup lang="ts">
  import { ref, watch } from 'vue';
  import * as utils from '../modules/utils';
  import { QInput } from 'quasar';
  import styles from '../style.module.css';

  const props = defineProps<{ readOnly: boolean; id: utils.Identification }>();
  const emits = defineEmits(['update']);

  const id = ref<utils.Identification>({
    name: props.id.name,
    street: props.id.street,
    city: props.id.city,
    email: props.id.email,
  });

  watch(
    () => {
      return props.id;
    },
    () => {
      id.value.name = props.id.name;
      id.value.street = props.id.street;
      id.value.city = props.id.city;
      id.value.email = props.id.email;
    },
    { deep: true },
  );

  watch(
    () => {
      return id.value;
    },
    () => {
      emits('update', id.value);
    },
    { deep: true },
  );
</script>
<template>
  <div>
    <div v-show="props.readOnly">
      <div>{{ id.name }}</div>
      <div>{{ id.street }}</div>
      <div>{{ id.city }}</div>
      <div>{{ id.email }}</div>
    </div>
    <div v-show="!props.readOnly">
      <div :class="[styles.idPart]">
        <div :class="[styles.idLabel]">Name:</div>
        <q-input v-model="id.name" dense borderless hide-bottom-space />
      </div>
      <div :class="[styles.idPart]">
        <div :class="[styles.idLabel]">Street:</div>
        <q-input v-model="id.street" dense borderless />
      </div>
      <div :class="[styles.idPart]">
        <div :class="[styles.idLabel]">City:</div>
        <q-input v-model="id.city" dense borderless />
      </div>

      <div :class="[styles.idPart]">
        <div :class="[styles.idLabel]">Email:</div>
        <q-input v-model="id.email" dense borderless />
      </div>
    </div>
  </div>
</template>
