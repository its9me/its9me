import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Copy, Check, Terminal, Shield, Sparkles, AlertTriangle, 
  Eye, Key, Lock, Braces, Files, Flame, Cloud, Cpu, Coffee, 
  Layout, Network, Award, Zap, HelpCircle 
} from 'lucide-react';
import { cn } from '../lib/utils';

interface NucleiPageProps {
  language: 'en' | 'ar';
  domain: string;
}

interface NucleiCategory {
  id: string;
  nameEn: string;
  nameAr: string;
  tags: string[];
  color: 'purple' | 'cyan' | 'red' | 'indigo' | 'emerald' | 'amber' | 'pink' | 'orange' | 'blue' | 'rose';
  icon: React.ComponentType<any>;
}

export const NucleiPage: React.FC<NucleiPageProps> = ({ language, domain }) => {
  const isAr = language === 'ar';
  const targetHost = domain || 'example.com';

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customFile, setCustomFile] = useState('');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories: NucleiCategory[] = [
    {
      id: 'recon',
      nameEn: '🔍 Recon & Discovery',
      nameAr: '🔍 الاستكشاف والتعرف على التقنيات',
      tags: ['tech', 'detect', 'discovery', 'fingerprint', 'enumeration', 'osint', 'cloud-enum'],
      color: 'blue',
      icon: Eye
    },
    {
      id: 'disclosure',
      nameEn: '📂 Information Disclosure',
      nameAr: '📂 تسريب وثائق ومعلومات حساسة',
      tags: ['exposure', 'disclosure', 'info-leak', 'information-disclosure', 'config', 'files', 'backup', 'env', 'git', 'svn', 'logs', 'secrets', 'credentials', 'token-leak', 'source-disclosure'],
      color: 'purple',
      icon: Key
    },
    {
      id: 'misconfig',
      nameEn: '⚠️ Misconfigurations',
      nameAr: '⚠️ أخطاء في الإعدادات والتهيئة',
      tags: ['misconfig', 'misconfiguration', 'default-login', 'unauth', 'unauthenticated', 'admin', 'panel', 'public-access', 'exposed'],
      color: 'amber',
      icon: AlertTriangle
    },
    {
      id: 'auth',
      nameEn: '🔑 Authentication & Access Control',
      nameAr: '🔑 المصادقة والتحكم بالوصول والـ IDOR',
      tags: ['auth', 'auth-bypass', 'login-bypass', 'account-takeover', 'broken-auth', 'idor', 'privilege-escalation', 'roles', 'authorization'],
      color: 'red',
      icon: Lock
    },
    {
      id: 'api',
      nameEn: '🌐 API Security',
      nameAr: '🌐 حماية واجهات البرمجية (APIs)',
      tags: ['api', 'graphql', 'swagger', 'swagger-ui', 'openapi', 'oauth', 'oauth2', 'jwt', 'token'],
      color: 'indigo',
      icon: Braces
    },
    {
      id: 'sqli',
      nameEn: '💉 Injection Attacks',
      nameAr: '💉 هجمات الحقن (SQLi, Command, SSTI...)',
      tags: ['sqli', 'time-based-sqli', 'command-injection', 'code-injection', 'ssti', 'xxe'],
      color: 'pink',
      icon: Terminal
    },
    {
      id: 'ssrf',
      nameEn: '🎯 SSRF',
      nameAr: '🎯 طلبات الخوادم المزورة (SSRF)',
      tags: ['ssrf', 'blind-ssrf', 'metadata'],
      color: 'orange',
      icon: Shield
    },
    {
      id: 'xss',
      nameEn: '🕷️ XSS',
      nameAr: '🕷️ البرمجة النصية عبر المواقع (XSS)',
      tags: ['xss', 'reflected-xss', 'stored-xss', 'dom-xss'],
      color: 'rose',
      icon: Sparkles
    },
    {
      id: 'files',
      nameEn: '📁 File Vulnerabilities',
      nameAr: '📁 ثغرات الملفات والقراءة والرفع واستعراض المسارات',
      tags: ['lfi', 'rfi', 'file-read', 'file-upload', 'file-write', 'path-traversal'],
      color: 'cyan',
      icon: Files
    },
    {
      id: 'websec',
      nameEn: '🌍 Web Security (Redirects, CORS, CSRF)',
      nameAr: '🌍 أمان التوجيهات وحماية السياسات و CORS',
      tags: ['redirect', 'cors', 'csp', 'csrf', 'clickjacking'],
      color: 'emerald',
      icon: Network
    },
    {
      id: 'critical',
      nameEn: '💀 Critical Impact (RCE & Shells)',
      nameAr: '💀 الأثر العالي والتحكم بالأنظمة (RCE)',
      tags: ['rce', 'lpe', 'root', 'remote-shell', 'webshell', 'shell'],
      color: 'red',
      icon: Flame
    },
    {
      id: 'aws',
      nameEn: '☁️ AWS Security',
      nameAr: '☁️ أمن الخدمات السحابية لـ AWS',
      tags: ['aws', 's3', 'iam', 'ec2', 'rds', 'cloudtrail', 'cloudformation'],
      color: 'amber',
      icon: Cloud
    },
    {
      id: 'azure',
      nameEn: '☁️ Azure Security',
      nameAr: '☁️ أمن الخدمات السحابية لـ Azure',
      tags: ['azure', 'azure-storage', 'azure-key-vault', 'azure-cloud-config'],
      color: 'blue',
      icon: Cloud
    },
    {
      id: 'gcp',
      nameEn: '☁️ GCP Security',
      nameAr: '☁️ أمن الخدمات السحابية لـ GCP (Google Cloud)',
      tags: ['gcp', 'google-cloud', 'google-cloud-storage', 'google-cloud-iam'],
      color: 'cyan',
      icon: Cloud
    },
    {
      id: 'containers',
      nameEn: '🐳 Containers & Kubernetes',
      nameAr: '🐳 أمن الحاويات والكوبرنتس',
      tags: ['docker', 'kubernetes', 'k8s', 'kubelet', 'rancher'],
      color: 'blue',
      icon: Cpu
    },
    {
      id: 'cicd',
      nameEn: '🚀 CI/CD Systems',
      nameAr: '🚀 أنظمة الإنتاج وتكامل الأكواد المستمر',
      tags: ['jenkins', 'gitlab', 'github', 'argocd', 'teamcity'],
      color: 'orange',
      icon: Cpu
    },
    {
      id: 'monitoring',
      nameEn: '📊 Monitoring & Internal Services',
      nameAr: '📊 أنظمة المراقبة وقواعد البيانات الداخلية',
      tags: ['grafana', 'prometheus', 'kibana', 'elasticsearch', 'clickhouse', 'mongodb', 'redis'],
      color: 'purple',
      icon: Layout
    },
    {
      id: 'java',
      nameEn: '☕ Java Ecosystem',
      nameAr: '☕ بيئات عمل الجافا و SpringBoot',
      tags: ['springboot', 'spring-boot', 'actuator', 'jolokia', 'tomcat', 'jboss', 'java'],
      color: 'amber',
      icon: Coffee
    },
    {
      id: 'cms',
      nameEn: '🏪 CMS & Platforms',
      nameAr: '🏪 أنظمة إدارة المحتوى والمتاجر الإلكترونية',
      tags: ['wordpress', 'joomla', 'drupal', 'magento', 'shopify', 'prestashop', 'opencart'],
      color: 'pink',
      icon: Layout
    },
    {
      id: 'network',
      nameEn: '🌐 Network Services',
      nameAr: '🌐 الخدمات والبروتوكولات الشائعة في الشبكات',
      tags: ['ftp', 'ssh', 'smb', 'ldap', 'smtp', 'dns', 'ntlm', 'snmp', 'telnet'],
      color: 'indigo',
      icon: Network
    },
    {
      id: 'gold_standard',
      nameEn: '👑 Bug Bounty Gold (أهم أمر)',
      nameAr: '👑 المعيار الذهبي لاصطياد ثغرات الباونتي',
      tags: ['takeover', 'exposure', 'misconfig', 'unauth', 'springboot', 'swagger', 'grafana', 'prometheus', 'elasticsearch', 'clickhouse', 'jenkins', 'api', 'graphql', 'oauth', 'jwt', 'ssrf', 'idor', 'sqli', 'xss', 'rce', 'lfi'],
      color: 'emerald',
      icon: Award
    },
    {
      id: 'gold_secrets_cloud',
      nameEn: '🚨 Bug Bounty Gold + Secrets + Cloud (أقوى أمر)',
      nameAr: '🚨 الثغرات الذهبية مع تسريبات الأكواد والخدمات السحابية',
      tags: ['takeover', 'exposure', 'disclosure', 'info-leak', 'config', 'backup', 'git', 'env', 'secrets', 'credentials', 'misconfig', 'unauth', 'springboot', 'swagger', 'grafana', 'prometheus', 'elasticsearch', 'clickhouse', 'jenkins', 'api', 'graphql', 'oauth', 'jwt', 'ssrf', 'idor', 'sqli', 'xss', 'rce', 'lfi', 'aws', 'azure', 'gcp'],
      color: 'purple',
      icon: Zap
    }
  ];

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase();
    return categories.map(cat => ({
      ...cat,
      tags: cat.tags.filter(t => t.toLowerCase().includes(query))
    })).filter(cat => 
      cat.tags.length > 0 || 
      cat.nameEn.toLowerCase().includes(query) || 
      cat.nameAr.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const toggleTagSelection = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const getCustomCommand = () => {
    const fileSource = customFile.trim() || 'alive_web.txt';
    if (selectedTags.length === 0) {
      return `nuclei -u https://${targetHost} -as`;
    }
    return `nuclei -l ${fileSource} -tags ${selectedTags.join(',')}`;
  };

  const colorStyles: Record<string, { border: string, bg: string, text: string, textGlow: string, glow: string }> = {
    blue: { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-300', textGlow: 'text-blue-400 font-bold', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)] bg-gradient-to-r from-blue-950/20 to-transparent' },
    purple: { border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-300', textGlow: 'text-purple-400 font-bold', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)] bg-gradient-to-r from-purple-950/20 to-transparent' },
    amber: { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-300', textGlow: 'text-amber-400 font-bold', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)] bg-gradient-to-r from-amber-950/20 to-transparent' },
    red: { border: 'border-red-500/30', bg: 'bg-red-500/10', text: 'text-red-300', textGlow: 'text-red-400 font-bold', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)] bg-gradient-to-r from-red-950/20 to-transparent' },
    indigo: { border: 'border-indigo-500/30', bg: 'bg-indigo-500/10', text: 'text-indigo-300', textGlow: 'text-indigo-400 font-bold', glow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)] bg-gradient-to-r from-indigo-950/20 to-transparent' },
    pink: { border: 'border-pink-500/30', bg: 'bg-pink-500/10', text: 'text-pink-300', textGlow: 'text-pink-400 font-bold', glow: 'shadow-[0_0_15px_rgba(236,72,153,0.15)] bg-gradient-to-r from-pink-950/20 to-transparent' },
    orange: { border: 'border-orange-500/30', bg: 'bg-orange-500/10', text: 'text-orange-300', textGlow: 'text-orange-400 font-bold', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.15)] bg-gradient-to-r from-orange-950/20 to-transparent' },
    rose: { border: 'border-rose-500/30', bg: 'bg-rose-500/10', text: 'text-rose-300', textGlow: 'text-rose-400 font-bold', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)] bg-gradient-to-r from-rose-950/20 to-transparent' },
    cyan: { border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', text: 'text-cyan-300', textGlow: 'text-cyan-400 font-bold', glow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)] bg-gradient-to-r from-cyan-950/20 to-transparent' },
    emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-300', textGlow: 'text-emerald-400 font-bold', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)] bg-gradient-to-r from-emerald-950/20 to-transparent' },
  };

  return (
    <div className="space-y-8 animate-fade-in text-white">
      {/* Page Header */}
      <div className={cn("flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-indigo-500/20 pb-6", isAr && "md:flex-row-reverse")}>
        <div>
          <h2 className={cn("text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-200 to-purple-400", isAr && "text-right")}>
            {isAr ? 'قوالب وتاغات نيوكلي الفضائية' : '🚀 Nuclei Space Constellation Platform'}
          </h2>
          <p className={cn("text-indigo-300/80 font-sans mt-2 text-sm leading-relaxed", isAr && "text-right")}>
            {isAr 
              ? 'تصفح تاغات Nuclei المصنفة بعناية وسرعة نسخ الأوامر أو بناء أوامرك المخصصة برسم النجوم المتصلة.' 
              : 'Browse pre-categorized Nuclei Tags, copy ready commands, or build dynamically tailored payloads by selecting tags.'}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80 group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? "ابحث عن تاغ أو صنف..." : "Search tags or category..."}
            className={cn(
              "w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-white placeholder-indigo-300/40 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 font-sans transition-all",
              isAr ? "text-right pl-4 pr-10" : "text-left pl-10 pr-4"
            )}
          />
          <Search className={cn("absolute top-2.5 w-4.5 h-4.5 text-indigo-400/60 group-focus-within:text-cyan-400 transition-colors", isAr ? "right-3" : "left-3")} />
        </div>
      </div>

      {/* Dynamic Command Constellation Builder */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#0a0a20] to-[#040410] border border-cyan-500/20 rounded-[2rem] p-6 shadow-2xl shadow-cyan-500/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 blur-[100px] pointer-events-none -z-10"></div>
        
        <h3 className={cn("text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-200 mb-2 flex items-center gap-2", isAr && "flex-row-reverse")}>
          <Zap className="text-cyan-400 w-5 h-5 animate-pulse" />
          {isAr ? 'مستكشف نيوكلي وباني الأوامر التكيفي' : 'Adaptive Constellation Command Builder'}
        </h3>
        <p className={cn("text-xs text-indigo-300/70 font-sans mb-4", isAr && "text-right")}>
          {isAr 
            ? 'انقر على النجوم (التاغات) في الأسفل لضمها في بايلود Nuclei المخصص وتكييف الأمر تلقائياً' 
            : 'Click on stars (tags) in any category below to patch them instantly into your dynamic custom scanner command below.'}
        </p>

        <div className="bg-black/60 border border-indigo-500/30 rounded-2xl p-4 md:p-6 backdrop-blur-md relative">
          <div className={cn("flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4", isAr && "md:flex-row-reverse")}>
            <div className="flex-1 space-y-2">
              <div className={cn("flex items-center gap-2.5", isAr && "flex-row-reverse")}>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping absolute block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 relative block"></span>
                <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 font-mono">
                  {isAr ? 'أمر نيوكلي المخصص النشط' : 'Active Multi-Tag Custom Command'}
                </span>
              </div>
              <code className="block bg-black/80 font-mono text-cyan-200 p-3 rounded-lg border border-white/5 select-all overflow-x-auto text-xs md:text-sm whitespace-nowrap">
                {getCustomCommand()}
              </code>
            </div>

            <div className={cn("flex flex-col sm:flex-row gap-3 items-stretch sm:items-center", isAr && "sm:flex-row-reverse")}>
              <div>
                <label className={cn("block text-[10px] text-indigo-300/70 font-semibold uppercase tracking-wider mb-1", isAr && "text-right")}>
                  {isAr ? 'ملف الأهداف' : 'Targets File'}
                </label>
                <input
                  type="text"
                  value={customFile}
                  onChange={(e) => setCustomFile(e.target.value)}
                  placeholder="alive_web.txt"
                  className="bg-black/70 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-indigo-200 placeholder-indigo-300/20 focus:outline-none focus:border-cyan-400 font-sans text-center w-28"
                />
              </div>

              <div className="flex gap-2 justify-end mt-4 sm:mt-0">
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-xl text-xs transition-colors border border-red-500/20"
                  >
                    {isAr ? 'تصفير البرج' : 'Reset Stars'}
                  </button>
                )}
                <button
                  onClick={() => handleCopy(getCustomCommand(), 'custom-builder')}
                  className={cn(
                    "flex items-center justify-center gap-2 text-xs px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/20",
                    isAr && "flex-row-reverse"
                  )}
                >
                  {copiedId === 'custom-builder' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      {isAr ? 'تم النسخ!' : 'Copied!'}
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      {isAr ? 'نسخ الأمر المخصص' : 'Copy Custom Payload'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {selectedTags.length > 0 && (
            <div className={cn("mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-1.5 items-center", isAr && "flex-row-reverse")}>
              <span className="text-xs text-indigo-300/60 font-medium">
                {isAr ? 'التاغات المحددة:' : 'Selected Stars:'}
              </span>
              {selectedTags.map(tag => (
                <span 
                  key={tag} 
                  onClick={() => toggleTagSelection(tag)}
                  className="px-2 py-0.5 bg-cyan-400/20 hover:bg-cyan-400/30 border border-cyan-400/30 text-cyan-200 text-xs rounded-full cursor-pointer flex items-center gap-1 transition-colors font-mono"
                >
                  {tag} <span className="text-red-400 select-none">×</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid of Command Cards with Stars selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        <AnimatePresence mode="popLayout">
          {filteredCategories.map((cat) => {
            const styles = colorStyles[cat.color] || colorStyles.blue;
            const Icon = cat.icon;
            const catTitle = isAr ? cat.nameAr : cat.nameEn;
            const isGold = cat.id === 'gold_standard' || cat.id === 'gold_secrets_cloud';
            const defaultCommandText = `nuclei -l alive_web.txt -tags ${cat.tags.join(',')}`;

            return (
              <motion.div
                layout
                key={cat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex flex-col bg-[#050514]/60 backdrop-blur-md rounded-2xl border transition-all overflow-hidden relative group/card",
                  styles.border, styles.glow,
                  isGold && "md:col-span-2 border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.1)] bg-gradient-to-b from-[#110d06] to-[#040410]"
                )}
              >
                {isGold && (
                  <div className="absolute top-0 right-0 p-1 flex gap-1">
                    <span className="animate-ping absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400"></span>
                    <span className="relative w-2 h-2 rounded-full bg-amber-500"></span>
                  </div>
                )}

                <div className={cn(
                  "p-4 border-b flex items-center gap-3",
                  styles.bg, styles.border,
                  isAr ? "flex-row-reverse text-right" : "text-left"
                )}>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <Icon className={cn("w-5 h-5", styles.text)} />
                  </div>
                  <div className="flex-1">
                    <h4 className={cn("font-bold text-sm text-gray-100", isAr ? "text-right" : "text-left")}>
                      {catTitle}
                    </h4>
                    <p className={cn("text-[10px] text-indigo-300/50 mt-0.5", isAr ? "text-right" : "text-left")}>
                      {cat.tags.length} {isAr ? 'رابط تاغات' : 'linked tags'}
                    </p>
                  </div>
                </div>

                {/* Tags cluster / constellations */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-5">
                  <div className={cn("flex flex-wrap gap-2 items-center", isAr ? "flex-row-reverse justify-start" : "justify-start")}>
                    {cat.tags.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleTagSelection(tag)}
                          className={cn(
                            "px-2.5 py-1 text-xs font-mono rounded-lg transition-all border outline-none cursor-pointer flex items-center gap-1.5 relative select-none",
                            isSelected 
                              ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.3)] scale-[1.03]"
                              : "bg-black/40 border-white/[0.06] text-indigo-200/80 hover:border-cyan-500/40 hover:text-cyan-200"
                          )}
                        >
                          {/* Glowing Dot (star concept) */}
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full transition-all",
                            isSelected 
                              ? "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)] animate-pulse" 
                              : "bg-indigo-500/30 group-hover/card:bg-indigo-400/40"
                          )}></div>
                          {tag}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-2 border-t border-white/[0.05] pt-4">
                    <div className={cn("flex justify-between items-center", isAr && "flex-row-reverse")}>
                      <span className="text-[10px] font-mono tracking-wider text-indigo-400 uppercase font-semibold">
                        {isAr ? 'الأمر الافتراضي للصنف' : 'Default Category Command'}
                      </span>
                      <button
                        onClick={() => handleCopy(defaultCommandText, cat.id)}
                        className={cn(
                          "p-1.5 rounded-lg border border-transparent hover:border-white/10 hover:bg-white/5 text-indigo-300 hover:text-white transition-all duration-200 flex items-center gap-1.5 text-xs font-sans",
                          isAr && "flex-row-reverse"
                        )}
                        title="Copy default category command"
                      >
                        {copiedId === cat.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="text-[10px] text-cyan-400">{isAr ? 'تم نسخ التاغ!' : 'Copied!'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[10px]">{isAr ? 'نسخ الأمر' : 'Copy'}</span>
                          </>
                        )}
                      </button>
                    </div>
                    <code className="block bg-black/70 font-mono text-cyan-100/90 py-2.5 px-3 rounded-lg text-xs overflow-x-auto border border-white/5 shadow-inner">
                      {defaultCommandText}
                    </code>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Horizontal Map / Visual Constellation Tree Structure precisely matching user request */}
      <div className="bg-[#040410] border border-indigo-500/20 rounded-[2.5rem] p-6 md:p-8 lg:p-12 relative overflow-hidden mt-8">
        {/* Constellation backdrops */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none opacity-20 -z-15">
          <svg preserveAspectRatio="none" className="w-full h-full" viewBox="0 0 1000 1000">
            <line x1="200" y1="100" x2="500" y2="400" stroke="#818cf8" strokeWidth="1" strokeDasharray="3 3"/>
            <line x1="800" y1="150" x2="500" y2="400" stroke="#c084fc" strokeWidth="1" strokeDasharray="3 3"/>
            <line x1="500" y1="400" x2="100" y2="600" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3 3"/>
            <circle cx="200" cy="100" r="2" fill="#fff" />
            <circle cx="800" cy="150" r="3" fill="#fff" />
            <circle cx="500" cy="400" r="4" fill="#a855f7" className="animate-pulse" stroke="#fff" />
          </svg>
        </div>

        <div className={cn("flex flex-col gap-4 text-center pb-8 border-b border-indigo-500/10", isAr ? "rtl" : "ltr")}>
          <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
            {isAr ? 'شجرة الخريطة الفضائية (Nuclei Tags Map)' : '🗺️ Nuclei Tags Space Tree Map'}
          </h3>
          <p className="text-xs text-indigo-300/60 font-sans max-w-2xl mx-auto leading-relaxed">
            {isAr 
              ? 'توضح الهيكلية الشجرية التالية التوزيع المتسلسل والمستويات المختلفة للتاغات في Nuclei لتخطيط هجومات ذكية ومنهجية.'
              : 'The tree structure represents the precise hierarchical map of Nuclei tags divided by categories for easy planning.'
            }
          </p>
        </div>

        {/* Tree visual rendering block */}
         <div className="mt-8 font-mono text-xs md:text-sm text-indigo-200/90 bg-black/60 p-6 md:p-8 rounded-2xl border border-white/5 overflow-x-auto shadow-inner leading-relaxed">
           <pre className="whitespace-pre text-left text-cyan-200/80">
{`Nuclei Tags Map
│
├── 1. Recon & Discovery
│   ├── tech
│   ├── detect
│   ├── discovery
│   ├── fingerprint
│   ├── enumeration
│   ├── osint
│   └── cloud-enum
│
├── 2. Information Disclosure
│   ├── exposure
│   ├── disclosure
│   ├── info-leak
│   ├── information-disclosure
│   ├── config
│   ├── files
│   ├── backup
│   ├── env
│   ├── git
│   ├── svn
│   ├── logs
│   ├── secrets
│   ├── credentials
│   ├── token-leak
│   └── source-disclosure
│
├── 3. Misconfigurations
│   ├── misconfig
│   ├── misconfiguration
│   ├── default-login
│   ├── unauth
│   ├── unauthenticated
│   ├── admin
│   ├── panel
│   ├── public-access
│   └── exposed
│
├── 4. Authentication & Access Control
│   ├── auth
│   ├── auth-bypass
│   ├── login-bypass
│   ├── account-takeover
│   ├── broken-auth
│   ├── idor
│   ├── privilege-escalation
│   ├── roles
│   └── authorization
│
├── 5. API Security
│   ├── api
│   ├── graphql
│   ├── swagger
│   ├── swagger-ui
│   ├── openapi
│   ├── oauth
│   ├── oauth2
│   ├── jwt
│   └── token
│
├── 6. Web Vulnerabilities
│   ├── Injection
│   │   ├── sqli
│   │   ├── time-based-sqli
│   │   ├── command-injection
│   │   ├── code-injection
│   │   ├── ssti
│   │   └── xxe
│   │
│   ├── SSRF
│   │   ├── ssrf
│   │   ├── blind-ssrf
│   │   └── metadata
│   │
│   ├── XSS
│   │   ├── xss
│   │   ├── reflected-xss
│   │   ├── stored-xss
│   │   └── dom-xss
│   │
│   ├── Files
│   │   ├── lfi
│   │   ├── rfi
│   │   ├── file-read
│   │   ├── file-upload
│   │   ├── file-write
│   │   └── path-traversal
│   │
│   └── Other
│       ├── redirect
│       ├── cors
│       ├── csp
│       ├── csrf
│       └── clickjacking
│
├── 7. Critical Impact
│   ├── rce
│   ├── lpe
│   ├── root
│   ├── remote-shell
│   ├── webshell
│   └── shell
│
├── 8. Cloud Security
│   ├── AWS
│   │   ├── aws
│   │   ├── s3
│   │   ├── iam
│   │   ├── ec2
│   │   ├── rds
│   │   ├── cloudtrail
│   │   └── cloudformation
│   │
│   ├── Azure
│   │   ├── azure
│   │   ├── azure-storage
│   │   ├── azure-key-vault
│   │   └── azure-cloud-config
│   │
│   └── GCP
│       ├── gcp
│       ├── google-cloud
│       ├── google-cloud-storage
│       └── google-cloud-iam
│
├── 9. DevOps & Infrastructure
│   ├── Containers
│   │   ├── docker
│   │   ├── kubernetes
│   │   ├── k8s
│   │   ├── kubelet
│   │   └── rancher
│   │
│   ├── CI/CD
│   │   ├── jenkins
│   │   ├── gitlab
│   │   ├── github
│   │   ├── argocd
│   │   └── teamcity
│   │
│   └── Monitoring
│       ├── grafana
│       ├── prometheus
│       ├── kibana
│       ├── elasticsearch
│       ├── clickhouse
│       ├── mongodb
│       └── redis
│
├── 10. Java Ecosystem
│   ├── springboot
│   ├── spring-boot
│   ├── actuator
│   ├── jolokia
│   ├── tomcat
│   ├── jboss
│   └── java
│
├── 11. CMS & Platforms
│   ├── wordpress
│   ├── joomla
│   ├── drupal
│   ├── magento
│   ├── shopify
│   ├── prestashop
│   └── opencart
│
├── 12. Network Services
│   ├── ftp
│   ├── ssh
│   ├── smb
│   ├── ldap
│   ├── smtp
│   ├── dns
│   ├── ntlm
│   ├── snmp
│   └── telnet
│
└── 13. Bug Bounty Gold
    ├── takeover
    ├── exposure
    ├── misconfig
    ├── unauth
    ├── springboot
    ├── swagger
    ├── grafana
    ├── prometheus
    ├── elasticsearch
    ├── clickhouse
    ├── jenkins
    ├── api
    ├── graphql
    ├── oauth
    ├── jwt
    ├── ssrf
    ├── idor
    ├── sqli
    ├── xss
    ├── rce
    └── lfi`}
           </pre>
         </div>
      </div>
    </div>
  );
};
