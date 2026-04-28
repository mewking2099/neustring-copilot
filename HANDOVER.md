# NeuString Co-Pilot — Frontend Handover

**Date**: 2026-04-28
**Handed over by**: Product / Builder
**Receiving team**: Frontend Development
**Repo**: https://github.com/mewking2099/neustring-copilot
**Live (Railway)**: Redeploy after each push to `main`

---

## 1. What was built

A production-ready React + TypeScript frontend for the NeuString Co-Pilot — an AI-driven telecom roaming workspace. All UI phases are complete. The app runs, the full user flow is navigable, and every screen has real loading/error states. **No real API is connected yet** — all data is served from typed stub files with artificial delays that simulate network latency. Replacing those stubs with real API calls is the primary integration task.

### What's fully done

| Area | Detail |
|---|---|
| App shell | 3-column layout: Rail → NavSidebar → Main pane |
| Navigation | Operations tab (16 flows, sub-menus, pin/unpin), History tab, localStorage pin persistence |
| Welcome screen | Time-based greeting, suggestion chips, pinned quick-action row |
| Conversational chat | Intent router, AI message bubbles, typing indicator, card rendering, contract selector |
| 15 data cards | Traffic, Forecast, Rankings, Multi-Rankings, Partners, Negotiation, Tasks, Approvals, Coherency, Gaps, Anomaly, Help, TADIG, Contract Review, Contract Analysis |
| Deal Creation Wizard | 7-step flow with side-chat AI, TADIG multi-tag, rate grid, validation checklist |
| Contract flows | Create Manually (6-step), Create from Deal (4-step), Edit with diff view (4-step), Review (upload → analysis) |
| Query layer | TanStack React Query v5, QueryClientProvider, skeleton loading states, retry error states |
| Accessibility | `aria-label`, `aria-live`, `aria-current`, `role=list`, keyboard-navigable |
| Responsive | Sidebar auto-collapses below 1024px viewport |
| Deployment | `railway.toml` configured, `serve` static file server wired |

---

## 2. Tech stack

| Tool | Version | Purpose |
|---|---|---|
| React | 19 | UI |
| TypeScript | ~6 | Type safety |
| Vite | 8 | Build tool (fast HMR, `@` path alias) |
| React Router | v7 | Client-side routing |
| Zustand | 5 | Global state (nav + chat stores) |
| TanStack React Query | v5 | Server state, caching, loading/error |
| Tailwind CSS | v3 | Utility styling |
| shadcn/ui | latest | Component primitives (heavily overridden) |
| CVA (class-variance-authority) | 0.7 | Component variant management |
| Inter (fontsource) | 5 | Typography |
| serve | 14 | Static file server for production |

---

## 3. Getting started

```bash
git clone https://github.com/mewking2099/neustring-copilot.git
cd neustring-copilot
npm install
npm run dev        # http://localhost:5173
```

The dev-only component playground is available at `/dev/components` — useful for previewing all UI components in isolation.

```bash
npm run build      # TypeScript check + Vite production build → dist/
npm start          # Serve dist/ on PORT (default 3000)
```

---

## 4. Project structure

```
src/
  components/
    cards/          # 15 data-driven card components
    chat/           # ChatInput, MessageBubble, TypingIndicator
    nav/            # OperationsTab, HistoryTab, DemoBadge
    ui/             # shadcn base components (overridden with Neustring tokens)
    wizard/         # DealWizard, WizardSideChat, Stepper
    Rail.tsx        # Left icon rail
    NavSidebar.tsx  # Collapsible sidebar (Operations/History)
    Topbar.tsx      # Top bar with wordmark + user strip
  data/
    flows.ts        # Flow definitions, categories, sub-actions, default pins
    dealConv.ts     # Static deal wizard AI conversation script
    contractConv.ts # Static contract change data
  hooks/
    useTriggerFlow.ts  # Dispatch flows → wizard routes or chat messages
  layouts/
    RootLayout.tsx  # 3-column shell, responsive collapse logic
  lib/
    flowData.ts     # FLOW_TRIGGER_TEXT and AI_TEXT maps (chat response strings)
    intentRouter.ts # detectFlow() — keyword-based intent detection
    utils.ts        # cn() Tailwind class merger
  router.tsx        # All routes defined here
  services/
    analytics.ts    # Stub service for 9 analytical card data types
    contracts.ts    # Stub service for contract review + analysis data
    rodeo.ts        # Stub service for 5 RoDeO card data types
  store/
    app.ts          # useAppStore — nav open/close, rail item, pins, pending flow
    chat.ts         # useChatStore — messages, isTyping
  views/
    WelcomeView.tsx
    ChatView.tsx
    DealWizardView.tsx
    ContractCreateView.tsx
    ContractFromDealView.tsx
    ContractEditView.tsx
  index.css         # Neustring CSS token definitions (all CSS variables)
  main.tsx          # React root, QueryClientProvider
```

---

## 5. Design system tokens

All brand tokens are defined as CSS variables in `src/index.css`. Tailwind maps to them via `tailwind.config.js`. Key values:

