# تقرير فحص + خطة إصلاح موقع DUNAS TRAVEL

**الموقع الفحص:** `https://dunastravel-frontend.vercel.app/`
**أداة الفحص:** Google Lighthouse (الإصدار 13.x — نفس إعدادات PageSpeed Insights)
**المواصفات المفحوصة:** Mobile (هاتف) — شاشة 412×915 ، اتصال 4G بطيء
**تاريخ الفحص:** 14/09/2026

---

## خلاصة النتائج

| القسم | النتيجة | الحالة |
|---|---|---|
| الأداء Performance | **0 / 100** | 🔴 فاشل |
| أفضل الممارسات Best Practices | **73 / 100** | 🟠 متوسط |
| إمكانية الوصول Accessibility | **93 / 100** | 🟢 شبه ممتاز |
| SEO | **100 / 100** | 🟢 ممتاز |

> ملاحظة: نتيجة الأداء حوالين الصفر بسبب حجم الصفحة الهائل (4.1 MB) وتحميل كل ملفات اللغات معًا — مع الإصلاحات أدناه نتوقع ارتفاعها إلى 80–95.

---

# قائمة المشاكل بترتيب الإصلاح (من الأهم للأقل تأثيرًا)

---

## المشكلة 1 — تحميل كل ملفات الترجمة (locale) الخمسة مرة واحدة

### 🎯 الأولوية: حرجة جدًا (أكبر مشكلة أداء في الموقع)

- **اختبار Lighthouse:** `total-byte-weight` (Avoid enormous network payloads) — النتيجة 50/100
- **الحجم الإجمالي للصفحة:** 4,226 KB (المطلوب أقل من 1,600 KB)

### 📋 التفاصيل

الموقع React + React Router + i18n، والصفحة الرئيسية بتنزل **كل** ملفات الترجمة الخمسة بمجرد فتح الموقع، رغم إن المستخدم محتاج لغة واحدة بس:

| الملف | الحجم الخام | الحجم المضغوط (transfer) |
|---|---|---|
| `/assets/locale-ar-BiJ8hmBo.js` | 1,606 KB | 296 KB |
| `/assets/locale-es-OyeK8s1K.js` | 1,334 KB | 237 KB |
| `/assets/locale-it-RP9y6COs.js` | 1,327 KB | 243 KB |
| `/assets/locale-pt-DdRvvd8z.js` | 1,326 KB | 235 KB |
| `/assets/locale-en-DZ7yGcq1.js` | 1,283 KB | 202 KB |
| **المجموع** | **~6.9 MB** | **~1.2 MB** |

> كل ملف تحويلي فيه ترجمة الصفحة كاملة (Resources translations). ده معناه إن المستخدم بيطّلع كل ترجمات الدنيا (ar + en + es + it + pt) وبيستخدم واحدة بس.

### 🔧 طريقة الحل

الهدف: تحميل ملف اللغة الحالية فقط، وباقي اللغات عند الحاجة (lazy / dynamic import).

1. **قسّم ملفات الترجمة نفسها** — بدل ما يكون فيه ملف `locale-XXX.js` واحد جامد فيه كل صفحات الموقع في Key/Value كلها، قسّمها لكل صفحة/سيناريو (Home, Tours, Auth, Admin...) عشان كل route يحمّل الترجمات بتاعته بس.
   - هذا يتم داخل إعدادات i18next التقسيم: `ns: ['common', 'home', 'tours', 'auth', ...]` + `nsSeparator`.
   - اضبط `react-i18next` على `useSuspense: true` مع `Suspense` لكل route.

2. **خلّي i18next يحمّل اللغة النشطة فقط**:
   ```ts
   // i18n.ts
   i18n
     .use(initReactI18next)
     .use(LanguageDetector)
     .init({
       lng: 'en', // أو من الـ localStorage / URL
       fallbackLng: 'en',
       supportedLngs: ['en', 'ar', 'es', 'it', 'pt'],
       ns: ['common', 'home', 'tours', 'auth', 'booking', 'admin'],
       defaultNS: 'common',
       interpolation: { escapeValue: false }
     });
   ```

3. **الحمل الـ lazy** (لو بتستخدم backend خارجي حاليًا):
   ```ts
   i18n.use({
     type: 'backend',
     load: (language, namespace, callback) => {
       import(`../locales/${language}/${namespace}.json`).then(
         (mod) => callback(null, mod.default),
         (err) => callback(err)
       );
     }
   });
   ```

4. **غيّر إعداد الـ bundler**: الظاهر أن الملفات بيتولدوا كـ chunk منفصلة بس بيتطلبهم كلهم من كود الـ import الساكن (static import) في bootstrap. اتأكد إن كل import بيستخدم `await import(...)` (dynamic) مش `import ... from`.

