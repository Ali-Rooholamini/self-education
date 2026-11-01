<script setup lang="ts">
import { demoCourses, type DemoCourse } from '~/data/demo-courses'

const health = useBackendHealthStore()
const activeSection = ref('overview')
const navigation = [
  { id: 'overview', label: 'نمای کلی', icon: 'grid' },
  { id: 'courses', label: 'دوره‌های من', icon: 'book' },
  { id: 'roadmap', label: 'نقشهٔ یادگیری', icon: 'route' },
  { id: 'notes', label: 'یادداشت‌ها', icon: 'note' },
]
const selectedCourseId = ref('typescript')
const selectedLessonId = ref('ts-unions')
const completedLessonIds = ref(['ts-types'])
const note = ref('')
const selectedCourse = computed(() =>
  demoCourses.find((course) => course.id === selectedCourseId.value)!,
)
const selectedLesson = computed(() =>
  selectedCourse.value.lessons.find(
    (lesson) => lesson.id === selectedLessonId.value,
  )!,
)
const isLessonComplete = computed(() =>
  completedLessonIds.value.includes(selectedLesson.value.id),
)
const totalLessons = demoCourses.reduce(
  (total, course) => total + course.lessons.length,
  0,
)
const totalProgress = computed(() =>
  Math.round((completedLessonIds.value.length / totalLessons) * 100),
)
const faNumber = (value: number) => new Intl.NumberFormat('fa-IR').format(value)

function courseProgress(course: DemoCourse) {
  return Math.round(
    (course.lessons.filter((lesson) =>
      completedLessonIds.value.includes(lesson.id),
    ).length /
      course.lessons.length) *
      100,
  )
}

function selectCourse(course: DemoCourse) {
  selectedCourseId.value = course.id
  selectedLessonId.value = (course.lessons.find(
    (lesson) => !completedLessonIds.value.includes(lesson.id),
  ) ?? course.lessons[0])!.id
}

function toggleLesson() {
  const id = selectedLesson.value.id
  completedLessonIds.value = isLessonComplete.value
    ? completedLessonIds.value.filter((lessonId) => lessonId !== id)
    : [...completedLessonIds.value, id]
}

const connectionLabel = computed(
  () =>
    ({
      idle: 'ارتباط هنوز بررسی نشده است',
      checking: 'در حال بررسی ارتباط…',
      online: 'ارتباط با سرور برقرار است',
      offline: 'سرور در دسترس نیست؛ دوباره تلاش کن',
    })[health.status],
)
</script>

