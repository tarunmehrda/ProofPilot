import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, UploadCloud, X, Copy, CheckCircle2, Download, AlertCircle, 
  Loader2, Pin, Scale, Mail, MessageSquare, 
  Tag, AlertTriangle, Key, ArrowRight, CornerDownRight, Zap, Play, Search, Target, ShieldQuestion, UserSearch, Swords, Crosshair, StopCircle
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { createWorker } from 'tesseract.js';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '';
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const NVIDIA_MODEL = 'meta/llama-3.1-70b-instruct';

async function extractTextFromFile(file: File, onStatus: (s: string) => void): Promise<string> {
  const mimeType = file.type;
  if (mimeType === 'text/plain' || file.name.endsWith('.txt')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '');
      reader.onerror = () => reject(new Error('Failed to read text file'));
      reader.readAsText(file);
    });
  } else if (mimeType === 'application/pdf') {
    onStatus('Parsing PDF...');
    const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
    GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ') + '\n';
    }
    return text;
  } else if (mimeType.startsWith('image/')) {
    onStatus('Running OCR on image...');
    const worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(file);
    await worker.terminate();
    return text;
  }
  return `[Unsupported file type: ${file.name}]`;
}

async function callNvidiaAPI(messages: {role: string; content: string}[], jsonMode = false): Promise<string> {
  const payload: any = {
    model: NVIDIA_MODEL,
    messages,
    temperature: 0.2,
    max_tokens: 4000,
  };
  if (jsonMode) payload.response_format = { type: 'json_object' };

  const res = await fetch(NVIDIA_API_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${NVIDIA_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`NVIDIA API Error: ${res.status} ${err.substring(0, 200)}`);
  }
  const data = await res.json();
  return data.choices[0]?.message?.content || '{}';
}

// Reusable Circular Gauge UI
const CircularProgress = ({ value, label, colorCode, animatedStatus }: { value: number, label: string, colorCode: string, animatedStatus?: string }) => {
  const isGood = colorCode === 'emerald';
  const c = isGood ? 'text-emerald-400' : (colorCode === 'rose' ? 'text-rose-400' : 'text-indigo-400');
  const glow = isGood ? 'drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]' : (colorCode === 'rose' ? 'drop-shadow-[0_0_15px_rgba(251,113,133,0.5)]' : 'drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]');
  
  return (
    <div className="relative flex flex-col items-center justify-center p-4 group">
      <svg className={`w-28 h-28 transform -rotate-90 transition-transform duration-500 group-hover:scale-110 ${glow}`}>
        <circle cx="56" cy="56" r="42" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
        <circle cx="56" cy="56" r="42" stroke="currentColor" strokeWidth="6" fill="transparent" 
          strokeDasharray="264" 
          strokeDashoffset={264 - (264 * Math.max(value, 0.1)) / 100} 
          className={`${c} transition-all duration-[1500ms] ease-out`} 
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute top-[4.5rem] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="text-3xl font-black tracking-tighter text-white drop-shadow-md">{value}<span className="text-lg">%</span></span>
      </div>
      <span className="text-[11px] text-slate-300 mt-4 uppercase tracking-widest font-bold text-center leading-tight">{label}</span>
      {animatedStatus && (
        <span className={`absolute -bottom-2 text-[9px] uppercase tracking-widest font-black animate-pulse ${c}`}>{animatedStatus}</span>
      )}
    </div>
  );
};

