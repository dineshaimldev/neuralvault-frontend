Design a 100% production-grade, enterprise-level web application UI for an 
"Enterprise RAG System" (Retrieval-Augmented Generation AI Platform). 
i want the neat and clean ui neat colour selection attractive design

─────────────────────────────────────────
BRAND & VISUAL IDENTITY
─────────────────────────────────────────
Product Name: NeuralVault
Tagline: "Enterprise Intelligence, Grounded in Truth"
Personality: Authoritative, precise, intelligent, minimal — like Grafana 
meets Linear meets Vercel dashboard.

─────────────────────────────────────────
DESIGN SYSTEM (use strictly)
─────────────────────────────────────────
Color Palette:
- Background:       #080B14  (deep space black)
- Surface:          #0E1420  (card background)
- Surface Elevated: #141C2E  (modals, dropdowns)
- Border:           #1E2D45  (subtle borders)
- Primary:          #4F8EF7  (electric blue — CTAs, active states)
- Primary Glow:     #4F8EF740 (blue glow for highlights)
- Secondary:        #7C5CFC  (violet — secondary actions)
- Success:          #10B981  (green — healthy, complete)
- Warning:          #F59E0B  (amber — processing, caution)
- Error:            #EF4444  (red — failed, critical)
- Text Primary:     #F0F4FF  (near white)
- Text Secondary:   #8896B3  (muted blue-gray)
- Text Tertiary:    #4A5568  (placeholder, disabled)

Typography:
- Font Family: Inter (all UI), JetBrains Mono (code, IDs, scores)
- Display:  32px / 700 weight
- H1:       24px / 600
- H2:       18px / 600
- H3:       14px / 600 / letter-spacing 0.05em / UPPERCASE
- Body:     14px / 400
- Small:    12px / 400
- Code:     13px / JetBrains Mono

Spacing: 4px base grid (4, 8, 12, 16, 24, 32, 48, 64)
Border Radius: 6px (cards), 4px (inputs/buttons), 12px (modals)
Shadows: 0 0 0 1px #1E2D45, 0 4px 24px #00000066

─────────────────────────────────────────
LAYOUT STRUCTURE
─────────────────────────────────────────
Fixed left sidebar: 220px wide, collapsible to 64px icon-only mode
Top header bar: 100% width, 56px tall, sticky
Main content area: fluid, padding 24px, max-width 1440px
Right panel: 320px context/detail drawer (slides in)

─────────────────────────────────────────
SCREENS TO DESIGN (9 screens)
─────────────────────────────────────────

