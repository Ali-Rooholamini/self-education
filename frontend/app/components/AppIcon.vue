<script setup lang="ts">
const props = defineProps<{ name: string }>()

const paths: Record<string, string[]> = {
  book: [
    'M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H4z',
    'M13 7a3 3 0 0 1 3-3h5v14h-4a4 4 0 0 0-4 3',
  ],
  grid: ['M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z'],
  route: [
    'M7 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM17 23a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    'M7 7v3a3 3 0 0 0 3 3h4a3 3 0 0 1 3 3v1',
  ],
  note: ['M14 3H5v18h14V8z', 'M14 3v5h5M8 12h8M8 16h5'],
  arrow: ['M19 12H5m6-6-6 6 6 6'],
  chevron: ['m14 7-5 5 5 5'],
  check: ['m5 12 4 4L19 6'],
  code: ['m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18'],
  sparkle: ['m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z'],
  clock: ['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z', 'M12 7v5l3 2'],
  server: ['M4 4h16v6H4zM4 14h16v6H4z', 'M7 7h.01M7 17h.01M11 7h6M11 17h6'],
  leaf: ['M20 3C8 2 3 7 5 14s14 6 15-11Z', 'M4 21c0-7 5-10 10-13'],
}
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="(path, index) in paths[props.name]" :key="index" :d="path" />
  </svg>
</template>
