# React Learning Track

> مسیر یادگیری React برای آماده‌شدن جهت بازار کار Frontend Engineering  
> رویکرد: یادگیری مفهومی + تمرین هدفمند + پروژه در نقاط مناسب مسیر

---

## 1. هدف این دایرکتوری

این دایرکتوری برای ثبت و پیش‌برد مسیر یادگیری React ایجاد شده است.

هدف صرفاً یادگیری syntax یا چند Hook نیست. خروجی نهایی باید این باشد که بتوانم به‌عنوان یک **Frontend Engineer** وارد یک پروژه واقعی React شوم، معماری و mental model آن را بفهمم، کد production بنویسم و برای مصاحبه‌های شغلی React/Next.js آماده باشم.

پیش‌زمینه من Vue/Nuxt است؛ بنابراین در این مسیر:

- مفاهیم مشترک با Vue/Nuxt سریع‌تر پیش می‌روند.
- روی تفاوت‌های ذهنی React با Vue بیشتر تمرکز می‌شود.
- Rendering model، state model، effects، component identity و architecture اهمیت ویژه دارند.
- هرجا مفید باشد، React با Vue/Nuxt مقایسه می‌شود.
- اولویت با چیزهایی است که در پروژه‌های واقعی و بازار کار زیاد استفاده می‌شوند.
- موضوعات کم‌کاربرد و niche به انتهای مسیر منتقل می‌شوند.

---

## 2. شیوه مطالعه

جلسات اصلی:

- یکشنبه‌ها
- سه‌شنبه‌ها
- حدود 45 تا 75 دقیقه برای هر جلسه
- آخر هفته‌ها در صورت داشتن زمان، جلسات تکمیلی یا طولانی‌تر

هر مبحث معمولاً با این ساختار پیش می‌رود:

1. **Concept**
2. **Mental Model**
3. **Vue/Nuxt → React Comparison**
4. **Real Project Example**
5. **Focused Exercise**
6. **Code Review & Correction**
7. **Mini Interview Questions**
8. **Confirmation & Completion**

تا زمانی که یک بخش به‌اندازه کافی جا نیفتاده باشد، وارد سرفصل بعدی نمی‌شویم.

---

## 3. قانون تمرین و پروژه

هر مبحث آموزشی تمرین مخصوص خودش را دارد، اما قرار نیست بعد از هر مبحث یک پروژه جدید ساخته شود.

الگوی اصلی:

> Learn → Exercise → Continue → Project Checkpoint → Review → Continue

پروژه‌های عملی در **نقاط منطقی و مهم roadmap** انجام می‌شوند؛ یعنی زمانی که چند مفهوم مرتبط یاد گرفته شده و می‌توان آن‌ها را در یک سناریوی واقعی کنار هم استفاده کرد.

بنابراین:

- برای هر Concept یک تمرین کوچک و متمرکز داریم.
- برای هر چند Concept مرتبط، در صورت نیاز یک Integration Exercise داریم.
- در Breakpointهای مهم roadmap وارد پروژه اصلی می‌شویم.
- پروژه اصلی به‌مرور رشد می‌کند و مفاهیم جدید به آن اضافه می‌شوند.
- ممکن است در کنار پروژه اصلی چند Mini Project محدود برای موضوعات خاص داشته باشیم.
- پروژه عملی به انتهای سه ماه موکول نمی‌شود.
- در عین حال، آموزش هم با پروژه‌های بیش‌ازحد خرد و پراکنده نمی‌شود.

---

# 4. Roadmap

## Phase 1 — React Mental Model & Core

**Priority: Critical**

- [ ] React چیست و چه مسئله‌ای حل می‌کند؟
- [ ] React vs Vue mental model
- [ ] Function Components
- [ ] JSX
- [ ] Expressions in JSX
- [ ] Fragments
- [ ] Props
- [ ] Event Handling
- [ ] Conditional Rendering
- [ ] Rendering Lists
- [ ] `key`
- [ ] `useState`
- [ ] State as a Snapshot
- [ ] State Updates
- [ ] Batching
- [ ] Immutable Updates
- [ ] Render → Re-render → Commit
- [ ] What causes a component to render?
- [ ] State Preservation & Reset
- [ ] Component Identity

### Project Checkpoint 01

شروع نسخه اولیه پروژه اصلی با تمرکز روی:

- Component decomposition
- Props
- Local state
- Events
- Lists
- Conditional UI
- Basic interaction

هدف این checkpoint استفاده عملی از React Core است، نه ساخت یک پروژه کامل.

---

## Phase 2 — Effects, Refs & Reactivity

**Priority: Critical**

