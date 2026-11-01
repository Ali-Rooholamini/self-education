export interface DemoLesson {
  id: string
  title: string
  minutes: number
  description: string
  example: string
}

export interface DemoCourse {
  id: string
  title: string
  symbol: string
  theme: string
  description: string
  hint: string
  lessons: DemoLesson[]
}

export const demoCourses: DemoCourse[] = [
  {
    id: 'typescript',
    title: 'تایپ‌اسکریپت، قدم‌به‌قدم',
    symbol: 'TS',
    theme: 'blue',
    description: 'از شناخت تایپ‌ها تا نوشتن کد مطمئن‌تر.',
    hint: 'قبل از اجرای مثال، حدس بزن خروجی هر شاخه چیست. توضیح دادن کد با زبان خودت، بخشی از یادگیری است.',
    lessons: [
      {
        id: 'ts-types',
        title: 'آشنایی با تایپ‌ها',
        minutes: 15,
        description:
          'برای نام یک دوره، تعداد درس‌ها و وضعیت تکمیل آن، تایپ مناسب انتخاب کن.',
        example:
          "const course: string = 'TypeScript'\nconst lessons: number = 4\nconst completed: boolean = false",
      },
      {
        id: 'ts-unions',
        title: 'تایپ‌های ترکیبی و محدودسازی',
        minutes: 20,
        description:
          'یک مقدار می‌تواند بیشتر از یک تایپ داشته باشد. با بررسی نوع آن، هر حالت را به‌درستی مدیریت کن.',
        example:
          "function formatId(id: string | number) {\n  if (typeof id === 'string') {\n    return id.toUpperCase()\n  }\n\n  return id.toString()\n}",
      },
      {
        id: 'ts-interfaces',
        title: 'مدل‌سازی با اینترفیس‌ها',
        minutes: 25,
        description:
          'ساختار یک قدم یادگیری را با عنوان و وضعیت تکمیل مدل کن و یک نمونه از آن بساز.',
        example:
          "interface LearningStep {\n  title: string\n  completed: boolean\n}\n\nconst step: LearningStep = {\n  title: 'Practice interfaces',\n  completed: false,\n}",
      },
      {
        id: 'ts-generics',
        title: 'اولین قدم با جنریک‌ها',
        minutes: 25,
        description:
          'تابعی بنویس که اولین عضو یک آرایه را بدون از دست دادن اطلاعات تایپ برگرداند.',
        example:
          "function first<T>(items: T[]): T | undefined {\n  return items[0]\n}\n\nconst topic = first(['TypeScript', 'Testing'])",
      },
    ],
  },
  {
    id: 'testing',
    title: 'تست‌نویسی با اطمینان',
    symbol: '</>',
    theme: 'purple',
    description: 'تمرین نوشتن تست‌هایی که به کد اعتماد می‌دهند.',
    hint: 'از رفتار قابل مشاهده شروع کن: چه ورودی می‌دهی و انتظار چه خروجی‌ای داری؟ تست خوب، همین انتظار را روشن می‌کند.',
    lessons: [
      {
        id: 'test-first',
        title: 'اولین تست معنادار',
        minutes: 15,
        description:
          'رفتار یک تابع جمع را با یک ورودی مشخص و خروجی مورد انتظار بررسی کن.',
        example:
          "import assert from 'node:assert/strict'\nimport { test } from 'node:test'\n\ntest('adds two numbers', () => {\n  assert.equal(2 + 3, 5)\n})",
      },
      {
        id: 'test-arrange',
        title: 'ساختار یک تست خوانا',
        minutes: 20,
        description:
          'آماده‌سازی، اجرای رفتار و بررسی نتیجه را در یک تست ساده از هم مشخص کن.',
        example:
          "import assert from 'node:assert/strict'\n\n// Arrange\nconst items = ['TypeScript']\n\n// Act\nconst result = items.includes('TypeScript')\n\n// Assert\nassert.equal(result, true)",
      },
      {
        id: 'test-boundaries',
        title: 'حالت‌های مرزی',
        minutes: 20,
        description:
          'برای یک فهرست خالی، رفتار مورد انتظار را تعریف کن و آن را با تست توضیح بده.',
        example:
          "import assert from 'node:assert/strict'\nimport { test } from 'node:test'\n\ntest('an empty list has no lessons', () => {\n  const lessons: string[] = []\n\n  assert.equal(lessons.length, 0)\n})",
      },
      {
        id: 'test-refactor',
        title: 'بازنویسی با خیال راحت',
        minutes: 25,
        description:
          'پیاده‌سازی را ساده‌تر کن و بررسی کن که رفتار تعریف‌شده در تست، همچنان برقرار است.',
        example:
          "import assert from 'node:assert/strict'\n\nconst isComplete = (done: number, total: number) =>\n  total > 0 && done === total\n\nassert.equal(isComplete(4, 4), true)\nassert.equal(isComplete(0, 4), false)",
      },
    ],
  },
]
