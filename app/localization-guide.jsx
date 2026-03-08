import { useState } from "react";

const tabs = ["What is i18n?", "How it Works", "Integration Guide", "File Structure"];

const codeSnippets = {
  install: `npm install next-intl`,

  middlewareConfig: `// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'bn', 'fr', 'ar'],
  defaultLocale: 'en',
  localeDetection: true, // auto-detect from browser
});

export const config = {
  matcher: ['/((?!api|_next|.*\\\\..*).*)'],
};`,

  nextConfig: `// next.config.ts
import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const config: NextConfig = {
  // your existing config
};

export default withNextIntl(config);`,

  i18nRequest: `// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(\`../../messages/\${locale}.json\`)).default,
  };
});`,

  routing: `// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'bn', 'fr', 'ar'],
  defaultLocale: 'en',
});`,

  enJson: `// messages/en.json
{
  "nav": {
    "home": "Home",
    "about": "About",
    "login": "Login",
    "logout": "Logout"
  },
  "auth": {
    "signIn": "Sign In",
    "signOut": "Sign Out",
    "email": "Email",
    "password": "Password",
    "welcomeBack": "Welcome back, {name}!"
  },
  "dashboard": {
    "title": "Dashboard",
    "greeting": "Hello, {name}!",
    "statsTitle": "Your Stats"
  },
  "errors": {
    "notFound": "Page not found",
    "unauthorized": "You are not authorized"
  }
}`,

  bnJson: `// messages/bn.json
{
  "nav": {
    "home": "হোম",
    "about": "সম্পর্কে",
    "login": "লগইন",
    "logout": "লগআউট"
  },
  "auth": {
    "signIn": "সাইন ইন",
    "signOut": "সাইন আউট",
    "email": "ইমেইল",
    "password": "পাসওয়ার্ড",
    "welcomeBack": "স্বাগতম, {name}!"
  },
  "dashboard": {
    "title": "ড্যাশবোর্ড",
    "greeting": "হ্যালো, {name}!",
    "statsTitle": "আপনার পরিসংখ্যান"
  }
}`,

  folderStructure: `src/
├── app/
│   └── [locale]/           ← locale as dynamic segment
│       ├── layout.tsx
│       ├── page.tsx
│       ├── dashboard/
│       │   └── page.tsx
│       └── auth/
│           └── page.tsx
├── i18n/
│   ├── routing.ts
│   └── request.ts
├── middleware.ts
└── messages/
    ├── en.json
    ├── bn.json
    ├── fr.json
    └── ar.json`,

  layoutExample: `// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}`,

  useTranslations: `// src/app/[locale]/page.tsx (Server Component)
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('nav');

  return (
    <nav>
      <a href="/">{t('home')}</a>
      <a href="/about">{t('about')}</a>
    </nav>
  );
}`,

  clientComponent: `// src/components/Greeting.tsx (Client Component)
'use client';
import { useTranslations } from 'next-intl';

export default function Greeting({ name }: { name: string }) {
  const t = useTranslations('auth');

  // Interpolation - passes variables into translations
  return <h1>{t('welcomeBack', { name })}</h1>;
  // Output (en): "Welcome back, John!"
  // Output (bn): "স্বাগতম, John!"
}`,

  languageSwitcher: `// src/components/LanguageSwitcher.tsx
'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'bn', label: 'বাংলা', flag: '🇧🇩' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'عربي', flag: '🇸🇦' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const switchLocale = (newLocale: string) => {
    // Replace current locale prefix in URL
    const newPath = pathname.replace(\`/\${currentLocale}\`, \`/\${newLocale}\`);
    router.push(newPath);
  };

  return (
    <select
      value={currentLocale}
      onChange={(e) => switchLocale(e.target.value)}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.label}
        </option>
      ))}
    </select>
  );
}`,

  withNextAuth: `// src/app/[locale]/auth/page.tsx
// ✅ next-intl + NextAuth work seamlessly together
import { useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';

export default function AuthPage() {
  const t = useTranslations('auth');

  return (
    <form>
      <h1>{t('signIn')}</h1>
      <input placeholder={t('email')} type="email" />
      <input placeholder={t('password')} type="password" />
      <button onClick={() => signIn('credentials', { ... })}>
        {t('signIn')}
      </button>
    </form>
  );
}

// ⚠️ Update middleware.ts to handle both next-intl & NextAuth:
// Chain them together carefully — next-intl handles locale routing,
// NextAuth handles auth guards. Both use matchers.`,
};