- [ ] `useEffect`
- [ ] Effect lifecycle
- [ ] Dependency Array
- [ ] Cleanup
- [ ] Reactive Dependencies
- [ ] Stale Closures
- [ ] Effect vs Event
- [ ] When NOT to use `useEffect`
- [ ] Derived State
- [ ] Synchronizing with External Systems
- [ ] `useRef`
- [ ] DOM Refs
- [ ] Mutable Values Without Rendering

### Project Checkpoint 02

گسترش پروژه با سناریوهایی مثل:

- Search / Filter
- Sync with browser APIs
- Data persistence where appropriate
- DOM interaction
- Cleanup scenarios

تمرکز اصلی روی تشخیص صحیح این است که چه چیزی واقعاً Effect است و چه چیزی نیست.

---

## Phase 3 — Component Communication & State Architecture

**Priority: Very High**

- [ ] Parent → Child
- [ ] Child → Parent
- [ ] Lifting State Up
- [ ] Controlled Components
- [ ] Uncontrolled Components
- [ ] State Ownership
- [ ] State Colocation
- [ ] Composition
- [ ] `children`
- [ ] Prop Drilling
- [ ] Context API
- [ ] `useReducer`
- [ ] Context + Reducer
- [ ] Local State vs Global State vs Server State

### Project Checkpoint 03

بازنگری معماری پروژه:

- مشخص‌کردن ownership هر state
- استخراج reusable components
- کاهش prop drilling در صورت نیاز
- استفاده هدفمند از Context/Reducer
- طراحی component boundaries

---

## Phase 4 — Hooks & Reusable Logic

**Priority: Very High**

Core Hooks:

- [ ] `useState`
- [ ] `useEffect`
- [ ] `useRef`
- [ ] `useContext`
- [ ] `useReducer`

Reusable Logic:

- [ ] Custom Hooks
- [ ] Rules of Hooks
- [ ] Hook Composition
- [ ] Closures in Hooks
- [ ] Dependency Management

Optimization Hooks — بعدتر و با دلیل:

- [ ] `useMemo`
- [ ] `useCallback`
- [ ] `memo`

### Integration Exercise

ساخت یک یا چند Custom Hook واقعی از منطق پروژه، نه مثال مصنوعی.

---

## Phase 5 — Forms

**Priority: High**

React fundamentals:

- [ ] Controlled Inputs
- [ ] Form State
- [ ] Submit Handling
- [ ] Validation Concepts

Production ecosystem:

- [ ] React Hook Form
- [ ] Zod
- [ ] React Hook Form + Zod
- [ ] Reusable Form Fields
- [ ] Dynamic Forms
- [ ] Server Validation

### Project Checkpoint 04

اضافه‌کردن فرم‌های واقعی مثل:

- Create
- Edit
- Login / Authentication form
- Filters
- Validation
- Error handling

---

## Phase 6 — Routing

**Priority: High**

- [ ] SPA Routing Mental Model
- [ ] React Router
- [ ] Route Configuration
- [ ] Nested Routes
- [ ] Layouts
- [ ] Route Params
- [ ] Query Params
- [ ] Navigation
- [ ] Protected Routes
- [ ] 404 / Error Routes

### Project Checkpoint 05

تبدیل پروژه به یک application چندصفحه‌ای:

- Layout
- Dashboard
- List pages
- Detail/Edit pages
- Protected sections
- Navigation

---

## Phase 7 — API & Server State

**Priority: Critical for Real Projects**

API fundamentals:

- [ ] Fetching Data
- [ ] Loading State
- [ ] Error State
- [ ] Request Lifecycle
- [ ] API Layer / Service Layer

TanStack Query:

- [ ] Queries
- [ ] Query Keys
- [ ] Cache
- [ ] `staleTime`
- [ ] Refetching
- [ ] Mutations
- [ ] Query Invalidation
- [ ] Optimistic Updates
- [ ] Pagination
- [ ] Infinite Queries
- [ ] Dependent Queries

Core concept:

> Client State ≠ Server State

### Project Checkpoint 06

اتصال پروژه به API یا Mock API و پیاده‌سازی:

- Lists
- Detail
- CRUD
- Loading
- Errors
- Pagination
- Filtering
- Mutations
- Cache invalidation

---

## Phase 8 — Global State Management

**Priority: High**

- [ ] When Context is Enough
- [ ] Zustand
- [ ] Redux Mental Model
- [ ] Redux Toolkit
- [ ] Selectors
- [ ] Normalized State
- [ ] Async State Patterns
- [ ] Pinia vs Zustand vs Redux Toolkit

قاعده:

قبل از اضافه‌کردن Global State Manager باید دلیل وجود global state مشخص باشد.

### Project Checkpoint 07

در صورت نیاز واقعی پروژه:

- اضافه‌کردن Zustand یا Redux Toolkit
- انتقال فقط stateهایی که واقعاً global هستند
- بررسی اینکه چه stateهایی نباید global شوند

---

