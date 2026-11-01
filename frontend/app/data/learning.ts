export type TopicStatus = 'not-started' | 'in-progress' | 'completed'
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
  stage: string
  notes: string
  exercise: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}
export type SessionSummary = Pick<
  LearningSession,
  | 'id'
  | 'trackId'
  | 'topicId'
  | 'topicTitle'
  | 'stage'
  | 'createdAt'
  | 'updatedAt'
> & { messageCount: number }
export interface Connection {
  installed: boolean
  connected: boolean
  authType: string | null
  plan: string | null
  model: string | null
  message: string
}
export const sessionStages = [
  {
    id: 'concept',
    label: 'مفهوم',
    prompt:
      'مفهوم این موضوع را قدم‌به‌قدم توضیح بده و در پایان یک سؤال کوتاه از من بپرس.',
  },
  {
    id: 'mental-model',
    label: 'مدل ذهنی',
    prompt:
      'مدل ذهنی این موضوع چیست؟ با یک مثال توضیح بده و قبل از ادامه فهم من را بسنج.',
  },
  {
    id: 'comparison',
    label: 'مقایسه با Vue',
    prompt:
      'این موضوع را با تجربهٔ Vue و Nuxt من مقایسه کن؛ کدام شباهت‌ها ممکن است گمراه‌کننده باشند؟',
  },
  {
    id: 'example',
    label: 'مثال واقعی',
    prompt:
      'یک مثال واقعی Frontend برای همین موضوع بده و از من بخواه رفتار آن را توضیح بدهم.',
  },
  {
    id: 'exercise',
    label: 'تمرین',
    prompt:
      'یک تمرین کوچک و متمرکز برای این موضوع بده. راه‌حل کامل را نگو و منتظر پاسخ من بمان.',
  },
  {
    id: 'review',
    label: 'بازبینی',
    prompt:
      'پاسخ تمرین من را که در بخش تمرین ذخیره کرده‌ام بررسی کن. ایرادهای مشخص را بگو و از من بخواه اصلاح کنم.',
  },
  {
    id: 'interview',
    label: 'مصاحبه',
    prompt:
      'یک سؤال مصاحبه‌ای دربارهٔ همین موضوع بپرس و قبل از پاسخ‌دادن خودت، منتظر جواب من بمان.',
  },
  {
    id: 'confirmation',
    label: 'تثبیت',
    prompt:
      'با یک یا دو سؤال کوتاه بررسی کنیم این موضوع جا افتاده است. خودکار موضوع را تکمیل نکن یا سراغ موضوع بعدی نرو.',
  },
] as const
export const masteryChecks = [
  { id: 'explain', label: 'می‌توانم مفهوم را با زبان خودم توضیح بدهم.' },
  { id: 'apply', label: 'می‌توانم آن را در کد استفاده کنم.' },
  { id: 'compare', label: 'تفاوتش با روش‌های مشابه را می‌فهمم.' },
  { id: 'pitfalls', label: 'اشتباه‌های رایج آن را می‌شناسم.' },
  { id: 'exercise', label: 'تمرین مربوط به آن را انجام داده‌ام.' },
] as const
