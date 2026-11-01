# گفت‌وگوی آموزشی و مسیرهای مکمل

منبع: متن فارسی ارسال‌شده توسط صاحب پروژه در همین گفتگو. این فایل ثبت ساخت‌یافته و وفادار به محتوای آن است، نه رونوشت کلمه‌به‌کلمه. فایل React جداگانه، برنامهٔ دقیق و بازِ تأییدشدهٔ React است. مسیرهای این فایل پیشنهاد هستند.

## درخواست یادگیرنده

یادگیری TypeScript، React و Testing هم‌اکنون دنبال می‌شود. پرسش اصلی این است که چطور Frontend System Design، JavaScript / Browser Fundamentals و Performance را هم به‌صورت جلسهٔ آموزشی و تمرین عملی یاد بگیریم تا در پروژه، مصاحبهٔ Senior Frontend و ارزیابی کار agentها قابل استفاده باشند. پیش‌زمینهٔ Vue/Nuxt یک مزیت است؛ هدف صرفاً یادگیری syntax نیست.

## قرارداد جلسه

یک مفهوم اصلی → مثال واقعی Frontend → مقایسه با Vue/Nuxt → یک یا دو پرسش برای mental model → تمرین کوچک → دریافت پاسخ یادگیرنده → بررسی و اصلاح → سناریوی واقعی یا مصاحبه‌ای. پس از چند مفهوم مرتبط یک Integration Exercise و در breakpointهای مهم یک مسئلهٔ طراحی یا پروژهٔ بزرگ‌تر انجام می‌شود. پروژه نه به انتهای مسیر موکول می‌شود و نه بعد از هر مفهوم از صفر شروع می‌شود.

## JavaScript / Browser Fundamentals

### JavaScript Core

Execution Context، Call Stack، Scope، Lexical Scope، Closures، Hoisting، this، Primitive vs Reference، Equality، Coercion، Object / Prototype، Prototype Chain، معنای واقعی Classes، Functions، Higher Order Functions و Immutability / Mutation.

### Async JavaScript

Event Loop، Task / Macrotask، Microtask، Promise، async/await، Promise chaining، Error propagation، Promise.all، Promise.allSettled، Race conditions و AbortController. سناریوی چند API شرطی و Promise.allSettled نمونهٔ واقعی مناسب برای تمرین است.

### Browser

Browser architecture در حد لازم، HTML parsing، DOM، CSSOM، Render Tree، Layout، Paint، Composite، Main Thread، Web APIs، Event Loop در Browser، Event propagation، Capturing / Bubbling و Event delegation.

Storage: Cookie، localStorage، sessionStorage، IndexedDB، Cache API و HTTP cache. امنیت پایه: CORS، Same Origin Policy، Cookies + SameSite. حافظه: Memory / Garbage Collection و Memory leaks.

### Network برای Frontend

DNS، HTTP، HTTPS، TCP در حد conceptual، Request / Response، Headers، Cookies، Cache-Control، ETag، CDN، Compression، HTTP/2 و HTTP/3 در حد مفهوم. هدف شبکهٔ دانشگاهی نیست؛ قضاوت عملی Frontend است.

## Performance

منطق مسیر: مرورگر چه می‌کند؟ → چه چیزی کند است؟ → چطور اندازه می‌گیریم؟ → چطور مشکل را پیدا می‌کنیم؟ → چطور بهبود می‌دهیم؟ حفظ تکنیک‌های بهینه‌سازی جای این روند را نمی‌گیرد.

- Foundations: Loading vs Runtime Performance، CPU vs Network bottleneck، Rendering pipeline، Main thread، Long tasks.
- Measurement: Chrome DevTools، Network tab، Performance tab، Lighthouse، Performance API، Core Web Vitals؛ LCP، CLS، INP و TTFB.
- Network Performance: Bundle size، Compression، CDN، caching، preloading، prefetching، lazy loading، image optimization و fonts.
- JavaScript Performance: expensive computation، unnecessary work، event handlers، memory leaks، large DOM و scheduling.
- Framework Performance: Vue rendering، React rendering، SSR، CSR، hydration، code splitting، dynamic imports و memoization.