| Token | Value | Use |
|---|---|---|
| Navy | `#0e2c46` | Primary brand, buttons, active states, sidebars |
| Navy gradient | `#0e2c46 → #185992` | Brand-primary button |
| Lime | `#82bc34` | Accent, active chip, success indicators, secondary gradient |
| Lime range | `#e8f2ce` | Date picker range highlight |
| Focus ring | `rgba(24,89,146,0.3)` | Input focus state |
| Error | `#f04438` | Error button, error text |
| Disabled bg | `#f2f4f7` | Disabled input/field |
| Gray-700 | `#344054` | Toggle label, body text |
| Font | Inter | All text |
| Border radius | `10px` (`radius-lg`) | Buttons |

To change brand colors globally, update the CSS variables in `src/index.css`. Do not hardcode hex values in components — route through CSS variables or Tailwind config.

The `DemoBadge` component marks flows that are UI-only demonstrations (not yet backed by real data). Remove these badges as real integrations are wired up.

---

## 6. State management

Two Zustand stores. Do not add more stores without good reason — most component state should stay local.

### `useAppStore` (`src/store/app.ts`)

| Key | Type | Purpose |
|---|---|---|
| `navOpen` | `boolean` | Whether NavSidebar is expanded |
| `activeRailItem` | `string` | Currently highlighted rail icon |
| `pins` | `PinnedItem[]` | User-pinned operations (persisted to localStorage under `ns-pinned-ops`) |
| `pendingFlowId` | `string \| null` | Flow to auto-trigger when ChatView mounts |
| `pendingUserMessage` | `string \| null` | Message to pre-fill in chat |

### `useChatStore` (`src/store/chat.ts`)

| Key | Type | Purpose |
|---|---|---|
| `messages` | `Message[]` | Full chat history (in-memory only, not persisted) |
| `isTyping` | `boolean` | Controls TypingIndicator visibility |

`Message` shape:
```ts
{
  id: string
  role?: "user" | "ai"
  kind?: "divider"        // section divider in chat
  label?: string          // divider label text
  text?: string           // message body
  card?: string           // flow ID → renders the matching card component
  contractChoices?: ContractChoice[]  // renders contract selector list
  isDeal?: boolean        // reserved for deal-context messages
}
```

---

## 7. Routing

All routes are in `src/router.tsx`. All routes are children of `RootLayout` (3-column shell).

| Path | View | Notes |
|---|---|---|
| `/` | `WelcomeView` | Time-based greeting, pinned actions |
| `/chat` | `ChatView` | Main AI chat, consumes `pendingFlowId` on mount |
| `/deal/new` | `DealWizardView` | 7-step deal creation + side chat |
| `/contract/new` | `ContractCreateView` | 6-step manual contract creation |
| `/contract/from-deal` | `ContractFromDealView` | 4-step contract from existing deal |
| `/contract/:id/edit` | `ContractEditView` | 4-step contract edit with diff view |
| `/contract/:id/review` | `ChatView` | Reuses chat view for contract review flow |
| `/dev/components` | `ComponentPlayground` | Dev only (stripped from production build) |

**Known stub**: `contract/:id` — the `:id` param is not currently passed to service calls. `ContractEditView` and review both use hardcoded contract `1`. This must be wired up during API integration.

---

## 8. Chat and intent system

### How a chat message becomes a card

1. User types a message → `ChatInput` calls `sendUserMessage(text)` in `useTriggerFlow`
2. `detectFlow(text)` (`src/lib/intentRouter.ts`) keyword-matches to a flow ID
3. `useTriggerFlow` adds a user message, shows `TypingIndicator` for 1300ms, then adds an AI message with `card: flowId`
4. `MessageBubble` renders the card via `CARD_REGISTRY` (`src/components/cards/index.ts`)

### How a nav flow triggers a card

1. User clicks a flow in OperationsTab or a pinned item
2. `useAppStore.setPendingFlow(flowId)` is called, then `navigate("/chat")`
3. `ChatView` reads `pendingFlowId` on mount, calls `triggerFlow(flowId)` automatically

### `detectFlow()` limitations

The current implementation (`src/lib/intentRouter.ts`) is simple keyword matching. It will misfire on ambiguous input and falls back to `"traffic"` for anything unrecognised. When the real AI backend is available, replace this with a server-side intent classification call, or send all free-text messages directly to the LLM and let it decide.

### `sendUserMessage` fallback

Currently, `sendUserMessage()` always renders the `traffic` card for any free-text input that doesn't route to a wizard. This is a placeholder — replace with a real LLM call.

---

## 9. Service layer — what to replace

All three service files contain **typed stub functions** with artificial `delay()` calls simulating network latency. Each function has a fully-typed return interface. **Replace the function body only — keep the interface.**

### `src/services/analytics.ts`
Covers: Traffic, Forecast, Rankings, Multi-Rankings, Partners, Negotiation, Help, TADIG

```ts
// Current stub:
export async function fetchTrafficData(): Promise<TrafficData> {
  await delay(650)
  return { /* hardcoded */ }
}

// Replace with:
export async function fetchTrafficData(): Promise<TrafficData> {
  const res = await fetch(`${API_BASE}/analytics/traffic`, { headers: authHeaders() })
  if (!res.ok) throw new Error(res.statusText)
  return res.json()
}
```

