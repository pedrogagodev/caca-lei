# Repository Guidelines

## Project Structure & Module Organization
- Next.js 16 App Router with React 19 and TypeScript; entry layout in `src/app/layout.tsx`, homepage in `src/app/page.tsx`.
- Feature pages live under `src/app/leis/` (list) and dynamic routes under `src/app/leis/[id]/`; share styles via `src/app/globals.css` (Tailwind CSS v4 theme tokens).
- Static assets in `public/`; compiled output in `.next/` (ignored).
- Use the `@/` alias for imports from `src/` to avoid long relative paths.

## Build, Test, and Development Commands
- `npm run dev` - start the local server at http://localhost:3000 with hot reload.
- `npm run build` - production build; fails on type or asset issues.
- `npm start` - serve the production build locally.
- `npm run lint` - Biome lint checks (Next and React recommended rules).
- `npm run format` - apply Biome formatting; use Node 18+ to match Next.js 16 support.

## Coding Style & Naming Conventions
- Biome enforces 2-space indentation and organizes imports; keep unused code out of commits.
- Prefer TypeScript with strict typing; keep components small and pure so React Compiler can optimize them (`reactCompiler: true` in `next.config.ts`).
- App Router naming: pages use `page.tsx`, layouts use `layout.tsx`; shared components use PascalCase, hooks start with `use`.
- Tailwind v4 `@theme inline` tokens live in `globals.css`; extend tokens there instead of sprinkling custom colors.
- Limit `use client` to code that truly needs browser-only APIs to keep bundles lean.

## Testing Guidelines
- No automated tests are configured yet; when adding, colocate `*.test.tsx` or `*.spec.tsx` near the code or in `__tests__/`.
- Cover page rendering, data formatting utilities, and any client-only hooks; mock network or filesystem access for determinism.
- Add an npm script (`npm test`) once a framework is chosen so CI can run it consistently.

## Commit & Pull Request Guidelines
- Follow the existing conventional style (`feat: ...`, `fix: ...`, `chore: ...`); keep subjects imperative and under roughly 72 characters.
- Before opening a PR, run `npm run lint` and `npm run format`; include a short summary, linked issue or ticket, and screenshots or GIFs for UI changes.
- Mention any new env vars or migrations in the PR description and provide setup steps for reviewers.

## Security & Configuration Tips
- Store secrets in `.env.local` and never commit them; reserve `NEXT_PUBLIC_*` for safe public values only.
- Validate external inputs and sanitize content rendered into dynamic routes under `src/app/leis/[id]/`.
- Watch bundle size when adding client components; keep heavy dependencies on the server side when possible.