5. **قبل الحل / لو مستعجل**: حوّل `preload` or اضبط من CDN — بس الحل الجذري فوق.

6. **تحقق**: بعد الإصلاح، من Network tab هتلاقي ملف `locale-en-...js` واحد بس بيتطلب. وأعد فحص Lighthouse.

---

## المشكلة 2 — انخفاض السرعة بسبب JavaScript ضخمة في الصفحة الرئيسية

### 🎯 الأولوية: عالية جدًا

- **ملفات مشبوهة:** `Home-DkYSnUgn.js` (291 KB raw) ، `index-CCQACbdm.js` (128 KB) ، `vendor-react-dom` (178 KB) ، `vendor-motion` ، `vendor-icons*` وغيرها من حِزَم بالحجم كبير
- عدد السكربتات في الصفحة: **32 Script**.

### 📋 التفاصيل

كل الـ sections في الصفحة الرئيسية (Hero, Slider, Destinations, Packages, FAQ, Footer...) بتتسحب في bundle واحد `Home-*.js`. الكود ده كله بيعدّي على الـ parser والـ compiler والـ execution على الـ main thread — وده بيظهر في Lighthouse على صورة `Unused JavaScript`, `Largest Contentful Paint`, `Total Blocking Time` عالية.

### 🔧 طريقة الحل

- **قسّم الصفحة الرئيسية برضه** — RSC / React.lazy لكل section كبير:
  ```tsx
  const Packages = lazy(() => import('./components/Packages'));
  const Destinations = lazy(() => import('./components/Destinations'));
  const GallerySlider = lazy(() => import('./components/GallerySlider'));

  function Home() {
    return (
      <>
        <Hero />                                 {/* critical، بتسريع فوق الـ fold */}
        <Suspense fallback={<section/>}>
          <Destinations />
          <Packages />
          <GallerySlider />
        </Suspense>
      </>
    );
  }
  ```
- **أي library زي `motion`, `icons*`, `gsap`** — نزلها على النص بـ `React.lazy` لكل section بيستخدمها، أو فعّل `manualChunks` بحيث التوزيع يطلع منطقي.
- **استعمل `defer` / modulepreload** بشكل صحيح. البنية الحالية (`<script type="module" crossorigin src="/assets/index-CCQACbdm.js">`) كويسة، بس اتأكد من إعداد `build.cssCodeSplit` وتقسيم الـ chunks.

### 🎯 تحقق
شوف `Largest Contentful Paint` تبقى أقل من 2.5s بعد الحل.

---

## المشكلة 3 — صور JPG كبيرة غير محسّنة وبدون WebP

### 🎯 الأولوية: عالية

- **اختبار Lighthouse:** `uses-optimized-images` و `modern-image-formats` بيشتكوا من صورة 190 KB+ بصيغة JPG.
- الصور المشغولة من `res.cloudinary.com/degbrq3ck` (النطاق التاني لسحابة الصور بتاعت البيانات/الرحلة):

| الصورة | الحجم | الصيغة |
|---|---|---|
| `3776ecde-249e-4183-9840-e9fd900ad96b_xvmumu.jpg` | 241 KB | JPG ❌ |
| `80f6f47a-4938-4684-aaf1-b1e61d44dab6_n8vdtl.jpg` | 241 KB | JPG ❌ |
| `2ec72126-709b-4c8d-8f7b-a592d212cc3b_czpoig.jpg` | 190 KB | JPG ❌ |
| `dad14822-455c-419c-8627-32b3daebef90_akfw3l.jpg` | 179 KB | JPG ❌ |

### 🔧 طريقة الحل

- الصور دي بتنزل من Cloudinary — فعّل تحويل WebP/AVIF + ضغط تلقائي في الـ `<img>`:
  ```
  https://res.cloudinary.com/degbrq3ck/image/upload/v.../xxx.jpg
  ↓ حولها في الكود لـ
  https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto:eco,w_...,/v.../xxx.webp
  ```
  (فهم: `f_auto` هدفها أفضل صيغة حسب المتصفح، `q_auto:eco` ضغط ذكي، `w_` حسب حجم العرض.)
- **أضف `srcset` + `sizes`** لكل `<img>` عشان المتصفح ينزل الحجم المناسب بس ولا ينزل 1920px على موبايل 412px:
  ```tsx
  <img
    src="...f_auto,q_auto/c_limit,q_auto,w_600/... "
    srcSet="...w_300 300w, ...w_600 600w, ...w_1000 1000w"
    sizes="(max-width: 768px) 100vw, 50vw"
    loading="lazy"
    fetchPriority="auto"
  />
  ```