SCREEN 1 — LOGIN PAGE
- Full screen dark background with subtle animated grid pattern
- Centered card: 440px wide, glassmorphism style 
  (background: #0E142080, backdrop-filter: blur(20px))
- NeuralVault logo + icon top center
- "Welcome back" heading, "Sign in to your workspace" subheading
- Email input field (with mail icon inside)
- Password input (with eye toggle)
- "Remember me" checkbox + "Forgot password?" right-aligned link
- Primary CTA button: "Sign In" (full width, #4F8EF7 background)
- Divider "or continue with"
- SSO button: "Sign in with Google" (outlined)
- Footer: "Don't have an account? Request Access"
- Bottom left: version badge "v2.4.1"
- Background: faint blue radial gradient glow from center
- Right side (60% of screen): animated visualization of RAG pipeline 
  flow (nodes + connections, very subtle, blue glowing lines)

SCREEN 2 — MAIN DASHBOARD (Overview)
- Sidebar: NeuralVault logo, nav items with icons:
  Dashboard (active), Documents, Query Studio, Tenants, 
  Evaluation, Monitoring, Settings
  Bottom of sidebar: user avatar + name + role + logout
- Top bar: tenant selector dropdown (left), 
  search bar (center), notification bell + user avatar (right)
- 4 KPI metric cards in a row:
  Card 1: "Total Documents" — 12,847 — +234 this week — 
          document icon — blue accent
  Card 2: "Queries Today" — 3,291 — +18% vs yesterday — 
          lightning icon — violet accent
  Card 3: "Avg RAG Score" — 0.847 — faithfulness metric — 
          target icon — green accent
  Card 4: "Avg Latency" — 284ms — P95: 890ms — 
          clock icon — amber accent
- Below cards: 2-column layout
  Left (65%): Line chart — "Query Volume (Last 30 Days)" 
              with primary blue line, area fill, grid lines subtle
  Right (35%): Donut chart — "Document Status Distribution"
               (Ready: 89%, Processing: 7%, Failed: 4%)
               with legend
- Below charts: "Recent Activity" feed
  List of events: [icon] [action] [tenant] [time ago]
  e.g. "📄 12 documents ingested — Acme Corp — 2 min ago"
- Bottom right: "System Health" widget
  Rows: ChromaDB ● Online | PostgreSQL ● Online | 
        Redis ● Online | Ollama ● Online
  Each with green pulsing dot and latency in ms

SCREEN 3 — DOCUMENT MANAGEMENT
- Page header: "Document Library" + "Upload Documents" button (primary)
- Filter bar: Search input, Tenant dropdown, Status filter 
  (All/Ready/Processing/Failed), Date range picker
- Data table with columns:
  [ ] checkbox | Document Name | Tenant | Size | Chunks | 
  Status badge | Uploaded | Actions (3-dot menu)
- Status badges: 
  "Ready" — green pill
  "Processing" — amber pill with spinner
  "Failed" — red pill
- Pagination: "Showing 1–25 of 847 documents" + prev/next
- Right panel (slides in on row click):
  Document detail — filename, size, tenant, upload date
  Chunk count, embedding model used
  "View Chunks" expandable section showing first 3 chunks as 
  code-style blocks with chunk ID and token count
  "Delete Document" danger button at bottom
- Upload modal (triggered by button):
  Large dropzone: dashed border, cloud upload icon, 
  "Drag & drop files here or click to browse"
  "Supports PDF, DOCX, TXT, MD — Max 50MB per file"
  Tenant selector dropdown
  Chunking strategy: radio buttons (Fixed/Semantic/Sentence)
  Uploaded files list with progress bars + status
  "Start Ingestion" primary button

SCREEN 4 — QUERY STUDIO (Chat Interface)
- 3-panel layout:
  LEFT (260px): Query History sidebar
    "New Query" button at top
    List of past queries with truncated question text + timestamp
    Active query highlighted
  CENTER (fluid): Chat interface
    Messages area (scrollable):
      User message: right-aligned, #141C2E bg, rounded
      Assistant message: left-aligned, #0E1420 bg
      Below each assistant message: 
        "Sources" collapsible section — shows 3 source cards
        Each source card: document name + chunk excerpt + 
        relevance score bar (0.0–1.0) + page/chunk number
    Bottom: query input bar (full width, tall textarea)
      Left: tenant selector (compact dropdown)
      Right: send button (blue, arrow icon)
      Below input: token count + model indicator "llama3.1:8b"
  RIGHT (320px): Retrieval Inspector panel
    "Retrieval Details" heading
    Step-by-step pipeline visualization:
      1. HyDE Generation ✓ (expanded query shown)
      2. Vector Search ✓ (top-k: 10, returned: 8)
      3. Reranking ✓ (CrossEncoder, final: 3)
      4. Context Compression ✓
      5. LLM Generation ✓ (tokens: 342, time: 1.2s)
    Metrics: Retrieval time, Reranking time, Generation time
    All shown as horizontal bars in sequence

SCREEN 5 — TENANT MANAGEMENT
- Page header: "Tenants" + "Create Tenant" button
- 3 stat cards: Total Tenants, Active This Month, Storage Used
- Tenants data table:
  Tenant Name | Namespace ID | Documents | Storage | 
  Queries/Month | Status | Created | Actions
- "Create Tenant" modal:
  Tenant name input
  Namespace ID (auto-generated slug, editable)
  Description textarea
  Storage limit selector (dropdown: 1GB/5GB/10GB/Unlimited)
  Rate limit (queries/min) number input
  "Create Tenant" primary button
- Tenant detail page (separate screen or right panel):
  Tenant header with avatar (initials), name, namespace badge
  4 mini stat cards
  Usage chart (last 30 days)
  Document list (filtered for this tenant)
  Danger zone: "Delete Tenant" with warning text

SCREEN 6 — RAG EVALUATION DASHBOARD
- Page header: "RAG Evaluation" + "Run Evaluation" button
- 4 RAGAs metric cards with ring charts:
  Faithfulness: 0.89 (green ring)
  Answer Relevancy: 0.84 (green ring)
  Context Precision: 0.76 (amber ring, slightly lower)
  Context Recall: 0.91 (green ring)
- Below: "Evaluation Results" table
  Columns: Question | Answer (truncated) | Faithfulness | 
  Relevancy | Precision | Recall | Overall | Date
  Each score shown as colored number (green >0.8, amber >0.6, red <0.6)
- "Run Evaluation" modal:
  Dataset selector dropdown
  Tenant filter
  Number of samples (slider: 10–500)
  Metrics checkboxes (all checked by default)
  Estimated time indicator
  "Start Evaluation" button with warning "This may take 5–20 minutes"
- Bottom: Trend chart — "RAGAs Scores Over Time"
  Multi-line chart, one line per metric, legend below

SCREEN 7 — MONITORING (Grafana-style)
- Time range picker top right (Last 1h / 6h / 24h / 7d)
- "Refresh: 30s" toggle
- Grid of metric panels (Grafana-inspired):
  Row 1 (4 panels): 
    CPU Usage (gauge), Memory Usage (gauge), 
    Active Connections (stat), Cache Hit Rate (stat with %)
  Row 2 (2 panels):
    Request Rate over time (line chart, req/s)
    Latency Percentiles (line chart, P50/P95/P99)
  Row 3 (2 panels):
    Error Rate (line chart, red)
    Document Ingestion Rate (bar chart, docs/hour)
- Each panel: dark card, panel title top-left, 
  time axis bottom, values in primary color

SCREEN 8 — SETTINGS
- Left sub-nav: General | Models | Cache | Security | 
  Notifications | API Keys
- "Models" section (shown as active):
  Section: "Embedding Model"
    Current: "BAAI/bge-small-en-v1.5" 
    Dropdown to change, "Test Connection" button
  Section: "LLM Model"
    Current: "llama3.1:8b via Ollama"
    Base URL input field
    Test connection status (green checkmark)
  Section: "Reranker Model"
    Current: "cross-encoder/ms-marco-MiniLM-L-6-v2"
  Section: "Chunking Defaults"
    Chunk size: number input (default: 512)
    Chunk overlap: number input (default: 50)
    Strategy: segmented radio buttons
  "Save Changes" primary button, "Reset to Defaults" ghost button

SCREEN 9 — EMPTY STATE + LOADING STATES
- Empty document library: illustration + 
  "No documents yet" + "Upload your first document" CTA
- Empty query history: "Start a conversation" prompt
- Loading skeleton screens for table rows (animated shimmer)
- Full-page loader: NeuralVault logo + progress bar + 
  "Initializing RAG Pipeline..." text
- Error state: 500 page with "Something went wrong" + 
  retry button

─────────────────────────────────────────
COMPONENT LIBRARY (build these as components)
─────────────────────────────────────────
- Button: Primary / Secondary / Ghost / Danger — 
  each with default/hover/active/disabled/loading states
- Input: Default / Focus / Error / Disabled — 
  with label, helper text, error message
- Badge/Pill: Success / Warning / Error / Info / Neutral
- Card: Default surface card with optional header + 
  footer + hover lift effect
- Table: Header row, data row, hover state, selected state, 
  loading skeleton row
- Modal: with overlay, header, body, footer, close button
- Dropdown: with search, multi-select variant
- Tabs: underline style, pill style
- Tooltip: dark, max 200px, arrow pointing to trigger
- Progress bar: determinate + indeterminate (loading)
- Sidebar nav item: icon + label + active/hover states + 
  badge variant (for counts)
- Avatar: image + initials fallback, sizes: SM/MD/LG
- Toast notification: Success / Error / Warning / Info — 
  slide in from top-right
- Code block: dark bg, monospace, copy button top-right
- Metric card: icon + value + label + trend indicator
- Status indicator: pulsing dot (green/amber/red) + label

─────────────────────────────────────────
INTERACTION & ANIMATION NOTES
─────────────────────────────────────────
- Sidebar collapse: smooth 200ms ease transition
- Right panel: slides in from right, 300ms ease-out
- Modal: fade in + scale from 0.95 to 1.0, 150ms
- Toast: slide in from top-right, auto-dismiss 4s
- Chart tooltips: appear on hover, show exact values
- Table row hover: subtle #141C2E background shift
- Button hover: 8% lighter, slight glow on primary
- Skeleton loading: shimmer animation left to right
- Active nav item: left border 3px #4F8EF7 + bg highlight
- Page transitions: fade 100ms between routes

─────────────────────────────────────────
FIGMA FILE STRUCTURE
─────────────────────────────────────────
Page 1: 🎨 Design System (colors, type, spacing, icons)
Page 2: 🧩 Components (all components with variants/states)
Page 3: 📱 Screens — Desktop (all 9 screens, 1440px wide)
Page 4: 📐 Wireframes (low-fi layout planning)
Page 5: 🔄 User Flows (auth flow, upload flow, query flow)

─────────────────────────────────────────
QUALITY CHECKLIST (production grade)
─────────────────────────────────────────
✅ Every screen has empty + loading + error state
✅ All interactive elements have hover + active + 
   disabled states
✅ Consistent 4px grid spacing throughout
✅ All text meets WCAG AA contrast ratio
✅ Components use Auto Layout (responsive-ready)
✅ Proper use of Figma variables for all design tokens
✅ All icons from single icon set (Lucide or Phosphor)
✅ Realistic data in all mockups (no "Lorem ipsum")
✅ Annotations on complex interactions
✅ Prototype links between all 9 screens