export default function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [demoState, setDemoState] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Intelligence'|'Strategy'|'Artifacts'|'Copilot'>('Intelligence');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Voice
  const [isPlaying, setIsPlaying] = useState(false);

  // Chat Context
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'assistant', content: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files!)]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleUploadFiles = async (dataFiles: File[]) => {
    let extracted_text = '';
    for (const file of dataFiles) {
      try {
        extracted_text += await extractTextFromFile(file, setDemoState) + '\n\n';
      } catch (err: any) {
        extracted_text += `[Error reading ${file.name}: ${err.message}]\n\n`;
      }
    }
    return extracted_text;
  };

  const handleExecuteAI = async (extractedText: string) => {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: extractedText }),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error('Intelligence parsing failed: ' + errText.substring(0, 120));
    }
    try {
      return await res.json();
    } catch {
      throw new Error('Neural link unstable. AI returned invalid data. Try again.');
    }
  };

  const handleRunAnalysis = async (customText?: string) => {
    // If no files and no customText, abort
    if (!customText && files.length === 0) return;
    
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      let extractedText = customText;
      
      if (!extractedText) {
         setDemoState('Intercepting file data...');
         extractedText = await handleUploadFiles(files);
      }
      
      if (!extractedText) throw new Error("Zero viable evidence data found.");
      
      setDemoState('Simulating Judge Scenarios...');
      const parseResults = await handleExecuteAI(extractedText);
      parseResults.extractedText = extractedText; // Keep a raw dump

      setChatHistory([{ role: 'assistant', content: 'Connection secured. I have fully analyzed the evidence. What would you like to investigate?' }]);
      setResults(parseResults);
      setActiveTab('Intelligence');
    } catch (err: any) {
      setError(err.message || "An unknown extraction exception occurred.");
    } finally {
      setLoading(false);
      setDemoState('');
    }
  };

  const triggerDemo = async () => {
    const fakeEvidenceText = "Order #992-AZ from GlobalTechShip. Purchased a Nikon DSLR for $1,200. The tracking said 'Delivered' on April 15th but my porch camera shows nothing. They refuse to refund me saying 'check with neighbors'. It's been 2 weeks and my credit card company says the window is closing soon.";
    setFiles([new File(["demo..."], "evidence_ring_camera.png", { type: "image/png" })]);
    await handleRunAnalysis(fakeEvidenceText);
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading || !results?.extractedText) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: results.extractedText, message: userMsg, history: chatHistory.slice(1) }),
      });
      if (!res.ok) throw new Error('Comms down');
      const data = await res.json();
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'SYSTEM ERR: Connection refused.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const playVoice = () => {
    if (!results?.voice_script) return;
    const synth = window.speechSynthesis;
    
    if (isPlaying) {
      synth.cancel();
      setIsPlaying(false);
      return;
    }
    
    synth.cancel();
    const u = new SpeechSynthesisUtterance(results.voice_script);
    u.pitch = 0.95; u.rate = 1.05;
    
    u.onend = () => setIsPlaying(false);
    
    const voices = synth.getVoices();
    const engVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Samantha'))) || voices[0];
    if (engVoice) u.voice = engVoice;
    
    setIsPlaying(true);
    synth.speak(u);
  };

  return (
    <div className="min-h-screen bg-animated text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 flex flex-col">
      {/* Navbar */}
      <nav className="glass-panel sticky top-0 z-50 border-b border-white/5 py-4">
        <div className="px-6 flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="relative">
               <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-50 rounded-full" />
               <Shield className="w-8 h-8 text-indigo-400 relative z-10" />
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tighter text-white drop-shadow-md">
                ProofPilot<span className="text-indigo-500">.ai</span>
              </span>
            </div>
          </div>
          {results && (
             <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-widest">
                   <CheckCircle2 className="w-3 h-3" /> Evidence Locked
                </div>
                <button onClick={playVoice} className="flex items-center gap-2 glass px-4 py-2 rounded-full hover:bg-indigo-500/20 hover:text-indigo-300 transition text-sm font-semibold neon-border">
                  {isPlaying ? <><StopCircle className="w-4 h-4"/> Stop AI Debrief</> : <><Play className="w-4 h-4"/> Play AI Debrief</>}
                </button>
             </div>
          )}
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* LEFT COMPARTMENT (Uploads & Raw Evidence) */}
        {!results ? (
           // LARGE EMPTY STATE
           <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
              <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="max-w-2xl w-full">
                 
                 {error && (
                    <div className="mb-6 bg-rose-500/10 border border-rose-500/50 p-4 rounded-xl flex items-center gap-3 text-rose-300">
                      <AlertCircle className="w-5 h-5" /> {error}
                    </div>
                 )}

                 <div className="text-center mb-10">
                    <h1 className="text-5xl sm:text-7xl font-black tracking-tighter mb-6 neon-text text-white">
                       Outsmart the <br/> Opposition.
                    </h1>
                    <p className="text-lg text-slate-400 font-medium max-w-lg mx-auto">
                       Upload your evidence. Our AI instantly simulates legal outcomes, predicts opponent tactics, and generates an ironclad defense package.
                    </p>
                 </div>

                 <motion.div whileHover={{scale: 1.02}} whileTap={{scale:0.98}} className="glass-card rounded-3xl p-8 mb-6 text-center border-dashed border-indigo-500/40 hover:border-cyan-400/50 transition-all cursor-pointer relative overflow-hidden group"
                      onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}>
                    <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <UploadCloud className="w-16 h-16 text-indigo-400 mx-auto mb-4 group-hover:scale-125 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                    <p className="text-xl font-bold text-slate-200">Drop securely here</p>
                    <p className="text-sm text-slate-500 mt-2">Images, PDFs, or Text Logs intercepted</p>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept="image/*,.pdf,.txt" />
                 </motion.div>

                 <AnimatePresence>
                 {files.length > 0 && (
                   <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="space-y-4 mb-6">
                      {files.map((file, i) => (
                         <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, scale:0.8}} key={i} className="flex justify-between items-center glass p-3 rounded-lg border border-white/10 shadow-lg">
                            <span className="text-sm text-slate-300 truncate pl-2 font-mono">{file.name}</span>
                            <button onClick={()=>setFiles(files.filter((_, idx)=>idx!==i))} className="text-slate-500 hover:text-rose-400 p-2"><X className="w-4 h-4"/></button>
                         </motion.div>
                      ))}
                      <motion.button whileHover={{scale: 1.02}} whileTap={{scale: 0.98}} onClick={()=>handleRunAnalysis()} disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold tracking-wide transition shadow-[0_0_20px_rgba(79,70,229,0.4)] disabled:opacity-50 relative overflow-hidden group">
                         <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                         <span className="relative flex justify-center items-center gap-3">
                           {loading ? <><Loader2 className="w-5 h-5 animate-spin"/> {demoState}</> : 'Initiate Analysis'}
                         </span>
                      </motion.button>
                   </motion.div>
                 )}
                 </AnimatePresence>

                 <div className="text-center mt-8 relative z-10">
                    <motion.button whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} animate={{ opacity: [1, 0.6, 1] }} transition={{ opacity: { repeat: Infinity, duration: 2.5 } }} onClick={triggerDemo} disabled={loading} className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition flex items-center gap-2 justify-center w-full group mx-auto p-2">
                       <Zap className="w-4 h-4 group-hover:scale-125 transition-transform"/> Run Live Demo Protocol
                    </motion.button>
                 </div>
              </motion.div>
           </div>
        ) : (
           <>
              {/* COLLAPSED LEFT PANEL FOR RAW DATUM */}
              <div className="w-80 glass-panel border-r border-white/5 p-6 flex flex-col hidden lg:flex">
                 <div className="flex items-center gap-2 text-indigo-400 font-bold tracking-widest text-xs uppercase mb-6">
                    <Search className="w-4 h-4" /> Intercepted Datum
                 </div>
                 <div className="flex-1 overflow-y-auto scrollbar-hide text-xs text-slate-400 font-mono leading-relaxed bg-slate-950/80 p-4 rounded-xl border border-white/5 shadow-inner">
                    <div className="opacity-50 break-words whitespace-pre-wrap">
                      {results.extractedText}
                    </div>
                 </div>
                 <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
                    <div className="text-xs text-slate-500 font-bold uppercase">Extracted Entities</div>
                    {Object.entries(results.entities || {}).map(([key, vals]: any) => {
                      if (!vals || vals.length === 0) return null;
                      return (
                        <div key={key}>
                          <span className="text-[10px] text-cyan-500 uppercase font-black">{key}</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {vals.map((v:string, i:number) => (
                              <span key={i} className="text-[11px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-300">{v}</span>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                 </div>
              </div>

              {/* RIGHT MAIN PANEL (INTELLIGENCE HUB) */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 scrollbar-hide">
                 
                 {/* Urgent Alert Banner */}
                 {results.urgency && (
                   <motion.div initial={{y:-20, opacity:0}} animate={{y:0, opacity:1}} className="mb-6 bg-red-500/10 border border-red-500/50 rounded-2xl p-4 flex items-center gap-4 glow-rose">
                      <AlertTriangle className="w-8 h-8 text-red-400 shrink-0 animate-pulse" />
                      <div>
                         <h4 className="text-red-400 font-bold uppercase tracking-wider text-sm">{results.urgency.alert}</h4>
                         <p className="text-red-200/70 text-sm mt-0.5">{results.urgency.reason}</p>
                      </div>
                   </motion.div>
                 )}

                 {/* Top Intelligence Stats Row */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Judge Simulation */}
                    <div className="glass-card rounded-3xl pt-2 pb-4 px-4 flex flex-col items-center justify-center relative overflow-hidden group">
                       <div className="absolute top-4 left-4 text-indigo-400 group-hover:animate-bounce"><Scale className="w-5 h-5"/></div>
                       <CircularProgress value={results.judge_simulation?.chance_of_success_pct || 0} label="Judge Simulated Success" colorCode={results.judge_simulation?.strength === 'Weak' ? 'rose' : (results.judge_simulation?.strength === 'Strong' ? 'emerald' : 'indigo')} animatedStatus={results.judge_simulation?.strength + ' case'} />
                       <div className="text-center px-4 -mt-1 hidden md:block">
                         <span className="text-[11px] text-slate-400 leading-tight block line-clamp-2">{results.judge_simulation?.reasoning}</span>
                       </div>
                    </div>

                    {/* Fraud / Reverse Investigation */}
                    <div className="glass-card rounded-3xl pt-2 pb-4 px-4 flex flex-col items-center justify-center relative group">
                       <div className="absolute top-4 left-4 text-cyan-400 group-hover:-rotate-12 transition-transform"><UserSearch className="w-5 h-5"/></div>
                       <CircularProgress value={results.reverse_investigation?.scam_probability_pct || 0} label="Scam Probability Index" colorCode={results.reverse_investigation?.scam_probability_pct > 50 ? 'rose' : 'emerald'} animatedStatus={results.reverse_investigation?.scam_probability_pct > 50 ? 'HIGH RISK' : 'SECURE'} />
                       <div className="text-center px-4 -mt-1 hidden md:flex flex-wrap items-center justify-center gap-1">
                         {results.reverse_investigation?.detected_patterns?.slice(0,2).map((str:string, i:number)=>(
                           <span key={i} className="inline-block text-[10px] text-rose-300 bg-rose-900/30 border border-rose-800 px-2 py-0.5 rounded mx-1 truncate max-w-[120px]">{str}</span>
                         ))}
                       </div>
                    </div>

                    {/* Quick Classification */}
                    <div className="glass-card rounded-3xl p-6 flex flex-col justify-center">
                       <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-2"><Target className="w-4 h-4"/> Case Vector</div>
                       <div className="text-3xl font-black text-white">{results.classification?.type}</div>
                       <div className="flex flex-wrap gap-2 mt-4">
                         <span className="text-xs text-indigo-200 bg-indigo-900/30 border border-indigo-500/30 px-3 py-1 rounded-full">{results.severity?.level} Severity</span>
                         {results.classification?.tags?.map((t:string, i:number)=>(
                           <span key={i} className="text-xs text-cyan-200 bg-cyan-900/30 border border-cyan-500/30 px-3 py-1 rounded-full">#{t}</span>
                         ))}
                       </div>
                    </div>
                 </div>

                 {/* TAB NAVIGATION */}
                 <div className="flex gap-6 mb-6 border-b border-white/10 pb-0 overflow-x-auto scrollbar-hide relative">
                    {['Intelligence', 'Strategy', 'Artifacts', 'Copilot'].map(tab => (
                      <button key={tab} onClick={()=>setActiveTab(tab as any)} className={`relative px-4 py-3 text-sm font-bold tracking-wide transition-colors duration-300 ${activeTab === tab ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-200'}`}>
                         {tab}
                         {activeTab === tab && (
                           <motion.div layoutId="activeTabUnderline" className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)] rounded-t-md" />
                         )}
                      </button>
                    ))}
                 </div>

                 {/* TAB CONTENT: INTELLIGENCE */}
                 <AnimatePresence mode="wait">
                 {activeTab === 'Intelligence' && (
                    <motion.div key="Intelligence" initial={{opacity:0, y:15}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-15}} transition={{duration: 0.3}} className="space-y-6">
                       
                       {/* Exec Summary */}
                       <div className="glass-card rounded-3xl p-6">
                          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Pin className="w-5 h-5 text-indigo-400"/> Executive Decode</h3>
                          <p className="text-slate-300 leading-relaxed text-sm md:text-base">{results.summary}</p>
                       </div>

                       {/* Simulated Opponent Predictor */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="glass-card rounded-3xl p-6 border-t-4 border-t-rose-500/50">
                             <div className="text-xs font-black text-rose-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Swords className="w-4 h-4"/> Projected Opponent Move</div>
                             <p className="text-sm text-slate-300 border-l-2 border-rose-500/30 pl-3">{results.opponent_predictor?.likely_reply}</p>
                          </div>
                          <div className="glass-card rounded-3xl p-6 border-t-4 border-t-cyan-500/50">
                             <div className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2"><ShieldQuestion className="w-4 h-4"/> Recommended Counter-Tactics</div>
                             <p className="text-sm text-slate-300 border-l-2 border-cyan-500/30 pl-3">{results.opponent_predictor?.counter_strategy}</p>
                          </div>
                       </div>
                    </motion.div>
                 )}

                 {/* TAB CONTENT: STRATEGY */}
                 {activeTab === 'Strategy' && (
                    <motion.div key="Strategy" initial={{opacity:0, y:15}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-15}} transition={{duration: 0.3}} className="space-y-6">
                        {/* Auto Negotiation */}
                        <div className="glass-card rounded-3xl p-6 border border-white/10 relative overflow-hidden">
                           <div className="absolute -right-10 -top-10 text-slate-800 opacity-50"><Crosshair className="w-40 h-40" /></div>
                           <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10"><Crosshair className="w-5 h-5 text-emerald-400"/> Calculated Negotiation Protocol</h3>
                           
                           <div className="grid md:grid-cols-2 gap-6 relative z-10">
                              <motion.div whileHover={{scale: 1.02}} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 transition cursor-default">
                                 <span className="text-xs text-slate-500 uppercase font-black block mb-2">Initial Settlement Offer</span>
                                 <span className="text-emerald-300 font-medium text-sm">{results.negotiation_strategy?.offer}</span>
                              </motion.div>
                              <motion.div whileHover={{scale: 1.02}} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 transition cursor-default">
                                 <span className="text-xs text-slate-500 uppercase font-black block mb-2">Escalation Threat Matrix</span>
                                 <span className="text-rose-300 font-medium text-sm">{results.negotiation_strategy?.escalation_threat}</span>
                              </motion.div>
                           </div>
                        </div>

                        {/* Scenario Simulator */}
                        <h3 className="text-lg font-bold text-white pt-4 pb-2">Outcome Simulation Engine</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {results.scenarios?.map((s:any, i:number) => (
                             <motion.div key={i} whileHover={{y:-5}} transition={{type:"spring", stiffness:300}} className="glass border border-white/5 p-5 rounded-2xl flex flex-col justify-between cursor-default">
                                <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Scenario Alpha: {s.action}</div>
                                <div className="text-sm text-slate-300 font-light">{s.prediction}</div>
                             </motion.div>
                           ))}
                        </div>
                    </motion.div>
                 )}

                 {/* TAB CONTENT: ARTIFACTS */}
                 {activeTab === 'Artifacts' && (
                    <motion.div key="Artifacts" initial={{opacity:0, y:15}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-15}} transition={{duration: 0.3}} className="space-y-6">
                       
                       {/* Tools List */}
                       <div className="flex gap-4 mb-4">
                          <button onClick={()=>{
                            const el = document.getElementById('pdf-report-template');
                            if(!el) return;
                            html2pdf().set({margin:0, filename:'ProofPilot_HQ.pdf', image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2,useCORS:true, y: 0, scrollY: 0}, jsPDF:{unit:'px',format:[800,1131],orientation:'portrait'}}).from(el).save();
                          }} className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 neon-border glow-indigo transition">
                             <Download className="w-4 h-4"/> Generate Legal Package PDF
                          </button>
                       </div>

                       <div className="grid lg:grid-cols-2 gap-6">
                         {/* Email Copy */}
                         <div className="glass-card rounded-2xl overflow-hidden flex flex-col">
                            <div className="px-4 py-3 bg-slate-900/80 border-b border-white/5 flex justify-between items-center">
                              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2"><Mail className="w-4 h-4"/> Optimized Email Protocol</span>
                              <button onClick={() => { navigator.clipboard.writeText(results.complaint_email); setCopiedKey('email'); setTimeout(()=>setCopiedKey(null), 2000); }} className="text-slate-400 hover:text-white transition">
                                {copiedKey === 'email' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                            <div className="bg-slate-100 flex-1 flex flex-col">
                               <div className="flex px-4 py-3 border-b border-slate-200 items-center">
                                 <div className="text-xs font-semibold text-slate-500 w-16">To:</div>
                                 <div className="text-xs text-slate-700 bg-slate-200/50 px-2 py-1 rounded">Target Resolution Dept</div>
                               </div>
                               <div className="flex px-4 py-3 border-b border-slate-200 items-center">
                                 <div className="text-xs font-semibold text-slate-500 w-16">Subject:</div>
                                 <div className="text-xs font-bold text-slate-900 truncate">
                                   {results.complaint_email?.split('\n\n')[0].replace(/subject:\s*/i, '') || 'Resolution Request'}
                                 </div>
                               </div>
                               <div className="p-5 overflow-y-auto bg-white text-slate-800 text-[13px] font-sans leading-relaxed max-h-72 scrollbar-hide whitespace-pre-wrap">
                                  {results.complaint_email?.split('\n\n').slice(results.complaint_email?.split('\n\n')[0].toLowerCase().includes('subject:') ? 1 : 0).join('\n\n') || results.complaint_email}
                               </div>
                            </div>
                         </div>
                         
                         {/* Legal Notice */}
                         <div className="glass-card rounded-2xl overflow-hidden flex flex-col">
                            <div className="px-4 py-3 bg-slate-100 border-b border-slate-300 flex justify-between items-center text-slate-800">
                              <span className="text-xs font-bold uppercase tracking-widest">Official Notice Letter</span>
                              <button onClick={() => { navigator.clipboard.writeText(results.legal_notice); setCopiedKey('legal'); setTimeout(()=>setCopiedKey(null), 2000); }} className="text-slate-500 hover:text-slate-900 transition">
                                {copiedKey === 'legal' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                            <div className="p-6 bg-slate-50 text-slate-800 font-serif text-[12px] leading-relaxed overflow-y-auto max-h-96 scrollbar-hide flex-1 shadow-inner">
                               {results.legal_notice}
                            </div>
                         </div>
                       </div>
                    </motion.div>
                 )}

                 {/* TAB CONTENT: COPILOT */}
                 {activeTab === 'Copilot' && (
                    <motion.div key="Copilot" initial={{opacity:0, y:15}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-15}} transition={{duration: 0.3}} className="h-[500px] flex flex-col glass-card border border-indigo-500/30 rounded-3xl overflow-hidden glow-indigo">
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-slate-900/50">
                           {chatHistory.map((msg, idx) => (
                             <motion.div initial={{opacity:0, scale:0.95, y:10}} animate={{opacity:1, scale:1, y:0}} key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed backdrop-blur-md border ${
                                  msg.role === 'user' 
                                  ? 'bg-indigo-600/80 text-white rounded-br-sm border-indigo-500 shadow-lg' 
                                  : 'bg-slate-800/80 text-slate-200 border-slate-600 rounded-bl-sm shadow-md'
                                }`}>
                                   {msg.content}
                                </div>
                             </motion.div>
                           ))}
                           {chatLoading && <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-slate-500 text-xs flex gap-1 items-center">
                             <Loader2 className="w-3 h-3 animate-spin"/> Copilot is synthesizing...
                           </motion.div>}
                           <div ref={chatEndRef} />
                        </div>
                        <div className="bg-slate-900 border-t border-white/10 p-4">
                           <form onSubmit={(e) => { e.preventDefault(); handleSendChat(); }} className="flex relative">
                              <input 
                                type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                                placeholder="Query the AI about counter-strategies or laws..."
                                className="flex-1 bg-slate-800/50 border border-slate-700 rounded-full px-6 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 outline-none transition placeholder-slate-500"
                              />
                              <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} type="submit" disabled={!chatInput.trim() || chatLoading} className="absolute right-2 top-1.5 bottom-1.5 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-500 transition disabled:opacity-50 inline-flex items-center justify-center aspect-square shadow-lg disabled:shadow-none">
                                 <ArrowRight className="w-4 h-4"/>
                              </motion.button>
                           </form>
                        </div>
                    </motion.div>
                 )}
                 </AnimatePresence>

              </div>
           </>
        )}
      </main>

      {/* Hidden Plain-White PDF Template for Exporting visually clean real-world documents */}
      <div className="absolute overflow-hidden h-0 w-0 pointer-events-none">
        <div id="pdf-report-template" className="bg-white text-black p-12 w-[800px] font-sans">
            <div className="border-b-2 border-slate-900 pb-4 mb-8 flex justify-between items-end">
               <div>
                 <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Intelligence Report</h1>
                 <div className="font-bold text-indigo-700 uppercase tracking-widest text-xs mt-2">CONFIDENTIAL & AI-GENERATED // PROOFPILOT</div>
               </div>
               <div className="text-right text-xs font-mono text-slate-500">
                  ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}<br/>
                  DATE: {new Date().toLocaleDateString()}
               </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
               <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg col-span-2">
                 <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Executive Summary</h2>
                 <p className="text-sm text-slate-800 leading-relaxed font-serif">{results?.summary}</p>
               </div>
               <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                 <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Risk Assessment</h2>
                 <div className="text-2xl font-black text-slate-900 mb-1">{results?.severity?.level || 'N/A'}</div>
                 <div className="text-xs text-slate-600">Classification: {results?.classification?.type || 'General'}</div>
                 <div className="text-xs text-slate-600 mt-2 font-bold">Judge Simulation: {results?.judge_simulation?.strength || 'N/A'} Case</div>
               </div>
            </div>

            <h2 className="text-sm font-bold mt-8 mb-4 text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">Extracted Entities</h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {Object.entries(results?.entities || {}).map(([k, v]: any) => (
                <div key={k} className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{k}</span>
                  <span className="block text-sm text-slate-800 font-mono mt-1">{v?.join(', ') || 'None'}</span>
                </div>
              ))}
            </div>

            {results?.timeline && results.timeline.length > 0 && (
              <>
                <h2 className="text-sm font-bold mt-8 mb-4 text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">Event Timeline</h2>
                <div className="mb-8 space-y-3">
                  {results.timeline.map((t: any, i: number) => (
                    <div key={i} className="flex gap-4 text-sm items-start">
                      <div className="w-24 font-bold text-slate-600 font-mono shrink-0">{t.date || 'Unknown'}</div>
                      <div className="text-slate-800">{t.event}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <h2 className="text-sm font-bold mt-8 mb-4 text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">Recommended Strategy Playbook</h2>
            <ul className="text-sm text-slate-800 list-disc pl-5 space-y-2 mb-8 font-serif">
              {Array.isArray(results?.next_steps) 
                ? results?.next_steps.map((n: string, i: number) => <li key={i}>{n}</li>) 
                : <li>{results?.next_steps}</li>}
            </ul>

            <h2 className="text-sm font-bold mt-8 mb-4 text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">Generated Legal Assets</h2>
            <div className="space-y-6">
               <div className="border border-slate-300 rounded-lg overflow-hidden">
                 <div className="bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 uppercase tracking-widest border-b border-slate-300">Draft Complaint Email</div>
                 <div className="p-4 text-xs font-sans whitespace-pre-wrap text-slate-800 leading-relaxed">
                   {results?.complaint_email}
                 </div>
               </div>
               <div className="border border-slate-300 rounded-lg overflow-hidden">
                 <div className="bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 uppercase tracking-widest border-b border-slate-300">Formal Legal Notice</div>
                 <div className="p-4 text-xs font-serif whitespace-pre-wrap text-slate-800 leading-relaxed bg-white">
                   {results?.legal_notice}
                 </div>
               </div>
            </div>

            <div className="mb-10 text-center text-[10px] text-slate-400 pt-10 border-t border-slate-200 mt-12 font-mono uppercase tracking-widest">
               End of Report — ProofPilot Analytics Hub
            </div>
        </div>
      </div>
    </div>
  );
}