### `src/services/contracts.ts`
Covers: Contract Review (by ID), Contract Analysis (change set)

Note: `fetchContractReviewData` accepts an optional `_contractId` parameter that is currently ignored. Wire it to the URL param from `useParams()` in the view, then pass it through to the service call.

### `src/services/rodeo.ts`
Covers: Tasks, Approvals, Coherency, Gaps, Anomalies

### Adding auth headers

Create `src/lib/api.ts`:

```ts
export const API_BASE = import.meta.env.VITE_API_BASE_URL

export function authHeaders(): HeadersInit {
  const token = localStorage.getItem("ns-token") // or from your auth provider
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
}
```

Add to `.env`:
```
VITE_API_BASE_URL=https://api.neustring.com
```

TanStack Query already handles caching, background refetch, and retry. Do not add manual retry logic inside service functions.

---

## 10. Wizard form submissions

All four wizard flows (Deal, Contract Create, Contract from Deal, Contract Edit) currently advance through steps but **do not POST data**. Each wizard has a final "success" state that renders immediately without a real API call. You'll need to:

1. Add a `useMutation` (TanStack Query) in each wizard for the submit action
2. On the final step's CTA button, call `mutate(formData)` instead of advancing the step
3. On `onSuccess`, advance to the success step
4. On `onError`, show an inline error (use `CardError` as a pattern)

The form state in each wizard is currently `useState` local to the component — this is intentional for isolation. Lift to React Context if form state needs to span components within a wizard, but avoid putting wizard state in Zustand.

---

## 11. Known stubs and placeholders

These are intentional placeholders that need real implementation:

| Location | What it is | What to do |
|---|---|---|
| `src/lib/intentRouter.ts` | Keyword-only intent detection | Replace with LLM classification or server-side NLP |
| `useTriggerFlow.sendUserMessage()` | Always returns traffic card | Route to real LLM API |
| `data/dealConv.ts` | Hardcoded 7-step deal wizard AI script | Replace with streaming LLM responses |
| `data/contractConv.ts` | Static contract change dataset | Replace with real contract diff API |
| `lib/flowData.ts` — `AI_TEXT` | Hardcoded AI response text strings | Replace with LLM-generated responses |
| `contract/:id` routes | `:id` is always `"1"` | Pass real contract IDs from API |
| `ContractUploadCard` simulate | 2s timeout pretending to process upload | Wire to real document processing endpoint |
| `DemoBadge` on flows | Marks unimplemented flows | Remove as each flow gets a real API |
| `serve` in `npm start` | Static file server | Fine for Railway; use nginx/CDN for scale |

---

## 12. Deployment (Railway)

The app is a Vite SPA. Railway config is in `railway.toml`:

```toml
[build]
buildCommand = "npm install && npm run build"

[deploy]
startCommand = "npm start"   # runs: serve -s dist -l $PORT
```

`serve` is a production dependency and will be available after build.

**Environment variables to set in Railway**:
- `VITE_API_BASE_URL` — your backend API base URL (must be set at build time, not runtime, because Vite bakes it in)

Since Vite bakes `VITE_*` env vars at build time, any change to `VITE_API_BASE_URL` requires a rebuild. Set it in Railway's service variables before the first production deploy.

---

## 13. Handover checklist

### Before the team starts

- [ ] Add `.env.local` to your local clone with `VITE_API_BASE_URL`
- [ ] Run `npm install && npm run dev` — confirm the app starts
- [ ] Open `/dev/components` — review all component variants in the playground
- [ ] Walk through each route manually and confirm no console errors
- [ ] Set `VITE_API_BASE_URL` in Railway environment variables

### Integration milestones (suggested order)

1. **Auth layer** — add login/session management, store token, wire `authHeaders()`
2. **Analytics cards** — replace stubs in `analytics.ts` one card at a time; verify loading + error states with real latency
3. **RoDeO cards** — replace stubs in `rodeo.ts`
4. **Contract review** — wire contract ID from URL params, replace `contracts.ts` stubs
5. **Deal wizard submission** — add `useMutation`, POST deal on final step
6. **Contract wizard submissions** — same pattern for all 3 contract wizards
7. **Chat free-text** — replace `sendUserMessage` fallback with real LLM call
8. **Intent detection** — upgrade `detectFlow()` or replace with server-side classification
9. **Remove DemoBadges** — as each flow goes live, remove its `DemoBadge`
10. **Production hardening** — error boundaries, Sentry/logging, CSP headers

### What you don't need to rebuild

- The entire component library is done — do not recreate `src/components/ui/`
- Card layout and rendering logic is complete — only replace the service function body
- Wizard step UX, stepper, side-chat wiring — all done
- Responsive behaviour, accessibility pass — done
- TanStack Query setup — already configured at root with sensible defaults

---

## 14. Contact

For questions about product intent, flow design, or what a specific data field means in the domain — contact the original builder. For questions about component behaviour or styling decisions, the git history has a detailed log entry per phase.
