<script setup lang="ts">
const props = defineProps<{ text: string }>()
const blocks = computed(() => {
  const blocks: { code: boolean; language: string; text: string }[] = []
  const pattern = /```([\w+-]*)\n([\s\S]*?)```/g
  let start = 0
  for (const match of props.text.matchAll(pattern)) {
    if (match.index! > start)
      blocks.push({
        code: false,
        language: '',
        text: props.text.slice(start, match.index),
      })
    blocks.push({ code: true, language: match[1] ?? '', text: match[2] ?? '' })
    start = match.index! + match[0].length
  }
  if (start < props.text.length)
    blocks.push({ code: false, language: '', text: props.text.slice(start) })
  return blocks
})
</script>

<template>
  <div class="learning-markdown">
    <template v-for="(block, index) in blocks" :key="index">
      <div v-if="block.code" class="message-code">
        <span v-if="block.language" dir="ltr">{{ block.language }}</span>
        <pre
          dir="ltr"
          tabindex="0"
          aria-label="نمونه کد"
        ><code>{{ block.text }}</code></pre>
      </div>
      <p v-else dir="auto" class="markdown-prose">{{ block.text }}</p>
    </template>
  </div>
</template>
