import React, { useState, useEffect, useRef } from "react";
import {
  Globe,
  Shield,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Server,
  Search,
  Copy,
  FileText,
  Check,
  Activity,
  Cpu,
  Zap,
  Database,
  Network,
  Terminal as TerminalIcon,
  ArrowRight,
  Lock,
  Unlock,
  Download,
  Eye,
  RefreshCw,
  FileSpreadsheet,
  MessageSquare,
  Send,
  Share2,
  FileDown,
  HelpCircle,
  Info,
  Sparkles
} from "lucide-react";
import { defaultSearchQueries } from "../data/searchEngines";

interface RecoxScannerProps {
  language: "en" | "ar";
  initialDomain?: string;
}

interface DiscoveredEndpoint {
  url: string;
  type: string;
  method: string;
  params: string[];
}

interface ScanResult {
  target: string;
  ip: string;
  geo: {
    country: string;
    city: string;
    isp: string;
  };
  dns: {
    a: string[];
    mx: string[];
    txt: string[];
    ns: string[];
  };
  subdomains: Array<{ subdomain: string; ip: string }>;
  headers: Array<{
    name: string;
    value: string;
    status: "present" | "missing";
    description: string;
    descriptionAr: string;
  }>;
  serverHeader: string;
  poweredByHeader: string;
  whois: string;
  nmap: string;
  endpoints: DiscoveredEndpoint[];
  aiReport: {
    severity: "Low" | "Medium" | "High";
    analysis: string;
    analysisAr: string;
    recommendations: string[];
    recommendationsAr: string[];
    threats: string[];
    threatsAr: string[];
  };
  passiveIntel?: {
    shodan?: {
      ip: string;
      asn: string;
      isp: string;
      ports: number[];
      os: string;
      last_update: string;
      hostnames: string[];
      vulns: string[];
      services: Array<{
        port: number;
        name: string;
        product: string;
        banner: string;
      }>;
    };
    fofa?: {
      query: string;
      total: number;
      results: Array<{
        ip: string;
        port: number;
        protocol: string;
        country: string;
        domain: string;
        server: string;
        title: string;
      }>;
    };
    censys?: {
      ip: string;
      services: Array<{
        port: number;
        name: string;
        protocol: string;
        software: string;
      }>;
    };
  };
}

interface ChatMessage {
  role: "user" | "model";
  text: string;
  timestamp: string;
}