- **خد بالك من hero image**: الـ `/imgs/slider-abu-simbel.webp` الموجودة عبارة عن `preload as="image"` — اتأكد إنها هي فعلاً الصورة المشتركه في الـ LCP، وضبط أبعادها `width/height` منعًا للـ layout shift.

### 🎯 تحقق
لا تسيب أي صورة فوق 150 KB في الـ Network tab، وكل الصور بصيغة webp/avif.

---

## المشكلة 4 — CSS ضخم (210 KB) معظمه غير مستعمل

### 🎯 الأولوية: متوسطة

- **ملف:** `/assets/index-BUHT75Ru.css` — **210 KB** خام / 29 KB مضغوط
- **اختبار Lighthouse:** `unused-css-rules` (Reduce unused CSS)

### 📋 التفاصيل

أغلب الـ CSS ده كلاسيس Tailwind جاهز بكل القيم (كل `text-[#F5A623]` و `sm:` و `md:`... إلخ) مفيش purge فعل — أو الـ CSS ده بيحتوي ذيل orig أنماط سويسر للمكتبات زي swiper و fontawesome بدون ما يتقصّ.

### 🔧 طريقة الحل

1. **أتأكد من إعداد Tailwind content paths** مظبوطة في `tailwind.config`:
   ```js
   // tailwind.config.js
   module.exports = {
     content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
     safelist: [] // خليها فاضية، لا تفتعلها
   }
   ```
2. **اصنع purge في البناء** (يعتمد على Vite): فعّل `build.cssCodeSplit: true` واديك بتقسم كل route بياخد CSS بتاعه.
3. **لو بتستورد مكتبة CSS كاملة** (زي `swiper/css`, `font-awesome`) استبدلها بـ استيراد الانتقائي:
   ```ts
   import 'swiper/css';
   ```
   بدل ما تستورد كل حاجة، أو حوّل كل شيء لـ bring-your-own-css من المكتبة.

---

## المشكلة 5 — خطأ 401 في الـ Console (خادم backend مش مستقر الجلسة)

### 🎯 الأولوية: حرجة (تأثير مباشر على الـ Best Practices + تجربة المستخدم)

- **اختبار Lighthouse:** `errors-in-console` — النتيجة 0/1
- **الخطأ:** `Failed to load resource: the server responded with a status of 401 ()`
- **المصدر:** `GET https://dunastravel-backend-seven.vercel.app/api/auth/me`

### 📋 التفاصيل

عند فتح الموقع بدون تسجيل دخول، الـ `/api/auth/me` بيرجع **401 Unauthorized**، والكود بيمشي عليه عادي من غير ما يعمل catch، فبيطلع خطأ في الـ console (وبيأثر على Lighthouse و على الـ Issues).

### 🔧 طريقة الحل

في الـ fetch/axios layer بتاع `auth/me`، عالج الـ 401 كأمر طبيعي من غير ما يطلع error:

```ts
const res = await api.get('/api/auth/me', { validateStatus: (s) => s < 500 });
if (res.status === 401) {
  // مستخدم غير مسجل → user = null
  setUser(null);
  return;
}
```

- أو في الاتجاه السليم lad الشكل: اعتمد على `csrf` token و `session` مش لازم تسأل على `/me` أصلاً في أول تحميل.
- اتأكد إن الـ backend بياخد الـ `csrf_token` cookie صح على ملف `SameSite` و `Secure`.

### 🎯 تحقق
من بعد الحل، افتح الصفحة وافحص الـ Console — مفيش أي خطأ أحمر.

---

## المشكلة 6 — تحذيرات Cookies / Issues في DevTools

### 🎯 الأولوية: متوسطة

- **اختبار Lighthouse:** `inspector-issues` (Issues panel) — النتيجة 0/1
- **الكوكيز/المصادر:** `csrf_token` من `https://dunastravel-backend-seven.vercel.app/api/auth/csrf` (+ 11 endpoint API تاني بنفس الدومين).
- **اختبار ثالث:** `third-party-cookies` — نتيجة 0/1: "Uses third-party cookies".

### 📋 التفاصيل

الـ backend (`dunastravel-backend-seven.vercel.app`) بيبعت كوكيز على الدومين بتاعه وهي domain مختلف عن الـ frontend (`dunastravel-frontend.vercel.app`) — يعني جهة تالتة (third-party) للمتصفح، ومتصفحات حديثة (Chrome/Edge/Safari) ممكن تبدأ تحظرها → هيكسر الـ auth و الـ CSRF و الـ session.

