<script setup lang="ts">
  import * as utils from '../modules/utils';
  import { QInput } from 'quasar';
  import { onBeforeMount, ref, watch } from 'vue';

  const props = defineProps<{ cell: utils.Cell; row: number; col: number }>();
  const emits = defineEmits(['updated', 'clicked']);

  const cell = ref<utils.Cell>(new utils.Cell());
  cell.value.value = props.cell.value;

  const label = ref<string>('');
  const bgColour = ref<string>('');

  const init = () => {
    bgColour.value = cell.value.value == '#' ? 'black' : '';
  };

  const setLabel = (num: number) => {
    label.value = num > 0 ? String(num) : '';
  };

  const updateValue = (val: string) => {
    cell.value.value = val;
    bgColour.value = cell.value.value == '#' ? 'black' : '';

    emits('updated', val);
  };
  watch(
    () => {
      return props.cell.value;
    },
    () => {
      cell.value.value = props.cell.value;
    },
  );
  watch(
    () => {
      return props.cell.number;
    },
    () => {
      setLabel(props.cell.number);
    },
    { deep: true },
  );
  watch(
    () => {
      return utils.state.row;
    },
    () => {
      init();
    },
  );
  watch(
    () => {
      return utils.state.column;
    },
    () => {
      init();
    },
  );

  const setCurrentCell = () => {
    utils.state.row = props.row;
    utils.state.column = props.col;
    // trigger word selection
    emits('clicked', props.row, props.col);
  };

  const emitClicked = () => {
    if (
      props.row == utils.state.clickedRow &&
      props.col == utils.state.clickedColumn
    ) {
      toggleDirection();
    } else {
      utils.state.clickedRow = props.row;
      utils.state.clickedColumn = props.col;
    }
    emits('clicked', props.row, props.col);
  };
  const toggleDirection = () => {
    if (props.row == utils.state.row && props.col == utils.state.column) {
      utils.toggleDirection();
      emits('clicked', props.row, props.col);
    }
  };

  onBeforeMount(() => {
    setLabel(props.cell.number);
    init();
  });
</script>
<template>
  <div>
    <q-input
      v-model="cell.value"
      mask="A"
      :mask-tokens="{
        A: {
          pattern: '[a-zA-Z#]',
          negate: '[^a-zA-Z#]',
          transform: (v) => v.toLocaleUpperCase(),
        },
      }"
      :label="label"
      stack-label
      label-color="black"
      dense
      square
      outlined
      :bg-color="bgColour"
      @update:model-value="(value) => updateValue(value as string)"
      @focus.stop="setCurrentCell()"
      @keyup.enter="toggleDirection()"
      @click="emitClicked()"
    />
  </div>
</template>
