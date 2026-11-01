import { defineStore } from 'pinia'
import {
  masteryChecks,
  sessionStages,
  type Connection,
  type LearningSession,
  type Progress,
  type Roadmap,
  type SessionSummary,
  type Topic,
} from '~/data/learning'

function messageOf(error: unknown) {
  const data = (error as { data?: { message?: string | string[] } })?.data
  return typeof data?.message === 'string'
    ? data.message
    : 'ارتباط با فضای یادگیری انجام نشد. اجرای backend و اتصال را بررسی کن.'
}

export const useLearningStore = defineStore('learning', () => {
  const apiBase = useRuntimeConfig().public.apiBase.replace(/\/$/, '')
  const roadmaps = ref<Roadmap[]>([])
  const progress = ref<Record<string, Progress>>({})
  const sessions = ref<SessionSummary[]>([])
  const selectedTrackId = ref('react')
  const selectedTopicId = ref<string | null>(null)
  const room = ref<LearningSession | null>(null)
  const draftExercise = ref('')
  const draftNotes = ref('')
  const checks = ref<string[]>([])
  const loading = ref(true)
  const busy = ref(false)
  const saving = ref(false)
  const checkingConnection = ref(false)
  const connection = ref<Connection | null>(null)
  const login = ref<{ verificationUrl?: string; userCode?: string } | null>(
    null,
  )
  const error = ref('')
  const notice = ref('')
  const streamedReply = ref('')
  const currentTrack = computed(() =>
    roadmaps.value.find((item) => item.id === selectedTrackId.value),
  )
  const topics = computed(
    () => currentTrack.value?.phases.flatMap((phase) => phase.topics) ?? [],
  )
  const currentTopic = computed(() =>
    topics.value.find((topic) => topic.id === selectedTopicId.value),
  )
  const currentPhase = computed(() =>
    currentTrack.value?.phases.find((phase) =>
      phase.topics.some((topic) => topic.id === selectedTopicId.value),
    ),
  )
  const trackSessions = computed(() =>
    sessions.value
      .filter((item) => item.trackId === selectedTrackId.value)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  )
  const currentStage = computed(
    () =>
      sessionStages.find((stage) => stage.id === room.value?.stage) ??
      sessionStages[0],
  )
  const completedCount = computed(
    () =>
      topics.value.filter((topic) => statusOf(topic) === 'completed').length,
  )
  const canComplete = computed(
    () =>
      !!currentTopic.value &&
      masteryChecks.every((check) => checks.value.includes(check.id)),
  )
  const request = <T>(
    path: string,
    options: Parameters<typeof $fetch>[1] = {},
  ) => $fetch<T>(path, { baseURL: apiBase, ...options })

  function statusOf(topic: Topic) {
    return progress.value[topic.id]?.status ?? topic.status
  }

  async function refreshWorkspace() {
    const result = await request<{
      roadmaps: Roadmap[]
      progress: Record<string, Progress>
      sessions: SessionSummary[]
    }>('/learning/workspace')
    roadmaps.value = result.roadmaps
    progress.value = result.progress
    sessions.value = result.sessions
  }

  function acceptRoom(value: LearningSession) {
    room.value = value
    selectedTrackId.value = value.trackId
    selectedTopicId.value = value.topicId
    draftExercise.value = value.exercise
    draftNotes.value = value.notes
    checks.value = value.topicId
      ? [...(progress.value[value.topicId]?.checks ?? [])]
      : []
    if (import.meta.client)
      localStorage.setItem('learning:last-session', value.id)
  }

  async function saveDraft(showNotice = false) {
    if (!room.value && (draftExercise.value || draftNotes.value))
      await ensureSession()
    if (
      !room.value ||
      (room.value.exercise === draftExercise.value &&
        room.value.notes === draftNotes.value)
    ) {
      if (showNotice)
        notice.value = 'تمرین و یادداشت در فایل محلی ذخیره شده است.'
      return
    }
    saving.value = true
    try {
      const updated = await request<LearningSession>(
        `/learning/sessions/${room.value.id}`,
        {
          method: 'PATCH',
          body: { exercise: draftExercise.value, notes: draftNotes.value },
        },
      )
      room.value = updated
      if (showNotice) notice.value = 'تمرین و یادداشت در فایل محلی ذخیره شد.'
    } finally {
      saving.value = false
    }
  }

  async function openSession(id: string) {
    if (busy.value) return
    try {
      await saveDraft()
      acceptRoom(await request<LearningSession>(`/learning/sessions/${id}`))
      error.value = ''
      notice.value = ''
    } catch (cause) {
      error.value = messageOf(cause)
    }
  }

  async function selectTopic(id: string | null) {
    if (busy.value) return
    try {
      await saveDraft()
      selectedTopicId.value = id
      room.value = null
      draftExercise.value = ''
      draftNotes.value = ''
      checks.value = id ? [...(progress.value[id]?.checks ?? [])] : []
      const latest = trackSessions.value.find(
        (session) => session.topicId === id,
      )
      if (latest)
        acceptRoom(
          await request<LearningSession>(`/learning/sessions/${latest.id}`),
        )
      error.value = ''
      notice.value = ''
    } catch (cause) {
      error.value = messageOf(cause)
    }
  }

  async function selectTrack(id: string) {
    if (busy.value) return
    try {
      await saveDraft()
      selectedTrackId.value = id
      const all = topics.value
      const next =
        all.find((topic) => statusOf(topic) === 'in-progress') ??
        all.find((topic) => statusOf(topic) !== 'completed') ??
        all[0]
      await selectTopic(next?.id ?? null)
    } catch (cause) {
      error.value = messageOf(cause)
    }
  }

  let creatingSession: Promise<LearningSession> | null = null

  async function createSession(): Promise<LearningSession> {
    if (creatingSession) return creatingSession
    creatingSession = (async () => {
      const keepDraft = !room.value
      const exercise = draftExercise.value
      const notes = draftNotes.value
      if (room.value) await saveDraft()
      const created = await request<LearningSession>('/learning/sessions', {
        method: 'POST',
        body: {
          trackId: selectedTrackId.value,
          topicId: selectedTopicId.value,
        },
      })
      await refreshWorkspace()
      acceptRoom(created)
      if (keepDraft) {
        draftExercise.value = exercise
        draftNotes.value = notes
      }
      return created
    })()
    try {
      return await creatingSession
    } finally {
      creatingSession = null
    }
  }

  async function ensureSession() {
    if (room.value) return room.value
    const exercise = draftExercise.value
    const notes = draftNotes.value
    const created = await createSession()
    draftExercise.value = exercise
    draftNotes.value = notes
    return created
  }

  async function changeStage(id: string) {
    if (busy.value) return
    try {
      const current = await ensureSession()
      room.value = await request<LearningSession>(
        `/learning/sessions/${current.id}`,
        { method: 'PATCH', body: { stage: id } },
      )
    } catch (cause) {
      error.value = messageOf(cause)
    }
  }

  async function checkConnection() {
    checkingConnection.value = true
    try {
      connection.value = await request<Connection>('/learning/connection', {
        timeout: 35000,
      })
      if (connection.value.connected) login.value = null
    } catch (cause) {
      error.value = messageOf(cause)
    } finally {
      checkingConnection.value = false
    }
  }

  async function connect() {
    try {
      login.value = await request<{
        verificationUrl?: string
        userCode?: string
      }>('/learning/connection/login', { method: 'POST', timeout: 35000 })
      await checkConnection()
    } catch (cause) {
      error.value = messageOf(cause)
    }
  }

  let progressQueue: Promise<void> = Promise.resolve()

  async function updateChecks() {
    if (!currentTopic.value || !currentTrack.value) return
    const topicId = currentTopic.value.id
    const completed =
      statusOf(currentTopic.value) === 'completed' && canComplete.value
    const body = {
      trackId: selectedTrackId.value,
      topicId,
      revision: currentTrack.value.revision,
      status: completed ? 'completed' : 'in-progress',
      checks: [...checks.value],
      confirmed: completed,
    }
    const operation = progressQueue.then(async () => {
      progress.value[topicId] = await request<Progress>('/learning/progress', {
        method: 'PATCH',
        body,
      })
    })
    progressQueue = operation.catch((cause) => {
      error.value = messageOf(cause)
    })
    await progressQueue
  }

  async function complete() {
    if (!canComplete.value || !currentTrack.value || !currentTopic.value) return
    const topicId = currentTopic.value.id
    const body = {
      trackId: selectedTrackId.value,
      topicId,
      revision: currentTrack.value.revision,
      status: 'completed',
      checks: [...checks.value],
      confirmed: true,
    }
    try {
      await progressQueue
      await saveDraft()
      progress.value[topicId] = await request<Progress>('/learning/progress', {
        method: 'PATCH',
        body,
      })
      notice.value =
        'تکمیل این موضوع با تأیید تو ثبت شد؛ موضوع بعدی خودکار شروع نمی‌شود.'
    } catch (cause) {
      error.value = messageOf(cause)
    }
  }

  async function send(text: string) {
    if (!text.trim() || busy.value) return false
    busy.value = true
    error.value = ''
    notice.value = ''
    streamedReply.value = ''
    try {
      const current = await ensureSession()
      await saveDraft()
      busy.value = true
      const response = await fetch(
        `${apiBase}/learning/sessions/${current.id}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        },
      )
      if (!response.ok || !response.body) throw new Error('Chat unavailable')
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let ended = false
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        let boundary: number
        while ((boundary = buffer.indexOf('\n\n')) >= 0) {
          const block = buffer.slice(0, boundary)
          buffer = buffer.slice(boundary + 2)
          if (!block.startsWith('data: ')) continue
          const event = JSON.parse(block.slice(6)) as {
            type: string
            text?: string
            message?: string
            session?: LearningSession
          }
          if (event.type === 'delta') streamedReply.value += event.text ?? ''
          if (event.session) room.value = event.session
          if (event.type === 'error') {
            error.value = event.message ?? 'پاسخ کامل نشد.'
            ended = true
          }
          if (event.type === 'done') ended = true
        }
      }
      if (!ended)
        error.value = 'ارتباط پیش از تکمیل پاسخ قطع شد؛ جلسه را دوباره باز کن.'
      await refreshWorkspace()
      return !error.value
    } catch (cause) {
      error.value = messageOf(cause)
      return false
    } finally {
      busy.value = false
      streamedReply.value = ''
    }
  }

  async function stop() {
    if (!room.value) return
    try {
      await request(`/learning/sessions/${room.value.id}/cancel`, {
        method: 'POST',
      })
    } catch (cause) {
      error.value = messageOf(cause)
    }
  }

  async function initialize() {
    loading.value = true
    try {
      await refreshWorkspace()
      const lastId = import.meta.client
        ? localStorage.getItem('learning:last-session')
        : null
      if (lastId && sessions.value.some((session) => session.id === lastId))
        acceptRoom(
          await request<LearningSession>(`/learning/sessions/${lastId}`),
        )
      else await selectTrack('react')
      void checkConnection()
    } catch (cause) {
      error.value = messageOf(cause)
    } finally {
      loading.value = false
    }
  }

  return {
    roadmaps,
    progress,
    sessions,
    selectedTrackId,
    selectedTopicId,
    room,
    draftExercise,
    draftNotes,
    checks,
    loading,
    busy,
    saving,
    checkingConnection,
    connection,
    login,
    error,
    notice,
    streamedReply,
    currentTrack,
    currentTopic,
    currentPhase,
    trackSessions,
    currentStage,
    topics,
    completedCount,
    canComplete,
    statusOf,
    initialize,
    selectTrack,
    selectTopic,
    openSession,
    createSession,
    ensureSession,
    changeStage,
    saveDraft,
    checkConnection,
    connect,
    updateChecks,
    complete,
    send,
    stop,
  }
})
