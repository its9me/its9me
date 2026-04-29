import { useState, useMemo, useEffect } from 'react';
import { Play, Copy, Terminal, Server, Globe2, Shield, Search, Database, Target, Github, Plus, Edit2, Trash2, Check, X, Search as SearchIcon, FileCode, Link, Save, BookOpen, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';
import { defaultCommandsData, CommandCategory, Command } from './data/commands';
import { defaultDorks, Dork } from './data/dorks';
import { defaultPayloads, Payload } from './data/payloads';
import { defaultMethodology, MethodologyTopic } from './data/methodology';

const Icons: Record<string, React.ElementType> = {
  Globe2, Search, Terminal, Server, Database, Shield, Play, Target, BookOpen, Layers
};

const ReconApp = () => {
  const [domain, setDomain] = useState('');
  const [activeTab, setActiveTab] = useState<'commands' | 'dorks' | 'payloads' | 'methodology'>('commands');
  const [activeCategory, setActiveCategory] = useState<number | null>(0);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const [selectedWordlists, setSelectedWordlists] = useState<Record<string, Record<string, string>>>({});

  // --- Methodology State ---
  const [activeMethodologyTopic, setActiveMethodologyTopic] = useState<number>(0);
  const [methodologyProgress, setMethodologyProgress] = useState<Record<string, Record<string, boolean>>>(() => {
    const saved = localStorage.getItem('methodologyProgress_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('methodologyProgress_v1', JSON.stringify(methodologyProgress));
  }, [methodologyProgress]);

  const toggleMethodologyItem = (itemId: string, checked: boolean) => {
    const currentDomainKey = (domain.trim() || 'default').toLowerCase();
    setMethodologyProgress(prev => {
      const domainProgress = prev[currentDomainKey] || {};
      return {
        ...prev,
        [currentDomainKey]: {
          ...domainProgress,
          [itemId]: checked
        }
      };
    });
  };


  // --- Commands State ---
  const [commandsCategories, setCommandsCategories] = useState<CommandCategory[]>(() => {
    const saved = localStorage.getItem('commandsCategories_v5');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultCommandsData;
      }
    }
    return defaultCommandsData;
  });
  
  const [editingCommandPath, setEditingCommandPath] = useState<{catId: string, cmdId: string} | null>(null);
  const [editCmdTemplate, setEditCmdTemplate] = useState('');
  const [editCmdTool, setEditCmdTool] = useState('');

  useEffect(() => {
    localStorage.setItem('commandsCategories_v5', JSON.stringify(commandsCategories));
  }, [commandsCategories]);

  // --- Dorks State ---
  const [dorks, setDorks] = useState<Dork[]>(() => {
    const saved = localStorage.getItem('customDorks_v2');
    if (saved) {
      try {
        return [...defaultDorks, ...JSON.parse(saved)];
      } catch (e) {
        return defaultDorks;
      }
    }
    return defaultDorks;
  });
  
  const [isAddingDork, setIsAddingDork] = useState(false);
  const [editingDork, setEditingDork] = useState<string | null>(null);
  const [newDorkName, setNewDorkName] = useState('');
  const [newDorkQuery, setNewDorkQuery] = useState('');
  const [newDorkCategory, setNewDorkCategory] = useState('');
  const [newDorkDescription, setNewDorkDescription] = useState('');
  const [selectedDorkCategory, setSelectedDorkCategory] = useState<string>('All');

  const dorkCategories = useMemo(() => {
    const cats = new Set(dorks.map(d => d.category).filter(Boolean) as string[]);
    return ['All', ...Array.from(cats)];
  }, [dorks]);

  const filteredDorks = useMemo(() => {
    if (selectedDorkCategory === 'All') return dorks;
    return dorks.filter(d => d.category === selectedDorkCategory);
  }, [dorks, selectedDorkCategory]);

  useEffect(() => {
    const customDorks = dorks.filter(d => d.isCustom);
    localStorage.setItem('customDorks_v2', JSON.stringify(customDorks));
  }, [dorks]);

  // --- Payloads State ---
  const [payloads, setPayloads] = useState<Payload[]>(() => {
    const saved = localStorage.getItem('customPayloads_v3');
    if (saved) {
      try {
        return [...defaultPayloads, ...JSON.parse(saved)];
      } catch (e) {
        return defaultPayloads;
      }
    }
    return defaultPayloads;
  });

  const [isAddingPayload, setIsAddingPayload] = useState(false);
  const [editingPayload, setEditingPayload] = useState<string | null>(null);
  const [newPayloadName, setNewPayloadName] = useState('');
  const [newPayloadContent, setNewPayloadContent] = useState('');
  const [newPayloadType, setNewPayloadType] = useState('');
  const [newPayloadDesc, setNewPayloadDesc] = useState('');
  const [selectedPayloadType, setSelectedPayloadType] = useState<string>('All');
  const [urlEncodeLevel, setUrlEncodeLevel] = useState<0 | 1 | 2>(0);

  const payloadTypes = useMemo(() => {
    const types = new Set(payloads.map(p => p.type).filter(Boolean) as string[]);
    return ['All', ...Array.from(types)];
  }, [payloads]);

  const filteredPayloads = useMemo(() => {
    if (selectedPayloadType === 'All') return payloads;
    return payloads.filter(p => p.type === selectedPayloadType);
  }, [payloads, selectedPayloadType]);

  useEffect(() => {
    const customPayloads = payloads.filter(p => p.isCustom);
    localStorage.setItem('customPayloads_v3', JSON.stringify(customPayloads));
  }, [payloads]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // --- Handlers for Commands ---
  const startEditCommand = (catId: string, cmd: Command) => {
    setEditingCommandPath({ catId, cmdId: cmd.id });
    setEditCmdTemplate(cmd.cmdTemplate);
    setEditCmdTool(cmd.tool);
  };

  const saveEditedCommand = () => {
    if (!editingCommandPath) return;
    setCommandsCategories(prev => prev.map(cat => {
      if (cat.id === editingCommandPath.catId) {
        return {
          ...cat,
          commands: cat.commands.map(cmd => cmd.id === editingCommandPath.cmdId ? {
            ...cmd,
            tool: editCmdTool,
            cmdTemplate: editCmdTemplate
          } : cmd)
        };
      }
      return cat;
    }));
    setEditingCommandPath(null);
  };

  // --- Handlers for Dorks ---
  const handleSaveDork = () => {
    if (!newDorkName.trim() || !newDorkQuery.trim()) return;
    if (editingDork) {
      setDorks(dorks.map(d => 
        d.id === editingDork ? { ...d, name: newDorkName, query: newDorkQuery, category: newDorkCategory, description: newDorkDescription } : d
      ));
    } else {
      setDorks([...dorks, {
        id: Date.now().toString(),
        name: newDorkName,
        query: newDorkQuery,
        category: newDorkCategory,
        description: newDorkDescription,
        isCustom: true
      }]);
    }
    setIsAddingDork(false);
    setEditingDork(null);
  };

  const startEditDork = (dork: Dork) => {
    setEditingDork(dork.id);
    setNewDorkName(dork.name);
    setNewDorkQuery(dork.query);
    setNewDorkCategory(dork.category || '');
    setNewDorkDescription(dork.description || '');
    setIsAddingDork(true);
  };

  const deleteDork = (id: string) => setDorks(dorks.filter(d => d.id !== id));

  // --- Handlers for Payloads ---
  const handleSavePayload = () => {
    if (!newPayloadName.trim() || !newPayloadContent.trim()) return;
    if (editingPayload) {
      setPayloads(payloads.map(p => 
        p.id === editingPayload ? { ...p, name: newPayloadName, content: newPayloadContent, type: newPayloadType, description: { en: newPayloadDesc, ar: newPayloadDesc } } : p
      ));
    } else {
      setPayloads([...payloads, {
        id: Date.now().toString(),
        name: newPayloadName,
        content: newPayloadContent,
        type: newPayloadType,
        description: { en: newPayloadDesc, ar: newPayloadDesc },
        isCustom: true
      }]);
    }
    setIsAddingPayload(false);
    setEditingPayload(null);
  };

  const startEditPayload = (payload: Payload) => {
    setEditingPayload(payload.id);
    setNewPayloadName(payload.name);
    setNewPayloadContent(payload.content);
    setNewPayloadType(payload.type);
    setNewPayloadDesc(payload.description?.en || '');
    setIsAddingPayload(true);
  };

  const deletePayload = (id: string) => setPayloads(payloads.filter(d => d.id !== id));

  // Helper formatting 
  const interpolateCommand = (template: string, cmdId: string) => {
     let t = template;
     if (domain) {
        t = t.replace(/\{target\}/g, domain);
     } else {
        t = t.replace(/\{target\}/g, 'example.com');
     }
     
     // Replace active wordlists
     if (selectedWordlists[cmdId]) {
       Object.entries(selectedWordlists[cmdId]).forEach(([target, link]) => {
         t = t.replace(target, link);
       });
     }
     
     return t;
  };

  return (
    <div className={cn("min-h-screen text-gray-200 font-mono selection:bg-cyan-500/30 selection:text-cyan-200 shadow-xl", language === 'ar' ? 'dir-rtl' : 'dir-ltr')}>
      {/* Header */}
      <header className="border-b border-white/5 bg-indigo-950/20 backdrop-blur-xl sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <Terminal className="w-8 h-8 text-cyan-400" />
              </div>
              <div className={cn("flex flex-col", language === 'ar' && "items-end")}>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent tracking-tight leading-tight">Recon Master</h1>
                <p className="text-sm text-cyan-200/70 font-sans mt-0.5">
                  {language === 'en' ? 'Automated Methodology Generator' : 'مولد أوامر المنهجية الآلي'}
                </p>
              </div>
            </div>

            <div className="flex-1 max-w-xl flex items-center gap-4">
              <div className="relative group flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe2 className="h-5 w-5 text-indigo-400 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder={language === 'en' ? "Enter target domain (e.g., example.com)" : "أدخل النطاق المستهدف (مثل example.com)"}
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className={cn(
                    "block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-black/20 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-sans shadow-inner backdrop-blur-sm",
                    language === 'ar' && "text-right pl-3 pr-10"
                  )}
                  style={language === 'ar' ? { paddingLeft: '0.75rem', paddingRight: '2.5rem'} : {}}
                />
                 {language === 'ar' && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                     <Globe2 className="h-5 w-5 text-indigo-400 group-focus-within:text-cyan-400 transition-colors" />
                  </div>
                 )}
              </div>
              <div className="flex bg-black/20 border border-white/5 rounded-lg p-1">
                <button
                  onClick={() => setLanguage('en')}
                  className={cn("px-3 py-1.5 text-sm font-sans font-medium rounded-md transition-all shadow-sm", language === 'en' ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white" : "text-indigo-300 hover:text-white")}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('ar')}
                  className={cn("px-3 py-1.5 text-sm font-sans font-medium rounded-md transition-all shadow-sm", language === 'ar' ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white" : "text-indigo-300 hover:text-white")}
                >
                  عربي
                </button>
              </div>
            </div>
          </div>
          
           {/* Top Navigation Tabs */}
           <div className="flex flex-wrap items-center gap-2 sm:gap-6 mt-8 border-b border-white/10 pb-[-1px]">
             <button
               onClick={() => setActiveTab('commands')}
               className={cn(
                 "px-4 py-2 border-b-2 font-sans font-medium transition-all text-sm uppercase tracking-wider flex items-center gap-2",
                 activeTab === 'commands' ? "border-cyan-400 text-cyan-300" : "border-transparent text-indigo-300/70 hover:text-indigo-200"
               )}
             >
               <Terminal className="w-4 h-4" />
               {language === 'en' ? 'Recon Commands' : 'أوامر الاستطلاع'}
             </button>
             <button
               onClick={() => setActiveTab('methodology')}
               className={cn(
                 "px-4 py-2 border-b-2 font-sans font-medium transition-all text-sm uppercase tracking-wider flex items-center gap-2",
                 activeTab === 'methodology' ? "border-amber-400 text-amber-300" : "border-transparent text-indigo-300/70 hover:text-indigo-200"
               )}
             >
               <BookOpen className="w-4 h-4" />
               {language === 'en' ? 'Methodology' : 'منهجية الفحص'}
             </button>
             <button
               onClick={() => setActiveTab('dorks')}
               className={cn(
                 "px-4 py-2 border-b-2 font-sans font-medium transition-all text-sm uppercase tracking-wider flex items-center gap-2",
                 activeTab === 'dorks' ? "border-fuchsia-400 text-fuchsia-300" : "border-transparent text-indigo-300/70 hover:text-indigo-200"
               )}
             >
               <SearchIcon className="w-4 h-4" />
               {language === 'en' ? 'Google Dorks' : 'دوركات جوجل'}
             </button>
             <button
               onClick={() => setActiveTab('payloads')}
               className={cn(
                 "px-4 py-2 border-b-2 font-sans font-medium transition-all text-sm uppercase tracking-wider flex items-center gap-2",
                 activeTab === 'payloads' ? "border-emerald-400 text-emerald-300" : "border-transparent text-indigo-300/70 hover:text-indigo-200"
               )}
             >
               <FileCode className="w-4 h-4" />
               {language === 'en' ? 'Web Payloads' : 'بايلودات الويب'}
             </button>
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 blur-[150px] -z-10 rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 blur-[150px] -z-10 rounded-full pointer-events-none"></div>

        {activeTab === 'commands' && (
          <div className="grid md:grid-cols-12 gap-6 lg:gap-8">
            {/* Sidebar / Navigation */}
            <div className="md:col-span-4 lg:col-span-3 space-y-2">
              {commandsCategories.map((category, idx) => {
                const Icon = Icons[category.iconName] || Terminal;
                const isActive = activeCategory === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveCategory(idx)}
                    className={cn(
                      "w-full flex items-center p-4 rounded-xl text-left transition-all duration-300 border backdrop-blur-sm group",
                      isActive 
                        ? "bg-indigo-950/40 border-cyan-500/40 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.15)] bg-gradient-to-r from-cyan-900/20 to-transparent" 
                        : "bg-white/5 border-white/5 text-indigo-200 hover:bg-white/10 hover:border-white/10 hover:text-indigo-100"
                    )}
                  >
                    <div className={cn("flex items-center gap-3 w-full", language === 'ar' && "flex-row-reverse text-right")}>
                      <Icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-cyan-400" : "text-indigo-400 group-hover:text-indigo-300")} />
                      <span className="font-semibold truncate font-sans text-sm">{category.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Commands Display */}
            <div className="md:col-span-8 lg:col-span-9">
              <AnimatePresence mode="wait">
                 {(activeCategory !== null && commandsCategories[activeCategory]) && (
                  <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="mb-8 p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-cyan-500/20 shadow-lg shadow-black/20">
                      <h2 className={cn("text-xl font-bold text-white mb-2 flex items-center gap-2", language === 'ar' && "flex-row-reverse text-right")}>
                        <Terminal className="w-5 h-5 text-cyan-400" />
                        {commandsCategories[activeCategory].title}
                      </h2>
                      <p className={cn("text-indigo-200/80 font-sans text-sm", language === 'ar' && "text-right")}>
                        {language === 'en' ? commandsCategories[activeCategory].description.en : commandsCategories[activeCategory].description.ar}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {commandsCategories[activeCategory].commands.map((cmdInfo) => {
                        const cmdId = `${commandsCategories[activeCategory].id}-${cmdInfo.id}`;
                        const isCopied = copiedIndex === cmdId;
                        const isEditing = editingCommandPath?.cmdId === cmdInfo.id && editingCommandPath?.catId === commandsCategories[activeCategory].id;
                        
                        return (
                          <div 
                            key={cmdInfo.id} 
                            className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/20 hover:border-cyan-500/30 transition-all shadow-md backdrop-blur-sm"
                          >
                            <div className={cn("flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5", language === 'ar' && "flex-row-reverse")}>
                               <div className={cn("flex items-center gap-2", language === 'ar' && "flex-row-reverse")}>
                                  <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                                  <span className="text-xs font-semibold text-indigo-300 uppercase tracking-widest">{cmdInfo.tool}</span>
                               </div>
                               
                               <div className={cn("flex items-center gap-2", language === 'ar' && "flex-row-reverse")}>
                                  <button onClick={() => isEditing ? setEditingCommandPath(null) : startEditCommand(commandsCategories[activeCategory].id, cmdInfo)} className="p-1.5 text-indigo-400 hover:text-white hover:bg-white/10 rounded-md transition-colors" title="Edit Command">
                                     <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                     onClick={() => handleCopy(interpolateCommand(cmdInfo.cmdTemplate, cmdId), cmdId)}
                                     className={cn(
                                       "flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg transition-all font-sans border",
                                       language === 'ar' && "flex-row-reverse",
                                       isCopied 
                                         ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]" 
                                         : "bg-white/5 text-indigo-200 border-transparent hover:bg-white/10 hover:text-white hover:border-white/10"
                                     )}
                                   >
                                     {isCopied ? (
                                       <>{language === 'en' ? 'Copied!' : 'تم النسخ!'}</>
                                     ) : (
                                       <><Copy className="w-3.5 h-3.5" /> {language === 'en' ? 'Copy' : 'نسخ'}</>
                                     )}
                                   </button>
                               </div>
                            </div>
                            
                            <div className={cn("p-4 overflow-x-auto flex flex-col gap-3", language === 'ar' && "text-left dir-ltr")}>
                              {isEditing ? (
                                <div className="flex flex-col gap-3">
                                   <input 
                                      value={editCmdTool} 
                                      onChange={(e) => setEditCmdTool(e.target.value)} 
                                      className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-1 text-sm text-cyan-300 font-sans focus:outline-none focus:border-cyan-500"
                                      placeholder="Tool name"
                                   />
                                   <input 
                                      value={editCmdTemplate} 
                                      onChange={(e) => setEditCmdTemplate(e.target.value)} 
                                      className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                                      placeholder="Command template (use {target})"
                                   />
                                   <div className="flex justify-end gap-2">
                                     <button onClick={() => setEditingCommandPath(null)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-xs font-sans">Cancel</button>
                                     <button onClick={saveEditedCommand} className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/30 rounded-md text-xs font-sans">Save Changes</button>
                                   </div>
                                </div>
                              ) : (
                                <>
                                  <code className="text-sm text-indigo-100 whitespace-pre font-mono">
                                    {interpolateCommand(cmdInfo.cmdTemplate, cmdId).split(domain || 'example.com').map((part, index, array) => (
                                       <span key={index}>
                                          {part}
                                        {index < array.length - 1 && (
                                          <span className="text-cyan-400 font-semibold">{domain || 'example.com'}</span>
                                        )}
                                       </span>
                                    ))}
                                  </code>
                                  {cmdInfo.wordlists && cmdInfo.wordlists.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2 pt-3 border-t border-white/5">
                                      {cmdInfo.wordlists.map((wl, wIdx) => {
                                        const targetToReplace = (wl as any).replaceTarget || 'wordlist.txt';
                                        const isActive = selectedWordlists[cmdId]?.[targetToReplace] === wl.link;
                                        return (
                                          <button
                                            key={wIdx}
                                            onClick={() => {
                                              setSelectedWordlists(prev => ({
                                                ...prev,
                                                [cmdId]: {
                                                  ...(prev[cmdId] || {}),
                                                  [targetToReplace]: isActive ? targetToReplace : wl.link // toggle capability
                                                }
                                              }));
                                            }}
                                            className={cn(
                                              "text-[10px] sm:text-xs px-2.5 py-1 rounded-md font-sans transition-colors flex items-center gap-1.5",
                                              isActive 
                                                ? "bg-cyan-500 text-[#020617] border border-cyan-400 font-bold shadow-[0_0_8px_rgba(34,211,238,0.5)]" 
                                                : "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20"
                                            )}
                                          >
                                            <Database className="w-3 h-3" />
                                            {wl.name}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Google Dorks Section */}
        {activeTab === 'dorks' && (
          <div className="space-y-6">
            <div className={cn("flex flex-col md:flex-row justify-between items-start md:items-center gap-4", language === 'ar' && "md:flex-row-reverse")}>
               <div>
                  <h2 className={cn("text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400", language === 'ar' && "text-right")}>
                    {language === 'en' ? 'Google Dorks' : 'دوركات جوجل'}
                  </h2>
                  <p className={cn("text-indigo-300/70 font-sans mt-1", language === 'ar' && "text-right")}>
                    {language === 'en' ? 'Advanced search queries to find sensitive information' : 'استعلامات بحث متقدمة للعثور على معلومات حساسة'}
                  </p>
               </div>
               <div className={cn("flex flex-col sm:flex-row gap-3 w-full md:w-auto", language === 'ar' && "sm:flex-row-reverse")}>
                 {dorkCategories.length > 1 && (
                   <select
                     value={selectedDorkCategory}
                     onChange={(e) => setSelectedDorkCategory(e.target.value)}
                     className={cn("bg-black/40 border border-fuchsia-500/20 rounded-lg px-3 py-2 text-white font-sans text-sm focus:outline-none focus:border-fuchsia-500", language === 'ar' && "text-right")}
                   >
                     {dorkCategories.map(cat => (
                       <option key={cat} value={cat}>
                         {cat === 'All' ? (language === 'en' ? 'All Categories' : 'جميع الفئات') : cat}
                       </option>
                     ))}
                   </select>
                 )}
                 <button
                    onClick={() => { setIsAddingDork(true); setEditingDork(null); setNewDorkName(''); setNewDorkQuery(''); setNewDorkCategory(''); setNewDorkDescription(''); }}
                    className={cn("flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white rounded-lg font-sans transition-all shadow-lg shadow-fuchsia-500/20", language === 'ar' && "flex-row-reverse")}
                  >
                    <Plus className="w-4 h-4" />
                    {language === 'en' ? 'Add Custom Dork' : 'إضافة دورك مخصص'}
                  </button>
               </div>
            </div>

            {/* Add/Edit Dork Form */}
            <AnimatePresence>
              {isAddingDork && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/5 backdrop-blur-md border border-fuchsia-500/30 rounded-2xl p-6 overflow-hidden shadow-2xl"
                >
                  <div className="flex flex-col gap-5">
                    <div className={cn("flex flex-col md:flex-row gap-4", language === 'ar' && "md:flex-row-reverse")}>
                      <div className={cn("flex-1", language === 'ar' && "text-right")}>
                        <label className="block text-sm font-sans text-indigo-300 mb-1.5 flex items-center gap-2">
                           {language === 'en' ? 'Dork Name' : 'اسم الدورك'}
                        </label>
                        <input 
                          type="text" 
                          value={newDorkName}
                          onChange={(e) => setNewDorkName(e.target.value)}
                          placeholder="e.g. SENSITIVE PDFS"
                          className={cn("w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white font-sans focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50", language === 'ar' && "text-right")}
                        />
                      </div>
                      <div className={cn("flex-1", language === 'ar' && "text-right")}>
                        <label className="block text-sm font-sans text-indigo-300 mb-1.5">
                          {language === 'en' ? 'Category (Optional)' : 'الفئة (اختياري)'}
                        </label>
                        <input 
                          type="text" 
                          value={newDorkCategory}
                          onChange={(e) => setNewDorkCategory(e.target.value)}
                          placeholder={language === 'en' ? "e.g. Documents" : "مثل: المستندات"}
                          className={cn("w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white font-sans focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50", language === 'ar' && "text-right")}
                        />
                      </div>
                    </div>
                    
                    <div className={cn("flex-1", language === 'ar' && "text-right")}>
                      <label className="block text-sm font-sans text-indigo-300 mb-1.5">
                        {language === 'en' ? 'Query (use {target} for domain)' : 'الاستعلام (استخدم {target} للنطاق)'}
                      </label>
                      <input 
                        type="text" 
                        value={newDorkQuery}
                        onChange={(e) => setNewDorkQuery(e.target.value)}
                        placeholder="site:{target} ext:pdf confidential"
                        className={cn("w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50", language === 'ar' && "text-right dir-ltr")}
                      />
                    </div>

                    <div className={cn("flex-1", language === 'ar' && "text-right")}>
                      <label className="block text-sm font-sans text-indigo-300 mb-1.5">
                        {language === 'en' ? 'Description (Optional)' : 'الوصف (اختياري)'}
                      </label>
                      <input 
                        type="text" 
                        value={newDorkDescription}
                        onChange={(e) => setNewDorkDescription(e.target.value)}
                        placeholder={language === 'en' ? "e.g. Finds sensitive documents" : "مثل: يعثر على الوثائق الحساسة"}
                        className={cn("w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50", language === 'ar' && "text-right")}
                      />
                    </div>
                    
                    <div className={cn("flex gap-3 w-full md:w-auto mt-2", language === 'ar' && "flex-row-reverse md:justify-start", language !== 'ar' && "md:justify-end")}>
                      <button 
                         onClick={() => { setIsAddingDork(false); setEditingDork(null); }}
                         className="flex-1 md:flex-none px-6 py-2.5 border border-white/10 hover:bg-white/5 rounded-xl text-indigo-300 font-sans text-sm transition-colors flex items-center justify-center gap-2"
                      >
                         <X className="w-4 h-4" />
                         {language === 'en' ? 'Cancel' : 'إلغاء'}
                      </button>
                      <button 
                        onClick={handleSaveDork}
                        disabled={!newDorkName.trim() || !newDorkQuery.trim()}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-fuchsia-500 hover:bg-fuchsia-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-sans text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-500/20"
                      >
                        <Save className="w-4 h-4" />
                        {language === 'en' ? 'Save Dork' : 'حفظ'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredDorks.map((dork) => {
                const currentTarget = domain || 'example.com';
                const finalQuery = dork.query.replace(/\{target\}/g, currentTarget);
                const dorkId = `dork-${dork.id}`;
                const isCopied = copiedIndex === dorkId;

                return (
                   <div key={dork.id} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-black/20 hover:border-fuchsia-500/30 transition-all flex flex-col shadow-lg backdrop-blur-sm">
                     <div className={cn("flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/5", language === 'ar' && "flex-row-reverse")}>
                        <div className={cn("flex flex-wrap items-center gap-2.5", language === 'ar' && "flex-row-reverse")}>
                           <SearchIcon className="w-4 h-4 text-fuchsia-400" />
                           <span className="text-sm font-bold text-indigo-100 font-sans tracking-wide">{dork.name}</span>
                           {dork.category && (
                             <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 font-sans font-medium uppercase tracking-wider">
                               {dork.category}
                             </span>
                           )}
                        </div>
                        
                        <div className={cn("flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity", language === 'ar' && "flex-row-reverse")}>
                           {dork.isCustom && (
                             <>
                               <button onClick={() => startEditDork(dork)} className="p-1.5 text-indigo-400 hover:text-white hover:bg-white/10 rounded-md transition-colors" title="Edit">
                                 <Edit2 className="w-3.5 h-3.5" />
                               </button>
                               <button onClick={() => deleteDork(dork.id)} className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors" title="Delete">
                                 <Trash2 className="w-3.5 h-3.5" />
                               </button>
                               <div className="w-px h-4 bg-white/10 mx-1"></div>
                             </>
                           )}
                           <button
                             onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(finalQuery)}`, '_blank')}
                             className="text-xs px-2.5 py-1.5 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/20 rounded-md font-sans transition-all flex items-center gap-1.5"
                             title="Search on Google"
                           >
                             <SearchIcon className="w-3 h-3" />
                             {language === 'en' ? 'Open' : 'فتح'}
                           </button>
                        </div>
                     </div>
                     
                     <div className={cn("p-5 flex-1 flex flex-col justify-between gap-5", language === 'ar' && "text-right")}>
                       <div className="flex flex-col gap-3">
                         <span className="bg-black/40 p-3 rounded-xl border border-white/5 font-mono text-sm text-fuchsia-300 break-all leading-relaxed">
                            {finalQuery}
                         </span>
                         {dork.description && (
                           <p className="text-sm text-indigo-300/80 font-sans flex items-start gap-2">
                             <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500/50 mt-1.5 flex-shrink-0" />
                             {dork.description}
                           </p>
                         )}
                       </div>
                       
                       <div className={cn("flex justify-end", language === 'ar' && "justify-start")}>
                         <button
                            onClick={() => handleCopy(finalQuery, dorkId)}
                            className={cn(
                              "flex items-center gap-2 text-sm px-4 py-2 rounded-xl transition-all font-sans font-medium",
                              language === 'ar' && "flex-row-reverse",
                              isCopied 
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
                                : "bg-white/5 text-indigo-200 hover:bg-white/10 hover:text-white"
                            )}
                          >
                            {isCopied ? (
                              <><Check className="w-4 h-4" /> {language === 'en' ? 'Copied!' : 'تم النسخ!'}</>
                            ) : (
                              <><Copy className="w-4 h-4" /> {language === 'en' ? 'Copy Query' : 'نسخ الاستعلام'}</>
                            )}
                          </button>
                       </div>
                     </div>
                   </div>
                );
              })}
            </div>
            
             <div className="mt-8 p-6 bg-gradient-to-r from-indigo-900/40 to-fuchsia-900/20 border border-fuchsia-500/20 rounded-2xl backdrop-blur-md">
               <h3 className={cn("text-fuchsia-400 font-bold mb-3 font-sans flex items-center gap-2", language === 'ar' && "flex-row-reverse justify-end")}>
                 <Github className="w-5 h-5" />
                 {language === 'en' ? 'GitHub Dorks' : 'دوركات GitHub'}
               </h3>
               <div className={cn("space-y-3 text-indigo-200 text-sm font-sans", language === 'ar' && "text-right")}>
                  <p>{language === 'en' ? 'For GitHub dorks, use tools like GitDorker to automate the search:' : 'بالنسبة لدوركات GitHub، استخدم أدوات مثل GitDorker لأتمتة البحث:'}</p>
                  <code className="block p-4 bg-black/40 rounded-xl border border-white/10 font-mono text-sm text-fuchsia-300 dir-ltr text-left">
                    python3 GitDorker.py -tf tf/TOKENSFILE -q {domain || 'example.com'} -d dorks/medium_dorks.txt -o output_file
                  </code>
               </div>
             </div>
          </div>
        )}

        {/* Web Payloads Section */}
        {activeTab === 'payloads' && (
          <div className="space-y-6">
            <div className={cn("flex flex-col md:flex-row justify-between items-start md:items-center gap-4", language === 'ar' && "md:flex-row-reverse")}>
               <div>
                  <h2 className={cn("text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400", language === 'ar' && "text-right")}>
                    {language === 'en' ? 'Web Vulnerability Payloads' : 'بايلودات ثغرات الويب'}
                  </h2>
                  <p className={cn("text-emerald-200/70 font-sans mt-1", language === 'ar' && "text-right")}>
                    {language === 'en' ? 'Ready-to-use payloads for testing web application security' : 'بايلودات جاهزة لاختبار أمان تطبيقات الويب'}
                  </p>
               </div>
               
               <div className={cn("flex flex-col sm:flex-row gap-3 w-full md:w-auto items-end sm:items-center", language === 'ar' && "sm:flex-row-reverse")}>
                 <div className={cn("flex items-center gap-2 bg-black/40 rounded-lg p-1.5 border border-white/5", language === 'ar' && "flex-row-reverse")}>
                     <button
                        onClick={() => setUrlEncodeLevel((prev) => (prev + 1) % 3 as 0 | 1 | 2)}
                        className={cn("px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-all flex items-center gap-1.5", 
                          urlEncodeLevel > 0 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-gray-400 hover:text-white"
                        )}
                     >
                       <Link className="w-3.5 h-3.5" />
                       {language === 'en' 
                          ? (urlEncodeLevel === 0 ? 'URL Encode: Off' : urlEncodeLevel === 1 ? 'URL Encode: Single' : 'URL Encode: Double') 
                          : (urlEncodeLevel === 0 ? 'تشفير: معطل' : urlEncodeLevel === 1 ? 'تشفير: أحادي' : 'تشفير: مزدوج')}
                     </button>
                 </div>

                 <button
                    onClick={() => { setIsAddingPayload(true); setEditingPayload(null); setNewPayloadName(''); setNewPayloadContent(''); setNewPayloadType(''); setNewPayloadDesc(''); }}
                    className={cn("flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-lg font-sans transition-all shadow-lg shadow-emerald-500/20", language === 'ar' && "flex-row-reverse")}
                  >
                    <Plus className="w-4 h-4" />
                    {language === 'en' ? 'Add Custom Payload' : 'إضافة بايلود مخصص'}
                  </button>
               </div>
            </div>

            <div className="grid md:grid-cols-12 gap-6 lg:gap-8">
              {/* Sidebar Navigation */}
              <div className="md:col-span-4 lg:col-span-3 space-y-2">
                 {payloadTypes.map(type => {
                    const isActive = selectedPayloadType === type;
                    return (
                        <button
                          key={type}
                          onClick={() => setSelectedPayloadType(type)}
                          className={cn(
                            "w-full text-left px-4 py-3 rounded-xl transition-all font-sans font-medium flex items-center justify-between group",
                            language === 'ar' && "text-right flex-row-reverse",
                            isActive 
                              ? "bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 border border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                              : "bg-white/5 border border-white/5 text-indigo-300 hover:bg-white/10 hover:text-white hover:border-white/10"
                          )}
                        >
                          <span>{type === 'All' ? (language === 'en' ? 'All Types' : 'جميع الأنواع') : type}</span>
                          <span className={cn(
                            "text-xs px-2.5 py-0.5 rounded-md font-sans border",
                            isActive 
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" 
                              : "bg-white/5 text-indigo-400 group-hover:text-white group-hover:bg-white/20 border-white/10 group-hover:border-white/20"
                          )}>
                             {type === 'All' ? payloads.length : payloads.filter(p => p.type === type).length}
                          </span>
                        </button>
                    );
                 })}
              </div>

              {/* Main Content */}
              <div className="md:col-span-8 lg:col-span-9 space-y-6">
                {/* Add/Edit Payload Form */}
                <AnimatePresence>
              {isAddingPayload && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/5 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-6 overflow-hidden shadow-2xl"
                >
                  <div className="flex flex-col gap-5">
                    <div className={cn("flex flex-col md:flex-row gap-4", language === 'ar' && "md:flex-row-reverse")}>
                      <div className={cn("flex-1", language === 'ar' && "text-right")}>
                        <label className="block text-sm font-sans text-indigo-300 mb-1.5 flex items-center gap-2">
                           {language === 'en' ? 'Payload Name' : 'اسم البايلود'}
                        </label>
                        <input 
                          type="text" 
                          value={newPayloadName}
                          onChange={(e) => setNewPayloadName(e.target.value)}
                          placeholder="e.g. Image OnError"
                          className={cn("w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500/50", language === 'ar' && "text-right")}
                        />
                      </div>
                      <div className={cn("flex-1", language === 'ar' && "text-right")}>
                        <label className="block text-sm font-sans text-indigo-300 mb-1.5">
                          {language === 'en' ? 'Vulnerability Type' : 'نوع الثغرة'}
                        </label>
                        <input 
                          type="text" 
                          value={newPayloadType}
                          onChange={(e) => setNewPayloadType(e.target.value)}
                          placeholder={language === 'en' ? "e.g. XSS, SQLi, SSRF" : "مثل: XSS, SQLi"}
                          className={cn("w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500/50", language === 'ar' && "text-right")}
                        />
                      </div>
                    </div>
                    
                    <div className={cn("flex-1", language === 'ar' && "text-right")}>
                      <label className="block text-sm font-sans text-indigo-300 mb-1.5">
                        {language === 'en' ? 'Content/Code' : 'المحتوى'}
                      </label>
                      <input 
                        type="text" 
                        value={newPayloadContent}
                        onChange={(e) => setNewPayloadContent(e.target.value)}
                        placeholder="<img src=x onerror=alert()>"
                        className={cn("w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-emerald-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50", language === 'ar' && "text-right dir-ltr")}
                      />
                    </div>

                    <div className={cn("flex-1", language === 'ar' && "text-right")}>
                      <label className="block text-sm font-sans text-indigo-300 mb-1.5">
                        {language === 'en' ? 'Description (Optional)' : 'الوصف (اختياري)'}
                      </label>
                      <input 
                        type="text" 
                        value={newPayloadDesc}
                        onChange={(e) => setNewPayloadDesc(e.target.value)}
                        placeholder={language === 'en' ? "e.g. Basic reflected XSS payload" : "مثل: بايلود لتخطي الجدار الناري"}
                        className={cn("w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50", language === 'ar' && "text-right")}
                      />
                    </div>
                    
                    <div className={cn("flex gap-3 w-full md:w-auto mt-2", language === 'ar' && "flex-row-reverse md:justify-start", language !== 'ar' && "md:justify-end")}>
                      <button 
                         onClick={() => { setIsAddingPayload(false); setEditingPayload(null); }}
                         className="flex-1 md:flex-none px-6 py-2.5 border border-white/10 hover:bg-white/5 rounded-xl text-indigo-300 font-sans text-sm transition-colors flex items-center justify-center gap-2"
                      >
                         <X className="w-4 h-4" />
                         {language === 'en' ? 'Cancel' : 'إلغاء'}
                      </button>
                      <button 
                        onClick={handleSavePayload}
                        disabled={!newPayloadName.trim() || !newPayloadContent.trim()}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-sans text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                      >
                        <Save className="w-4 h-4" />
                        {language === 'en' ? 'Save Payload' : 'حفظ'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredPayloads.map((payload) => {
                const payloadContent = urlEncodeLevel === 2 
                    ? encodeURIComponent(encodeURIComponent(payload.content))
                    : urlEncodeLevel === 1 
                        ? encodeURIComponent(payload.content) 
                        : payload.content;
                const payloadId = `payload-${payload.id}`;
                const isCopied = copiedIndex === payloadId;
                const descText = payload.description ? (language === 'ar' && payload.description.ar ? payload.description.ar : payload.description.en) : null;

                return (
                   <div key={payload.id} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-black/20 hover:border-emerald-500/30 transition-all flex flex-col shadow-lg backdrop-blur-sm">
                     <div className={cn("flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/5", language === 'ar' && "flex-row-reverse")}>
                        <div className={cn("flex flex-wrap items-center gap-2.5", language === 'ar' && "flex-row-reverse")}>
                           <FileCode className="w-4 h-4 text-emerald-400" />
                           <span className="text-sm font-bold text-indigo-100 font-sans tracking-wide">{payload.name}</span>
                           {payload.type && (
                             <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-sans font-medium uppercase tracking-wider">
                               {payload.type}
                             </span>
                           )}
                        </div>
                        
                        <div className={cn("flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity", language === 'ar' && "flex-row-reverse")}>
                           {payload.isCustom && (
                             <>
                               <button onClick={() => startEditPayload(payload)} className="p-1.5 text-indigo-400 hover:text-white hover:bg-white/10 rounded-md transition-colors" title="Edit">
                                 <Edit2 className="w-3.5 h-3.5" />
                               </button>
                               <button onClick={() => deletePayload(payload.id)} className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors" title="Delete">
                                 <Trash2 className="w-3.5 h-3.5" />
                               </button>
                             </>
                           )}
                        </div>
                     </div>
                     
                     <div className={cn("p-5 flex-1 flex flex-col justify-between gap-5", language === 'ar' && "text-right")}>
                       <div className="flex flex-col gap-3">
                         <span className="bg-black/40 p-3 rounded-xl border border-white/5 font-mono text-sm text-emerald-300 break-all leading-relaxed relative">
                            {payloadContent}
                         </span>
                         {descText && (
                           <p className="text-sm text-indigo-300/80 font-sans flex items-start gap-2">
                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 mt-1.5 flex-shrink-0" />
                             {descText}
                           </p>
                         )}
                       </div>
                       
                       <div className={cn("flex justify-end", language === 'ar' && "justify-start")}>
                         <button
                            onClick={() => handleCopy(payloadContent, payloadId)}
                            className={cn(
                              "flex items-center gap-2 text-sm px-4 py-2 rounded-xl transition-all font-sans font-medium",
                              language === 'ar' && "flex-row-reverse",
                              isCopied 
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
                                : "bg-white/5 text-indigo-200 hover:bg-white/10 hover:text-white"
                            )}
                          >
                            {isCopied ? (
                              <><Check className="w-4 h-4" /> {language === 'en' ? 'Copied!' : 'تم النسخ!'}</>
                            ) : (
                              <><Copy className="w-4 h-4" /> {language === 'en' ? 'Copy Payload' : 'نسخ'}</>
                            )}
                          </button>
                       </div>
                     </div>
                   </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
        )}

        {/* Methodology Section */}
        {activeTab === 'methodology' && (
          <div className="grid md:grid-cols-12 gap-6 lg:gap-8">
            {/* Sidebar / Navigation */}
            <div className="md:col-span-4 lg:col-span-3 space-y-2">
              {defaultMethodology.map((topic, idx) => {
                const Icon = Icons[topic.iconName] || BookOpen;
                const isActive = activeMethodologyTopic === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveMethodologyTopic(idx)}
                    className={cn(
                      "w-full flex items-center p-4 rounded-xl text-left transition-all duration-300 border backdrop-blur-sm group",
                      isActive 
                        ? "bg-amber-950/40 border-amber-500/40 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.15)] bg-gradient-to-r from-amber-900/20 to-transparent" 
                        : "bg-white/5 border-white/5 text-indigo-200 hover:bg-white/10 hover:border-white/10 hover:text-indigo-100"
                    )}
                  >
                    <div className={cn("flex items-center gap-3 w-full", language === 'ar' && "flex-row-reverse text-right")}>
                      <Icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-amber-400" : "text-indigo-400 group-hover:text-indigo-300")} />
                      <span className="font-semibold truncate font-sans text-sm">{language === 'en' ? topic.title.en : topic.title.ar}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Content Display */}
            <div className="md:col-span-8 lg:col-span-9">
              <AnimatePresence mode="wait">
                 {(activeMethodologyTopic !== null && defaultMethodology[activeMethodologyTopic]) && (
                  <motion.div
                    key={activeMethodologyTopic}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="mb-8 p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-amber-500/20 shadow-lg shadow-black/20">
                      <h2 className={cn("text-xl font-bold text-white mb-2 flex items-center gap-2", language === 'ar' && "flex-row-reverse text-right")}>
                        <BookOpen className="w-5 h-5 text-amber-400" />
                        {language === 'en' ? defaultMethodology[activeMethodologyTopic].title.en : defaultMethodology[activeMethodologyTopic].title.ar}
                      </h2>
                      <p className={cn("text-indigo-200/80 font-sans text-sm", language === 'ar' && "text-right")}>
                        {language === 'en' ? defaultMethodology[activeMethodologyTopic].description.en : defaultMethodology[activeMethodologyTopic].description.ar}
                      </p>
                    </div>

                    <div className="space-y-6">
                      {defaultMethodology[activeMethodologyTopic].steps.map((step, sIdx) => (
                        <div key={sIdx} className="rounded-xl border border-white/10 bg-black/20 shadow-md backdrop-blur-sm overflow-hidden">
                          <div className={cn("px-5 py-3 border-b border-white/5 bg-amber-500/10", language === 'ar' && "text-right")}>
                             <h3 className="font-bold text-amber-300 font-sans tracking-wide">
                               {language === 'en' ? step.title.en : step.title.ar}
                             </h3>
                          </div>
                          <div className={cn("p-5", language === 'ar' ? "text-right" : "text-left")}>
                            <ul className="space-y-4">
                              {step.items.map((item: any, iIdx: number) => {
                                const itemId = `topic${activeMethodologyTopic}-step${sIdx}-item${iIdx}`;
                                const currentDomainKey = (domain.trim() || 'default').toLowerCase();
                                const isChecked = methodologyProgress[currentDomainKey]?.[itemId] || false;

                                return (
                                  <li key={iIdx} className={cn("flex flex-col gap-2 font-sans text-sm leading-relaxed transition-all", isChecked ? "opacity-40 grayscale" : "text-indigo-100/90")}>
                                    <div className="flex items-start gap-3 group">
                                      <div className="mt-1 flex-shrink-0 flex items-center">
                                         <input 
                                           type="checkbox" 
                                           checked={isChecked}
                                           onChange={(e) => toggleMethodologyItem(itemId, e.target.checked)}
                                           className="w-4 h-4 rounded border-amber-500/30 bg-black/40 checked:bg-amber-500 checked:border-amber-500 focus:ring-amber-500/20 focus:ring-offset-0 cursor-pointer transition-colors shadow-inner"
                                         />
                                      </div>
                                      <span className={cn(language === 'ar' && "font-sans", isChecked && "line-through text-indigo-300")}>{language === 'en' ? item.en : item.ar}</span>
                                    </div>
                                    
                                    {item.exploit && !isChecked && (
                                      <div className={cn("ml-8 pl-3 border-l-2 border-amber-500/30 text-indigo-200/80 text-xs", language === 'ar' && "mr-8 ml-0 pr-3 border-r-2 border-l-0")}>
                                        <span className="font-semibold text-amber-500/70 mb-1 block">
                                          {language === 'en' ? 'Exploitation / Requirements:' : 'طريقة الاستغلال والمتطلبات:'}
                                        </span>
                                        {language === 'en' ? item.exploit.en : item.exploit.ar}
                                      </div>
                                    )}
  
                                    {item.code && item.code.length > 0 && !isChecked && (
                                      <div className={cn("ml-8 mt-1 flex flex-col gap-1", language === 'ar' && "mr-8 ml-0")}>
                                        {item.code.map((codeStr: string, cIdx: number) => (
                                          <div key={cIdx} dir="ltr" className="bg-black/40 px-3 py-2 rounded-md border border-white/5 font-mono text-xs text-amber-200/90 break-all text-left">
                                            {codeStr}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                            
                            {step.payloads && step.payloads.length > 0 && (
                              <div className="mt-5 pt-4 border-t border-white/10">
                                <h4 className={cn("text-xs font-semibold text-amber-500 uppercase tracking-widest mb-3", language === 'ar' && "text-right")}>
                                  {language === 'en' ? 'Common Payloads / Values' : 'قيم / بايلودات شائعة'}
                                </h4>
                                <div className={cn("flex flex-wrap gap-2", language === 'ar' && "justify-end")}>
                                  {step.payloads.map((payload, pIdx) => {
                                     const payloadId = `payload-${sIdx}-${pIdx}`;
                                     const isCopied = copiedIndex === payloadId;
                                     return (
                                       <button
                                         key={pIdx}
                                         onClick={() => handleCopy(payload, payloadId)}
                                         className={cn(
                                           "text-xs px-2.5 py-1.5 font-mono text-indigo-200 border rounded-md transition-all flex items-center gap-1.5 group",
                                           isCopied 
                                             ? "bg-amber-500/20 border-amber-500/40 text-amber-300" 
                                             : "bg-black/40 border-white/10 hover:border-amber-500/30 hover:bg-amber-500/10"
                                         )}
                                       >
                                         {payload}
                                         <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                       </button>
                                     );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default ReconApp;