<template>
  <div class="learning-app">
    <a class="skip-link" href="#main-content">رفتن به محتوای اصلی</a>
    <aside class="sidebar" aria-label="ناوبری اصلی">
      <a class="brand" href="#overview" aria-label="یادگیر، نمای کلی">
        <span class="brand-mark"><AppIcon name="book" /></span>
        <span
          ><strong>یادگیر<span class="brand-dot">.</span></strong
          ><small>فضای شخصی یادگیری</small></span
        >
      </a>
      <p class="nav-caption">میز کار تو</p>
      <nav class="main-nav">
        <a
          v-for="item in navigation"
          :key="item.id"
          class="nav-link"
          :class="{ 'nav-link-current': activeSection === item.id }"
          :href="`#${item.id}`"
          :aria-current="activeSection === item.id ? 'location' : undefined"
          @click="activeSection = item.id"
        >
          <AppIcon :name="item.icon" />{{ item.label }}
          <span v-if="item.id === 'courses'" class="nav-count">۲</span>
        </a>
      </nav>
      <div class="sidebar-bottom">
        <div class="growth-note">
          <AppIcon name="leaf" /><strong>هر قدم، یک پیشرفت.</strong>
          <p>قرار نیست همه‌چیز را یک‌باره یاد بگیری؛ فقط قدم بعدی را بردار.</p>
        </div>
        <div class="profile">
          <span class="avatar">من</span
          ><span
            ><strong>مسیر یادگیری من</strong
            ><small>با کنجکاوی ادامه بده</small></span
          >
        </div>
      </div>
    </aside>

    <main id="main-content" class="main-content" tabindex="-1">
      <header id="overview" class="topbar">
        <div class="breadcrumb">
          میز کار <AppIcon name="chevron" /><span>نمای کلی</span>
        </div>
        <span class="demo-label"><span />نسخهٔ نمایشی</span>
      </header>
      <div class="page-content">
        <section class="welcome" aria-labelledby="welcome-title">
          <div class="welcome-copy">
            <p class="eyebrow">
              <span class="small-line" />یک قدم کوچک، هر روز
            </p>
            <h1 id="welcome-title">
              کنجکاوی‌ات را دنبال کن.<span>مسیرت همین‌جاست.</span>
            </h1>
            <p class="welcome-description">
              درس‌ها، تمرین‌ها و فکرهای تازه‌ات، همه در یک جا. امروز هم از همان
              جایی که بودی، ادامه بده.
            </p>
            <a class="button button-primary" href="#lesson"
              >ادامهٔ یادگیری<AppIcon name="arrow"
            /></a>
          </div>
          <div class="journey-art" aria-hidden="true">
            <div class="art-orbit art-orbit-one" />
            <div class="art-orbit art-orbit-two" />
            <span class="art-point point-one" /><span
              class="art-point point-two"
            />
            <div class="floating-code">
              <AppIcon name="code" /><span dir="ltr"
                >learn. practice. grow.</span
              >
            </div>
            <div class="art-book"><AppIcon name="book" /></div>
            <div class="art-step">
              <span class="art-check"><AppIcon name="check" /></span>
              <div>
                <strong>یک قدم نزدیک‌تر</strong
                ><span>به چیزی که می‌خواهی یاد بگیری</span>
              </div>
            </div>
          </div>
        </section>
        <div class="demo-notice">
          <AppIcon name="sparkle" />
          <p>
            این یک پیش‌نمایش تعاملی است. دوره‌ها و پیشرفت، نمونه‌اند و تغییرات
            با تازه‌سازی صفحه پاک می‌شوند.
          </p>
        </div>

        <section class="stats" aria-label="خلاصهٔ پیشرفت نمونه">
          <div class="stat">
            <span class="stat-icon"><AppIcon name="book" /></span>
            <div>
              <strong>۲ <span>دوره</span></strong>
              <p>برای کشف کردن</p>
            </div>
          </div>
          <div class="stat">
            <span class="stat-icon"><AppIcon name="check" /></span>
            <div>
              <strong
                >{{ faNumber(completedLessonIds.length) }}
                <span>از {{ faNumber(totalLessons) }} قدم</span></strong
              >
              <p>در مسیر یادگیری</p>
            </div>
          </div>
          <div class="stat">
            <span class="stat-icon"><AppIcon name="route" /></span>
            <div>
              <strong
                >{{ faNumber(totalProgress) }}<span>٪ پیشرفت</span></strong
              >
              <p>هر قدمت ارزشمند است</p>
            </div>
          </div>
        </section>

        <section
          id="courses"
          class="courses-section"
          aria-labelledby="courses-title"
        >
          <div class="section-heading">
            <div>
              <p class="eyebrow">یادگیری، به سبک تو</p>
              <h2 id="courses-title">مسیرهای یادگیری</h2>
            </div>
            <span class="section-meta">۲ مسیر نمونه</span>
          </div>
          <div class="course-grid">
            <button
              v-for="course in demoCourses"
              :key="course.id"
              type="button"
              class="course-card"
              :class="[
                { 'course-selected': selectedCourseId === course.id },
                `course-${course.theme}`,
              ]"
              :aria-pressed="selectedCourseId === course.id"
              @click="selectCourse(course)"
            >
              <span class="course-top"
                ><span class="course-symbol" dir="ltr">{{ course.symbol }}</span
                ><span class="course-state"
                  >{{
                    selectedCourseId === course.id
                      ? 'در حال مشاهده'
                      : 'مشاهدهٔ مسیر'
                  }}<AppIcon
                    :name="
                      selectedCourseId === course.id ? 'check' : 'chevron'
                    " /></span
              ></span>
              <span class="course-title">{{ course.title }}</span
              ><span class="course-description">{{ course.description }}</span>
              <span class="course-progress-label"
                ><span
                  >{{
                    faNumber(
                      course.lessons.filter((lesson) =>
                        completedLessonIds.includes(lesson.id),
                      ).length,
                    )
                  }}
                  از {{ faNumber(course.lessons.length) }} درس</span
                ><span>{{ faNumber(courseProgress(course)) }}٪</span></span
              >
              <span class="progress-track"
                ><span :style="{ inlineSize: `${courseProgress(course)}%` }"
              /></span>
            </button>
          </div>
        </section>

        <div class="content-grid">
          <div class="primary-column">
            <section
              id="lesson"
              class="lesson-panel"
              aria-labelledby="lesson-title"
            >
              <div class="lesson-heading">
                <span class="eyebrow"><span class="status-dot" />قدم امروز</span
                ><span class="duration"
                  ><AppIcon name="clock" />{{
                    faNumber(selectedLesson.minutes)
                  }}
                  دقیقه</span
                >
              </div>
              <p class="lesson-course">{{ selectedCourse.title }}</p>
              <h2 id="lesson-title">{{ selectedLesson.title }}</h2>
              <p class="lesson-description">{{ selectedLesson.description }}</p>
              <div class="code-window">
                <div class="code-toolbar">
                  <span class="window-dots"><i /><i /><i /></span
                  ><span dir="ltr">practice.ts</span><span>مثال آموزشی</span>
                </div>
                <pre
                  dir="ltr"
                  tabindex="0"
                  aria-label="نمونه کد درس"
                ><code>{{ selectedLesson.example }}</code></pre>
              </div>
              <div class="lesson-footer">
                <span
                  class="lesson-feedback"
                  role="status"
                  aria-live="polite"
                  >{{
                    isLessonComplete
                      ? 'این قدم را در دمو کامل کردی.'
                      : 'مثال را بخوان و با یک ورودی تازه امتحان کن.'
                  }}</span
                ><button
                  class="button"
                  :class="
                    isLessonComplete ? 'button-secondary' : 'button-primary'
                  "
                  type="button"
                  :aria-pressed="isLessonComplete"
                  @click="toggleLesson"
                >
                  <AppIcon name="check" />{{
                    isLessonComplete
                      ? 'بازگرداندن به تمرین'
                      : 'این قدم را یاد گرفتم'
                  }}
                </button>
              </div>
            </section>
            <section
              id="notes"
              class="notes-panel"
              aria-labelledby="notes-title"
            >
              <div class="section-heading">
                <h2 id="notes-title"><AppIcon name="note" />یک فکر برای بعد</h2>
                <span class="section-meta">یادداشت موقت</span>
              </div>
              <label class="sr-only" for="learning-note">یادداشت یادگیری</label>
              <textarea
                id="learning-note"
                v-model="note"
                rows="3"
                maxlength="2000"
                placeholder="امروز چه چیزی برایت روشن شد؟ با زبان خودت بنویس…"
                aria-describedby="note-help"
              />
              <p id="note-help" class="note-help">
                این یادداشت فقط تا وقتی صفحه باز است باقی می‌ماند.
              </p>
            </section>
          </div>
          <div class="secondary-column">
            <section
              id="roadmap"
              class="roadmap-panel"
              aria-labelledby="roadmap-title"
            >
              <div class="section-heading">
                <h2 id="roadmap-title">قدم‌های مسیر</h2>
                <AppIcon name="route" />
              </div>
              <p class="section-description">{{ selectedCourse.title }}</p>
              <ol class="roadmap-list">
                <li
                  v-for="(lesson, index) in selectedCourse.lessons"
                  :key="lesson.id"
                  :class="{
                    'step-completed': completedLessonIds.includes(lesson.id),
                    'step-current': selectedLessonId === lesson.id,
                  }"
                >
                  <button
                    type="button"
                    class="roadmap-step"
                    :aria-current="
                      selectedLessonId === lesson.id ? 'step' : undefined
                    "
                    @click="selectedLessonId = lesson.id"
                  >
                    <span class="step-marker"
                      ><AppIcon
                        v-if="completedLessonIds.includes(lesson.id)"
                        name="check"
                      /><span v-else>{{ faNumber(index + 1) }}</span></span
                    ><span class="step-text"
                      ><strong>{{ lesson.title }}</strong
                      ><small>{{
                        completedLessonIds.includes(lesson.id)
                          ? 'تکمیل شده'
                          : selectedLessonId === lesson.id
                            ? 'در حال مشاهده'
                            : `${faNumber(lesson.minutes)} دقیقه یادگیری`
                      }}</small></span
                    ><AppIcon
                      v-if="selectedLessonId === lesson.id"
                      class="step-arrow"
                      name="chevron"
                    />
                  </button>
                </li>
              </ol>
              <p class="roadmap-caption">
                مسیرهای بزرگ، از قدم‌های کوچک ساخته می‌شوند.
              </p>
            </section>
            <section class="companion-panel" aria-labelledby="companion-title">
              <span class="companion-icon"><AppIcon name="sparkle" /></span>
              <p class="eyebrow">یک تلنگر کوچک</p>
              <h2 id="companion-title">فقط نخوان، کشف کن.</h2>
              <p>{{ selectedCourse.hint }}</p>
              <span class="sample-caption">پیشنهاد آموزشی نمونه</span>
            </section>
          </div>
        </div>
        <footer class="page-footer">
          <p>با حوصله یاد بگیر. با تمرین، ماندگارش کن.</p>
          <details class="service-details">
            <summary><AppIcon name="server" />وضعیت سرویس</summary>
            <div class="service-content">
              <p role="status" aria-live="polite">{{ connectionLabel }}</p>
              <button
                type="button"
                class="button button-secondary"
                :disabled="health.status === 'checking'"
                @click="health.check()"
              >
                {{
                  health.status === 'checking'
                    ? 'در حال بررسی…'
                    : 'بررسی ارتباط با سرور'
                }}
              </button>
            </div>
          </details>
        </footer>
      </div>
    </main>
  </div>
</template>