## Phase 9 — TypeScript with React

TypeScript fundamentals در مسیر جداگانه یاد گرفته می‌شوند؛ اینجا تمرکز روی استفاده آن‌ها در React است.

- [ ] Typing Props
- [ ] Typing `children`
- [ ] Events
- [ ] State
- [ ] Refs
- [ ] Reducers
- [ ] Context
- [ ] Custom Hooks
- [ ] API Types
- [ ] Generic Components
- [ ] React Hook Form Types

### Project Checkpoint 08

سخت‌گیری بیشتر روی Type Safety پروژه:

- Props contracts
- API models
- Forms
- Hooks
- State
- Reusable components

---

## Phase 10 — Rendering & Performance

**Priority: High for Engineering Depth**

- [ ] Rendering Tree
- [ ] Reconciliation
- [ ] Component Identity
- [ ] Keys & Identity
- [ ] Parent Re-render
- [ ] Child Re-render
- [ ] Referential Equality
- [ ] Closures
- [ ] Memoization
- [ ] `React.memo`
- [ ] `useMemo`
- [ ] `useCallback`
- [ ] React Profiler
- [ ] Expensive Calculations
- [ ] Code Splitting
- [ ] Lazy Loading
- [ ] Suspense Concepts
- [ ] Performance Anti-patterns

### Project Checkpoint 09

Performance Review واقعی روی پروژه:

- پیدا کردن re-renderهای غیرضروری
- تشخیص اینکه optimization لازم است یا نه
- Code splitting
- Profiling
- اصلاح bottleneckها بدون premature optimization

---

## Phase 11 — Testing

**Priority: High**

- [ ] Testing Philosophy
- [ ] Vitest
- [ ] React Testing Library
- [ ] Component Tests
- [ ] User Interaction Tests
- [ ] Mocking
- [ ] API Testing
- [ ] MSW
- [ ] Custom Hook Testing
- [ ] Integration Testing
- [ ] Playwright
- [ ] E2E Strategy

### Project Checkpoint 10

اضافه‌کردن test برای flowهای مهم پروژه:

- Critical UI behavior
- Forms
- API interactions
- Important user flows
- Selected E2E scenarios

---

# Phase 12 — Next.js

**Priority: High**

تمرکز اصلی روی App Router است.

- [ ] App Router
- [ ] Layouts
- [ ] Nested Routes
- [ ] Dynamic Routes
- [ ] Server Components
- [ ] Client Components
- [ ] `'use client'`
- [ ] Server / Client Boundaries
- [ ] Data Fetching
- [ ] Loading UI
- [ ] Error UI
- [ ] Suspense
- [ ] Streaming
- [ ] Mutations
- [ ] Caching
- [ ] Revalidation
- [ ] SSR
- [ ] SSG
- [ ] ISR
- [ ] Metadata / SEO
- [ ] Middleware
- [ ] Authentication Patterns
- [ ] Pages Router — Legacy Reading Knowledge

### Project Checkpoint 11

یکی از دو مسیر براساس شرایط آن زمان:

1. مهاجرت یا بازطراحی بخش‌هایی از پروژه اصلی با Next.js
2. ساخت یک پروژه کوچک مستقل با Next.js برای درک کامل App Router و Server Components

تصمیم در همان مرحله و براساس سطح یادگیری گرفته می‌شود.

---

# Phase 13 — Production React Architecture

**Priority: High**

- [ ] Folder Architecture
- [ ] Feature-based Architecture
- [ ] Component Boundaries
- [ ] Hooks Architecture
- [ ] API / Service Layer
- [ ] State Boundaries
- [ ] Reusable Components
- [ ] Design System Basics
- [ ] Error Boundaries
- [ ] Authentication Architecture
- [ ] Authorization / Permission Architecture
- [ ] Frontend Security Basics
- [ ] Accessibility
- [ ] Core Web Vitals
- [ ] Monitoring
- [ ] CI/CD Concepts

### Architecture Review

در این مرحله پروژه اصلی مثل یک پروژه production بررسی می‌شود:

- Structure
- Boundaries
- Reusability
- State
- Data Flow
- Errors
- Performance
- Maintainability
- Type Safety
- Tests

---

# Phase 14 — React Interview Preparation

این فاز کاملاً جدا از آموزش نیست و از ماه اول کم‌کم وارد جلسات می‌شود.

موضوعات مهم:

- [ ] Why does a React component re-render?
- [ ] Virtual DOM
- [ ] Reconciliation
- [ ] `key`
- [ ] State as a Snapshot
- [ ] Batching
- [ ] Stale Closures
- [ ] `useEffect`
- [ ] Effect vs Event
- [ ] Controlled vs Uncontrolled Components
- [ ] Context limitations
- [ ] Zustand vs Redux Toolkit
- [ ] `useMemo`
- [ ] `useCallback`
- [ ] Server State
- [ ] TanStack Query
- [ ] Suspense
- [ ] Server Components
- [ ] React vs Vue architectural differences