تمرین عملی: «این صفحه کند شده؛ از کجا شروع می‌کنی؟» ابتدا hypothesis و اندازه‌گیری، سپس Network / Main thread / Rendering / API / JS bundle / Images / Re-render / Memory. useMemo به‌تنهایی تضمین performance نیست.

## Frontend System Design

تجربه‌های Nuxt Layers، shared auth، design system، project boundaries و architecture باید به یک چارچوب تصمیم‌گیری تبدیل شوند.

- Foundations: Requirements gathering، Functional / Non-functional requirements، Constraints، Scale و Trade-offs.
- Architecture: SPA / MPA، CSR / SSR / SSG / ISR، BFF، Monolith Frontend، Micro Frontends، Modular Frontend، Feature-based architecture و Layered architecture.
- State Design: Local، Global، Server، URL، Form و Persistent state. جای درست state چیست؟ Component، Context، TanStack Query، Zustand، URL، Cookie یا Server؟
- Data Layer: API architecture، REST / GraphQL برای تصمیم‌گیری، caching، invalidation، pagination، optimistic update، retry، error handling و offline considerations.
- Authentication / Authorization: RBAC، Token lifecycle، Refresh token، Cookie vs storage، Route protection و Permission architecture؛ shared authentication میان چند پروژه یک case study مناسب است.
- Component / Design System: Component boundaries، Composition، Headless components، tokens، reusable vs over-abstraction، shared components و domain components.
- Performance / Scalability: CDN، asset strategy، code splitting، caching، SSR، edge و monitoring.
- Reliability: Error boundaries، graceful degradation، retries، fallbacks، observability، logs، metrics، monitoring، feature flags و rollback.
- Team Scale: ownership، repository boundaries، conventions، architecture rules، dependency rules، shared infrastructure، CI، review و documentation.
- Agentic Architecture: مرزبندی و مستندسازی‌ای که انسان و agent بتوانند با حفظ داده و کیفیت روی codebase کار کنند.

تمرین طراحی: marketplace شبیه Starshop با seller panel و buyer web، authentication مشترک، محصولات و تیم‌های بیشتر در آینده. مربی با «چرا؟»، «اگر ده برابر شد؟»، «کدام state در URL است؟»، «cache و permission و failure کجا هستند؟» تصمیم‌ها را به چالش می‌کشد؛ سپس راه‌حل refine می‌شود.

## منابع و کتاب‌ها

سرفصل‌ها از ترکیب مفاهیم کاربردی specification جاوااسکریپت، MDN، browser fundamentals، web.dev / Chrome، React/Vue/Nuxt، منابع معتبر System Design، الگوهای مصاحبهٔ Senior، کتاب‌های یادگیرنده و مسئله‌های واقعی پروژه شکل می‌گیرند. هیچ PDF در این مرحله ارائه نشده است.

برای You Don't Know JS و کتاب‌های دیگر: ابتدا ساختار و فصل‌ها بررسی شود. هر فصل به Core، Optional یا Later تقسیم شود. فصل → مفهوم → توضیح ساده → مثال جدید Frontend → تمرین → پاسخ → بازخورد → پرسش عمیق‌تر. جزئیات کم‌ارزش برای هدف فعلی در حد مفهوم بمانند. هدف مهندسی Frontend است؛ کتاب ابزار آن است.

## زمان‌بندی و اولویت

- اصلی: React، TypeScript، Testing.
- JS / Browser: یک جلسه در هفته.
- Performance: پس از چند هفته و آشنایی با پایهٔ Browser.
- System Design: یک case study در هر ۷ تا ۱۰ روز؛ به‌دلیل تجربهٔ موجود می‌تواند از حالا شروع شود.
- برای مسیرهای مکمل، گفت‌وگوهای مستقل داشته باشیم؛ از بار هم‌زمان چند دورهٔ سنگین پرهیز کنیم.

## هدف مهندسی

این موضوع‌ها را کامل به agent واگذار نکنیم. یادگیرنده باید بتواند پیشنهاد useMemo، global state، async flow و race condition را ارزیابی کند. قضاوت مهندسی و توان توضیح‌دادن تصمیم‌ها هدف اصلی است.
