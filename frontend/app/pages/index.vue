<script setup lang="ts">
import { masteryChecks, sessionStages } from '~/data/learning'

const learning = useLearningStore()
const runtimeConfig = useRuntimeConfig()
const activePanel = ref('practice')
const message = ref('')
const chatLog = ref<HTMLElement | null>(null)
const followChat = ref(true)
const fa = (value: number) => new Intl.NumberFormat('fa-IR').format(value)
const authority = computed(
  () =>
    ({
      authoritative: 'برنامهٔ اصلی تو',
      proposed: 'مسیر پیشنهادی',
      awaiting: 'در انتظار برنامه',
    })[learning.currentTrack?.authority ?? 'awaiting'],
)
const topicTitle = computed(
  () =>
    learning.currentTopic?.title ??
    learning.room?.topicTitle ??
    'گفت‌وگو دربارهٔ مسیر',
)
const progressPercent = computed(() =>
  learning.topics.length
    ? Math.round((learning.completedCount / learning.topics.length) * 100)
    : 0,
)
const sourceUrl = computed(
  () =>
    `${runtimeConfig.public.apiBase.replace(/\/$/, '')}/learning/roadmaps/${learning.selectedTrackId}/source`,
)

onMounted(() => learning.initialize())
watch(
  () => [
    learning.streamedReply,
    learning.room?.messages.length,
    learning.room?.id,
  ],
  async () => {
    await nextTick()
    if (followChat.value && chatLog.value)
      chatLog.value.scrollTop = chatLog.value.scrollHeight
  },
)
function trackScroll() {
  if (chatLog.value)
    followChat.value =
      chatLog.value.scrollHeight -
        chatLog.value.scrollTop -
        chatLog.value.clientHeight <
      100
}
async function send(text = message.value) {
  if (!text.trim()) return
  const original = message.value
  message.value = ''
  followChat.value = true
  if (!(await learning.send(text))) message.value = original
}
async function saveDraft() {
  try {
    await learning.ensureSession()
    await learning.saveDraft(true)
  } catch {
    learning.error = 'ذخیره انجام نشد؛ متن در صفحه حفظ شده است. دوباره تلاش کن.'
  }
}
async function newSession() {
  try {
    await learning.createSession()
    followChat.value = true
  } catch {
    learning.error = 'جلسهٔ تازه ایجاد نشد. اتصال به backend را بررسی کن.'
  }
}

function toolTabKeydown(event: KeyboardEvent) {
  const tabs = ['practice', 'mastery', 'sources']
  let index = tabs.indexOf(activePanel.value)
  if (event.key === 'ArrowLeft') index = (index + 1) % tabs.length
  else if (event.key === 'ArrowRight')
    index = (index + tabs.length - 1) % tabs.length
  else if (event.key === 'Home') index = 0
  else if (event.key === 'End') index = tabs.length - 1
  else return
  event.preventDefault()
  activePanel.value = tabs[index]!
  const parent = event.currentTarget as HTMLElement
  parent.querySelectorAll<HTMLButtonElement>('[role="tab"]')[index]?.focus()
}
</script>