### 🔧 طريقة الحل

1. **بديل صحيح**: انقل الـ API على نفس الدومين (reverse proxy / NextJS rewrites أو subpath زي `dunastravel-frontend.vercel.app/api`) بحيث الكوكيز تبقى first-party.
2. **أو**: فعّل `SameSite=None; Secure` على الكوكيز، وبعت الـ CSRF عبر header بدل cookie — نظام آمن بصرف النظر عن جهة ثالثة.
3. **تعامل مع تحذير DevTools**: اتفقد أن كل استجابة backend فيها `Set-Cookie` بخصائص `Secure` و `HttpOnly` و `SameSite` الصحيحة.

---

## المشكلة 7 — Source Maps مفقودة لملفات JavaScript

### 🎯 الأولوية: منخفضة (تحسين developer experience + دقة فحص Lighthouse)

- **اختبار Lighthouse:** `valid-source-maps` — النتيجة 0/1
- **الملفات الـ 5:** `locale-en/ar/es/it/pt-*.js` (كل ملفات الترجمة).

### 🔧 طريقة الحل

- فعّل توليد الـ source maps في البناء الإنتاجي لكن من غير ما تنشر كود المصدر بطريقة غلط:
  ```ts
  // vite.config.ts
  build: { sourcemap: true }
  ```
- أو خليها `sourcemap: 'hidden'` إذا حسّيت إن السورس معروض علي الإنترنت.
- دي أسهل مشكلة وتفيد في الـ debugging بعد كده.

---

## المشكلة 8 — تباين ألوان غير كافٍ (نص أصفر على خلفية فاتحة)

### 🎯 الأولوية: عالية (إمكانية الوصول — نصوص: أقرأها بلا مشاكل)

- **اختبار Lighthouse:** `color-contrast` — النتيجة 0/1
- **العنصر:** `<span class="text-[#F5A623] dark:text-[#F5A623] uppercase tracking-widest text-caption ...">`
- **الموقع:** في `section.py-12 > div.container > div.text-center` (قسم في الصفحة الرئيسية)
- **المواصفات:** النص الأصفر `#f5a623` على خلفية `#f8f9ff` — تباين **1.92:1** والمطلوب **4.5:1** على الأقل لفئة AA.

### 🔧 طريقة الحل

نحلل درجة اللون الأصفر بتاعك (لأن الصودا الأصفر الفاتح دا لا يتحقق فيه التباين لوحده على الأبيض):

- على الخلفية الفاتحة `#f8f9ff` استعمل **`#B45309`** (Tailwind `amber-600`) بدل `#F5A623`:
  - التباين المحسوب لـ `#B45309` على خلفية `#f8f9ff` ≈ **4.77:1** ✓ (يتجاوز الـ 4.5 المطلوب).

```tsx
<span className="text-[#B45309] dark:text-[#F5A623] uppercase tracking-widest text-caption">
```
> (في المود الداكن خليه `#F5A623` لأن الخلفية هناك غامقة، بس اتأكد بالقياس إنه >= 4.5 على خلفيتك الداكنة.)
> (خلي المود الداكن أسبق، والتقيت المقترح على الفاتح.)

### 🎯 تحقق
أعد فحص و تأكد إن الاختبار `color-contrast` مبقاش فاشل.

---

## المشكلة 9 — أزرار السلايدر (dots) صغيرة الحجم 12×12px

### 🎯 الأولوية: متوسطة (إمكانية الوصول)

- **اختبار Lighthouse:** `target-size` — النتيجة 0/1
- **العناصر:** `button.dot-slide` (النقط بتاعت سلايدر الهيرو):
  - `div.main-slider-wrpper > div.swiper > div.travel-slider-dots > button.dot-slide`
  - الموجود منها: "Go to slide 2" و "Go to slide 3"
- **الحجم الحالي:** **12×12px** — المطلوب **أدنى 24×24px** والتباعد الدائري الأمن 24px.

### 🔧 طريقة الحل

- زوّد أبعاد النقطة مع الحفاظ على الشكل المرئي (نقطة صغيرة بس مساحة لمس كبيرة):
  ```scss
  .travel-slider-dots button.dot-slide {
    width: 24px;
    height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
  }
  .travel-slider-dots button.dot-slide::before {
    content: '';
    width: 12px;      /* الشكل المرئي مظبوط */
    height: 12px;
    border-radius: 9999px;
    background: currentColor;
    opacity: 0.4;
  }
  .travel-slider-dots button.dot-slide[aria-current]::before {
    background: #F5A623;
    opacity: 1;
  }
  ```
- زوّد الـ `gap` بين الأزرار لـ 8px+ عشان تحقق المسافة المطلوبة.