هدف جواب حفظی نیست؛ باید بتوان مفاهیم را با مثال واقعی و reasoning توضیح داد.

---

# Phase 15 — Low-Priority / Rare Topics

این بخش بعد از مباحث مهم بازار کار انجام می‌شود.

- [ ] Advanced Refs
- [ ] Portals
- [ ] Imperative Handles
- [ ] Unusual Hook Patterns
- [ ] Advanced Suspense Internals
- [ ] Legacy Class Components
- [ ] Legacy Lifecycle Methods
- [ ] Less-used React APIs

هدف این بخش آشنایی و توانایی خواندن codebase است، نه اولویت‌دادن به آن‌ها نسبت به مهارت‌های production.

---

# 5. Main Project Track

پروژه اصلی به‌احتمال زیاد یک:

## Admin / Operations Dashboard

خواهد بود.

نوع دقیق domain می‌تواند هنگام شروع پروژه مشخص شود، ولی پروژه باید قابلیت رشد داشته باشد و بتواند موارد زیر را پوشش دهد:

- Authentication
- Layout
- Dashboard
- Lists
- Search
- Filters
- Sorting
- Pagination
- CRUD
- Forms
- Validation
- API
- Loading / Error states
- Routing
- Permissions
- Server State
- Global State where justified
- TypeScript
- Testing
- Performance Review

هدف پروژه نمایش تعداد زیاد feature نیست؛ هدف استفاده صحیح از React در یک application واقعی است.

---

# 6. Timeline

## Month 1 — Job-Ready React

تمرکز:

- React Core
- Mental Model
- State
- Effects
- Hooks
- Forms
- Routing
- API
- TanStack Query
- State Architecture
- TypeScript in React
- پروژه عملی همزمان
- Basic Testing
- Next.js Fundamentals در صورت رسیدن

هدف:

> رسیدن سریع به سطحی که بتوان برای موقعیت‌های React اقدام کرد و همزمان یادگیری عمیق‌تر را ادامه داد.

---

## Month 2 — Strong React Engineer

تمرکز:

- Rendering
- Reconciliation
- Closures
- Advanced State Architecture
- Advanced TanStack Query
- Performance
- Testing
- Suspense
- Architecture
- پروژه عملی پیشرفته‌تر

---

## Month 3 — React / Next Engineering

تمرکز:

- Next.js
- Server Components
- Rendering Strategies
- Caching
- Revalidation
- Performance
- Architecture
- Production Patterns
- Frontend System Design
- Interview Depth

---

# 7. Progress Rules

هر موضوع یکی از وضعیت‌های زیر را دارد:

- `[ ]` Not Started
- `[~]` In Progress
- `[x]` Completed

یک موضوع زمانی Complete محسوب می‌شود که:

1. مفهوم آن قابل توضیح باشد.
2. بتوان آن را در کد استفاده کرد.
3. تفاوتش با approachهای مشابه فهمیده شده باشد.
4. اشتباهات رایج آن شناخته شده باشد.
5. تمرین مربوط به آن انجام شده باشد.

برای موضوعات مهم‌تر ممکن است یک Project Checkpoint نیز شرط تکمیل واقعی آن بخش باشد.

---

# 8. Core Principles

1. **React را با mental model آن یاد بگیر، نه با حفظ APIها.**
2. **از تجربه Vue/Nuxt به‌عنوان مزیت استفاده کن، نه اینکه React را Vue دیگری فرض کنی.**
3. **اول production patterns، بعد rare features.**
4. **هر مفهوم مهم باید با کد لمس شود.**
5. **پروژه بخشی از مسیر است، نه مرحله آخر.**
6. **Global state پیش‌فرض نیست.**
7. **`useEffect` راه‌حل پیش‌فرض نیست.**
8. **Performance optimization باید مبتنی بر دلیل و measurement باشد.**
9. **TypeScript باید در کد واقعی React استفاده شود.**
10. **هدف نهایی مهندسی Frontend است، نه صرفاً React Developer شدن.**

---

# 9. Starting Point

اولین جلسه رسمی:

## React 01 — Mental Model, Rendering, Components, JSX & State

تمرکز اولیه:

- React چگونه UI را می‌بیند؟
- Component چیست؟
- Function Component چگونه اجرا می‌شود؟
- JSX واقعاً چیست؟
- Render چه معنایی دارد؟
- چه چیزی باعث Re-render می‌شود؟
- State در React چگونه باید تصور شود؟

بعد از تثبیت این پایه وارد Hookها و رفتارهای پیچیده‌تر می‌شویم.

---

> **Status:** Ready to Start 🚀
