import { createHash } from 'node:crypto'
import type { Phase } from './learning.types.js'

export function parseRoadmap(trackId: string, markdown: string): Phase[] {
  const phases: Phase[] = []
  let current: Phase | undefined
  let fenced = false
  for (const line of markdown.split(/\r?\n/)) {
    if (line.startsWith('```')) fenced = !fenced
    if (fenced) {
      if (current) current.content += `${line}\n`
      continue
    }
    const heading = line.match(/^#{1,2}\s+(Phase\s+\d+\s*[—–-].+)$/i)
    if (heading) {
      current = {
        id: `${trackId}-phase-${phases.length + 1}`,
        title: heading[1]!,
        content: '',
        topics: [],
        checkpoint: false,
      }
      phases.push(current)
      continue
    }
    if (/^#\s+\d+\./.test(line)) current = undefined
    if (!current) continue
    current.content += `${line}\n`
    if (
      /^###\s+(Project Checkpoint|Integration Exercise|Architecture Review)/i.test(
        line,
      )
    )
      current.checkpoint = true
    const checkbox = line.match(/^\s*-\s+\[([ xX~])\]\s+(.+)$/)
    if (!checkbox) continue
    const title = checkbox[2]!.replace(/`/g, '')
    const occurrence = current.topics.filter(
      (topic) => topic.title === title,
    ).length
    const id = createHash('sha256')
      .update(`${trackId}\n${current.title}\n${title}\n${occurrence}`)
      .digest('hex')
      .slice(0, 20)
    current.topics.push({
      id,
      title,
      status:
        checkbox[1]?.toLowerCase() === 'x'
          ? 'completed'
          : checkbox[1] === '~'
            ? 'in-progress'
            : 'not-started',
    })
  }
  return phases
}