---

## المشكلة 10 — الـ الرموز accessibility (aria-label) غير مطابقة للنص الظاهر

### 🎯 الأولوية: متوسطة (إمكانية الوصول)

- **اختبار Lighthouse:** `label-content-name-mismatch` — النتيجة 0/1
- **العناصر الثلاثة (مكتوبة بإعادة التحديد)**:

| # | العنصر | النص الظاهر | aria-label الحالي | المشكلة |
|---|---|---|---|---|
| 1 | `button.currency-btn` في الهيدر | `$ USD` | `Switch display currency to US Dollar` | المسمى لا يشمل كلمة `$ USD` |
| 2 | `button.h-6` (اختيار اللغة) | `EN` | `Select language` | المسمى لا يشمل `EN` |
| 3 | `div[role=button]` في معرض صور | `GENERAL / Aswan Philae Temple Serenity / Explore Photo` | `View Full Size Image: Aswan Philae Temple Serenity` | المسمى لا يشمل `GENERAL` و `Explore Photo` |

### 🔧 طريقة الحل

القاعدة (WCAG 2.5.3 Label in Name): **الـ accessible name لازم يضم النص الظاهر حرفيًا** بحيث يعرف مستخدم قارئ الشاشة يعمل Voice match.

1. **زر العملة**: خلي الـ label يبدأ بالنص الظاهر:
   ```tsx
   <button aria-label={`${label}, ${currency}`} className="currency-btn ...">
     {label} {currency}
   </button>
   // مثال: aria-label="$ USD, Switch display currency to US Dollar"
   ```
2. **زر اللغة**: عند فتح الـ dropdown، كلمة اللغة نفسها تكون في الـ accessible name:
   ```tsx
   <button aria-label={`Select language: ${currentLang}`} ...> EN </button>
   ```
   أو وفّر على الأقل في نص المسمى.

3. **بطاقة الصورة في المعرض**: اجعل `aria-label` يتضمن `GENERAL`, `Aswan Philae Temple Serenity`, `Explore Photo` كلها نص عربي وأجنبي ومعاً:
   - إما حذف الـ aria-label وترك النص الظاهر يكون هو الـ name عبر النصوص داخل الـ div.
   - أو: `aria-label="GENERAL, Aswan Philae Temple Serenity, Explore Photo — View Full Size Image"`.

4. **الأفضل**: ضف `aria-hidden="true"` على الأيقونات الزينة داخل الأزرار وخلّي النص الأساسي هو الـ accessible name مباشرة:
   ```tsx
   <button aria-label={`${visibleText} — ${action}`}>
     {visibleText}
     <i aria-hidden="true" />
   </button>
   ```

---

# خطة التنفيذ المقترحة (بالترتيب)

| الخطوة | المشكلة | الجهد التقديري | الأثر |
|---|---|---|---|
| 1 | حِمل اللغات الـ lazy (مشكلة 1) | يوم | 🔴 هائل |
| 2 | تقسم Home لـ React.lazy (مشكلة 2) | نصف يوم | 🔴 كبير |
| 3 | WebP + srcset للصور (مشكلة 3) | ساعة–ساعتين | 🔴 كبير |
| 4 | معالجة 401 auth/me (مشكلة 5) | ساعة | 🔴 كبير (تجربة المستخدم) |
| 5 | تباين الأصفر #F5A623 (مشكلة 8) | 15 دقيقة | 🟠 متوسط |
| 6 | أزرار السلايدر 24px (مشكلة 9) | 15 دقيقة | 🟠 متوسط |
| 7 | aria-labels المطابقة (مشكلة 10) | 30 دقيقة | 🟠 متوسط |
| 8 | CSS purge / تقسيم (مشكلة 4) | يوم | 🟡 متوسط |
| 9 | Cookies / CSRF first-party (مشكلة 6) | يوم–نصف | 🟡 متوسط |
| 10 | Source maps (مشكلة 7) | 10 دقائق | 🟢 ضئيل |

# بعد الإصلاح — إعادة الفحص

1. `npx lighthouse https://dunastravel-frontend.vercel.app/ --form-factor=mobile --output=json --output-path=report.json`
2. أو من PageSpeed Insights: `https://pagespeed.web.dev/`
3. الأهداف:
   - Performance ≥ 80 (الهدف النهائي 90+)
   - Accessibility 100
   - Best Practices 100
   - SEO 100

---

*التقرير جاهز للإرسال لأي IDE ذكاء اصطناعي (مثل Antigravity) وإعطائه الملف مباشرة وطلب تنفيذ الإصلاحات بالترتيب أعلاه.*