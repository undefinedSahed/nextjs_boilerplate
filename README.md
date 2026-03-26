# Next.js 15 Advanced Boilerplate

A production-ready, feature-rich boilerplate built with Next.js 15 (App Router) & React 19. This template is designed to significantly reduce setup time for modern web applications by pre-configuring essential modules for authentication, data fetching, internationalization, form handling, UI components, and strict code quality tools.

## 🚀 Features Included

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router) & React 19
- **Language**: [TypeScript](https://www.typescriptlang.org/) for robust static typing.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & `tw-animate-css` for rapid, responsive UI development.
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (built on Radix UI) with pre-installed primitives (Button, Card, Form, Input, Navigation Menu, Sheet, etc.).
- **Icons**: [Lucide React](https://lucide.dev/).
- **Form Handling & Validation**: [React Hook Form](https://react-hook-form.com/) integrated with [Zod](https://zod.dev/) for schema validation.
- **Data Fetching**: [TanStack React Query v5](https://tanstack.com/query) paired with [Axios](https://axios-http.com/) for optimized client-side state and request management.
- **Authentication**: [NextAuth.js v4](https://next-auth.js.org/) pre-configured with UI forms for Login and Signup.
- **Internationalization (i18n)**: [next-intl](https://next-intl-docs.vercel.app/) setup with dynamic routing. Currently supports English (`en`) and Bengali (`bn`).
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) for elegant toast notifications.
- **Code Quality & Workflow**:
  - **ESLint** (v9) & Prettier for code formatting and standard checking.
  - **Husky** for automatic Git hooks management.
  - **lint-staged** runs linting & fixes strictly on staged files.
  - **Commitlint** to strictly enforce conventional commit messages.

## 📁 Project Structure

This boilerplate strictly follows a scalable directory structure:

- `app/` - Next.js App Router (handles i18n `[locale]` routing, `layout.tsx`, `globals.css`).
- `components/`
  - `application/` - Specific app views (e.g., custom `not-found-content.tsx`).
  - `auth/` - NextAuth integrated forms (`login-form.tsx`, `signup-form.tsx`).
  - `shared/` - Global layout components (`navbar.tsx`, `footer.tsx`, `language-switcher.tsx`).
  - `ui/` - Reusable shadcn/ui generic components.
- `i18n/` - i18n configurations (`request.ts`, `routing.ts`).
- `messages/` - JSON dictionaries for translations (`en.json`, `bn.json`).
- `lib/` - Utility functions, custom hooks, and the Axios singleton setup (`api.ts`).
- `provider/` - Global context providers. `app-provider.tsx` encapsulates `QueryClientProvider` and conditionally renders the Navbar/Footer (hiding them on auth pages).
- `types/` - Global TypeScript type definitions (e.g., `next-auth.d.ts`).

## 🛠️ Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Environment Variables

If required by your setup (especially API and NextAuth), create a `.env.local` or `.env` file in the root. Example variables the boilerplate expects:

```env
NEXT_PUBLIC_API_URL=http://your-api-url.com/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_string
```

### Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The application will immediately redirect you to the default locale route (e.g., `/en`).

## ⚙️ Development Workflow

### Committing Changes

This boilerplate enforces **Conventional Commits** using Husky and Commitlint. Before a commit is finalized, `lint-staged` will automatically run formatting and linting on your staged files.

Example of a valid commit message:
```bash
git commit -m "feat: add user profile component"
git commit -m "fix: resolve login form hydration error"
```
If you provide an invalid commit message, the commit will be rejected.

## ⚙️ How to Customize and Extend

### 1. Adding New UI Components
This project uses `shadcn/ui`. To add a new component, use the shadcn CLI:
```bash
npx shadcn@latest add <component-name>
```
The new component will be placed automatically in `components/ui/`.

### 2. Modifying API & Data Fetching
- The Axios instance is configured in `lib/api.ts`. You can attach interceptors for auth tokens or global error handling here.
- React Query is wrapped internally in `provider/app-provider.tsx`.

### 3. Updating Translations
To add new text or support a new language:
1. Update `messages/en.json` and `messages/bn.json` with your new key-value pairs.
2. If adding a completely new language, create a new `<locale>.json` file in `messages/` and update `i18n/routing.ts` to include the new locale in the `locales` array.

### 4. Layout & Providers
The main global wrapper is `provider/app-provider.tsx`. If you need to add new global contexts (like Redux, ThemeProvider, etc.), wrap them inside components in this file. The Navbar and Footer are also conditionally rendered here.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
