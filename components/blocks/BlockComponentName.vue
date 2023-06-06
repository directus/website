<script setup lang='ts'>
type Block = {
  id: string

}
const props = defineProps({
  data: {
    type: Object as PropType<Block>,
    required: true,
  },
})
</script>
<template>
<div>
</div>
</template>