const SubdomainPreview: React.FC<{ domain: string; language: "en" | "ar" }> = ({ domain, language }) => {
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const getSrc = (index: number) => {
    if (index === 0) {
      return `https://image.thum.io/get/width/600/crop/800/maxAge/12/https://${domain}`;
    }
    if (index === 1) {
      return `https://api.microlink.io/?url=https://${domain}&screenshot=true&embed=screenshot.url`;
    }
    if (index === 2) {
      return `https://api.microlink.io/?url=http://${domain}&screenshot=true&embed=screenshot.url`;
    }
    return "";
  };

  const handleImageError = () => {
    if (attempt < 2) {
      setLoading(true);
      setAttempt((prev) => prev + 1);
    } else {
      setLoading(false);
      setAttempt(3); // Marked as failed/fallback
    }
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  const isFailed = attempt >= 3;

  // Generate a seed-based styled cyber mockup for offline/non-web domains
  const getMockupStyle = (host: string) => {
    const hash = host.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const gradients = [
      "from-indigo-950/80 via-slate-900 to-slate-950",
      "from-cyan-950/80 via-slate-900 to-slate-950",
      "from-purple-950/80 via-slate-900 to-slate-950",
      "from-slate-900 via-slate-950 to-slate-900"
    ];
    const borderColors = [
      "border-indigo-500/20 group-hover:border-indigo-500/40",
      "border-cyan-500/20 group-hover:border-cyan-500/40",
      "border-purple-500/20 group-hover:border-purple-500/40",
      "border-emerald-500/20 group-hover:border-emerald-500/40"
    ];
    return {
      gradient: gradients[hash % gradients.length],
      border: borderColors[hash % borderColors.length],
      badgeColor: ["text-indigo-400 bg-indigo-500/10", "text-cyan-400 bg-cyan-500/10", "text-purple-400 bg-purple-500/10", "text-emerald-400 bg-emerald-500/10"][hash % 4]
    };
  };

  const style = getMockupStyle(domain);

  return (
    <div className="relative group select-none">
      <div 
        onClick={() => setIsOpen(true)}
        className={`relative w-64 h-38 rounded-lg overflow-hidden border bg-slate-950 transition-all cursor-pointer ${
          isFailed 
            ? `border-slate-800 hover:border-slate-700 shadow-sm` 
            : `border-indigo-500/20 group-hover:border-indigo-500 group-hover:scale-[1.03] shadow-md shadow-indigo-500/5 group-hover:shadow-indigo-500/10`
        }`}
      >
        {/* Top Mini Browser Bar */}
        <div className="absolute top-0 inset-x-0 h-5.5 bg-slate-950/90 border-b border-slate-800/60 px-2 flex items-center justify-between z-10">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500/70"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500/70"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70"></span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono truncate max-w-[140px]">{domain}</span>
        </div>

        {/* Image / Mockup Body */}
        <div className="w-full h-full pt-5.5 relative">
          {loading && !isFailed && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-xs text-slate-500 font-mono z-20">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
            </div>
          )}

          {isFailed ? (
            <div className={`w-full h-full bg-gradient-to-br ${style.gradient} p-3 flex flex-col justify-between items-start`}>
              <div className="w-full flex justify-between items-center">
                <Globe className="w-4 h-4 text-slate-400" />
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${style.badgeColor}`}>
                  PASSIVE
                </span>
              </div>
              <div className="w-full">
                <p className="text-xs font-mono font-bold text-slate-200 truncate w-full" title={domain}>
                  {domain.split(".")[0].toUpperCase()}
                </p>
                <span className="text-[9px] text-slate-500 font-mono block tracking-wider">PORT 80/443</span>
              </div>
            </div>
          ) : (
            <img
              src={getSrc(attempt)}
              alt={domain}
              referrerPolicy="no-referrer"
              onLoad={handleImageLoad}
              onError={handleImageError}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      {/* Lightbox / Modal for magnification */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-2xl w-full relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Window Controls */}
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="ml-2 font-mono text-xs text-indigo-400 font-bold bg-slate-950 px-2.5 py-1 rounded border border-slate-800">{domain}</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg transition-all"
              >
                {language === "en" ? "Close" : "إغلاق"}
              </button>
            </div>
            
            {/* Main view container */}
            <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative flex items-center justify-center">
              {isFailed ? (
                <div className={`w-full h-full bg-gradient-to-br ${style.gradient} p-8 flex flex-col justify-between items-start`}>
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      <Globe className="w-6 h-6 animate-pulse" />
                    </span>
                    <div>
                      <h4 className="font-mono text-lg font-bold text-white">{domain}</h4>
                      <p className="text-xs text-slate-400">{language === "en" ? "Passive Subdomain Asset" : "أصل نطاق فرعي خامل"}</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 w-full bg-slate-900/60 p-4 rounded-xl border border-slate-800 max-w-md font-mono text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{language === "en" ? "DNS Resolution Status:" : "حالة مطابقة الـ DNS:"}</span>
                      <span className="text-emerald-400">SUCCESSFUL (ACTIVE)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{language === "en" ? "Web Port Response:" : "استجابة منفذ الويب:"}</span>
                      <span className="text-amber-400">No active HTML/HTTP response detected</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{language === "en" ? "Security Status:" : "حالة الحماية والأمان:"}</span>
                      <span className="text-slate-400">Passive DNS Record Locked</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 font-mono">
                    RECOX INTEL SCANNER v2.0 • {new Date().toLocaleDateString()}
                  </div>
                </div>
              ) : (
                <img 
                  src={getSrc(attempt === 3 ? 0 : attempt)}
                  alt={domain}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            
            <div className="mt-4 flex justify-between items-center text-xs text-slate-400">
              <p>
                {isFailed 
                  ? (language === "en" ? "Offline asset placeholder" : "معاينة البنية التحتية الافتراضية للعنوان")
                  : (language === "en" ? "Live visual preview capture" : "لقطة شاشة تفصيلية حية للموقع")}
              </p>
              <a 
                href={`http://${domain}`} 
                target="_blank" 
                rel="noreferrer" 
                className="text-indigo-400 hover:underline flex items-center gap-1 font-sans font-medium"
              >
                <span>{language === "en" ? "Visit Domain" : "زيارة الموقع"}</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const RecoxScanner: React.FC<RecoxScannerProps> = ({ language, initialDomain = "" }) => {
  const [targetDomain, setTargetDomain] = useState(initialDomain);
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [stepText, setStepText] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"dashboard" | "subdomains" | "network-map" | "endpoints" | "shodan-fofa" | "headers" | "dns" | "nmap" | "whois" | "ai-chat">("dashboard");
  
  // OSINT & Search Engine Keys & Live Query States
  const [shodanApiKey, setShodanApiKey] = useState(() => localStorage.getItem("recox_shodan_key") || "");
  const [fofaEmail, setFofaEmail] = useState(() => localStorage.getItem("recox_fofa_email") || "");
  const [fofaKey, setFofaKey] = useState(() => localStorage.getItem("recox_fofa_key") || "");
  const [censysId, setCensysId] = useState(() => localStorage.getItem("recox_censys_id") || "");
  const [censysSecret, setCensysSecret] = useState(() => localStorage.getItem("recox_censys_secret") || "");
  
  const [liveQueryEngine, setLiveQueryEngine] = useState<"Shodan" | "FOFA" | "Censys">("Shodan");
  const [customQueryText, setCustomQueryText] = useState("");
  const [selectedPredefinedDorkId, setSelectedPredefinedDorkId] = useState("");
  const [liveQueryLoading, setLiveQueryLoading] = useState(false);
  const [liveQueryResults, setLiveQueryResults] = useState<any | null>(null);
  const [liveQueryError, setLiveQueryError] = useState<string | null>(null);
  const [showKeysConfig, setShowKeysConfig] = useState(false);

  // Sync keys with localStorage when modified
  useEffect(() => {
    localStorage.setItem("recox_shodan_key", shodanApiKey);
  }, [shodanApiKey]);

  useEffect(() => {
    localStorage.setItem("recox_fofa_email", fofaEmail);
    localStorage.setItem("recox_fofa_key", fofaKey);
  }, [fofaEmail, fofaKey]);

  useEffect(() => {
    localStorage.setItem("recox_censys_id", censysId);
    localStorage.setItem("recox_censys_secret", censysSecret);
  }, [censysId, censysSecret]);

  // Tab-specific filters & searches
  const [subdomainSearch, setSubdomainSearch] = useState("");
  const [endpointSearch, setEndpointSearch] = useState("");
  const [endpointTypeFilter, setEndpointTypeFilter] = useState<string>("All");
  const [showOnlySensitive, setShowOnlySensitive] = useState(false);

  // AI Chat state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Network Map state
  const [selectedNode, setSelectedNode] = useState<{ label: string; ip: string; isRoot?: boolean } | null>(null);

  useEffect(() => {
    if (initialDomain) {
      setTargetDomain(initialDomain);
    }
  }, [initialDomain]);

  useEffect(() => {
    // Scroll chat to bottom when logs update
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, chatLoading]);

  // Set default chat welcome when scan result is loaded
  useEffect(() => {
    if (result) {
      setChatHistory([
        {
          role: "model",
          text: language === "en" 
            ? `👋 Greetings! I am your **RECOX AI Cybersecurity Advisor**. I have reviewed the automated intelligence gathered on **${result.target}**.\n\nHere are some strategic topics we can discuss regarding this target:\n- **Reconnaissance Audit**: Advanced testing plans or takeover risks.\n- **Endpoint Fuzzing**: Custom payloads for SQL Injection, XSS, or Command Injection.\n- **Defensive Hardening**: Step-by-step resolution for missing HTTP Headers.\n\nAsk me anything, or click one of the automated secure assessment prompts below!`
            : `👋 أهلاً بك! أنا **مستشار الأمن السيبراني الذكي RECOX**. لقد قمت بمراجعة البيانات المستطلعة لنطاق الهدف **${result.target}**.\n\nإليك بعض المواضيع الأمنية التي يمكننا مناقشتها وتوليدها لهذا الهدف:\n- **خطة الاستطلاع المتقدمة**: تحليل أخطار النطاقات الفرعية والاستحواذ عليها.\n- **اختبار الثغرات للروابط**: تصميم حزم فحص مخصصة لثغرات SQL Injection و XSS.\n- **التحصين الدفاعي**: خطوات عملية مخصصة لسد ثغرات عناوين الأمان HTTP.\n\nاطرح سؤالك الأمني، أو انقر على أحد الخيارات السريعة المتاحة بالأسفل!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      // Select the root domain as default map node
      setSelectedNode({ label: result.target, ip: result.ip, isRoot: true });
    }
  }, [result, language]);

  const stepsEn = [
    "Initializing RECOX reconnaissance framework...",
    "Querying DNS infrastructure (A, MX, TXT, NS records)...",
    "Resolving GeoIP location and Autonomous System (ASN) data...",
    "Querying Certificate Transparency logs (crt.sh)...",
    "Running rapid subdomain enumeration with HackerTarget HostSearch...",
    "Probing remote web port 80 & 443 for server headers...",
    "Analyzing HTTP Security Headers (HSTS, CSP, XFO, Referrer)...",
    "Running Nmap Port Scan (TCP standard services)...",
    "Fetching registrar WHOIS records...",
    "Consulting AI Security Agent for real-time risk assessment...",
    "Compiling unified security intelligence report..."
  ];

  const stepsAr = [
    "بدء تشغيل إطار عمل الاستطلاع الذكي RECOX...",
    "الاستعلام عن البنية التحتية لنظام DNS (سجلات A، MX، TXT، NS)...",
    "تحديد الموقع الجغرافي للـ IP وبيانات شبكة الاتصال (ASN)...",
    "فحص سجلات شفافية الشهادات الرقمية (crt.sh)...",
    "جرد وتعداد النطاقات الفرعية النشطة عبر محرك HackerTarget...",
    "فحص المنافذ والردود على المنفذ 80 و 443 لمطابقة خوادم الويب...",
    "تحليل عناوين الأمان لبروتوكول HTTP (HSTS، CSP، X-Frame)...",
    "تشغيل فحص منافذ سريع من خلال Nmap...",
    "سحب وتصنيف سجلات بيانات ملكية النطاق WHOIS...",
    "الاستعلام من خبير الذكاء الاصطناعي الأمني لتقييم المخاطر والثغرات...",
    "تجميع وتنسيق التقرير النهائي للأمن السيبراني..."
  ];

  const runScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!targetDomain) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setScanStep(0);

    const steps = language === "en" ? stepsEn : stepsAr;
    setStepText(steps[0]);

    // Animate scanning steps
    const interval = setInterval(() => {
      setScanStep((prev) => {
        const next = prev + 1;
        if (next < steps.length) {
          setStepText(steps[next]);
          return next;
        }
        clearInterval(interval);
        return prev;
      });
    }, 1200);

    try {
      const response = await fetch("/api/recox-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: targetDomain })
      });

      clearInterval(interval);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || (language === "en" ? "Failed to scan the target" : "فشل فحص الهدف المحدد"));
      }

      const data: ScanResult = await response.json();
      setResult(data);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRunLiveQuery = async (queryTextToRun?: string) => {
    const qText = queryTextToRun || customQueryText;
    if (!qText) {
      setLiveQueryError(language === "en" ? "Query cannot be empty" : "لا يمكن ترك نص الاستعلام فارغاً");
      return;
    }

    setLiveQueryLoading(true);
    setLiveQueryError(null);
    setLiveQueryResults(null);

    try {
      let endpoint = "";
      let payload: any = {};

      if (liveQueryEngine === "Shodan") {
        if (!shodanApiKey) {
          throw new Error(language === "en" ? "Shodan API Key is not configured. Add it in the Credentials panel." : "لم يتم إعداد مفتاح Shodan API. قم بإضافته من لوحة المصادقة.");
        }
        endpoint = "/api/proxy/shodan";
        const isIp = /^[0-9.]+$/.test(qText.trim());
        payload = {
          apiKey: shodanApiKey,
          type: isIp ? "host" : "search",
          ip: isIp ? qText.trim() : undefined,
          query: isIp ? undefined : qText
        };
      } else if (liveQueryEngine === "FOFA") {
        if (!fofaEmail || !fofaKey) {
          throw new Error(language === "en" ? "FOFA Credentials (Email and Key) are not configured." : "لم يتم إعداد بيانات FOFA (البريد الإلكتروني والمفتاح).");
        }
        endpoint = "/api/proxy/fofa";
        payload = { email: fofaEmail, key: fofaKey, query: qText };
      } else {
        if (!censysId || !censysSecret) {
          throw new Error(language === "en" ? "Censys Credentials (ID and Secret) are not configured." : "لم يتم إعداد بيانات Censys (الرمز التعريفي والسر).");
        }
        endpoint = "/api/proxy/censys";
        payload = { apiId: censysId, secret: censysSecret, query: qText };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `API Error: HTTP ${res.status}`);
      }

      setLiveQueryResults(data);
    } catch (err: any) {
      console.error("Live Query failed:", err);
      setLiveQueryError(err.message || "Failed to complete search engine query");
    } finally {
      setLiveQueryLoading(false);
    }
  };

  const handleSendChatMessage = async (customText?: string) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim() || chatLoading || !result) return;

    const userMsg: ChatMessage = {
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory((prev) => [...prev, userMsg]);
    if (!customText) setChatInput("");
    setChatLoading(true);
    setChatError(null);

    try {
      const response = await fetch("/api/recox-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: result.target,
          message: textToSend,
          chatHistory: chatHistory.map(h => ({ role: h.role, text: h.text })),
          scanData: {
            ip: result.ip,
            geo: result.geo,
            nmap: result.nmap,
            headers: result.headers.map(h => ({ name: h.name, status: h.status, value: h.value })),
            subdomains: result.subdomains,
            serverHeader: result.serverHeader,
            poweredByHeader: result.poweredByHeader
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || (language === "en" ? "AI response failed" : "فشلت استجابة الذكاء الاصطناعي"));
      }

      const data = await response.json();
      
      const modelMsg: ChatMessage = {
        role: "model",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistory((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      setChatError(err.message || "Error generating response");
    } finally {
      setChatLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "from-rose-500/20 to-rose-600/10 border-rose-500 text-rose-300";
      case "Medium":
        return "from-amber-500/20 to-amber-600/10 border-amber-500 text-amber-300";
      default:
        return "from-emerald-500/20 to-emerald-600/10 border-emerald-500 text-emerald-300";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40";
      case "Medium":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      default:
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    }
  };

  // Sensitivity checker for endpoints
  const isEndpointSensitive = (url: string): { isSensitive: boolean; reason: string; severity: "Critical" | "High" | "Medium" } => {
    const lower = url.toLowerCase();
    if (lower.includes(".env")) {
      return { isSensitive: true, reason: language === "en" ? "Environment File Leak" : "تسريب ملف البيئة الحساسة", severity: "Critical" };
    }
    if (lower.includes(".git")) {
      return { isSensitive: true, reason: language === "en" ? "Git Repository Directory Expose" : "مجلد مستودع Git مكشوف", severity: "Critical" };
    }
    if (lower.includes("wp-config")) {
      return { isSensitive: true, reason: language === "en" ? "WordPress Config File" : "ملف إعدادات ووردبريس", severity: "Critical" };
    }
    if (lower.includes(".sql") || lower.includes(".bak") || lower.includes("backup")) {
      return { isSensitive: true, reason: language === "en" ? "Database Backup Exposed" : "نسخة احتياطية لقاعدة البيانات", severity: "High" };
    }
    if (lower.includes("passwd") || lower.includes("shadow")) {
      return { isSensitive: true, reason: language === "en" ? "System Credential Path" : "مسار بيانات النظام الحساسة", severity: "High" };
    }
    if (lower.includes("/admin") || lower.includes("/wp-admin") || lower.includes("/login")) {
      return { isSensitive: true, reason: language === "en" ? "Administrative Panel Portal" : "مدخل لوحة تحكم إدارية", severity: "Medium" };
    }
    if (lower.includes("token=") || lower.includes("key=") || lower.includes("secret=") || lower.includes("password=")) {
      return { isSensitive: true, reason: language === "en" ? "Authentication Token in Query" : "رمز مصادقة في الرابط", severity: "High" };
    }
    return { isSensitive: false, reason: "", severity: "Medium" };
  };

  // Filter and compute subdomains
  const filteredSubdomains = result
    ? result.subdomains.filter((s) =>
        s.subdomain.toLowerCase().includes(subdomainSearch.toLowerCase())
      )
    : [];

  // Filter and compute endpoints
  const allEndpoints = result ? result.endpoints || [] : [];
  const processedEndpoints = allEndpoints.map(ep => {
    const sensData = isEndpointSensitive(ep.url);
    return { ...ep, ...sensData };
  });

  const filteredEndpoints = processedEndpoints.filter(ep => {
    const matchesSearch = ep.url.toLowerCase().includes(endpointSearch.toLowerCase());
    const matchesType = endpointTypeFilter === "All" || ep.type === endpointTypeFilter;
    const matchesSensitive = !showOnlySensitive || ep.isSensitive;
    return matchesSearch && matchesType && matchesSensitive;
  });

  const sensitiveEndpointsCount = processedEndpoints.filter(ep => ep.isSensitive).length;

  // Custom inline markdown parser to display bullet points, bold text, and code syntax correctly
  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, lIdx) => {
      // Check for code blocks
      if (line.startsWith("```")) {
        return null; // Skip markdown block characters
      }

      // Check for list bullet
      const isBullet = line.startsWith("- ") || line.startsWith("* ");
      const cleanLine = isBullet ? line.substring(2) : line;

      // Simple parser for **bold** and `code`
      const parts = [];
      let currentIdx = 0;
      const regex = /(\*\*.*?\*\*|`.*?`)/g;
      let match;

      while ((match = regex.exec(cleanLine)) !== null) {
        // Text before match
        if (match.index > currentIdx) {
          parts.push({ text: cleanLine.substring(currentIdx, match.index), type: "text" });
        }

        const matchText = match[0];
        if (matchText.startsWith("**") && matchText.endsWith("**")) {
          parts.push({ text: matchText.slice(2, -2), type: "bold" });
        } else if (matchText.startsWith("`") && matchText.endsWith("`")) {
          parts.push({ text: matchText.slice(1, -1), type: "code" });
        }

        currentIdx = regex.lastIndex;
      }

      if (currentIdx < cleanLine.length) {
        parts.push({ text: cleanLine.substring(currentIdx), type: "text" });
      }

      const inlineElements = parts.map((p, pIdx) => {
        if (p.type === "bold") {
          return <strong key={pIdx} className="text-white font-bold">{p.text}</strong>;
        }
        if (p.type === "code") {
          return <code key={pIdx} className="bg-slate-950 text-rose-400 font-mono px-1.5 py-0.5 rounded text-xs border border-slate-800">{p.text}</code>;
        }
        return <span key={pIdx}>{p.text}</span>;
      });

      if (isBullet) {
        return (
          <li key={lIdx} className="ml-4 list-disc text-sm text-slate-300 leading-relaxed mb-1.5">
            {inlineElements}
          </li>
        );
      }

      // Regular paragraph
      if (cleanLine.trim() === "") {
        return <div key={lIdx} className="h-2" />;
      }

      return (
        <p key={lIdx} className="text-sm text-slate-300 leading-relaxed mb-2">
          {inlineElements}
        </p>
      );
    });
  };

  // Export report as JSON file
  const exportAsJSON = () => {
    if (!result) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${result.target}_recox_scan.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export report as Markdown file
  const exportAsMarkdown = () => {
    if (!result) return;
    let mdContent = `# RECOX Security Scan Report - ${result.target}\n`;
    mdContent += `Generated: ${new Date().toLocaleDateString()} | Target: ${result.target} | Primary IP: ${result.ip}\n`;
    mdContent += `Location: ${result.geo.country}, ${result.geo.city} (ISP: ${result.geo.isp})\n\n`;
    
    mdContent += `## 1. AI Security smart Audit Summary\n`;
    mdContent += `**Overall Threat Severity**: ${result.aiReport.severity}\n\n`;
    mdContent += `### Posture Analysis\n`;
    mdContent += `${result.aiReport.analysis}\n\n`;
    
    mdContent += `### Identified Threat Vectors\n`;
    result.aiReport.threats.forEach(t => { mdContent += `- ${t}\n`; });
    
    mdContent += `\n### Recommended Security Hardening\n`;
    result.aiReport.recommendations.forEach(r => { mdContent += `- ${r}\n`; });
    
    mdContent += `\n## 2. Active Subdomains Discovery (${result.subdomains.length})\n`;
    result.subdomains.forEach(s => {
      mdContent += `- **${s.subdomain}** (${s.ip})\n`;
    });
    
    mdContent += `\n## 3. HTTP Security Headers Audit\n`;
    result.headers.forEach(h => {
      mdContent += `- **${h.name}**: ${h.status.toUpperCase()} (Value: ${h.value})\n`;
    });

    mdContent += `\n## 4. Open Ports & Services (Nmap)\n\`\`\`\n${result.nmap}\n\`\`\`\n`;

    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(mdContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${result.target}_recox_report.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-slate-900/60 border border-indigo-500/20 rounded-2xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl -z-10 rounded-full"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                <Zap className="w-6 h-6 animate-pulse" />
              </span>
              <h1 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-white">
                RECOX <span className="text-indigo-400 font-light">Scanner Platform v2.0</span>
              </h1>
            </div>
            <p className="text-slate-400 max-w-2xl text-sm md:text-base leading-relaxed">
              {language === "en"
                ? "Live automated web intelligence gatherer and cyber security reconnaissance. Resolves subdomains, maps interactive network topology, checks security headers, passive endpoints and consults interactive AI Cyber Advisors."
                : "منصة الاستطلاع والذكاء السيبراني التلقائية والمباشرة v2.0. تقوم بحصد النطاقات الفرعية ورسم خارطة البنية التحتية التفاعلية، كشف عيوب عناوين HTTP، جرد الروابط الحساسة ومحاورة مستشار الأمن السيبراني الذكي."}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 self-start md:self-center font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-slate-400">STATUS: ADVANCED RECON PRO</span>
          </div>
        </div>

        {/* Input Target */}
        <form onSubmit={runScan} className="mt-8">
          <div className="relative max-w-3xl flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                <Globe className="w-5 h-5 text-indigo-400" />
              </span>
              <input
                type="text"
                value={targetDomain}
                onChange={(e) => setTargetDomain(e.target.value)}
                placeholder="example.com"
                disabled={loading}
                className="w-full bg-slate-950/90 text-white placeholder-slate-500 pl-12 pr-4 py-3.5 rounded-xl border border-indigo-500/30 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-mono transition-all text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !targetDomain}
              className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-sans font-medium rounded-xl border border-indigo-400/20 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {language === "en" ? "Exploring..." : "جاري الاستكشاف..."}
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  {language === "en" ? "Explore Target" : "ابدأ استطلاع الهدف"}
                </>
              )}
            </button>
          </div>

          {/* Quick Targets suggestions */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500">
              {language === "en" ? "Quick Scans:" : "أهداف سريعة:"}
            </span>
            {["example.com", "hackerone.com", "vulnweb.com", "portswigger.net"].map((domainSug) => (
              <button
                key={domainSug}
                type="button"
                onClick={() => {
                  setTargetDomain(domainSug);
                }}
                disabled={loading}
                className="text-xs bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-indigo-300 font-mono px-2.5 py-1 rounded transition-all"
              >
                {domainSug}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* ERROR DISPLAY */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl p-5 flex items-start gap-4">
          <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5 text-rose-400" />
          <div className="space-y-1">
            <h4 className="font-sans font-semibold text-white">
              {language === "en" ? "Scan Error Encountered" : "حدث خطأ أثناء الفحص"}
            </h4>
            <p className="text-sm text-slate-300">{error}</p>
          </div>
        </div>
      )}

      {/* SCANNING PROGRESS OVERLAY */}
      {loading && (
        <div className="bg-slate-900/40 border border-indigo-500/20 rounded-2xl p-8 backdrop-blur-xl flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-indigo-500 animate-spin"></div>
            <span className="absolute inset-0 flex items-center justify-center text-xs text-indigo-400 font-mono">
              {scanStep * 10}%
            </span>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-lg font-sans font-bold text-white">
              {language === "en" ? "Scanning Target Infrastructure" : "جاري فحص البنية التحتية للهدف"}
            </h3>
            <p className="text-sm font-mono text-indigo-300/80 max-w-lg mx-auto bg-slate-950/80 px-4 py-2.5 rounded-lg border border-slate-800">
              {stepText}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-md bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-indigo-500 h-full transition-all duration-1000 ease-out"
              style={{ width: `${(scanStep / stepsEn.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* SCAN RESULTS DASHBOARD */}
      {result && !loading && (
        <div className="space-y-6">
          {/* Top Quick Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
              <span className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Globe className="w-5 h-5" />
              </span>
              <div>
                <div className="text-xs text-slate-500 font-sans">{language === "en" ? "Target Host" : "اسم النطاق المستهدف"}</div>
                <div className="text-sm font-mono text-white truncate max-w-[180px]" title={result.target}>
                  {result.target}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
              <span className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Cpu className="w-5 h-5" />
              </span>
              <div>
                <div className="text-xs text-slate-500 font-sans">{language === "en" ? "Primary IP" : "عنوان الـ IP الرئيسي"}</div>
                <div className="text-sm font-mono text-white">{result.ip}</div>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
              <span className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Network className="w-5 h-5" />
              </span>
              <div>
                <div className="text-xs text-slate-500 font-sans">{language === "en" ? "Discovered Subdomains" : "النطاقات الفرعية المكتشفة"}</div>
                <div className="text-sm font-mono text-white">{result.subdomains.length}</div>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
              <span className={`p-2.5 rounded-lg border bg-slate-950 ${result.aiReport.severity === "High" ? "text-rose-400" : result.aiReport.severity === "Medium" ? "text-amber-400" : "text-emerald-400"}`}>
                <Shield className="w-5 h-5" />
              </span>
              <div>
                <div className="text-xs text-slate-500 font-sans">{language === "en" ? "Threat Severity" : "مستوى التهديد الأمني"}</div>
                <div className={`text-sm font-sans font-semibold uppercase ${result.aiReport.severity === "High" ? "text-rose-400" : result.aiReport.severity === "Medium" ? "text-amber-400" : "text-emerald-400"}`}>
                  {result.aiReport.severity}
                </div>
              </div>
            </div>
          </div>

          {/* Action Row: Export & Share reports */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span className="text-xs text-slate-400">
                {language === "en" 
                  ? "Audit ready. Choose a format to save this security intelligence dossier." 
                  : "الملف الأمني جاهز. اختر صيغة لتصدير وحفظ نتائج استطلاع هذا الهدف."}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportAsJSON}
                className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-sans px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{language === "en" ? "Export JSON" : "تصدير ملف JSON"}</span>
              </button>

              <button
                onClick={exportAsMarkdown}
                className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-sans px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{language === "en" ? "Export Markdown" : "تصدير تقرير Markdown"}</span>
              </button>
            </div>
          </div>

          {/* Tab Selection */}
          <div className="flex border-b border-slate-800 overflow-x-auto scrollbar-none">
            {[
              { id: "dashboard", label: "Dashboard", labelAr: "لوحة التحكم", icon: Activity },
              { id: "subdomains", label: "Subdomains", labelAr: "النطاقات الفرعية", icon: Network },
              { id: "network-map", label: "Network Map", labelAr: "خارطة البنية التحتية", icon: Share2 },
              { id: "endpoints", label: "Endpoints / APIs", labelAr: "الروابط و API", icon: Globe },
              { id: "shodan-fofa", label: "Shodan & FOFA", labelAr: "استخبارات Shodan و FOFA", icon: Search },
              { id: "headers", label: "Security Headers", labelAr: "عناوين الأمان", icon: Shield },
              { id: "dns", label: "DNS Records", labelAr: "سجلات DNS", icon: Database },
              { id: "nmap", label: "Nmap Services", labelAr: "فحص المنافذ", icon: TerminalIcon },
              { id: "whois", label: "WHOIS Registry", labelAr: "بيانات الملكية", icon: FileText },
              { id: "ai-chat", label: "AI Advisor Chat", labelAr: "مستشار الذكاء الاصطناعي", icon: MessageSquare }
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`px-5 py-3 border-b-2 font-sans font-medium text-xs md:text-sm uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all ${
                    activeSubTab === tab.id
                      ? "border-indigo-500 text-indigo-400"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  {language === "en" ? tab.label : tab.labelAr}
                </button>
              );
            })}
          </div>

          {/* ACTIVE TAB DISPLAY COMPONENT */}

          {/* 1. DASHBOARD OVERVIEW & AI REPORT */}
          {activeSubTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              {/* AI Audit Report Card */}
              <div className={`rounded-xl border p-6 bg-gradient-to-br backdrop-blur-xl ${getSeverityColor(result.aiReport.severity)}`}>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                      <Cpu className="w-6 h-6 animate-pulse" />
                    </span>
                    <div>
                      <h3 className="text-lg md:text-xl font-sans font-bold text-white">
                        {language === "en" ? "AI Security Smart Audit" : "تقييم أمان الذكاء الاصطناعي الذكي"}
                      </h3>
                      <p className="text-xs text-slate-300/80">Powered by Gemini 3.5 AI Core</p>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityBadge(result.aiReport.severity)}`}>
                    {result.aiReport.severity} Severity
                  </span>
                </div>

                {/* Analysis text */}
                <p className="text-slate-200 text-sm md:text-base leading-relaxed bg-slate-950/80 p-4 rounded-xl border border-white/5 mb-6">
                  {language === "en" ? result.aiReport.analysis : result.aiReport.analysisAr}
                </p>

                {/* Threats and Recommendations */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Threats list */}
                  <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5 space-y-3">
                    <div className="flex items-center gap-2 text-rose-400 font-sans font-semibold text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      {language === "en" ? "Identified Threat Vectors" : "التهديدات والثغرات المحتملة"}
                    </div>
                    <ul className="space-y-2 text-xs md:text-sm text-slate-300 list-disc list-inside">
                      {(language === "en" ? result.aiReport.threats : result.aiReport.threatsAr).map((threat, index) => (
                        <li key={index} className="leading-relaxed">
                          {threat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations list */}
                  <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-sans font-semibold text-sm">
                      <CheckCircle className="w-4 h-4" />
                      {language === "en" ? "Recommended Security Hardening" : "توصيات الحماية المطلوبة"}
                    </div>
                    <ul className="space-y-2 text-xs md:text-sm text-slate-300 list-disc list-inside">
                      {(language === "en" ? result.aiReport.recommendations : result.aiReport.recommendationsAr).map((rec, index) => (
                        <li key={index} className="leading-relaxed">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Infrastructure Details */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* GeoIP Info */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4">
                  <h4 className="text-sm font-sans font-bold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    {language === "en" ? "Server GeoIP Information" : "معلومات الاستضافة الجغرافية"}
                  </h4>
                  <div className="space-y-2.5 text-sm font-sans">
                    <div className="flex justify-between border-b border-slate-800/60 pb-2">
                      <span className="text-slate-400">{language === "en" ? "Country" : "الدولة"}</span>
                      <span className="text-white font-medium">{result.geo.country}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/60 pb-2">
                      <span className="text-slate-400">{language === "en" ? "City" : "المدينة"}</span>
                      <span className="text-white font-medium">{result.geo.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{language === "en" ? "ISP Provider" : "موزع الإنترنت"}</span>
                      <span className="text-white font-medium text-right max-w-[150px] truncate" title={result.geo.isp}>
                        {result.geo.isp}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Server Banner & Technology */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4">
                  <h4 className="text-sm font-sans font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-purple-400" />
                    {language === "en" ? "Server Header Fingerprinting" : "بصمات خادم الويب"}
                  </h4>
                  <div className="space-y-2.5 text-sm font-sans">
                    <div className="flex justify-between border-b border-slate-800/60 pb-2">
                      <span className="text-slate-400">{language === "en" ? "Server Banner" : "إصدار الخادم"}</span>
                      <span className="text-white font-mono font-medium text-xs bg-slate-950 px-2 py-0.5 rounded">
                        {result.serverHeader}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{language === "en" ? "Technology Header" : "تقنيات التشغيل"}</span>
                      <span className="text-white font-mono font-medium text-xs bg-slate-950 px-2 py-0.5 rounded">
                        {result.poweredByHeader || "Not Disclosed"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Scan Metrics Summary */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4">
                  <h4 className="text-sm font-sans font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    {language === "en" ? "Recon Metrics summary" : "إحصائيات وقراءات الفحص"}
                  </h4>
                  <div className="space-y-2 text-xs md:text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{language === "en" ? "Subdomains Found" : "النطاقات الفرعية المكتشفة"}</span>
                      <span className="text-indigo-400 font-bold">{result.subdomains.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{language === "en" ? "Checked DNS Records" : "سجلات الـ DNS المفحوصة"}</span>
                      <span className="text-indigo-400 font-bold">4 Typology Types</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{language === "en" ? "Analyzed Security Headers" : "عناوين الأمان لـ HTTP"}</span>
                      <span className="text-indigo-400 font-bold">6 Header Checklists</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{language === "en" ? "Discovered Endpoints" : "الروابط وعناوين API المكتشفة"}</span>
                      <span className="text-indigo-400 font-bold">{(result.endpoints || []).length} Endpoints</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. SUBDOMAINS DISCOVERY TABS */}
          {activeSubTab === "subdomains" && (
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-base font-sans font-bold text-white">
                    {language === "en" ? "Discovered Subdomain Infrastructure" : "قائمة النطاقات الفرعية النشطة المكتشفة"}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {language === "en"
                      ? "Subdomains enumerated via crt.sh and DNS resolver engines."
                      : "تم جرد هذه النطاقات وتعدادها من خلال سجلات شفافية الشهادات CT ومطابقة الـ DNS."}
                  </p>
                </div>

                {/* Subdomains Search input */}
                <div className="relative max-w-xs w-full">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={subdomainSearch}
                    onChange={(e) => setSubdomainSearch(e.target.value)}
                    placeholder={language === "en" ? "Search subdomains..." : "ابحث بالنطاقات الفرعية..."}
                    className="w-full bg-slate-950 text-white placeholder-slate-500 pl-9 pr-3 py-2 rounded-lg border border-slate-800 focus:border-indigo-500 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Subdomains Table */}
              <div className="overflow-x-auto max-h-[450px] overflow-y-auto border border-slate-800/80 rounded-lg">
                <table className="w-full text-left font-mono text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider sticky top-0 border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3 text-left w-72">{language === "en" ? "Preview" : "معاينة بصرية"}</th>
                      <th className="px-4 py-3 text-left">Subdomain Host</th>
                      <th className="px-4 py-3 text-left">Resolved IP Address / Source</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {filteredSubdomains.length > 0 ? (
                      filteredSubdomains.map((sub, index) => (
                        <tr key={index} className="hover:bg-slate-900/50 transition-all align-middle">
                          <td className="px-4 py-3">
                            <SubdomainPreview domain={sub.subdomain} language={language} />
                          </td>
                          <td className="px-4 py-3 text-indigo-300 font-semibold text-sm select-all">
                            {sub.subdomain}
                          </td>
                          <td className="px-4 py-3">
                            <span className="bg-slate-950/80 text-cyan-400 px-2 py-1 rounded text-[10px] border border-slate-800">
                              {sub.ip}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={`http://${sub.subdomain}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 hover:text-white transition-all rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-center"
                                title="Open Website"
                              >
                                <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                              </a>
                              <button
                                onClick={() => copyToClipboard(sub.subdomain, `sub-${index}`)}
                                className="p-1 hover:text-white transition-all rounded bg-slate-950 hover:bg-slate-800 border border-slate-800"
                                title="Copy Host"
                              >
                                {copiedText === `sub-${index}` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-slate-500">
                          {language === "en" ? "No subdomains found matching current filter." : "لا توجد أي نطاقات فرعية مطابقة للبحث."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2.2 NEW INTERACTIVE NETWORK TOPOLOGY MAP */}
          {activeSubTab === "network-map" && (
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-6 animate-fade-in">
              <div className="space-y-1">
                <h4 className="text-base font-sans font-bold text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-indigo-400 animate-pulse" />
                  {language === "en" ? "Interactive Infrastructure Topology Map" : "خارطة البنية التحتية والربط الشبكي التفاعلي"}
                </h4>
                <p className="text-xs text-slate-400">
                  {language === "en"
                    ? "Interactive representation of subdomains mapping to DNS gateways. Hover over nodes to preview and click for security insights."
                    : "رسم بياني تفاعلي يوضح ارتباط النطاقات الفرعية بالخادم الأساسي. مرر فوق العقد لمعاينتها، وانقر فوقها لعرض تفاصيل الأمن."}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* SVG Visualizer Container */}
                <div className="lg:col-span-2 bg-slate-950/90 rounded-xl border border-slate-800 p-4 overflow-hidden relative">
                  <div className="absolute top-3 left-3 flex gap-2 z-10">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                      Target: {result.target}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      Nodes: {result.subdomains.length + 1}
                    </span>
                  </div>

                  <div className="w-full flex justify-center">
                    <svg
                      viewBox="0 0 600 450"
                      className="w-full max-w-lg h-auto select-none"
                    >
                      {/* Connecting lines with stroke animation */}
                      {result.subdomains.slice(0, 12).map((sub, idx) => {
                        const total = Math.min(result.subdomains.length, 12);
                        const angle = (idx / total) * 2 * Math.PI;
                        const radius = 140;
                        const childX = 300 + radius * Math.cos(angle);
                        const childY = 225 + radius * Math.sin(angle);

                        return (
                          <g key={`line-${idx}`}>
                            <line
                              x1={300}
                              y1={225}
                              x2={childX}
                              y2={childY}
                              className="stroke-indigo-500/20 stroke-[1.5]"
                            />
                            <line
                              x1={300}
                              y1={225}
                              x2={childX}
                              y2={childY}
                              className="stroke-indigo-400/40 stroke-[2]"
                              strokeDasharray="10, 15"
                              strokeDashoffset="100"
                            >
                              <animate
                                attributeName="strokeDashoffset"
                                values="200;0"
                                dur="6s"
                                repeatCount="indefinite"
                              />
                            </line>
                          </g>
                        );
                      })}

                      {/* Parent Core Target Node (Center) */}
                      <g
                        className="cursor-pointer"
                        onClick={() => setSelectedNode({ label: result.target, ip: result.ip, isRoot: true })}
                      >
                        {/* Animated pulsing outer rings */}
                        <circle cx={300} cy={225} r={32} className="fill-indigo-500/10 stroke-indigo-500/30 stroke-[1.5] animate-pulse" />
                        <circle cx={300} cy={225} r={22} className="fill-indigo-600/20 stroke-indigo-400 stroke-2" />
                        <circle cx={300} cy={225} r={12} className="fill-indigo-500" />
                        
                        {/* Core icon text */}
                        <text x={300} y={229} textAnchor="middle" className="fill-white font-sans text-[10px] font-bold">
                          CORE
                        </text>

                        {/* Label */}
                        <text x={300} y={185} textAnchor="middle" className="fill-indigo-300 font-mono text-[11px] font-bold">
                          {result.target}
                        </text>
                      </g>

                      {/* Child Subdomain Nodes */}
                      {result.subdomains.slice(0, 12).map((sub, idx) => {
                        const total = Math.min(result.subdomains.length, 12);
                        const angle = (idx / total) * 2 * Math.PI;
                        const radius = 140;
                        const childX = 300 + radius * Math.cos(angle);
                        const childY = 225 + radius * Math.sin(angle);
                        const isSelected = selectedNode?.label === sub.subdomain;

                        return (
                          <g
                            key={`node-${idx}`}
                            className="cursor-pointer group"
                            onClick={() => setSelectedNode({ label: sub.subdomain, ip: sub.ip })}
                          >
                            {/* Node glow circle */}
                            <circle
                              cx={childX}
                              cy={childY}
                              r={isSelected ? 18 : 12}
                              className={`fill-slate-950 stroke-2 transition-all duration-300 ${
                                isSelected 
                                  ? "stroke-cyan-400 fill-cyan-950/20 shadow-lg" 
                                  : "stroke-slate-700 group-hover:stroke-indigo-400"
                              }`}
                            />
                            {/* Inner dot */}
                            <circle
                              cx={childX}
                              cy={childY}
                              r={isSelected ? 6 : 4}
                              className={`transition-all duration-300 ${
                                isSelected ? "fill-cyan-400" : "fill-indigo-400 group-hover:fill-cyan-400"
                              }`}
                            />

                            {/* Hover detail tooltip label */}
                            <text
                              x={childX}
                              y={childY + (angle > 0 && angle < Math.PI ? 24 : -18)}
                              textAnchor="middle"
                              className={`font-mono text-[9px] pointer-events-none transition-all duration-200 ${
                                isSelected 
                                  ? "fill-cyan-300 font-bold" 
                                  : "fill-slate-400 group-hover:fill-slate-200"
                              }`}
                            >
                              {sub.subdomain.length > 18 ? sub.subdomain.substring(0, 16) + "..." : sub.subdomain}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                  
                  {result.subdomains.length > 12 && (
                    <div className="text-center text-[10px] text-slate-500 font-sans mt-2">
                      * {language === "en" ? `Showing top 12 of ${result.subdomains.length} discovered subdomains for optimal visualization.` : `يتم عرض أفضل 12 من أصل ${result.subdomains.length} نطاقات فرعية للحفاظ على وضوح الرسم.`}
                    </div>
                  )}
                </div>

                {/* Node Details Info Panel (Side Sidebar) */}
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 space-y-4 h-full">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Info className="w-4 h-4 text-indigo-400" />
                    <h5 className="font-sans font-bold text-white text-sm">
                      {language === "en" ? "Node Security Analyzer" : "محلل أمان العقدة المحددة"}
                    </h5>
                  </div>

                  {selectedNode ? (
                    <div className="space-y-4 font-sans text-sm">
                      <div>
                        <div className="text-xs text-slate-500 font-medium">
                          {language === "en" ? "Host Address / Name" : "عنوان النطاق أو المضيف"}
                        </div>
                        <div className="text-sm font-mono text-indigo-300 font-semibold mt-1 break-all select-all bg-slate-900 p-2.5 rounded-lg border border-slate-800/60">
                          {selectedNode.label}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500 font-medium">
                          {language === "en" ? "Resolved Gateway IP" : "عنوان الـ IP البوابة"}
                        </div>
                        <div className="text-sm font-mono text-cyan-400 font-semibold mt-1 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800/60 w-fit">
                          {selectedNode.ip || "Checked via SSL"}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500 font-medium mb-1">
                          {language === "en" ? "Recon Node Status" : "حالة العقدة في الاستطلاع"}
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          selectedNode.isRoot 
                            ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/30" 
                            : "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                        }`}>
                          {selectedNode.isRoot 
                            ? (language === "en" ? "ROOT HOST" : "النطاق الرئيسي") 
                            : (language === "en" ? "ACTIVE SUBDOMAIN" : "نطاق فرعي نشط")}
                        </span>
                      </div>

                      <div className="pt-4 border-t border-slate-800/60 space-y-2">
                        <button
                          onClick={() => copyToClipboard(selectedNode.label, "map-host")}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-sans text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all"
                        >
                          {copiedText === "map-host" ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{language === "en" ? "Host Copied!" : "تم النسخ!"}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{language === "en" ? "Copy Host Name" : "نسخ اسم المضيف"}</span>
                            </>
                          )}
                        </button>
                        
                        {!selectedNode.isRoot && (
                          <button
                            onClick={() => {
                              setTargetDomain(selectedNode.label);
                              setActiveSubTab("dashboard");
                            }}
                            className="w-full bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-sans text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Search className="w-3.5 h-3.5" />
                            <span>{language === "en" ? "Pivot & Scan Target" : "تحويل وفحص هذا النطاق"}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500 text-xs font-sans">
                      {language === "en" ? "Click any node in the topology map to inspect" : "انقر على أي عقدة في الخريطة لعرض تفاصيلها الأمنية"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. DISCOVERED ENDPOINTS TABS with Sensitive findings */}
          {activeSubTab === "endpoints" && (
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-base font-sans font-bold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-indigo-400" />
                    {language === "en" ? "Discovered API Endpoints & Web URLs" : "عناوين API وروابط الويب المكتشفة"}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {language === "en"
                      ? "Harvested passive endpoints and parameters from Wayback Machine & AlienVault OTX repositories."
                      : "تم جرد وحصد هذه الروابط وعناوين الـ API والمقاييس من مستودعات Wayback Machine و AlienVault OTX."}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  {/* Search Input */}
                  <div className="relative max-w-xs w-full">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={endpointSearch}
                      onChange={(e) => setEndpointSearch(e.target.value)}
                      placeholder={language === "en" ? "Search endpoints..." : "ابحث بالروابط..."}
                      className="w-full bg-slate-950 text-white placeholder-slate-500 pl-9 pr-3 py-2 rounded-lg border border-slate-800 focus:border-indigo-500 text-xs font-mono"
                    />
                  </div>

                  {/* Filter Select */}
                  <select
                    value={endpointTypeFilter}
                    onChange={(e) => setEndpointTypeFilter(e.target.value)}
                    className="bg-slate-950 text-slate-300 text-xs font-sans rounded-lg border border-slate-800 px-3 py-2 focus:border-indigo-500 outline-none cursor-pointer"
                  >
                    <option value="All">{language === "en" ? "All Types" : "كل الأنواع"}</option>
                    <option value="API">API Endpoints</option>
                    <option value="JS">JavaScript files</option>
                    <option value="Dynamic">Dynamic pages (PHP/ASP/etc.)</option>
                    <option value="Document">Documents (JSON/PDF/etc.)</option>
                    <option value="HTML">HTML / Routes</option>
                    <option value="Asset">Assets & Images</option>
                  </select>
                </div>
              </div>

              {/* Sensitive Detections Panel */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4.5 h-4.5 text-rose-400 animate-pulse" />
                    <h5 className="text-xs uppercase font-sans font-bold text-white tracking-wider">
                      {language === "en" ? "High-Risk Endpoint Findings" : "قسم الروابط والملفات عالية الخطورة"}
                    </h5>
                  </div>
                  
                  <button
                    onClick={() => setShowOnlySensitive(!showOnlySensitive)}
                    className={`text-[10px] font-sans px-2.5 py-1 rounded border transition-all ${
                      showOnlySensitive 
                        ? "bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold" 
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {language === "en" 
                      ? `Filter High Risk (${sensitiveEndpointsCount})` 
                      : `عرض الثغرات والملفات الحساسة فقط (${sensitiveEndpointsCount})`}
                  </button>
                </div>

                {sensitiveEndpointsCount > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[160px] overflow-y-auto pr-1">
                    {processedEndpoints.filter(ep => ep.isSensitive).map((ep, idx) => (
                      <div key={idx} className="bg-rose-950/10 border border-rose-500/20 p-2.5 rounded-lg flex items-start gap-2.5">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase shrink-0 ${
                          ep.severity === "Critical" ? "bg-rose-600 text-white" :
                          ep.severity === "High" ? "bg-orange-500 text-white" : "bg-yellow-500 text-slate-950"
                        }`}>
                          {ep.severity}
                        </span>
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="text-[11px] font-mono font-semibold text-white truncate" title={ep.url}>
                            {ep.url}
                          </div>
                          <div className="text-[10px] text-rose-300 font-sans flex items-center gap-1.5">
                            <span>• {ep.reason}</span>
                            <span className="text-slate-500">({ep.type})</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 font-sans italic">
                    {language === "en" 
                      ? "No sensitive high-risk patterns (like config files, .env, backups, admin panels) matched in current dataset." 
                      : "لم يتم الكشف عن ملفات أو روابط حساسة عالية الخطورة (مثل ملفات الإعدادات، قواعد البيانات الاحتياطية أو لوحات التحكم) في البيانات الحالية."}
                  </div>
                )}
              </div>

              {/* Endpoints Table */}
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto border border-slate-800/80 rounded-lg">
                <table className="w-full text-left font-mono text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider sticky top-0 border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3 text-left">Method</th>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Discovered Endpoint URL</th>
                      <th className="px-4 py-3 text-left">Parameters</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {filteredEndpoints.length > 0 ? (
                      filteredEndpoints.map((ep, index) => (
                        <tr key={index} className={`hover:bg-slate-900/50 transition-all ${ep.isSensitive ? "bg-rose-950/5 hover:bg-rose-950/10" : ""}`}>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ep.method === "POST" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            }`}>
                              {ep.method}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] ${
                              ep.type === "API" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" :
                              ep.type === "JS" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" :
                              ep.type === "Dynamic" ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30" :
                              ep.type === "Document" ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" :
                              ep.type === "Asset" ? "bg-slate-500/20 text-slate-300 border border-slate-500/30" :
                              "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                            }`}>
                              {ep.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-300 truncate max-w-[280px] select-all break-all" title={ep.url}>
                            <span className={ep.isSensitive ? "text-rose-300 font-semibold" : ""}>
                              {ep.url}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {ep.params && ep.params.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {ep.params.map((p, pIdx) => (
                                  <span key={pIdx} className="bg-rose-950/40 text-rose-300 px-1.5 py-0.5 rounded text-[9px] border border-rose-500/20 font-sans">
                                    {p}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-500 italic text-[10px]">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => copyToClipboard(ep.url, `ep-${index}`)}
                              className="p-1 hover:text-white transition-all rounded bg-slate-950 hover:bg-slate-800 border border-slate-800"
                              title="Copy Endpoint"
                            >
                              {copiedText === `ep-${index}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-slate-500">
                          {language === "en" ? "No endpoints found matching current filters." : "لا توجد أي عناوين روابط مطابقة للبحث الحالي."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3.5. SHODAN & FOFA PASSIVE INTELLIGENCE */}
          {activeSubTab === "shodan-fofa" && (
            <div className="space-y-6 animate-fade-in">
              {/* Introduction Banner */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-1">
                <h4 className="text-base font-sans font-bold text-white flex items-center gap-2">
                  <Search className="w-5 h-5 text-sky-400" />
                  {language === "en" ? "Passive External Intelligence (OSINT)" : "الاستخبارات الخارجية السلبية (OSINT)"}
                </h4>
                <p className="text-xs text-slate-400">
                  {language === "en"
                    ? "Passive threat mapping automatically compiled via Shodan, FOFA, and Censys metadata crawlers."
                    : "خرائط التهديد السلبية المجمعة تلقائياً من خلال برامج زحف البيانات الوصفية لـ Shodan و FOFA و Censys."}
                </p>
              </div>

              {/* Secure API Credentials Vault */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setShowKeysConfig(!showKeysConfig)}
                  className="w-full flex items-center justify-between p-4 bg-slate-900/30 hover:bg-slate-900/80 transition-all font-sans font-bold text-sm text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>
                      {language === "en"
                        ? "OSINT API Keys Management Vault (Saved Locally)"
                        : "خزنة مفاتيح محركات البحث الاستخباراتية (تخزين محلي آمن)"}
                    </span>
                    {(shodanApiKey || (fofaEmail && fofaKey) || (censysId && censysSecret)) && (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold">
                        {language === "en" ? "KEYS ACTIVE" : "المفاتيح مسجلة"}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-indigo-400 hover:underline">
                    {showKeysConfig ? (language === "en" ? "Hide Vault" : "إخفاء") : (language === "en" ? "Open Vault" : "عرض")}
                  </span>
                </button>

                {showKeysConfig && (
                  <div className="p-5 border-t border-slate-800/80 bg-slate-950/60 grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Shodan Keys */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-mono font-bold text-slate-400">Shodan API Key</label>
                        <a href="https://account.shodan.io" target="_blank" rel="noreferrer" className="text-[9px] text-red-400 hover:underline">Get Key</a>
                      </div>
                      <input
                        type="password"
                        placeholder="Paste Shodan API Key..."
                        value={shodanApiKey}
                        onChange={(e) => setShodanApiKey(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-red-500/40"
                      />
                    </div>

                    {/* FOFA Keys */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-mono font-bold text-slate-400">FOFA Credentials</label>
                        <a href="https://fofa.info/personal" target="_blank" rel="noreferrer" className="text-[9px] text-blue-400 hover:underline">Get Key</a>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="FOFA Email..."
                          value={fofaEmail}
                          onChange={(e) => setFofaEmail(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-2 text-[11px] font-mono text-white focus:outline-none focus:border-blue-500/40"
                        />
                        <input
                          type="password"
                          placeholder="FOFA Key..."
                          value={fofaKey}
                          onChange={(e) => setFofaKey(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-2 text-[11px] font-mono text-white focus:outline-none focus:border-blue-500/40"
                        />
                      </div>
                    </div>

                    {/* Censys Keys */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-mono font-bold text-slate-400">Censys Credentials</label>
                        <a href="https://search.censys.io/account/api" target="_blank" rel="noreferrer" className="text-[9px] text-orange-400 hover:underline">Get Key</a>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="API ID..."
                          value={censysId}
                          onChange={(e) => setCensysId(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-2 text-[11px] font-mono text-white focus:outline-none focus:border-orange-500/40"
                        />
                        <input
                          type="password"
                          placeholder="Secret..."
                          value={censysSecret}
                          onChange={(e) => setCensysSecret(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-2 text-[11px] font-mono text-white focus:outline-none focus:border-orange-500/40"
                        />
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="col-span-1 md:col-span-3 text-[11px] text-slate-500 font-sans border-t border-slate-900 pt-3">
                      💡 {language === "en" 
                        ? "API Keys are saved entirely on your device (localStorage). They are only passed to the secure RECOX proxy routes to query without leakage."
                        : "مفاتيح API تُحفظ بالكامل محلياً في متصفحك. تُستخدم فقط لنقل الاستعلامات بأمان عبر روابط proxy دون الكشف عنها."}
                    </div>
                  </div>
                )}
              </div>

              {/* Live Search Engine Query Console Dashboard */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-5">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-sans font-bold text-white flex items-center gap-2">
                      <TerminalIcon className="w-4 h-4 text-emerald-400" />
                      {language === "en" ? "Live OSINT Query Orchestrator" : "لوحة تشغيل الاستعلامات المباشرة (OSINT)"}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {language === "en" 
                        ? "Select an engine, load an advanced dork pattern, and launch real-time queries against your target."
                        : "اختر محرك البحث، وحمّل تركيبة دork متقدمة، وافحص أصل النطاق مباشرة."}
                    </p>
                  </div>

                  {/* Engine Selectors */}
                  <div className="flex gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                    {(["Shodan", "FOFA", "Censys"] as const).map((eng) => (
                      <button
                        key={eng}
                        onClick={() => {
                          setLiveQueryEngine(eng);
                          setLiveQueryResults(null);
                          setLiveQueryError(null);
                          setSelectedPredefinedDorkId("");
                          setCustomQueryText("");
                        }}
                        className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                          liveQueryEngine === eng
                            ? eng === "Shodan"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20 shadow-md shadow-red-500/5"
                              : eng === "FOFA"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-md shadow-blue-500/5"
                              : "bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-md shadow-orange-500/5"
                            : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {eng}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Predefined Dorks Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 block">{language === "en" ? "Select Advanced Dork" : "اختر ثغرة/Dork متقدم"}</label>
                    <select
                      value={selectedPredefinedDorkId}
                      onChange={(e) => {
                        const dId = e.target.value;
                        setSelectedPredefinedDorkId(dId);
                        const match = defaultSearchQueries.find((q) => q.id === dId);
                        if (match) {
                          setCustomQueryText(match.query.replace("{target}", result.target));
                        } else {
                          setCustomQueryText("");
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="">-- {language === "en" ? "Custom Query / Or Select..." : "استعلام مخصص / أو اختر..."} --</option>
                      {defaultSearchQueries
                        .filter((q) => q.engine === liveQueryEngine)
                        .map((q) => (
                          <option key={q.id} value={q.id}>
                            [{q.category}] {q.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Custom Query Text Input */}
                  <div className="col-span-1 md:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 block">{language === "en" ? "Dork Syntax Query" : "صيغة الاستعلام"}</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={
                          liveQueryEngine === "Shodan"
                            ? 'e.g. port:27017 "target.com" or a target IP...'
                            : liveQueryEngine === "FOFA"
                            ? 'e.g. domain="target.com" && app="WordPress"'
                            : 'e.g. host.services.port:2375 and host.services.cert.names:"target.com"'
                        }
                        value={customQueryText}
                        onChange={(e) => setCustomQueryText(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handleRunLiveQuery()}
                        disabled={liveQueryLoading}
                        className={`px-4 py-2 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                          liveQueryEngine === "Shodan"
                            ? "bg-red-500 hover:bg-red-600 text-white disabled:bg-slate-800 disabled:text-slate-500"
                            : liveQueryEngine === "FOFA"
                            ? "bg-blue-500 hover:bg-blue-600 text-white disabled:bg-slate-800 disabled:text-slate-500"
                            : "bg-orange-500 hover:bg-orange-600 text-white disabled:bg-slate-800 disabled:text-slate-500"
                        }`}
                      >
                        {liveQueryLoading ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Zap className="w-3.5 h-3.5" />
                        )}
                        <span>{language === "en" ? "Query API" : "استعلام"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Predefined Dork Description */}
                {selectedPredefinedDorkId && (
                  <div className="bg-slate-950/40 p-3 rounded border border-slate-800/60 text-xs text-slate-400">
                    <span className="font-bold text-indigo-400">Dork Description: </span>
                    {defaultSearchQueries.find((q) => q.id === selectedPredefinedDorkId)?.description}
                  </div>
                )}

                {/* Live Query Errors */}
                {liveQueryError && (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-3 rounded-lg text-xs font-mono flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span>{liveQueryError}</span>
                  </div>
                )}

                {/* Live Query Loading Screen */}
                {liveQueryLoading && (
                  <div className="py-12 flex flex-col items-center justify-center space-y-3 bg-slate-950/20 border border-slate-800/40 rounded-xl">
                    <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                    <p className="text-xs font-mono text-slate-400 animate-pulse">
                      {language === "en" ? "Executing remote API query against " : "جاري تشغيل استعلام محرك البحث السحابي ضد "}
                      {liveQueryEngine} API proxy...
                    </p>
                  </div>
                )}

                {/* Live Query Results Area */}
                {liveQueryResults && (
                  <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-4 animate-fade-in">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                      <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        {language === "en" ? "Live API Query Complete" : "اكتمل الاستعلام بنجاح"}
                      </span>
                      <button
                        onClick={() => {
                          setLiveQueryResults(null);
                        }}
                        className="text-[10px] text-slate-500 hover:text-slate-300 font-mono"
                      >
                        [Clear Results]
                      </button>
                    </div>

                    {/* Shodan Live Results Parsing */}
                    {liveQueryEngine === "Shodan" && (
                      <div className="space-y-4 font-mono text-xs">
                        {liveQueryResults.ip ? (
                          // Individual Host View
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="bg-slate-900/60 p-3 rounded border border-slate-800">
                                <span className="text-slate-500 block text-[10px]">ISP / ASN:</span>
                                <span className="text-white font-bold">{liveQueryResults.isp || "Unknown"} ({liveQueryResults.asn || "-"})</span>
                              </div>
                              <div className="bg-slate-900/60 p-3 rounded border border-slate-800">
                                <span className="text-slate-500 block text-[10px]">OS / Geo:</span>
                                <span className="text-white font-bold">{liveQueryResults.os || "Unknown"} ({liveQueryResults.country_name || "-"})</span>
                              </div>
                              <div className="bg-slate-900/60 p-3 rounded border border-slate-800">
                                <span className="text-slate-500 block text-[10px]">Indexed Ports:</span>
                                <span className="text-red-400 font-bold">{(liveQueryResults.ports || []).join(", ") || "None"}</span>
                              </div>
                            </div>

                            {/* Shodan Live Vulns */}
                            {liveQueryResults.vulns && liveQueryResults.vulns.length > 0 ? (
                              <div className="space-y-2 bg-rose-950/10 p-3.5 rounded border border-rose-500/20">
                                <span className="text-rose-400 text-[11px] font-bold block uppercase tracking-wider">Identified Live CVEs:</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {liveQueryResults.vulns.map((v: string) => (
                                    <span key={v} className="bg-rose-950/60 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded text-[10px] font-bold">
                                      {v}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="text-slate-500 bg-slate-900/30 p-2.5 rounded border border-slate-800 text-[11px] italic">
                                No CVEs mapped to this IP in live Shodan host record.
                              </div>
                            )}

                            {/* Shodan Services List */}
                            <div className="space-y-2">
                              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">Discovered Banner Details:</span>
                              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                {(liveQueryResults.data || []).map((srv: any, idx: number) => (
                                  <div key={idx} className="bg-slate-900/80 rounded border border-slate-800/80 p-3 space-y-2">
                                    <div className="flex justify-between items-center text-[10px] border-b border-slate-800 pb-1.5">
                                      <span className="text-red-400 font-bold">Port {srv.port} / {srv.transport?.toUpperCase()} ({srv._shodan?.module || "unknown"})</span>
                                      <span className="text-slate-500">{srv.product || ""} {srv.version || ""}</span>
                                    </div>
                                    <pre className="text-slate-300 text-[10px] font-mono whitespace-pre-wrap leading-tight max-h-28 overflow-y-auto overflow-x-hidden select-text">
                                      {srv.data}
                                    </pre>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Search query View
                          <div className="space-y-3">
                            <div className="text-slate-400">Total Results Matches: <span className="text-white font-bold">{liveQueryResults.total || 0} hosts found</span></div>
                            <div className="space-y-2.5 max-h-[350px] overflow-y-auto">
                              {(liveQueryResults.matches || []).map((match: any, idx: number) => (
                                <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded p-3 space-y-2">
                                  <div className="flex justify-between items-center text-[11px] border-b border-slate-800/50 pb-1.5">
                                    <span className="text-white font-bold select-all">{match.ip_str}:{match.port}</span>
                                    <span className="text-slate-400 text-[10px]">{match.org || ""} ({match.location?.country_name || ""})</span>
                                  </div>
                                  {match.data && (
                                    <pre className="text-slate-300 text-[9px] font-mono truncate select-text">
                                      {match.data.slice(0, 300)}
                                    </pre>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* FOFA Live Results Parsing */}
                    {liveQueryEngine === "FOFA" && (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>Total Results Matched:</span>
                          <span className="text-blue-400 font-bold">{liveQueryResults.results?.length || 0} Records</span>
                        </div>

                        {liveQueryResults.error && (
                          <div className="text-rose-400 italic">FOFA API Error: {liveQueryResults.error}</div>
                        )}

                        <div className="space-y-2.5 max-h-[350px] overflow-y-auto">
                          {(liveQueryResults.results || []).map((resItem: any[], idx: number) => (
                            <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded p-3 space-y-2">
                              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5 text-[11px]">
                                <span className="text-white font-bold select-all">{resItem[0]}:{resItem[1]}</span>
                                <span className="text-blue-400 bg-blue-950/40 border border-blue-500/20 px-1.5 py-0.25 rounded uppercase font-bold text-[9px]">{resItem[2]}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400">
                                <div>Country: <span className="text-slate-200">{resItem[3]}</span></div>
                                <div>Domain: <span className="text-slate-200 select-all">{resItem[4] || "-"}</span></div>
                              </div>
                              <div className="space-y-1 text-[10px] text-slate-400 pt-1">
                                <div>Web Title: <span className="text-slate-200 select-text">{resItem[6] || "No title parsed"}</span></div>
                                <div className="truncate">Web Server: <span className="text-indigo-400 font-bold">{resItem[5] || "Not disclosed"}</span></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Censys Live Results Parsing */}
                    {liveQueryEngine === "Censys" && (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>Search Matched:</span>
                          <span className="text-orange-400 font-bold">{liveQueryResults.result?.hits?.length || 0} hosts</span>
                        </div>

                        <div className="space-y-2.5 max-h-[350px] overflow-y-auto">
                          {(liveQueryResults.result?.hits || []).map((hit: any, idx: number) => (
                            <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded p-3 space-y-2">
                              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5 text-[11px]">
                                <span className="text-white font-bold select-all">{hit.ip}</span>
                                <span className="text-slate-400 font-bold text-[10px]">{hit.location?.country || "Unknown Location"}</span>
                              </div>
                              <div className="text-[10px] text-slate-400">
                                <span className="block mb-1 font-bold">Matched Services:</span>
                                <div className="flex flex-wrap gap-1">
                                  {(hit.services || []).map((s: any, sIdx: number) => (
                                    <span key={sIdx} className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800/80 text-[10px] text-orange-400">
                                      {s.port}/{s.service_name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Raw JSON Inspector Toggle */}
                    <div className="border-t border-slate-900 pt-3">
                      <details className="group">
                        <summary className="text-[10px] text-slate-500 hover:text-slate-300 cursor-pointer font-mono select-none outline-none">
                          [+] {language === "en" ? "Show Raw JSON response payload" : "عرض استجابة JSON الخام"}
                        </summary>
                        <div className="mt-2.5 bg-slate-900/60 border border-slate-800 rounded-lg p-3 max-h-[220px] overflow-y-auto select-text font-mono text-[10px] text-slate-400 leading-tight">
                          <pre>{JSON.stringify(liveQueryResults, null, 2)}</pre>
                        </div>
                      </details>
                    </div>
                  </div>
                )}
              </div>

              {/* Passive Reconnaissance Overview Header */}
              <div className="border-b border-slate-800 pb-2">
                <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
                  {language === "en" ? "Passive Crawl Snapshot Details (Pre-Compiled)" : "تفاصيل لقطة الزحف السلبية الجاهزة للفحص"}
                </h4>
              </div>

              {/* Grid of Shodan, FOFA & Censys */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                
                {/* A. SHODAN CARD */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                        <h4 className="text-sm font-sans font-bold text-white uppercase tracking-wider">Shodan Intelligence</h4>
                      </div>
                      <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded uppercase font-sans font-bold">
                        PASSIVE INDEX
                      </span>
                    </div>

                    {result.passiveIntel?.shodan ? (
                      <div className="space-y-4 text-xs font-mono">
                        {/* Shodan Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
                          <div>
                            <span className="text-slate-500">IP Address:</span>
                            <span className="text-white block font-bold text-sm mt-0.5 select-all">{result.passiveIntel.shodan.ip}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Operating System:</span>
                            <span className="text-white block font-bold text-sm mt-0.5">{result.passiveIntel.shodan.os || "Linux / Unknown"}</span>
                          </div>
                          <div className="mt-2">
                            <span className="text-slate-500">ISP Provider:</span>
                            <span className="text-white block truncate text-xs mt-0.5" title={result.passiveIntel.shodan.isp}>{result.passiveIntel.shodan.isp}</span>
                          </div>
                          <div className="mt-2">
                            <span className="text-slate-500">ASN:</span>
                            <span className="text-cyan-400 block text-xs mt-0.5">{result.passiveIntel.shodan.asn}</span>
                          </div>
                        </div>

                        {/* Hostnames */}
                        <div className="space-y-1">
                          <span className="text-slate-500 uppercase text-[10px] tracking-wider block font-bold">Indexed Hostnames</span>
                          <div className="flex flex-wrap gap-1">
                            {result.passiveIntel.shodan.hostnames?.map((h: string, i: number) => (
                              <span key={i} className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[10px] text-slate-300">
                                {h}
                              </span>
                            )) || <span className="text-slate-500 italic">None indexed</span>}
                          </div>
                        </div>

                        {/* Vulnerabilities */}
                        <div className="space-y-1">
                          <span className="text-rose-400 uppercase text-[10px] tracking-wider block font-bold">Identified Vulnerabilities (CVEs)</span>
                          {result.passiveIntel.shodan.vulns && result.passiveIntel.shodan.vulns.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {result.passiveIntel.shodan.vulns.map((v: string, i: number) => (
                                <span key={i} className="bg-rose-950/40 text-rose-300 px-2 py-0.5 rounded border border-rose-500/20 text-[10px] font-bold">
                                  {v}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-500 italic bg-slate-950/20 p-2 rounded border border-slate-800/40">
                              {language === "en" ? "No active CVE vulnerabilities publicly indexed on this IP." : "لا توجد ثغرات CVE مسجلة بشكل عام على هذا العنوان في Shodan."}
                            </div>
                          )}
                        </div>

                        {/* Services List */}
                        <div className="space-y-2">
                          <span className="text-slate-500 uppercase text-[10px] tracking-wider block font-bold">Crawled Services</span>
                          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                            {result.passiveIntel.shodan.services?.map((srv: any, i: number) => (
                              <div key={i} className="bg-slate-950/80 rounded border border-slate-800 p-2 text-[11px] leading-relaxed">
                                <div className="flex justify-between items-center border-b border-slate-900 pb-1 mb-1">
                                  <span className="text-indigo-400 font-bold">Port {srv.port} • {srv.name?.toUpperCase()}</span>
                                  <span className="text-slate-500 text-[10px]">{srv.product || "Unknown software"}</span>
                                </div>
                                <pre className="text-slate-400 overflow-x-auto whitespace-pre-wrap font-mono text-[10px] leading-tight select-text">
                                  {srv.banner}
                                </pre>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 italic">No Shodan records available.</div>
                    )}
                  </div>
                </div>

                {/* B. FOFA CARD */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                        <h4 className="text-sm font-sans font-bold text-white uppercase tracking-wider">FOFA Intelligence</h4>
                      </div>
                      <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded uppercase font-sans font-bold">
                        GLOBAL CRAWL
                      </span>
                    </div>

                    {result.passiveIntel?.fofa ? (
                      <div className="space-y-4 text-xs font-mono">
                        {/* FOFA Search query representation */}
                        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/60 space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-500">API Query Syntax:</span>
                            <span className="text-cyan-400 select-all">{result.passiveIntel.fofa.query}</span>
                          </div>
                          <div className="flex justify-between text-[10px] border-t border-slate-900 pt-1 mt-1">
                            <span className="text-slate-500">Indexed Records Count:</span>
                            <span className="text-white font-bold">{result.passiveIntel.fofa.total} host(s) found</span>
                          </div>
                        </div>

                        {/* Crawled Results */}
                        <div className="space-y-2">
                          <span className="text-slate-500 uppercase text-[10px] tracking-wider block font-bold">Indexed Ports & Web Fingerprints</span>
                          <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
                            {result.passiveIntel.fofa.results?.map((resItem: any, i: number) => (
                              <div key={i} className="bg-slate-950/80 rounded border border-slate-800 p-2.5 space-y-1.5 text-[11px]">
                                <div className="flex justify-between items-center text-[10px]">
                                  <span className="text-white font-bold select-all">{resItem.ip}:{resItem.port}</span>
                                  <span className="bg-blue-950 text-blue-300 border border-blue-800 px-1.5 py-0.25 rounded uppercase font-bold tracking-widest">{resItem.protocol}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-1 text-[10px] border-t border-b border-slate-900 py-1 text-slate-400">
                                  <div>Country: <span className="text-white font-semibold">{resItem.country || "Unknown"}</span></div>
                                  <div>Host: <span className="text-white font-semibold truncate block max-w-[140px]" title={resItem.domain}>{resItem.domain || "-"}</span></div>
                                </div>
                                <div className="space-y-0.5">
                                  <div className="text-[10px] text-slate-500">Web Title: <span className="text-slate-200">{resItem.title || "No title parsed"}</span></div>
                                  <div className="text-[10px] text-slate-500 truncate" title={resItem.server}>Web Server: <span className="text-slate-200 font-mono">{resItem.server || "Not disclosed"}</span></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 italic">No FOFA records available.</div>
                    )}
                  </div>
                </div>

              </div>

              {/* C. CENSYS PANEL */}
              {result.passiveIntel?.censys && (
                <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
                      <h4 className="text-sm font-sans font-bold text-white uppercase tracking-wider">Censys Host Intelligence</h4>
                    </div>
                    <span className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded uppercase font-sans font-bold">
                      TLS CERTIFICATE INTEGRATION
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                    <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-1">
                      <span className="text-slate-500 block uppercase text-[9px] tracking-wider">Target Endpoint IP</span>
                      <span className="text-white font-bold select-all">{result.passiveIntel.censys.ip}</span>
                    </div>

                    <div className="bg-slate-950 p-3 rounded border border-slate-800 col-span-2 space-y-2">
                      <span className="text-slate-500 block uppercase text-[9px] tracking-wider">Active Services Mapping</span>
                      <div className="flex flex-wrap gap-2">
                        {result.passiveIntel.censys.services?.map((svc: any, i: number) => (
                          <span key={i} className="bg-slate-900/80 border border-slate-800 rounded px-2 py-1 text-slate-300 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                            <span className="font-bold text-white">Port {svc.port}</span> ({svc.name}/{svc.protocol}) <span className="text-slate-500">[{svc.software || "Generic software"}]</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. SECURITY HEADERS */}
          {activeSubTab === "headers" && (
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4 animate-fade-in">
              <div className="space-y-1">
                <h4 className="text-base font-sans font-bold text-white">
                  {language === "en" ? "HTTP Security Headers Compliance Checklist" : "تدقيق عناوين الأمان لبروتوكول HTTP"}
                </h4>
                <p className="text-xs text-slate-400">
                  {language === "en"
                    ? "Scans response headers to check if critical defense mechanisms are present in server responses."
                    : "تفحص العناوين المرجعة من الخادم للتحقق من وجود إعدادات الحماية الدفاعية الأساسية."}
                </p>
              </div>

              {/* Grid of Headers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.headers.map((header, idx) => {
                  const isPresent = header.status === "present";
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border flex gap-3.5 ${
                        isPresent
                          ? "bg-emerald-950/10 border-emerald-500/20 text-emerald-100"
                          : "bg-rose-950/10 border-rose-500/20 text-rose-100"
                      }`}
                    >
                      <span className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                        isPresent ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                      }`}>
                        {isPresent ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                      </span>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="font-mono text-sm font-bold text-white truncate" title={header.name}>
                            {header.name}
                          </h5>
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider shrink-0 font-bold ${
                            isPresent ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                          }`}>
                            {isPresent ? "SAFE" : "MISSING"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-sans">
                          {language === "en" ? header.description : header.descriptionAr}
                        </p>
                        <div className="bg-slate-950/80 p-2 rounded border border-white/5 mt-2 font-mono text-[11px] truncate text-indigo-300">
                          <span className="text-slate-500">Value:</span> {header.value}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. DNS MAP */}
          {activeSubTab === "dns" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* A & MX Records */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4">
                  <h4 className="text-sm font-sans font-bold text-white border-b border-slate-800 pb-2">
                    A (Address) & MX (Mail Exchange) Records
                  </h4>

                  {/* A Records */}
                  <div className="space-y-2">
                    <div className="text-xs text-slate-400 uppercase font-mono tracking-wider font-bold">A Records:</div>
                    {result.dns.a && result.dns.a.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {result.dns.a.map((ip, i) => (
                          <span key={i} className="bg-slate-950 px-3 py-1 rounded border border-slate-800 font-mono text-xs text-indigo-300">
                            {ip}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 font-mono italic">No resolved IPv4 (A) records discovered.</div>
                    )}
                  </div>

                  {/* MX Records */}
                  <div className="space-y-2 mt-4">
                    <div className="text-xs text-slate-400 uppercase font-mono tracking-wider font-bold">MX Mail Records:</div>
                    {result.dns.mx && result.dns.mx.length > 0 ? (
                      <div className="space-y-1.5">
                        {result.dns.mx.map((mx, i) => (
                          <div key={i} className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-xs text-cyan-300 truncate">
                            {mx}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 font-mono italic">No SMTP servers (MX) records configured.</div>
                    )}
                  </div>
                </div>

                {/* NS & TXT Records */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4">
                  <h4 className="text-sm font-sans font-bold text-white border-b border-slate-800 pb-2">
                    TXT (Text Metadata) & NS (Name Servers) Records
                  </h4>

                  {/* NS Records */}
                  <div className="space-y-2">
                    <div className="text-xs text-slate-400 uppercase font-mono tracking-wider font-bold">Name Servers (NS):</div>
                    {result.dns.ns && result.dns.ns.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {result.dns.ns.map((ns, i) => (
                          <span key={i} className="bg-slate-950 px-3 py-1 rounded border border-slate-800 font-mono text-xs text-purple-300">
                            {ns}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 font-mono italic">No Nameserver authorities found.</div>
                    )}
                  </div>

                  {/* TXT Records */}
                  <div className="space-y-2 mt-4">
                    <div className="text-xs text-slate-400 uppercase font-mono tracking-wider font-bold">TXT Records / Policies:</div>
                    {result.dns.txt && result.dns.txt.length > 0 ? (
                      <div className="space-y-1.5">
                        {result.dns.txt.map((txt, i) => (
                          <div key={i} className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-xs text-slate-300 break-all">
                            {txt}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 font-mono italic">No TXT configurations mapped.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. NMAP TERMINAL SCAN */}
          {activeSubTab === "nmap" && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-fade-in">
              <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-xs text-slate-400 font-mono ml-2">Nmap live port scanner terminal</span>
                </div>
                <button
                  onClick={() => copyToClipboard(result.nmap, "nmap")}
                  className="text-xs hover:text-white transition-all text-slate-400 flex items-center gap-1.5 font-sans"
                >
                  {copiedText === "nmap" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Output</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-5 font-mono text-xs text-indigo-200 bg-slate-950 overflow-x-auto leading-relaxed max-h-[400px] overflow-y-auto select-text scrollbar-thin">
                {result.nmap}
              </pre>
            </div>
          )}

          {/* 7. WHOIS REGISTRY */}
          {activeSubTab === "whois" && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-fade-in">
              <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                  <span className="text-xs text-slate-400 font-mono">Domain Registration Metadata WHOIS</span>
                </div>
                <button
                  onClick={() => copyToClipboard(result.whois, "whois")}
                  className="text-xs hover:text-white transition-all text-slate-400 flex items-center gap-1.5 font-sans"
                >
                  {copiedText === "whois" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Output</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-5 font-mono text-xs text-slate-300 bg-slate-950 overflow-x-auto leading-relaxed max-h-[400px] overflow-y-auto select-text scrollbar-thin">
                {result.whois}
              </pre>
            </div>
          )}

          {/* 8. NEW SMART INTERACTIVE AI ADVISOR CHAT */}
          {activeSubTab === "ai-chat" && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start animate-fade-in">
              {/* Quick Assistant Prompts Sidebar */}
              <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3.5">
                <div className="border-b border-slate-800 pb-2">
                  <h5 className="text-xs font-sans font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                    <span>{language === "en" ? "Assessment Scenarios" : "سيناريوهات التحليل"}</span>
                  </h5>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleSendChatMessage(language === "en" ? "Formulate custom SQL Injection and XSS fuzzing parameters for the discovered endpoints." : "صمم مدخلات مخصصة لاختبار ثغرات SQLi و XSS وعناوين الـ API المستهدفة.")}
                    disabled={chatLoading}
                    className="w-full text-left bg-slate-950/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 p-2.5 rounded-lg text-xs transition-all space-y-1 flex flex-col group disabled:opacity-50"
                  >
                    <span className="font-sans font-bold text-slate-200 group-hover:text-indigo-400 transition-all flex items-center gap-1">
                      🔍 {language === "en" ? "Generate Payloads" : "توليد ثغرات مخصصة"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans">
                      {language === "en" ? "Fuzzing queries for high-interest parameters." : "إنشاء حزم فحص مخصصة للثغرات البرمجية."}
                    </span>
                  </button>

                  <button
                    onClick={() => handleSendChatMessage(language === "en" ? "Suggest target-specific advanced OSINT and subdomain reconnaissance strategies for this target." : "اقترح خطة استطلاع متقدمة ومخصصة لهذا الهدف والنطاقات الفرعية الخاصة به.")}
                    disabled={chatLoading}
                    className="w-full text-left bg-slate-950/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 p-2.5 rounded-lg text-xs transition-all space-y-1 flex flex-col group disabled:opacity-50"
                  >
                    <span className="font-sans font-bold text-slate-200 group-hover:text-indigo-400 transition-all flex items-center gap-1">
                      🌐 {language === "en" ? "Reconnaissance Plan" : "خطة استطلاع متقدمة"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans">
                      {language === "en" ? "Targeted sub-host takeover & DNS audits." : "تحليل أخطار الاستحواذ وفحص الخوادم الفرعية."}
                    </span>
                  </button>

                  <button
                    onClick={() => handleSendChatMessage(language === "en" ? "Provide step-by-step instructions to fix all the missing HTTP security headers on this server." : "قدم دليلاً مفصلاً خطوة بخطوة لمعالجة وإعداد عناوين الحماية HTTP الناقصة في خوادم هذا الهدف.")}
                    disabled={chatLoading}
                    className="w-full text-left bg-slate-950/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 p-2.5 rounded-lg text-xs transition-all space-y-1 flex flex-col group disabled:opacity-50"
                  >
                    <span className="font-sans font-bold text-slate-200 group-hover:text-indigo-400 transition-all flex items-center gap-1">
                      🛡️ {language === "en" ? "Header Hardening" : "تحصين وسد الثغرات"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans">
                      {language === "en" ? "Remediation code snippet for Nginx/Apache." : "أكواد برمجية جاهزة لإعدادات Nginx و Apache لزيادة الأمان."}
                    </span>
                  </button>

                  <button
                    onClick={() => handleSendChatMessage(language === "en" ? "Analyze the active port scan services and write custom Nuclei templates to scan them." : "حلل الخدمات والمنافذ المفتوحة المستخرجة في الفحص وصمم قوالب Nuclei مخصصة لتدقيقها.")}
                    disabled={chatLoading}
                    className="w-full text-left bg-slate-950/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 p-2.5 rounded-lg text-xs transition-all space-y-1 flex flex-col group disabled:opacity-50"
                  >
                    <span className="font-sans font-bold text-slate-200 group-hover:text-indigo-400 transition-all flex items-center gap-1">
                      ⚙️ {language === "en" ? "Port / Nuclei Audit" : "تصميم قوالب Nuclei"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans">
                      {language === "en" ? "Match services against automated scanner files." : "توليد ملفات YAML مخصصة للفحص التلقائي لخدمات المنفذ."}
                    </span>
                  </button>
                </div>
              </div>

              {/* Chat Interface Console */}
              <div className="lg:col-span-3 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
                {/* Console header */}
                <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
                    <span className="text-xs text-slate-300 font-mono">
                      RECOX_SEC_ADVISOR://{result.target}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-indigo-400 uppercase bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-900/40">
                    Live Session
                  </span>
                </div>

                {/* Messages logs */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-sm scrollbar-thin">
                  {chatHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 max-w-[85%] ${
                        msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                      }`}
                    >
                      {/* Avatar */}
                      <span className={`p-2 rounded-lg h-9 w-9 flex items-center justify-center shrink-0 ${
                        msg.role === "user" 
                          ? "bg-slate-850 border border-slate-700 text-indigo-300" 
                          : "bg-indigo-600/10 border border-indigo-500/20 text-indigo-400"
                      }`}>
                        {msg.role === "user" ? <Globe className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
                      </span>

                      {/* Msg bubble */}
                      <div className={`rounded-xl p-3.5 space-y-1.5 ${
                        msg.role === "user" 
                          ? "bg-indigo-600/10 border border-indigo-500/30 text-white" 
                          : "bg-slate-900/80 border border-slate-800/80 text-slate-200"
                      }`}>
                        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
                          <span>{msg.role === "user" ? "YOU" : "RECOX ADVISOR"}</span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        
                        <div className="prose prose-invert prose-xs leading-relaxed max-w-none select-text break-words">
                          {renderFormattedText(msg.text)}
                        </div>
                      </div>
                    </div>
                  ))}

                  {chatLoading && (
                    <div className="flex gap-3 max-w-[85%] mr-auto">
                      <span className="p-2 rounded-lg h-9 w-9 flex items-center justify-center bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                        <Cpu className="w-4 h-4 animate-spin" />
                      </span>
                      <div className="rounded-xl p-4 bg-slate-900/80 border border-slate-800/80 text-slate-200 flex items-center gap-3">
                        <span className="text-xs font-mono text-indigo-300">{language === "en" ? "Consulting AI security intelligence database..." : "جاري مراجعة قواعد البيانات وتحليل الثغرات..."}</span>
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                      </div>
                    </div>
                  )}

                  {chatError && (
                    <div className="bg-rose-950/20 border border-rose-500/20 text-rose-300 rounded-xl p-3 text-xs font-mono flex items-start gap-2 max-w-md">
                      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                      <div>{chatError}</div>
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </div>

                {/* Chat input form */}
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSendChatMessage(); }}
                  className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={language === "en" ? "Ask a custom question regarding this target..." : "اطرح سؤالاً أمنياً مخصصاً حول هذا الهدف..."}
                    disabled={chatLoading}
                    className="flex-1 bg-slate-950 text-white placeholder-slate-500 px-4 py-2.5 rounded-lg border border-slate-800 focus:border-indigo-500 text-xs font-sans outline-none disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