const steps = [
  { num: "01", title: "Install next-intl", key: "install", desc: "The most popular i18n library for Next.js App Router" },
  { num: "02", title: "Define Routing", key: "routing", desc: "Declare your supported locales and default" },
  { num: "03", title: "Setup Middleware", key: "middlewareConfig", desc: "Intercepts requests and redirects to correct locale" },
  { num: "04", title: "Configure next.config", key: "nextConfig", desc: "Wrap your config with the next-intl plugin" },
  { num: "05", title: "i18n Request Handler", key: "i18nRequest", desc: "Server-side message loader per request" },
  { num: "06", title: "Update Layout", key: "layoutExample", desc: "Wrap your app with the message provider" },
  { num: "07", title: "Create Message Files", key: "enJson", desc: "JSON files with key-value translation strings" },
  { num: "08", title: "Use Translations", key: "useTranslations", desc: "Call useTranslations() in any component" },
  { num: "09", title: "Language Switcher", key: "languageSwitcher", desc: "Let users change language on the fly" },
  { num: "10", title: "NextAuth Integration", key: "withNextAuth", desc: "Works perfectly alongside your existing auth" },
];

function CodeBlock({ code, label }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ position: "relative", marginTop: "12px" }}>
      {label && (
        <div style={{ fontSize: "11px", color: "#7c85a2", marginBottom: "4px", fontFamily: "monospace", letterSpacing: "0.05em" }}>
          {label}
        </div>
      )}
      <div style={{
        background: "#0d1117",
        border: "1px solid #21262d",
        borderRadius: "10px",
        padding: "18px 20px",
        paddingRight: "60px",
        overflowX: "auto",
        position: "relative",
      }}>
        <pre style={{
          margin: 0,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontSize: "12.5px",
          lineHeight: "1.75",
          color: "#e6edf3",
          whiteSpace: "pre",
        }}>{code}</pre>
        <button
          onClick={copy}
          style={{
            position: "absolute", top: "12px", right: "12px",
            background: copied ? "#238636" : "#21262d",
            color: copied ? "#fff" : "#8b949e",
            border: "1px solid #30363d",
            borderRadius: "6px",
            padding: "4px 10px",
            fontSize: "11px",
            cursor: "pointer",
            transition: "all 0.2s",
            fontFamily: "monospace",
          }}
        >{copied ? "✓ Copied" : "Copy"}</button>
      </div>
    </div>
  );
}

function Badge({ children, color = "#1f6feb" }) {
  return (
    <span style={{
      background: color + "22",
      color: color,
      border: `1px solid ${color}44`,
      borderRadius: "20px",
      padding: "2px 10px",
      fontSize: "11px",
      fontWeight: 600,
      letterSpacing: "0.04em",
    }}>{children}</span>
  );
}

