import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Bell, BookOpen, Bot, ChevronDown, ChevronLeft, ChevronRight, CircleCheck, Clock3,
  Database, Download, Eye, EyeOff, FileText, Gauge, LayoutDashboard, Lock, Mail, Menu,
  MoreHorizontal, Plus, RotateCcw, Search, Settings, ShieldCheck, SlidersHorizontal,
  Sparkles, Target, TriangleAlert, Upload, Users, X, Zap
} from "lucide-react";
import { apiFetch, API_BASE_URL } from "../api/config";

type Page = "Dashboard" | "Documents" | "Query Studio" | "Tenants" | "Evaluation" | "Monitoring" | "Settings";
const nav: [Page, typeof LayoutDashboard][] = [
  ["Dashboard", LayoutDashboard], ["Documents", FileText], ["Query Studio", Sparkles],
  ["Tenants", Users], ["Evaluation", Target], ["Monitoring", Gauge], ["Settings", Settings]
];

// ─── UI primitives ───────────────────────────────────────────────────────────
function Logo({ short = false }: { short?: boolean }) {
  return <div className="flex items-center gap-2.5"><div className="grid size-8 place-items-center rounded-xl bg-[#d85d7a] text-white shadow-[0_8px_18px_rgba(216,93,122,.25)]"><Bot className="size-[17px]" /></div>{!short && <span className="text-[15px] font-bold tracking-[-.04em] text-[#482b35]">Neural<span className="text-[#d85d7a]">Vault</span></span>}</div>;
}
function Button({ children, onClick, variant = "primary", disabled = false }: { children: ReactNode; onClick?: () => void; variant?: "primary" | "soft" | "ghost"; disabled?: boolean }) {
  const styles = { primary: "bg-[#d85d7a] text-white shadow-[0_7px_16px_rgba(216,93,122,.2)] hover:bg-[#c94f6e]", soft: "bg-[#f8e1e5] text-[#9d3f5a] hover:bg-[#f4d0d8]", ghost: "bg-white text-[#76505c] border border-[#f0dde1] hover:bg-[#fff8f8]" };
  return <button onClick={onClick} disabled={disabled} className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3.5 text-[12px] font-semibold transition ${styles[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>{children}</button>;
}
function Status({ children, tone = "green" }: { children: ReactNode; tone?: "green" | "pink" | "amber" }) {
  const tones = { green: "bg-[#e7f6ee] text-[#388065]", pink: "bg-[#fbe9ed] text-[#b04d68]", amber: "bg-[#fff4db] text-[#af7c2e]" };
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold ${tones[tone]}`}><i className="size-1.5 rounded-full bg-current" />{children}</span>;
}
function PageHeading({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#b6919b]">Workspace / {title}</p><h1 className="text-[26px] font-bold tracking-[-.045em] text-[#422c34]">{title}</h1><p className="mt-1.5 text-[12px] text-[#9b7b85]">{text}</p></div>{action}</div>;
}
function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-[#f0dde1] bg-white shadow-[0_10px_30px_rgba(100,49,62,.04)] ${className}`}>{children}</section>;
}
function Metric({ label, value, sub, icon: Icon, tint }: { label: string; value: string; sub: string; icon: typeof FileText; tint: string }) {
  return <Card className="p-4"><div className="flex items-start justify-between"><div className={`grid size-9 place-items-center rounded-xl ${tint}`}><Icon className="size-[17px]" /></div><MoreHorizontal className="size-4 text-[#b99ba4]" /></div><p className="mt-4 text-[11px] font-semibold text-[#9b7b85]">{label}</p><p className="mt-1 font-mono text-[23px] font-semibold tracking-[-.05em] text-[#402b34]">{value}</p><p className="mt-1 text-[10px] text-[#61a483]">↗ {sub}</p></Card>;
}
function Modal({ children, close }: { children: ReactNode; close: () => void }) {
  return <div className="fixed inset-0 z-[60] grid place-items-center bg-[#4b2834]/25 p-4 backdrop-blur-sm" onClick={close}><div onClick={(e) => e.stopPropagation()} className="w-full max-w-[520px] rounded-2xl border border-[#f0dde1] bg-[#fffafa] p-6 shadow-[0_24px_70px_rgba(91,35,52,.2)]">{children}</div></div>;
}

// ─── Login ───────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (tab === "register") {
        // Register first
        await apiFetch("/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, password, full_name: fullName }),
        });
      }
      // Then login
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (data?.access_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify({
          email: data.email,
          full_name: data.full_name,
          role: data.role,
          tenant_id: data.tenant_id,
        }));
        onLogin();
      } else {
        setError("Invalid credentials");
      }
    } catch (err: any) {
      setError(err.message || (tab === "register" ? "Registration failed" : "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8f8] grid place-items-center p-4">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 text-center">
          <Logo />
          <p className="mt-3 text-[12px] text-[#9b7b85]">Enterprise Intelligence, Grounded in Truth</p>
        </div>
        <Card className="p-8">
          {/* Tabs */}
          <div className="flex rounded-lg border border-[#f0dde1] p-1 mb-6">
            <button onClick={() => { setTab("login"); setError(""); }} className={`flex-1 rounded-md py-2 text-[12px] font-semibold transition ${tab === "login" ? "bg-[#d85d7a] text-white" : "text-[#9b7b85]"}`}>Sign in</button>
            <button onClick={() => { setTab("register"); setError(""); }} className={`flex-1 rounded-md py-2 text-[12px] font-semibold transition ${tab === "register" ? "bg-[#d85d7a] text-white" : "text-[#9b7b85]"}`}>Register</button>
          </div>

          <h1 className="text-[20px] font-bold text-[#422c34]">{tab === "login" ? "Welcome back" : "Create account"}</h1>
          <p className="mt-1 text-[12px] text-[#9b7b85]">{tab === "login" ? "Sign in to your workspace" : "Get started with NeuralVault"}</p>

          {error && <div className="mt-4 rounded-lg bg-[#fde8ec] px-3 py-2 text-[11px] text-[#b04d68]">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" autoComplete="on">
            {tab === "register" && (
              <label className="block">
                <span className="text-[11px] font-bold text-[#422c34]">Full name</span>
                <div className="relative mt-1.5">
                  <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" className="h-10 w-full rounded-lg border border-[#f0dde1] bg-[#fffafa] px-3 text-[12px] outline-none focus:border-[#d85d7a]" required />
                </div>
              </label>
            )}
            <label className="block">
              <span className="text-[11px] font-bold text-[#422c34]">Email</span>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#b99ba4]" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" className="h-10 w-full rounded-lg border border-[#f0dde1] bg-[#fffafa] pl-9 pr-3 text-[12px] outline-none focus:border-[#d85d7a]" required />
              </div>
            </label>
            <label className="block">
              <span className="text-[11px] font-bold text-[#422c34]">Password</span>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#b99ba4]" />
                <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" className="h-10 w-full rounded-lg border border-[#f0dde1] bg-[#fffafa] pl-9 pr-9 text-[12px] outline-none focus:border-[#d85d7a]" required />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b99ba4]">{show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
              </div>
            </label>
            <button type="submit" disabled={loading} className="mt-2 h-10 w-full rounded-lg bg-[#d85d7a] text-[13px] font-bold text-white hover:bg-[#c94f6e] disabled:opacity-50">
              {loading ? (tab === "login" ? "Signing in…" : "Creating account…") : (tab === "login" ? "Sign in" : "Create account")}
            </button>
          </form>
        </Card>
        <p className="mt-4 text-center text-[10px] text-[#b99ba4]">v1.0.0-local · NeuralVault Enterprise RAG</p>
      </div>
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
function Dashboard({ setPage }: { setPage: (p: Page) => void }) {
  const [metrics, setMetrics] = useState<any>(null);
  const [docs, setDocs] = useState<any[]>([]);

  useEffect(() => {
    apiFetch("/monitoring/metrics").then(setMetrics).catch(() => {});
    apiFetch("/documents").then(setDocs).catch(() => {});
  }, []);

  return <>
    <PageHeading title="Dashboard" text="Your knowledge system is healthy and ready to work." action={<Button onClick={() => setPage("Documents")}><Upload className="size-4" /> Ingest documents</Button>} />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric icon={FileText} label="Total documents" value={String(metrics?.total_documents ?? "—")} sub="in knowledge base" tint="bg-[#fde9ed] text-[#d85d7a]" />
      <Metric icon={Zap} label="Total tenants" value={String(metrics?.total_tenants ?? "—")} sub="active workspaces" tint="bg-[#eee9fd] text-[#8063d4]" />
      <Metric icon={Target} label="Avg RAG score" value={metrics?.avg_rag_score ? String(metrics.avg_rag_score) : "—"} sub="latest eval run" tint="bg-[#e6f5ee] text-[#4f9e7b]" />
      <Metric icon={Clock3} label="API status" value={metrics ? "Live" : "—"} sub="all systems operational" tint="bg-[#fff2dc] text-[#c1882d]" />
    </div>
    <div className="mt-5 grid gap-5 xl:grid-cols-[1.6fr_.9fr]">
      <Card>
        <div className="flex items-center justify-between border-b border-[#f0dde1] p-5">
          <div><h2 className="text-[13px] font-bold">Query activity</h2><p className="mt-1 text-[11px] text-[#9b7b85]">Retrievals across all workspaces</p></div>
        </div>
        <div className="h-[240px] p-5">
          <svg viewBox="0 0 680 200" className="h-full w-full" preserveAspectRatio="none">
            <defs><linearGradient id="pink-area" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#e59bad" stopOpacity=".45" /><stop offset="1" stopColor="#e59bad" stopOpacity="0" /></linearGradient></defs>
            {[35, 75, 115, 155].map((y) => <line key={y} x1="0" x2="680" y1={y} y2={y} stroke="#f3e1e4" strokeDasharray="3 6" />)}
            <path d="M0,140 L100,152 L195,95 L290,112 L390,54 L490,72 L590,30 L680,65 L680,190 L0,190Z" fill="url(#pink-area)" />
            <polyline points="0,140 100,152 195,95 290,112 390,54 490,72 590,30 680,65" fill="none" stroke="#d85d7a" strokeWidth="3" />
          </svg>
          <div className="flex justify-between text-[10px] text-[#b6949e]"><span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>Now</span></div>
        </div>
      </Card>
      <Card>
        <div className="border-b border-[#f0dde1] p-5"><h2 className="text-[13px] font-bold">Recent documents</h2><p className="mt-1 text-[11px] text-[#9b7b85]">Latest ingested files</p></div>
        <div className="divide-y divide-[#f0dde1]">
          {docs.slice(0, 3).map((doc) => (
            <div className="flex items-center gap-3 px-5 py-3.5" key={doc.id}>
              <div className="grid size-8 place-items-center rounded-lg bg-[#fbe7eb] text-[#d85d7a]"><FileText className="size-4" /></div>
              <div className="min-w-0 flex-1"><p className="truncate text-[11px] font-semibold">{doc.original_filename}</p><p className="mt-1 text-[10px] text-[#9b7b85]">{doc.file_type?.toUpperCase()} · {doc.chunk_count} chunks</p></div>
              <Status tone={doc.status === "ready" ? "green" : "amber"}>{doc.status}</Status>
            </div>
          ))}
          {docs.length === 0 && <p className="p-5 text-[12px] text-[#9b7b85]">No documents yet — upload some!</p>}
        </div>
        <button onClick={() => setPage("Documents")} className="w-full border-t border-[#f0dde1] p-3 text-[11px] font-bold text-[#c34d6b] hover:bg-[#fff8f8]">View document library</button>
      </Card>
    </div>
  </>;
}

// ─── Documents ───────────────────────────────────────────────────────────────
function EnhancedDocuments({ toast }: { toast: (msg: string) => void }) {
  const [search, setSearch] = useState("");
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [upload, setUpload] = useState(false);
  const [detail, setDetail] = useState<any>(null);
  const [chunks, setChunks] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [collectionTag, setCollectionTag] = useState("Finance");

  const fetchDocs = () => {
    setLoading(true);
    apiFetch(`/documents${search ? `?search=${search}` : ""}`)
      .then(setDocs)
      .catch(() => setDocs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDocs(); }, [search]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (collectionTag) formData.append("collection_tag", collectionTag);
      const res = await fetch(`${API_BASE_URL}/documents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUpload(false);
        setSelectedFile(null);
        toast(`${data.original_filename} uploaded successfully!`);
        fetchDocs();
      } else {
        toast(`Upload failed: ${data.detail}`);
      }
    } catch {
      toast("Upload failed — check connection");
    } finally {
      setUploading(false);
    }
  };

  const openDetail = async (doc: any) => {
    setDetail(doc);
    if (doc.status === "ready") {
      const c = await apiFetch(`/documents/${doc.id}/chunks`).catch(() => []);
      setChunks(c);
    }
  };

  return <>
    <PageHeading title="Documents" text="Manage the knowledge that grounds every response." action={<Button onClick={() => setUpload(true)}><Upload className="size-4" /> Upload files</Button>} />
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0dde1] p-4">
        <div className="relative w-full max-w-sm"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#b18d98]" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search documents" className="h-9 w-full rounded-lg border border-[#f0dde1] bg-[#fffafa] pl-9 pr-3 text-[11px] outline-none focus:border-[#d85d7a]" /></div>
      </div>
      {loading ? (
        <div className="p-5 space-y-3">{[1, 2, 3].map(n => <div key={n} className="flex items-center gap-3"><div className="size-9 animate-pulse rounded-xl bg-[#f7dfe4]" /><div className="flex-1 space-y-2"><div className="h-3 w-2/5 animate-pulse rounded bg-[#f7dfe4]" /><div className="h-2.5 w-1/4 animate-pulse rounded bg-[#f9ecee]" /></div></div>)}</div>
      ) : docs.length === 0 ? (
        <div className="grid min-h-[300px] place-items-center p-8 text-center"><div><BookOpen className="mx-auto size-8 text-[#d85d7a]" /><h2 className="mt-4 text-[14px] font-bold">No documents yet</h2><p className="mt-2 text-[12px] text-[#9b7b85]">Upload a file to start building your knowledge base.</p><div className="mt-4"><Button onClick={() => setUpload(true)}><Upload className="size-4" /> Upload first document</Button></div></div></div>
      ) : (
        <div className="divide-y divide-[#f4e4e7]">
          {docs.map((doc) => (
            <button onClick={() => openDetail(doc)} className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-[#fff7f8]" key={doc.id}>
              <div className="grid size-9 place-items-center rounded-xl bg-[#fde8ec] text-[#d85d7a]"><FileText className="size-4" /></div>
              <div className="min-w-0 flex-1"><p className="truncate text-[12px] font-semibold">{doc.original_filename}</p><p className="mt-1 text-[10px] text-[#9b7b85]">{doc.file_type?.toUpperCase()} · {doc.chunk_count} chunks · {doc.collection_tag || "Uncategorized"}</p></div>
              <Status tone={doc.status === "ready" ? "green" : doc.status === "failed" ? "pink" : "amber"}>{doc.status}</Status>
              <ChevronRight className="size-4 text-[#c8aab2]" />
            </button>
          ))}
        </div>
      )}
    </Card>

    {upload && (
      <Modal close={() => setUpload(false)}>
        <div className="flex justify-between"><div><h2 className="text-[17px] font-bold">Upload documents</h2><p className="mt-1 text-[11px] text-[#9b7b85]">PDF, DOCX, TXT, MD — processed via LangChain text splitter</p></div><button onClick={() => setUpload(false)}><X className="size-4" /></button></div>
        <label className="mt-6 grid h-40 w-full cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-[#e8bac5] bg-[#fff5f6] text-center hover:bg-[#fdecf0]">
          <div><Upload className="mx-auto size-5 text-[#d85d7a]" /><p className="mt-2 text-[12px] font-bold">{selectedFile ? selectedFile.name : "Drop files here or click to browse"}</p><p className="mt-1 text-[10px] text-[#9b7b85]">Your files are processed locally.</p></div>
          <input type="file" className="hidden" accept=".pdf,.docx,.txt,.md" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
        </label>
        <label className="mt-4 block"><span className="text-[11px] font-bold">Collection tag</span><input value={collectionTag} onChange={e => setCollectionTag(e.target.value)} className="mt-1 h-9 w-full rounded-lg border border-[#f0dde1] bg-[#fffafa] px-3 text-[11px] outline-none" placeholder="Finance, Legal, HR..." /></label>
        <div className="mt-5 flex justify-end gap-2"><Button variant="ghost" onClick={() => setUpload(false)}>Cancel</Button><Button onClick={handleUpload} disabled={!selectedFile || uploading}>{uploading ? "Uploading…" : "Start ingestion"}</Button></div>
      </Modal>
    )}

    {detail && (
      <Modal close={() => setDetail(null)}>
        <div className="flex items-start justify-between"><div><Status tone={detail.status === "ready" ? "green" : "amber"}>{detail.status}</Status><h2 className="mt-3 text-[16px] font-bold">{detail.original_filename}</h2><p className="mt-1 text-[11px] text-[#9b7b85]">{detail.collection_tag} · {detail.chunk_count} chunks</p></div><button onClick={() => setDetail(null)}><X className="size-4" /></button></div>
        {chunks.length > 0 && <div className="mt-6 rounded-xl bg-[#fff1f3] p-4"><p className="text-[10px] font-bold uppercase tracking-[.1em] text-[#b96f82]">Chunk preview · {chunks[0]?.chunk_index}</p><p className="mt-2 text-[12px] leading-5 text-[#5e414a]">{chunks[0]?.text?.slice(0, 200)}...</p></div>}
        <div className="mt-5 flex justify-end gap-2"><Button variant="ghost" onClick={() => setDetail(null)}>Close</Button></div>
      </Modal>
    )}
  </>;
}

// ─── Query Studio ─────────────────────────────────────────────────────────────
function QueryStudio() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ q: string; a: string; sources: any[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const [useHyde, setUseHyde] = useState(false);
  const [useReranking, setUseReranking] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const ask = async () => {
    if (!message.trim() || loading) return;
    const q = message;
    setMessage("");
    setLoading(true);
    try {
      const data = await apiFetch("/query", {
        method: "POST",
        body: JSON.stringify({
          question: q,
          tenant_id: user.tenant_id,
          top_k: 5,
          use_hyde: useHyde,
          use_reranking: useReranking,
        }),
      });
      setMessages(prev => [...prev, { q, a: data.answer, sources: data.sources || [] }]);
    } catch {
      setMessages(prev => [...prev, { q, a: "Error connecting to backend.", sources: [] }]);
    } finally {
      setLoading(false);
    }
  };

  return <>
    <PageHeading title="Query Studio" text="Ask source-grounded questions across your connected knowledge." />
    <div className="grid gap-5 xl:grid-cols-[1fr_290px]">
      <Card className="flex min-h-[500px] flex-col">
        <div className="border-b border-[#f0dde1] p-5"><Status tone="pink"><ShieldCheck className="size-3" /> Grounded mode on</Status></div>
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {messages.length === 0 && !loading ? (
            <div className="grid h-full place-items-center text-center"><div><div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#fce8ec] text-[#d85d7a]"><Sparkles className="size-5" /></div><h2 className="mt-4 text-[15px] font-bold">What would you like to know?</h2><p className="mx-auto mt-2 max-w-sm text-[12px] leading-5 text-[#9b7b85]">Every response is connected to your uploaded documents.</p></div></div>
          ) : (
            messages.map((item, i) => (
              <div key={i} className="space-y-3">
                <div className="ml-auto max-w-[75%] rounded-2xl rounded-tr-sm bg-[#f8dfe5] px-4 py-3 text-[12px] text-[#5b3340]">{item.q}</div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-[#f0dadd] bg-[#fffafa] px-4 py-3">
                  <p className="text-[12px] leading-5">{item.a}</p>
                  {item.sources.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{item.sources.slice(0, 3).map((s, si) => <span key={si} className="rounded bg-[#f8e8eb] px-2 py-1 text-[10px] text-[#aa5267]">{s.document_name}</span>)}</div>}
                </div>
              </div>
            ))
          )}
          {loading && <div className="flex items-center gap-2 text-[12px] text-[#9b7b85]"><div className="size-4 animate-spin rounded-full border-2 border-[#d85d7a] border-t-transparent" />Thinking…</div>}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); ask(); }} className="border-t border-[#f0dde1] p-4">
          <div className="flex gap-2 rounded-xl border border-[#f0dde1] bg-[#fffafa] p-1.5 focus-within:border-[#d85d7a]">
            <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask a question about your knowledge..." className="h-9 flex-1 bg-transparent px-2 text-[12px] outline-none" />
            <Button disabled={loading}><ChevronRight className="size-4" /></Button>
          </div>
        </form>
      </Card>
      <Card className="h-fit p-5">
        <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#a98791]">Retrieval context</p>
        <div className="mt-5 space-y-4">
          <div>
            <p className="text-[11px] font-semibold">HyDE query expansion</p>
            <label className="mt-2 flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={useHyde} onChange={e => setUseHyde(e.target.checked)} className="rounded" /><span className="text-[11px] text-[#9b7b85]">{useHyde ? "Enabled" : "Disabled"}</span></label>
          </div>
          <div>
            <p className="text-[11px] font-semibold">Cross-encoder reranking</p>
            <label className="mt-2 flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={useReranking} onChange={e => setUseReranking(e.target.checked)} className="rounded" /><span className="text-[11px] text-[#9b7b85]">{useReranking ? "Enabled" : "Disabled"}</span></label>
          </div>
          <div>
            <p className="text-[11px] font-semibold">Answer precision</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#f4dce1]"><div className="h-full w-[84%] rounded-full bg-[#d85d7a]" /></div>
            <p className="mt-1 text-[10px] text-[#9b7b85]">Top 5 chunks · cross-encoder reranked · HyDE {useHyde ? "on" : "off"}</p>
            <span className="mt-2 inline-flex rounded-md bg-[#f8e8eb] px-2 py-1 text-[9px] text-[#9a5065]">Vector store: ChromaDB (local)</span>
          </div>
        </div>
      </Card>
    </div>
  </>;
}

// ─── Tenants ─────────────────────────────────────────────────────────────────
function Tenants() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTenants = () => {
    apiFetch("/tenants").then(setTenants).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchTenants(); }, []);

  const addTenant = async () => {
    if (!newName.trim()) return;
    await apiFetch("/tenants", { method: "POST", body: JSON.stringify({ name: newName, plan: "growth" }) });
    setAdding(false);
    setNewName("");
    fetchTenants();
  };

  return <>
    <PageHeading title="Tenants" text="Configure isolated knowledge workspaces for every organization." action={<Button onClick={() => setAdding(true)}><Plus className="size-4" /> Add tenant</Button>} />
    {loading ? <p className="text-[12px] text-[#9b7b85]">Loading…</p> : (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tenants.map((t) => (
          <Card className="p-5" key={t.id}>
            <div className="flex items-start justify-between"><div className="grid size-10 place-items-center rounded-xl bg-[#f8dfe5] font-bold text-[#c3506c]">{t.name.charAt(0)}</div><Status tone={t.is_active ? "green" : "amber"}>{t.status}</Status></div>
            <h2 className="mt-5 text-[14px] font-bold">{t.name}</h2>
            <p className="mt-1 text-[11px] text-[#9b7b85]">{t.plan} plan · {t.doc_count} docs</p>
            <p className="mt-1 text-[10px] text-[#b99ba4]">Namespace: {t.chroma_namespace}</p>
            <div className="mt-5 flex border-t border-[#f0dde1] pt-4 text-[11px]">
              <button
                className="font-semibold text-[#c34d6b] hover:underline"
                onClick={() => {
                  const user = JSON.parse(localStorage.getItem("user") || "{}");
                  user.tenant_id = t.id;
                  localStorage.setItem("user", JSON.stringify(user));
                  alert(`Switched to ${t.name}`);
                }}
              >
                Switch to workspace
              </button>
              <ChevronRight className="ml-auto size-4 text-[#bd9ca5]" />
            </div>
          </Card>
        ))}
      </div>
    )}
    {adding && (
      <Modal close={() => setAdding(false)}>
        <h2 className="text-[17px] font-bold">Add tenant</h2>
        <label className="mt-4 block"><span className="text-[11px] font-bold">Tenant name</span><input value={newName} onChange={e => setNewName(e.target.value)} className="mt-1.5 h-9 w-full rounded-lg border border-[#f0dde1] bg-[#fffafa] px-3 text-[12px] outline-none focus:border-[#d85d7a]" placeholder="e.g. Acme Financial" /></label>
        <div className="mt-5 flex justify-end gap-2"><Button variant="ghost" onClick={() => setAdding(false)}>Cancel</Button><Button onClick={addTenant}>Create tenant</Button></div>
      </Modal>
    )}
  </>;
}

// ─── Evaluation ───────────────────────────────────────────────────────────────
function Evaluation() {
  const [scores, setScores] = useState<any>(null);
  const [running, setRunning] = useState(false);
  const [runs, setRuns] = useState<any[]>([]);
  const [error, setError] = useState("");

  const fetchScores = () => {
    apiFetch("/evaluation/scores")
      .then(setScores)
      .catch(() => setScores(null));
    apiFetch("/evaluation/runs")
      .then(setRuns)
      .catch(() => setRuns([]));
  };

  useEffect(() => { fetchScores(); }, []);

  const triggerEval = async () => {
    setRunning(true);
    setError("");
    try {
      await apiFetch("/evaluation/run", { method: "POST" });
      // Poll every 10 seconds until completed
      const interval = setInterval(() => {
        apiFetch("/evaluation/runs")
          .then((data) => {
            setRuns(data);
            const latest = data[0];
            if (latest?.status === "completed" || latest?.status === "failed") {
              clearInterval(interval);
              setRunning(false);
              fetchScores();
            }
          })
          .catch(() => {
            clearInterval(interval);
            setRunning(false);
          });
      }, 10000);
    } catch {
      setError("Failed to start evaluation");
      setRunning(false);
    }
  };

  const metrics = scores ? [
    ["Faithfulness", scores.faithfulness?.toFixed(2), Math.round(scores.faithfulness * 100)],
    ["Answer relevancy", scores.answer_relevancy?.toFixed(2), Math.round(scores.answer_relevancy * 100)],
    ["Context precision", scores.context_precision?.toFixed(2), Math.round(scores.context_precision * 100)],
    ["Context recall", scores.context_recall?.toFixed(2), Math.round(scores.context_recall * 100)],
  ] : [
    ["Faithfulness", "—", 0], ["Answer relevancy", "—", 0],
    ["Context precision", "—", 0], ["Context recall", "—", 0],
  ];

  return <>
    <PageHeading title="Evaluation" text="Measure response quality against your verified test set." action={<Button onClick={triggerEval} disabled={running}>{running ? "Running evaluation…" : "Run evaluation"}</Button>} />
    {error && <div className="mb-4 rounded-lg bg-[#fde8ec] px-3 py-2 text-[11px] text-[#b04d68]">{error}</div>}
    <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
      <Card className="p-5">
        <h2 className="text-[13px] font-bold">RAGAs scorecard</h2>
        <p className="mt-1 text-[11px] text-[#9b7b85]">{scores ? `Latest run · ${runs[0]?.question_count || 5} questions` : "No runs yet — click Run evaluation"}</p>
        <div className="mt-6 space-y-5">
          {metrics.map(([label, value, width]) => (
            <div key={label as string}>
              <div className="flex justify-between text-[11px]"><span className="font-semibold">{label}</span><span className="font-mono text-[#b44964]">{value}</span></div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#f9e8eb]"><div className="h-full rounded-full bg-[#d85d7a] transition-all" style={{ width: `${width}%` }} /></div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-5">
        <h2 className="text-[13px] font-bold">Evaluation runs</h2>
        <p className="mt-1 text-[11px] text-[#9b7b85]">History of evaluation runs</p>
        <div className="mt-6 divide-y divide-[#f0dde1] rounded-xl border border-[#f0dde1]">
          {runs.length === 0 ? (
            <p className="px-4 py-3 text-[11px] text-[#9b7b85]">No runs yet</p>
          ) : (
            runs.slice(0, 5).map((run) => (
              <div className="flex justify-between px-4 py-3 text-[11px]" key={run.id}>
                <span className="text-[#9b7b85]">{new Date(run.created_at).toLocaleDateString()}</span>
                <Status tone={run.status === "completed" ? "green" : run.status === "failed" ? "pink" : "amber"}>{run.status}</Status>
              </div>
            ))
          )}
        </div>
        <div className="mt-4">
          <Button variant="soft" onClick={() => {
            fetchScores();
            setError("");
          }}>
            <RotateCcw className="size-4" /> Refresh scores
          </Button>
        </div>
      </Card>
    </div>
  </>;
}

// ─── Monitoring ───────────────────────────────────────────────────────────────
function Monitoring() {
  const [metrics, setMetrics] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    apiFetch("/monitoring/metrics").then(setMetrics).catch(() => {});
    apiFetch("/monitoring/services").then((d) => setServices(d.services || [])).catch(() => {});
  }, []);

  return <>
    <PageHeading title="Monitoring" text="Live health and performance signals from your RAG pipeline." />
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Metric label="Total documents" value={String(metrics?.total_documents ?? "—")} sub="in knowledge base" icon={FileText} tint="bg-[#fde9ed] text-[#d85d7a]" />
      <Metric label="Total tenants" value={String(metrics?.total_tenants ?? "—")} sub="active workspaces" icon={Users} tint="bg-[#fff1db] text-[#c1882d]" />
      <Metric label="Avg RAG score" value={metrics?.avg_rag_score ? String(metrics.avg_rag_score) : "—"} sub="latest eval" icon={Target} tint="bg-[#e6f5ee] text-[#4f9e7b]" />
      <Metric label="API status" value={metrics ? "Live" : "—"} sub="all systems" icon={Zap} tint="bg-[#eee9fd] text-[#8063d4]" />
    </div>
    <Card className="mt-5">
      <div className="border-b border-[#f0dde1] p-5"><h2 className="text-[13px] font-bold">Service status</h2><p className="mt-1 text-[11px] text-[#9b7b85]">Core infrastructure health</p></div>
      <div className="grid divide-y divide-[#f0dde1] md:grid-cols-4 md:divide-x md:divide-y-0">
        {services.length === 0 ? (
          <div className="col-span-4 p-5 text-[12px] text-[#9b7b85]">Loading services…</div>
        ) : (
          services.map((svc) => (
            <div className="p-5" key={svc.name}>
              <Status tone={svc.status === "operational" ? "green" : "pink"}>{svc.status}</Status>
              <p className="mt-4 text-[12px] font-bold">{svc.name}</p>
              <p className="mt-1 text-[11px] text-[#9b7b85]">Latency: {svc.latency_ms}ms</p>
            </div>
          ))
        )}
      </div>
    </Card>
  </>;
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function EnhancedSettings({ toast }: { toast: (msg: string) => void }) {
  const [tab, setTab] = useState("Models");
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    apiFetch("/settings").then(setSettings).catch(() => {});
  }, []);

  const save = async () => {
    await apiFetch("/settings", { method: "PUT", body: JSON.stringify(settings) });
    toast("Settings saved successfully!");
  };

  return <>
    <PageHeading title="Settings" text="Set the models and defaults that power this workspace." />
    <div className="grid gap-5 lg:grid-cols-[180px_1fr]">
      <Card className="h-fit p-2">
        {["General", "Models", "Cache", "Security", "Notifications", "API Keys"].map((item) => (
          <button onClick={() => setTab(item)} key={item} className={`w-full rounded-lg px-3 py-2.5 text-left text-[11px] font-semibold ${tab === item ? "bg-[#f8dfe5] text-[#a83e5a]" : "text-[#9b7b85] hover:bg-[#fff8f8]"}`}>{item}</button>
        ))}
      </Card>
      <Card className="p-6">
        <h2 className="text-[16px] font-bold">{tab}</h2>
        {tab === "Models" && settings && (
          <div className="mt-6 space-y-6">
            {[
              ["Embedding model", "embedding_model"],
              ["LLM model", "llm_model"],
              ["Reranker model", "reranker_model"],
            ].map(([label, key]) => (
              <label className="block" key={key}>
                <span className="text-[11px] font-bold">{label}</span>
                <div className="mt-2 flex gap-2"><div className="flex h-10 flex-1 items-center rounded-lg border border-[#f0dde1] bg-[#fffafa] px-3 text-[11px] text-[#654b54]">{settings[key]}</div></div>
                <p className="mt-1.5 text-[10px] text-[#5b9d7c]">● Connection verified</p>
              </label>
            ))}
            <div className="border-t border-[#f0dde1] pt-5">
              <p className="text-[11px] font-bold">Chunking defaults</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="text-[10px] text-[#9b7b85]">Chunk size<input value={settings.chunk_size} onChange={e => setSettings({ ...settings, chunk_size: Number(e.target.value) })} className="mt-1 block h-9 w-full rounded-lg border border-[#f0dde1] bg-[#fffafa] px-3 text-[11px] outline-none" /></label>
                <label className="text-[10px] text-[#9b7b85]">Chunk overlap<input value={settings.chunk_overlap} onChange={e => setSettings({ ...settings, chunk_overlap: Number(e.target.value) })} className="mt-1 block h-9 w-full rounded-lg border border-[#f0dde1] bg-[#fffafa] px-3 text-[11px] outline-none" /></label>
              </div>
            </div>
            <div className="flex gap-2 border-t border-[#f0dde1] pt-5"><Button onClick={save}>Save changes</Button><Button variant="ghost">Reset defaults</Button></div>
          </div>
        )}
        {tab === "Cache" && settings && (
          <div className="mt-6 space-y-4">
            <label className="block"><span className="text-[11px] font-bold">Response cache TTL (seconds)</span><input value={settings.cache_ttl} onChange={e => setSettings({ ...settings, cache_ttl: Number(e.target.value) })} className="mt-1.5 h-9 w-full rounded-lg border border-[#f0dde1] bg-[#fffafa] px-3 text-[11px] outline-none" /></label>
            <label className="block"><span className="text-[11px] font-bold">Semantic cache threshold</span><input value={settings.semantic_cache_threshold} onChange={e => setSettings({ ...settings, semantic_cache_threshold: Number(e.target.value) })} className="mt-1.5 h-9 w-full rounded-lg border border-[#f0dde1] bg-[#fffafa] px-3 text-[11px] outline-none" /></label>
            <p className="text-[10px] text-[#9b7b85]">Powered by Redis OSS (self-hosted)</p>
            <Button onClick={save}>Save changes</Button>
          </div>
        )}
        {tab !== "Models" && tab !== "Cache" && (
          <div className="mt-6 rounded-xl bg-[#fff6f7] p-5 text-[12px] text-[#9b7b85]">{tab} preferences are ready to configure.</div>
        )}
      </Card>
    </div>
  </>;
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem("access_token"));

  if (!authed) return <LoginPage onLogin={() => setAuthed(true)} />;
  return <WorkspaceApp onSignOut={() => { localStorage.clear(); setAuthed(false); }} />;
}

function WorkspaceApp({ onSignOut }: { onSignOut: () => void }) {
  const [page, setPage] = useState<Page>("Dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [toast, setToast] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 4000); };

  const pageContent: Record<Page, ReactNode> = {
    Dashboard: <Dashboard setPage={setPage} />,
    Documents: <EnhancedDocuments toast={showToast} />,
    "Query Studio": <QueryStudio />,
    Tenants: <Tenants />,
    Evaluation: <Evaluation />,
    Monitoring: <Monitoring />,
    Settings: <EnhancedSettings toast={showToast} />,
  };

  return (
    <main className="min-h-screen bg-[#fff8f8] font-sans text-[#422c34]">
      <aside className={`fixed inset-y-0 left-0 z-30 flex flex-col border-r border-[#f0dde1] bg-[#fff1f1]/95 backdrop-blur-lg transition-all duration-200 ${collapsed ? "w-[70px]" : "w-[228px]"}`}>
        <div className={`flex h-16 items-center border-b border-[#f0dde1] px-4 ${collapsed ? "justify-center" : ""}`}>
          <Logo short={collapsed} />
          {!collapsed && <button onClick={() => setCollapsed(true)} className="ml-auto grid size-7 place-items-center rounded-lg text-[#b78f9b] hover:bg-[#f8dce1]"><ChevronLeft className="size-4" /></button>}
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map(([label, Icon]) => (
            <button onClick={() => setPage(label)} title={collapsed ? label : undefined} className={`flex h-10 w-full items-center rounded-xl transition ${page === label ? "bg-[#f8dce1] text-[#9d3654]" : "text-[#856a73] hover:bg-[#fde8eb]"}`} key={label}>
              <Icon className={`size-[17px] ${collapsed ? "mx-auto" : "ml-3"}`} />
              {!collapsed && <span className="ml-3 text-[12px] font-semibold">{label}</span>}
            </button>
          ))}
        </nav>
        <div className="border-t border-[#f0dde1] p-3">
          {collapsed ? (
            <button onClick={() => setCollapsed(false)} className="grid size-10 place-items-center rounded-xl text-[#a27985] hover:bg-[#f8dce1]"><Menu className="size-4" /></button>
          ) : (
            <div className="flex items-center gap-2 rounded-xl p-2">
              <div className="grid size-8 place-items-center rounded-full bg-[#e7a7b6] text-[10px] font-bold text-white">{user.full_name?.[0] || "A"}</div>
              <div className="min-w-0"><p className="truncate text-[11px] font-bold">{user.full_name || "Admin"}</p><p className="text-[10px] text-[#9b7b85]">{user.role}</p></div>
            </div>
          )}
        </div>
      </aside>

      <div className={`min-h-screen transition-all duration-200 ${collapsed ? "ml-[70px]" : "ml-[228px]"}`}>
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-[#f0dde1] bg-[#fff8f7]/90 px-5 backdrop-blur-lg">
          <div className="flex items-center gap-2 rounded-lg border border-[#f0dde1] bg-white px-3 py-2 text-[11px] font-semibold text-[#634953]">
            {user.full_name || "Admin"} <ChevronDown className="size-3.5 text-[#a9828d]" />
          </div>
          <div className="relative mx-auto max-w-[430px] flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#bd99a3]" />
            <input placeholder="Search your workspace" className="h-9 w-full rounded-lg border border-[#f0dde1] bg-white pl-9 pr-3 text-[11px] outline-none placeholder:text-[#b99aa3]" />
          </div>
          <button onClick={() => setDrawer(true)} className="relative grid size-9 place-items-center rounded-lg hover:bg-[#fde8eb]"><Bell className="size-4 text-[#866b74]" /></button>
          <div className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-full bg-[#e7a7b6] text-[9px] font-bold text-white">{user.full_name?.[0] || "A"}</div>
          <button onClick={onSignOut} className="flex items-center gap-1.5 rounded-lg border border-[#f0dde1] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#9b7b85] hover:bg-[#fff0f2] hover:text-[#d85d7a] transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign out
          </button>
          </div>
        </header>
        <section className="mx-auto max-w-[1440px] p-5 lg:p-7">{pageContent[page]}</section>
      </div>

      {drawer && (
        <div onClick={() => setDrawer(false)} className="fixed inset-0 z-50 flex justify-end bg-[#4b2834]/15 backdrop-blur-[1px]">
          <aside onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-[360px] border-l border-[#f0dde1] bg-[#fffafa] p-6">
            <div className="flex items-center justify-between"><h2 className="text-[15px] font-bold">Notifications</h2><button onClick={() => setDrawer(false)}><X className="size-4" /></button></div>
            <div className="mt-6 space-y-3">
              {[["System ready", "NeuralVault backend is connected.", "just now"], ["Evaluation done", `RAGAs scores updated.`, "2m ago"]].map(([title, text, time]) => (
                <div className="rounded-xl border border-[#f0dde1] bg-white p-4" key={title}>
                  <div className="flex gap-3"><span className="mt-1.5 size-2 shrink-0 rounded-full bg-[#d85d7a]" /><div><p className="text-[11px] font-bold">{title}</p><p className="mt-1 text-[11px] leading-5 text-[#9b7b85]">{text}</p><p className="mt-2 text-[10px] text-[#b6929b]">{time}</p></div></div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}

      {toast && (
        <div className="fixed right-5 top-5 z-[70] flex items-center gap-3 rounded-xl border border-[#d4eadc] bg-white px-4 py-3 text-[11px] font-semibold text-[#3c765c] shadow-lg">
          <CircleCheck className="size-4" />{toast}<button onClick={() => setToast("")}><X className="size-3.5" /></button>
        </div>
      )}
    </main>
  );
}