<template>
  <div class="study-shell">
    <a class="skip-link" href="#learning-room">رفتن به اتاق یادگیری</a>
    <aside class="study-sidebar" aria-label="مسیرهای یادگیری">
      <a href="#learning-room" class="study-brand"
        ><span class="brand-mark"><AppIcon name="book" /></span
        ><span
          ><strong>یادگیر<span>.</span></strong
          ><small>جایی برای فهمیدن، نه فقط خواندن</small></span
        ></a
      >
      <p class="sidebar-label">مسیرهای تو</p>
      <nav class="track-navigation">
        <button
          v-for="track in learning.roadmaps"
          :key="track.id"
          type="button"
          class="track-link"
          :class="{ selected: learning.selectedTrackId === track.id }"
          :aria-pressed="learning.selectedTrackId === track.id"
          :disabled="learning.busy"
          @click="learning.selectTrack(track.id)"
        >
          <span class="track-symbol" dir="ltr">{{ track.symbol }}</span
          ><span
            ><strong dir="auto">{{ track.title }}</strong
            ><small>{{ track.cadence }}</small></span
          ><AppIcon
            v-if="learning.selectedTrackId === track.id"
            name="chevron"
          />
        </button>
      </nav>
      <div class="sidebar-schedule">
        <AppIcon name="clock" /><strong>ریتم یادگیری React</strong>
        <p>یکشنبه و سه‌شنبه<br />۴۵ تا ۷۵ دقیقه؛ آخر هفته اختیاری.</p>
        <span>با سرعت فهمیدن خودت جلو برو.</span>
      </div>
      <div class="sidebar-foot">
        <AppIcon name="note" /><span
          >نقشه‌ها از فایل Markdown<br />جلسه‌ها در فایل محلی</span
        >
      </div>
    </aside>

    <main class="study-main">
      <header class="study-topbar">
        <div class="breadcrumb">
          <span>فضای یادگیری</span><AppIcon name="chevron" /><strong
            >اتاق مطالعه</strong
          >
        </div>
        <div class="connection-controls">
          <span
            class="connection-state"
            :class="{ connected: learning.connection?.connected }"
            ><span />{{
              learning.checkingConnection
                ? 'در حال بررسی…'
                : learning.connection?.connected
                  ? 'حساب Codex متصل'
                  : 'اتصال Codex'
            }}</span
          ><button
            type="button"
            class="quiet-button"
            :disabled="learning.checkingConnection"
            @click="learning.checkConnection()"
          >
            <AppIcon name="refresh" /><span class="sr-only">بررسی اتصال</span>
          </button>
        </div>
      </header>

      <div v-if="learning.loading" class="workspace-loading" role="status">
        <AppIcon name="book" />
        <h1>مسیرت را آماده می‌کنیم…</h1>
        <p>در حال خواندن نقشه‌های راه از فایل‌های پروژه.</p>
      </div>
      <div v-else-if="!learning.currentTrack" class="workspace-loading">
        <h1>فضای یادگیری در دسترس نیست</h1>
        <p>{{ learning.error }}</p>
        <button
          class="button button-primary"
          type="button"
          @click="learning.initialize()"
        >
          تلاش دوباره
        </button>
      </div>
      <template v-else>
        <section class="room-heading" aria-labelledby="room-title">
          <div>
            <div class="heading-eyebrow">
              <span class="accent-line" />{{ authority
              }}<span class="heading-divider">/</span
              ><span dir="auto">{{ learning.currentTrack.title }}</span>
            </div>
            <h1 id="room-title" dir="auto">{{ topicTitle }}</h1>
            <p>یک مفهوم را بفهم. با کد لمسش کن. بعد، قدم بعدی را بردار.</p>
          </div>
          <button
            type="button"
            class="button button-secondary"
            :disabled="learning.busy || learning.saving"
            @click="newSession()"
          >
            <AppIcon name="plus" />جلسهٔ تازه
          </button>
        </section>

        <div class="session-flow" aria-label="مراحل جلسه">
          <button
            v-for="(stage, index) in sessionStages"
            :key="stage.id"
            type="button"
            :class="{ active: learning.currentStage.id === stage.id }"
            :aria-pressed="learning.currentStage.id === stage.id"
            :disabled="learning.busy"
            @click="learning.changeStage(stage.id)"
          >
            <span>{{ fa(index + 1) }}</span
            >{{ stage.label }}
          </button>
        </div>

        <div
          v-if="learning.error"
          class="feedback-banner error-banner"
          role="alert"
        >
          <AppIcon name="info" /><span>{{ learning.error }}</span
          ><button
            type="button"
            class="quiet-button"
            aria-label="بستن پیام خطا"
            @click="learning.error = ''"
          >
            ×
          </button>
        </div>
        <div
          v-if="learning.notice"
          class="feedback-banner success-banner"
          role="status"
        >
          <AppIcon name="check" /><span>{{ learning.notice }}</span
          ><button
            type="button"
            class="quiet-button"
            aria-label="بستن پیام ذخیره"
            @click="learning.notice = ''"
          >
            ×
          </button>
        </div>
        <div v-if="learning.login?.verificationUrl" class="login-banner">
          <p>
            برای اتصال، کد
            <strong dir="ltr">{{ learning.login.userCode }}</strong> را در صفحهٔ
            رسمی ورود وارد کن.
          </p>
          <a
            :href="learning.login.verificationUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="button button-primary"
            >ادامهٔ ورود به ChatGPT<AppIcon name="external" /></a
          ><button
            class="button button-secondary"
            type="button"
            @click="learning.checkConnection()"
          >
            ورود انجام شد؛ بررسی اتصال
          </button>
        </div>

        <div class="workspace-columns">
          <aside class="roadmap-pane" aria-labelledby="roadmap-heading">
            <div class="pane-heading">
              <h2 id="roadmap-heading"><AppIcon name="route" />نقشهٔ مسیر</h2>
              <span>{{ fa(learning.currentTrack.phases.length) }} فاز</span>
            </div>
            <div class="roadmap-progress">
              <div>
                <strong
                  >{{ fa(learning.completedCount) }} از
                  {{ fa(learning.topics.length) }} موضوع</strong
                ><span>{{ fa(progressPercent) }}٪</span>
              </div>
              <div class="progress-track">
                <span :style="{ inlineSize: `${progressPercent}%` }" />
              </div>
              <p>تکمیل فقط با تأیید تو ثبت می‌شود.</p>
            </div>
            <div class="roadmap-scroll">
              <p v-if="!learning.topics.length" class="empty-roadmap">
                برنامهٔ دقیق این مسیر هنوز ارائه نشده است. می‌توانی دربارهٔ مسیر
                گفتگو کنی؛ سرفصل و پیشرفت ساختگی اضافه نمی‌کنیم.
              </p>
              <details
                v-for="(phase, phaseIndex) in learning.currentTrack.phases"
                :key="phase.id"
                class="phase-group"
                :open="learning.currentPhase?.id === phase.id"
              >
                <summary>
                  <span class="phase-number">{{ fa(phaseIndex + 1) }}</span
                  ><span dir="auto">{{
                    phase.title.replace(/^Phase\s+\d+\s*[—–-]\s*/i, '')
                  }}</span
                  ><AppIcon name="chevron" />
                </summary>
                <div class="phase-topics">
                  <button
                    v-for="topic in phase.topics"
                    :key="topic.id"
                    type="button"
                    class="topic-button"
                    :class="[
                      { current: learning.selectedTopicId === topic.id },
                      `topic-${learning.statusOf(topic)}`,
                    ]"
                    :aria-current="
                      learning.selectedTopicId === topic.id ? 'step' : undefined
                    "
                    :disabled="learning.busy"
                    @click="learning.selectTopic(topic.id)"
                  >
                    <AppIcon
                      :name="
                        learning.statusOf(topic) === 'completed'
                          ? 'check'
                          : learning.statusOf(topic) === 'in-progress'
                            ? 'clock'
                            : 'circle'
                      "
                    /><span dir="auto">{{ topic.title }}</span
                    ><span class="sr-only">{{
                      learning.statusOf(topic) === 'completed'
                        ? 'تکمیل شده'
                        : learning.statusOf(topic) === 'in-progress'
                          ? 'در حال یادگیری'
                          : 'شروع نشده'
                    }}</span></button
                  ><span v-if="phase.checkpoint" class="checkpoint-label"
                    ><AppIcon name="code" />checkpoint یا تمرین یکپارچه در این
                    فاز</span
                  >
                </div>
              </details>
            </div>
            <details class="saved-sessions">
              <summary>
                جلسه‌های ذخیره‌شده
                <span>{{ fa(learning.trackSessions.length) }}</span>
              </summary>
              <button
                v-for="session in learning.trackSessions"
                :key="session.id"
                type="button"
                :disabled="learning.busy"
                :class="{ selected: learning.room?.id === session.id }"
                @click="learning.openSession(session.id)"
              >
                <span dir="auto">{{ session.topicTitle }}</span
                ><small
                  >{{ fa(session.messageCount) }} پیام ·
                  {{
                    new Date(session.updatedAt).toLocaleDateString('fa-IR')
                  }}</small
                >
              </button>
              <p v-if="!learning.trackSessions.length">
                اولین گفت‌وگوی این مسیر را بساز.
              </p>
            </details>
          </aside>

          <section
            id="learning-room"
            class="chat-pane"
            aria-labelledby="chat-heading"
            tabindex="-1"
          >
            <header class="chat-heading">
              <div class="tutor-mark"><AppIcon name="sparkle" /></div>
              <div>
                <h2 id="chat-heading">همراه یادگیری</h2>
                <p>
                  {{ learning.currentStage.label }}<span> · </span
                  >{{ learning.room ? 'جلسهٔ ذخیره‌شده' : 'آمادهٔ شروع' }}
                </p>
              </div>
              <span class="chat-provider" dir="ltr">Codex</span>
            </header>
            <div
              ref="chatLog"
              class="chat-messages"
              role="log"
              aria-label="پیام‌های جلسه"
              :aria-busy="learning.busy"
              @scroll="trackScroll"
            >
              <div v-if="!learning.room?.messages.length" class="chat-welcome">
                <span class="welcome-orbit"><AppIcon name="book" /></span>
                <p class="eyebrow">از فهمیدن شروع کنیم</p>
                <h3>این‌بار فقط یک موضوع.</h3>
                <p>
                  مربی، نقشهٔ راه و مرحلهٔ انتخابی تو را می‌خواند. تمرین می‌دهد،
                  منتظر جوابت می‌ماند و با هم بازبینی می‌کنید.
                </p>
                <div class="starter-prompts">
                  <button
                    type="button"
                    :disabled="learning.busy"
                    @click="send(learning.currentStage.prompt)"
                  >
                    <AppIcon name="arrow" />{{ learning.currentStage.label }} را
                    شروع کنیم</button
                  ><button
                    type="button"
                    :disabled="learning.busy"
                    @click="
                      send(
                        'قبل از شروع، یک سؤال کوتاه بپرس تا معلوم شود دربارهٔ این موضوع چه می‌دانم.',
                      )
                    "
                  >
                    <AppIcon name="chat" />اول فهم فعلی‌ام را بسنج
                  </button>
                </div>
                <p
                  v-if="!learning.connection?.connected"
                  class="connection-hint"
                >
                  {{
                    learning.connection?.message ??
                    'اتصال حساب در حال بررسی است.'
                  }}<button
                    type="button"
                    class="text-button"
                    :disabled="learning.checkingConnection"
                    @click="learning.connect()"
                  >
                    اتصال حساب ChatGPT
                  </button>
                </p>
              </div>
              <article
                v-for="item in learning.room?.messages ?? []"
                :key="item.id"
                class="chat-message"
                :class="[
                  `message-${item.role}`,
                  {
                    'message-incomplete':
                      item.status === 'failed' || item.status === 'interrupted',
                  },
                ]"
              >
                <div class="message-meta">
                  <span>{{
                    item.role === 'user' ? 'تو' : 'همراه یادگیری'
                  }}</span
                  ><span v-if="item.status === 'failed'">پاسخ کامل نشد</span
                  ><span v-else-if="item.status === 'interrupted'"
                    >متوقف شد</span
                  ><time v-else :datetime="item.createdAt">{{
                    new Date(item.createdAt).toLocaleTimeString('fa-IR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  }}</time>
                </div>
                <LearningMarkdown
                  :text="
                    item.status === 'pending' && learning.busy
                      ? learning.streamedReply || 'در حال آماده‌کردن پاسخ…'
                      : item.text ||
                        (item.status === 'pending'
                          ? 'این پاسخ با توقف برنامه ناتمام مانده؛ می‌توانی دوباره پیام بدهی.'
                          : 'پاسخی ذخیره نشده است.')
                  "
                />
              </article>
            </div>
            <div class="stage-action">
              <AppIcon name="route" /><span
                >مرحلهٔ فعلی:
                <strong>{{ learning.currentStage.label }}</strong></span
              ><button
                class="text-button"
                type="button"
                :disabled="learning.busy"
                @click="send(learning.currentStage.prompt)"
              >
                ادامهٔ این مرحله<AppIcon name="arrow" />
              </button>
            </div>
            <form class="chat-composer" @submit.prevent="send()">
              <label class="sr-only" for="chat-message">پیام به مربی</label
              ><textarea
                id="chat-message"
                v-model="message"
                rows="2"
                maxlength="12000"
                :disabled="learning.busy"
                placeholder="سؤالت را بپرس، پاسخ تمرینت را توضیح بده، یا بگو کدام قسمت هنوز روشن نیست…"
              />
              <div class="composer-footer">
                <span>پاسخ‌ها از Codex می‌آیند؛ تکمیل درس با توست.</span
                ><button
                  v-if="learning.busy"
                  type="button"
                  class="button button-secondary"
                  @click="learning.stop()"
                >
                  <AppIcon name="stop" />توقف پاسخ</button
                ><button
                  v-else
                  type="submit"
                  class="button button-primary"
                  :disabled="!message.trim()"
                >
                  <AppIcon name="arrow" />ارسال
                </button>
              </div>
            </form>
          </section>

          <aside class="practice-pane" aria-label="تمرین، معیار تکمیل و منابع">
            <div
              class="work-tabs"
              role="tablist"
              aria-label="ابزارهای جلسه"
              @keydown="toolTabKeydown"
            >
              <button
                id="practice-tab"
                type="button"
                role="tab"
                :aria-selected="activePanel === 'practice'"
                :tabindex="activePanel === 'practice' ? 0 : -1"
                aria-controls="practice-panel"
                @click="activePanel = 'practice'"
              >
                تمرین</button
              ><button
                id="mastery-tab"
                type="button"
                role="tab"
                :aria-selected="activePanel === 'mastery'"
                :tabindex="activePanel === 'mastery' ? 0 : -1"
                aria-controls="mastery-panel"
                @click="activePanel = 'mastery'"
              >
                تثبیت</button
              ><button
                id="sources-tab"
                type="button"
                role="tab"
                :aria-selected="activePanel === 'sources'"
                :tabindex="activePanel === 'sources' ? 0 : -1"
                aria-controls="sources-panel"
                @click="activePanel = 'sources'"
              >
                منابع
              </button>
            </div>
            <section
              v-show="activePanel === 'practice'"
              id="practice-panel"
              class="practice-content"
              role="tabpanel"
              aria-labelledby="practice-tab"
            >
              <div class="tool-eyebrow">
                <AppIcon name="code" />یادگیری با دست‌های خودت
              </div>
              <h2>اول تلاش تو، بعد بازبینی.</h2>
              <p>
                کد یا پاسخ تمرین را اینجا بنویس. با ارسال در مرحلهٔ بازبینی،
                مربی همین نسخهٔ ذخیره‌شده را می‌بیند.
              </p>
              <label for="exercise-draft"
                >پاسخ تمرین <span dir="ltr">code / notes</span></label
              ><textarea
                id="exercise-draft"
                v-model="learning.draftExercise"
                class="exercise-editor"
                dir="ltr"
                spellcheck="false"
                rows="12"
                maxlength="50000"
                :disabled="learning.busy || learning.saving"
                placeholder="// Your attempt starts here…"
              /><label for="session-note">نکته‌ای برای جلسهٔ بعد</label
              ><textarea
                id="session-note"
                v-model="learning.draftNotes"
                rows="4"
                maxlength="20000"
                :disabled="learning.busy || learning.saving"
                placeholder="چه چیزی را فهمیدی؟ چه سؤالی هنوز باز است؟"
              /><button
                type="button"
                class="button button-secondary full-width"
                :disabled="learning.busy || learning.saving"
                @click="saveDraft()"
              >
                <AppIcon name="note" />{{
                  learning.saving ? 'در حال ذخیره…' : 'ذخیرهٔ تمرین و یادداشت'
                }}
              </button>
              <p class="tool-caption">
                فایل محلی؛ بدون اجرای کد و بدون ذخیره در دیتابیس.
              </p>
            </section>
            <section
              v-show="activePanel === 'mastery'"
              id="mastery-panel"
              class="practice-content"
              role="tabpanel"
              aria-labelledby="mastery-tab"
            >
              <div class="tool-eyebrow">
                <AppIcon name="check" />تمام شدن با فهمیدن فرق دارد
              </div>
              <h2>این موضوع جا افتاده؟</h2>
              <p>
                طبق قانون نقشهٔ React، هر پنج معیار را با تجربهٔ واقعی خودت
                بررسی کن.
              </p>
              <label
                v-for="check in masteryChecks"
                :key="check.id"
                class="mastery-check"
                ><input
                  v-model="learning.checks"
                  type="checkbox"
                  :value="check.id"
                  :disabled="!learning.currentTopic || learning.busy"
                  @change="learning.updateChecks()"
                /><span>{{ check.label }}</span></label
              ><button
                type="button"
                class="button button-primary full-width"
                :disabled="!learning.canComplete || learning.busy"
                @click="learning.complete()"
              >
                <AppIcon name="check" />تأیید من؛ ثبت تکمیل موضوع
              </button>
              <p class="tool-caption">
                مربی هیچ موضوعی را به‌جای تو تکمیل نمی‌کند. checkpointهای پروژه
                را هم در زمان مقرر انجام بده.
              </p>
            </section>
            <section
              v-show="activePanel === 'sources'"
              id="sources-panel"
              class="practice-content"
              role="tabpanel"
              aria-labelledby="sources-tab"
            >
              <div class="tool-eyebrow">
                <AppIcon name="book" />منبع همین گفت‌وگو
              </div>
              <h2 dir="auto">{{ learning.currentTrack.title }}</h2>
              <p>{{ learning.currentTrack.description }}</p>
              <dl class="source-facts">
                <div>
                  <dt>نوع برنامه</dt>
                  <dd>{{ authority }}</dd>
                </div>
                <div>
                  <dt>ریتم پیشنهادی</dt>
                  <dd>{{ learning.currentTrack.cadence }}</dd>
                </div>
                <div>
                  <dt>ذخیره‌سازی</dt>
                  <dd>فایل Markdown در پروژه</dd>
                </div>
              </dl>
              <a
                :href="sourceUrl"
                class="source-link"
                target="_blank"
                rel="noopener noreferrer"
                ><span dir="ltr">{{ learning.currentTrack.file }}</span
                ><AppIcon name="external"
              /></a>
              <details class="source-preview">
                <summary>متن بخش فعلی</summary>
                <pre dir="auto">{{
                  learning.currentPhase?.content ??
                  learning.currentTrack.markdown
                }}</pre>
              </details>
              <div class="book-notice">
                <AppIcon name="book" /><strong>کتاب، ابزار مسیر است.</strong>
                <p>
                  پس از ارائهٔ PDF، فصل‌ها را به Core، Optional و Later وصل
                  می‌کنیم. هنوز کتابی وارد نشده است.
                </p>
              </div>
            </section>
          </aside>
        </div>
      </template>
    </main>
  </div>
</template>