export default function LocalizationGuide() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#010409",
      color: "#e6edf3",
      fontFamily: "'Geist', 'Inter', system-ui, sans-serif",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #0d1117 100%)",
        borderBottom: "1px solid #21262d",
        padding: "48px 32px 36px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(ellipse at 20% 50%, #1f6feb18 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, #8b5cf618 0%, transparent 60%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
            <Badge color="#1f6feb">Next.js</Badge>
            <Badge color="#8b5cf6">next-intl</Badge>
            <Badge color="#10b981">App Router</Badge>
            <Badge color="#f59e0b">i18n</Badge>
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 800,
            background: "linear-gradient(135deg, #e6edf3, #8b949e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0 0 12px",
            letterSpacing: "-0.02em",
          }}>Localization (i18n) for Your Next.js Boilerplate</h1>
          <p style={{ color: "#8b949e", maxWidth: "560px", margin: "0 auto", fontSize: "15px", lineHeight: 1.6 }}>
            A complete guide to adding multi-language support — from concept to code — alongside your existing Shadcn, NextAuth, and TanStack Query setup.
          </p>
        </div>
      </div>

      {/* Tab Nav */}
      <div style={{
        display: "flex",
        borderBottom: "1px solid #21262d",
        background: "#0d1117",
        padding: "0 32px",
        overflowX: "auto",
        gap: "4px",
      }}>
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            style={{
              background: "none",
              border: "none",
              color: activeTab === i ? "#e6edf3" : "#8b949e",
              padding: "14px 20px",
              fontSize: "13.5px",
              fontWeight: activeTab === i ? 600 : 400,
              cursor: "pointer",
              borderBottom: activeTab === i ? "2px solid #1f6feb" : "2px solid transparent",
              whiteSpace: "nowrap",
              transition: "color 0.15s",
            }}
          >{tab}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>

        {/* TAB 0: What is i18n */}
        {activeTab === 0 && (
          <div>
            <div style={{
              background: "#0d1117",
              border: "1px solid #1f6feb44",
              borderRadius: "12px",
              padding: "24px 28px",
              marginBottom: "24px",
              borderLeft: "4px solid #1f6feb",
            }}>
              <h2 style={{ margin: "0 0 12px", fontSize: "20px", fontWeight: 700, color: "#79c0ff" }}>🌍 What is Localization (i18n)?</h2>
              <p style={{ color: "#c9d1d9", lineHeight: 1.75, margin: 0, fontSize: "14.5px" }}>
                <strong style={{ color: "#e6edf3" }}>Internationalization (i18n)</strong> is the process of designing your app so it can be adapted for different languages, regions, and cultures — <em>without</em> changing the core code each time. <strong style={{ color: "#e6edf3" }}>Localization (l10n)</strong> is the actual adaptation for a specific locale (e.g., translating English → Bengali).
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              {[
                { icon: "🔤", title: "Text Translation", desc: "Every UI string lives in a JSON file, not hardcoded. Switch locale → swap the file." },
                { icon: "📅", title: "Date & Number Formats", desc: "Jan 1, 2025 vs 01/01/2025. Commas vs periods. next-intl handles this automatically." },
                { icon: "➡️", title: "RTL Support", desc: "Arabic, Hebrew etc. read right-to-left. i18n lets you set document direction per locale." },
                { icon: "🔗", title: "Locale in URL", desc: "yourapp.com/en/dashboard vs /bn/dashboard. Each locale gets its own route prefix." },
              ].map((item, i) => (
                <div key={i} style={{
                  background: "#161b22",
                  border: "1px solid #21262d",
                  borderRadius: "10px",
                  padding: "20px",
                }}>
                  <div style={{ fontSize: "28px", marginBottom: "10px" }}>{item.icon}</div>
                  <div style={{ fontWeight: 600, marginBottom: "6px", color: "#e6edf3", fontSize: "14px" }}>{item.title}</div>
                  <div style={{ color: "#8b949e", fontSize: "13px", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              ))}
            </div>

            <div style={{
              background: "#161b22",
              border: "1px solid #21262d",
              borderRadius: "12px",
              padding: "24px 28px",
            }}>
              <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 700, color: "#e6edf3" }}>Why your teammate suggested it</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  ["✅", "Future-proof", "Much harder to add i18n later when you have 200+ components. Do it in the boilerplate."],
                  ["✅", "Global reach", "Even if you only need English now, teams grow, markets expand."],
                  ["✅", "Better UX", "Users trust and convert better in their native language."],
                  ["✅", "SEO benefit", "Locale-prefixed URLs (/en/, /bn/) help search engines index your content per region."],
                ].map(([icon, title, desc], i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "16px", marginTop: "1px" }}>{icon}</span>
                    <div>
                      <span style={{ fontWeight: 600, color: "#e6edf3", fontSize: "13.5px" }}>{title}: </span>
                      <span style={{ color: "#8b949e", fontSize: "13.5px" }}>{desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: How it Works */}
        {activeTab === 1 && (
          <div>
            <div style={{
              background: "#161b22",
              border: "1px solid #21262d",
              borderRadius: "12px",
              padding: "24px 28px",
              marginBottom: "24px",
            }}>
              <h2 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: 700, color: "#e6edf3" }}>🔄 The Flow — How it All Works</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {[
                  { step: "1", title: "User visits /bn/dashboard", detail: "URL carries the locale prefix — this is the source of truth for which language to serve.", color: "#1f6feb" },
                  { step: "2", title: "Middleware intercepts the request", detail: "next-intl middleware reads the locale from the URL (or detects from Accept-Language header on first visit).", color: "#8b5cf6" },
                  { step: "3", title: "Locale is extracted → messages loaded", detail: "The request handler on the server imports messages/bn.json and makes it available to the component tree.", color: "#10b981" },
                  { step: "4", title: "Components call useTranslations()", detail: "Any Server or Client Component calls t('key') and gets the translated string for the current locale.", color: "#f59e0b" },
                  { step: "5", title: "User switches language", detail: "LanguageSwitcher updates the URL prefix (/en/ → /fr/), React re-renders with new messages.", color: "#ef4444" },
                ].map((item, i, arr) => (
                  <div key={i} style={{ display: "flex", gap: "0", position: "relative" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: "16px" }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        background: item.color + "22", border: `2px solid ${item.color}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "13px", fontWeight: 700, color: item.color, flexShrink: 0,
                      }}>{item.step}</div>
                      {i < arr.length - 1 && <div style={{ width: "2px", flex: 1, background: "#21262d", margin: "4px 0" }} />}
                    </div>
                    <div style={{ paddingBottom: "24px", paddingTop: "6px" }}>
                      <div style={{ fontWeight: 600, color: "#e6edf3", fontSize: "14px", marginBottom: "4px" }}>{item.title}</div>
                      <div style={{ color: "#8b949e", fontSize: "13px", lineHeight: 1.6 }}>{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#0d1117", border: "1px solid #238636", borderRadius: "12px", padding: "20px 24px", borderLeft: "4px solid #238636" }}>
              <h3 style={{ margin: "0 0 12px", color: "#3fb950", fontSize: "15px", fontWeight: 700 }}>📦 Why next-intl?</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  "Native App Router support (RSC + Client)",
                  "Type-safe translations with TypeScript",
                  "Built-in interpolation ({name} variables)",
                  "Pluralization rules built in",
                  "Works perfectly with Middleware",
                  "Tiny bundle — tree-shakeable",
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "13px", color: "#c9d1d9" }}>
                    <span style={{ color: "#3fb950" }}>✓</span> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Integration Guide */}
        {activeTab === 2 && (
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "24px" }}>
            {/* Step Nav */}
            <div style={{ position: "sticky", top: "20px", alignSelf: "start" }}>
              <div style={{ fontSize: "11px", color: "#8b949e", fontWeight: 600, letterSpacing: "0.1em", marginBottom: "12px" }}>STEPS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {steps.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    style={{
                      background: activeStep === i ? "#1f6feb22" : "none",
                      border: activeStep === i ? "1px solid #1f6feb44" : "1px solid transparent",
                      color: activeStep === i ? "#79c0ff" : "#8b949e",
                      borderRadius: "6px",
                      padding: "7px 10px",
                      fontSize: "12px",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s",
                      fontWeight: activeStep === i ? 600 : 400,
                    }}
                  >
                    <span style={{ opacity: 0.5, marginRight: "6px" }}>{s.num}</span>
                    {s.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div>
              <div style={{
                background: "#161b22",
                border: "1px solid #21262d",
                borderRadius: "12px",
                padding: "24px 28px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <span style={{
                    background: "#1f6feb22", color: "#79c0ff",
                    border: "1px solid #1f6feb44", borderRadius: "6px",
                    padding: "3px 10px", fontSize: "12px", fontWeight: 700,
                  }}>STEP {steps[activeStep].num}</span>
                </div>
                <h2 style={{ margin: "0 0 8px", fontSize: "20px", fontWeight: 700, color: "#e6edf3" }}>
                  {steps[activeStep].title}
                </h2>
                <p style={{ color: "#8b949e", fontSize: "13.5px", margin: "0 0 16px" }}>
                  {steps[activeStep].desc}
                </p>

                <CodeBlock code={codeSnippets[steps[activeStep].key]} />

                {activeStep === 6 && (
                  <div style={{ marginTop: "16px" }}>
                    <div style={{ fontSize: "12px", color: "#8b949e", marginBottom: "6px" }}>Bengali version:</div>
                    <CodeBlock code={codeSnippets.bnJson} />
                  </div>
                )}

                {activeStep === 8 && (
                  <div style={{ marginTop: "16px" }}>
                    <div style={{ fontSize: "12px", color: "#8b949e", marginBottom: "6px" }}>Client Component example:</div>
                    <CodeBlock code={codeSnippets.clientComponent} />
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
                  <button
                    onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                    disabled={activeStep === 0}
                    style={{
                      background: activeStep === 0 ? "#21262d44" : "#21262d",
                      color: activeStep === 0 ? "#484f58" : "#e6edf3",
                      border: "1px solid #30363d",
                      borderRadius: "8px", padding: "8px 18px",
                      fontSize: "13px", cursor: activeStep === 0 ? "default" : "pointer",
                    }}
                  >← Previous</button>
                  <span style={{ fontSize: "12px", color: "#484f58", alignSelf: "center" }}>
                    {activeStep + 1} / {steps.length}
                  </span>
                  <button
                    onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                    disabled={activeStep === steps.length - 1}
                    style={{
                      background: activeStep === steps.length - 1 ? "#21262d44" : "#1f6feb",
                      color: activeStep === steps.length - 1 ? "#484f58" : "#fff",
                      border: "none",
                      borderRadius: "8px", padding: "8px 18px",
                      fontSize: "13px", cursor: activeStep === steps.length - 1 ? "default" : "pointer",
                    }}
                  >Next →</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: File Structure */}
        {activeTab === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{
              background: "#161b22",
              border: "1px solid #21262d",
              borderRadius: "12px",
              padding: "24px 28px",
            }}>
              <h2 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: 700, color: "#e6edf3" }}>📁 Final Folder Structure</h2>
              <CodeBlock code={codeSnippets.folderStructure} label="Your boilerplate with i18n" />
              <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  ["app/[locale]/", "Dynamic segment — every page is now locale-aware automatically", "#1f6feb"],
                  ["i18n/routing.ts", "Single source of truth for your supported locales", "#8b5cf6"],
                  ["i18n/request.ts", "Server-side: loads the right JSON file per request", "#10b981"],
                  ["middleware.ts", "Intercepts all navigation, enforces locale in URL", "#f59e0b"],
                  ["messages/*.json", "One JSON file per language — easy to hand off to translators", "#ef4444"],
                ].map(([file, desc, color], i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "12px", background: "#0d1117", borderRadius: "8px" }}>
                    <code style={{ color, fontFamily: "monospace", fontSize: "12.5px", whiteSpace: "nowrap", minWidth: "160px" }}>{file}</code>
                    <span style={{ color: "#8b949e", fontSize: "13px" }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: "#0d1117",
              border: "1px solid #f59e0b44",
              borderRadius: "12px",
              padding: "20px 24px",
              borderLeft: "4px solid #f59e0b",
            }}>
              <h3 style={{ margin: "0 0 12px", color: "#f59e0b", fontSize: "15px", fontWeight: 700 }}>⚡ Quick Tips for Your Stack</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  ["NextAuth", "Keep your auth callbacks locale-agnostic. The [locale] segment doesn't affect NextAuth's /api/auth/* routes."],
                  ["TanStack Query", "Query keys don't need locale — next-intl handles display. But if you fetch locale-specific content, include locale in the key: ['posts', locale]."],
                  ["Shadcn/UI", "Shadcn components accept children/props — just wrap text with t('key'). No special Shadcn config needed."],
                  ["TypeScript", "next-intl supports full type-safety. Run next-intl's codegen to get autocomplete on all your translation keys."],
                ].map(([lib, tip], i) => (
                  <div key={i} style={{ fontSize: "13.5px" }}>
                    <span style={{ fontWeight: 600, color: "#e6edf3" }}>{lib}: </span>
                    <span style={{ color: "#8b949e" }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
