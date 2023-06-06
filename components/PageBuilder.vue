<script setup lang="ts">
import { Page } from '~~/types'

// Map the page builder collection names to the components
// https://nuxt.com/docs/guide/directory-structure/components#dynamic-components
const map = {
  block_name: resolveComponent('BlockComponentName'),

}

const props = defineProps<{
  page: Page
}>()
</script>
<template>
  <div class="mx-auto" id="content">
    <template v-for="(block, blockIdx) in page.blocks" :key="blockIdx">
      <component :is="map[block.collection]" :data="block.item" />
    </template>
  </div>
</template>
