export type TopicStatus = 'not-started' | 'in-progress' | 'completed'
export const stages = [
  'concept',
  'mental-model',
  'comparison',
  'example',
  'exercise',
  'review',
  'interview',
  'confirmation',
] as const
export type Stage = (typeof stages)[number]
export const completionChecks = [
  'explain',
  'apply',
  'compare',
  'pitfalls',
  'exercise',
] as const
export interface Progress {
  status: TopicStatus
  checks: string[]
  updatedAt: string
}
export interface Topic {
  id: string
  title: string
  status: TopicStatus
}
export interface Phase {
  id: string
  title: string
  content: string
  topics: Topic[]
  checkpoint: boolean
}
export interface Roadmap {
  id: string
  title: string
  cadence: string
  description: string
  symbol: string
  file: string
  authority: 'authoritative' | 'proposed' | 'awaiting'
  markdown: string
  revision: string
  phases: Phase[]
}
export interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  createdAt: string
  status: 'complete' | 'pending' | 'failed' | 'interrupted'
}
export interface LearningSession {
  id: string
  trackId: string
  topicId: string | null
  topicTitle: string
  phaseTitle: string
  sourceRevision: string
  stage: Stage
  notes: string
  exercise: string
  messages: Message[]
  threadId: string | null
  createdAt: string
  updatedAt: string
}
export interface LearningState {
  version: 1
  progress: Record<string, Progress>
  sessions: LearningSession[]
}
