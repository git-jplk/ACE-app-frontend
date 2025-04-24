import React, { useState, useEffect, createContext, useContext, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "~/utils/api";

// Context for file upload
export type UploadContextType = {
    file: File | null;
    setFile: (file: File | null) => void;
};
const UploadContext = createContext<UploadContextType>({ file: null, setFile: () => { } });
export const useUpload = () => useContext(UploadContext);

// FileUpload component
export type FileUploadProps = {
    onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
};
const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
    const { file } = useUpload();
    return (
        <label className="block w-full text-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-purple-400 transition">
            {file ? file.name : "Click to upload PDF context"}
            <input type="file" accept="application/pdf" className="hidden" onChange={onFileChange} />
        </label>
    );
};
// Dashboard.tsx

interface CompanyInfo {
    companyName?: string;
    logoUrl?: string;
    founders?: string;
    fundingStage?: string;
    fundingAmount?: string;
    growthRate?: string;
    productStage?: string;
    competitors?: string;
    summary?: string;
}

interface DashboardProps {
    companyInfo?: CompanyInfo;
    scores: Record<string, number>;
    justifications: Record<string, string>;
    logoUrl?: string;
}

const Dashboard: React.FC<DashboardProps> = ({
    companyInfo = {},
    scores,
    justifications,
    logoUrl,
}) => {

    const placeholderLogo = "https://via.placeholder.com/48?text=Logo";

    const metrics = [
        { key: "team_score", label: "Team" },
        { key: "market_score", label: "Market" },
        { key: "product_score", label: "Product" },
        { key: "traction_score", label: "Traction" },
        { key: "risk_score", label: "Risk" },
        { key: "overall_score", label: "Overall" },
    ];

    // If you have comparison data, you can replace 0 with real averages here
    const comparison: Record<string, number> = {
        team_score: 0,
        market_score: 0,
        product_score: 0,
        traction_score: 0,
        risk_score: 0,
        overall_score: 0,
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <img
                    src={logoUrl || placeholderLogo}
                    alt={`${companyInfo.companyName} logo`}
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                    <h2 className="text-2xl font-bold text-purple-600">{companyInfo.companyName}</h2>
                    <p className="text-sm text-gray-600">Founders: {companyInfo.founders}</p>
                </div>
            </div>

            {/* Key Info */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <h4 className="text-xs font-medium text-gray-500">Funding Stage</h4>
                    <p className="mt-1 text-lg font-semibold">{companyInfo.fundingStage}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <h4 className="text-xs font-medium text-gray-500">Funding Amount</h4>
                    <p className="mt-1 text-lg font-semibold">{companyInfo.fundingAmount}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <h4 className="text-xs font-medium text-gray-500">Growth Rate</h4>
                    <p className="mt-1 text-lg font-semibold">{companyInfo.growthRate}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <h4 className="text-xs font-medium text-gray-500">Product Stage</h4>
                    <p className="mt-1 text-lg font-semibold">{companyInfo.productStage}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <h4 className="text-xs font-medium text-gray-500">Competitors</h4>
                    <p className="mt-1 text-lg font-semibold">companyInfo.{companyInfo.competitors}</p>
                </div>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {metrics.map(({ key, label }) => {
                    const score = scores[key] ?? 0;
                    const avg = comparison[key] ?? 0;
                    const isOverall = key === "overall_score";
                    const spanClass = isOverall
                        ? "col-span-1 md:col-span-2 lg:col-span-3"
                        : "";
                    return (
                        <div
                            key={key}
                            className={`${spanClass} bg-white p-4 rounded-xl shadow-md`}
                        >
                            <h3 className="text-lg font-semibold text-purple-600 mb-2">
                                {label} Score: {score}
                            </h3>
                            {/* Your existing bar chart code */}
                            <div className="space-y-2 mb-2">
                                {/* You */}
                                <div className="flex justify-between text-sm">
                                    <span>You</span>
                                    <span>{score}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-purple-600 h-3 rounded-full"
                                        style={{ width: `${(score / 10) * 100}%` }}
                                    />
                                </div>
                                {/* Average */}
                                <div className="flex justify-between text-sm">
                                    <span>Average</span>
                                    <span>{avg}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-gray-400 h-3 rounded-full"
                                        style={{ width: `${(avg / 10) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <details className="mt-2">
                                <summary className="cursor-pointer text-sm text-gray-700">
                                    Justification
                                </summary>
                                <p className="mt-1 text-sm text-gray-600">
                                    {justifications[key] ?? "No justification provided."}
                                </p>
                            </details>
                        </div>
                    );
                })}
            </div>

            {/* Executive Summary */}
            <div className="bg-white p-4 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-purple-600 mb-2">
                    Executive Summary
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">{companyInfo.summary}</p>
            </div>
        </div>
    );
};


const LoadingScreen: React.FC = () => {
    const tooltips = [
        "Leverage your network: attend industry meetups and demo days to discover promising startups early.",
        "Validate the problem: ensure the startup is solving a real pain point before diving in deeper.",
        "Perform competitive analysis: map out the landscape to spot the next unicorn in the making.",
        "Track funding rounds: follow platforms like Crunchbase or AngelList to see which startups are raising capital.",
        "Use social listening: monitor Twitter and LinkedIn for chatter around emerging companies.",
        "Evaluate the team: look for founders with proven track records and complementary skill sets.",
        "Assess market size: big markets breed unicorns—seek startups tackling billion-dollar industries.",
        "Check traction metrics: monthly active users, revenue growth, and churn rates reveal true momentum.",
        "Dive into product demos: hands-on trials uncover which solutions have that magical unicorn spark.",
        "Stay curious: subscribe to newsletters like TechCrunch or Product Hunt to spot early-stage gems.",
        "Network with investors: angel and VC communities often share insider tips on potential unicorns.",
        "Monitor exit activity: acquisitions and IPO filings can signal which startups might join the unicorn club.",
        "Encourage feedback loops: maintain open communication channels with founders to help their growth.",
        "Scale sensibly: advise startups to balance rapid growth with operational stability to avoid flaming out.",
        "Celebrate milestones: recognizing progress—no matter how small—can keep teams motivated toward unicorn status."
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(i => (i + 1) % tooltips.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            {/* Spinner + rings wrapper */}
            <div className="relative w-40 h-40">
                {/* Rotating rings */}
                <motion.div
                    className="absolute inset-0 border-2 border-purple-300 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                    className="absolute inset-4 border-2 border-purple-400 rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />

                {/* Main spinner */}
                <motion.div
                    className="absolute inset-8 border-8 border-purple-600 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Tooltip below spinner */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="absolute bottom-[-2.5rem] left-1/2 transform -translate-x-1/2"
                    >
                        <div className="bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg text-sm whitespace-nowrap">
                            {tooltips[index]}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};


interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}
const SidebarChat: React.FC<{ score: any, onClose: () => void }> = ({ score, onClose }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    // Mutation hook for llm chat (logic to be provided)
    const chatMutation = api.analyze.chat.useMutation({
        onSuccess: (data) => {
            const assistantMsg: ChatMessage = { role: 'assistant', content: data.result };
            setMessages(prev => [...prev, assistantMsg]);
        },
        onError: () => {
            const errorMsg: ChatMessage = { role: 'assistant', content: 'Error occurred. Please try again.' };
            setMessages(prev => [...prev, errorMsg]);
        },
    });

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        chatMutation.mutate({ message: input, context: score }); // context to be defined
        setInput('');
    };

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg flex flex-col"
        >
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Chat with LLM</h2>
                <button onClick={onClose} aria-label="Close Sidebar" className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`p-2 rounded-lg ${msg.role === 'user' ? 'bg-purple-100 self-end' : 'bg-gray-100 self-start'}`}>
                        {msg.content}
                    </div>
                ))}
                {chatMutation.status === 'pending' && <div className="text-sm text-gray-500">LLM is typing...</div>}
            </div>
            <div className="p-4 border-t flex">
                <input
                    type="text"
                    className="flex-1 border rounded-lg p-2 mr-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Send
                </button>
            </div>
        </motion.div>
    );
};

// Main App component
const App: React.FC = () => {
    const [view, setView] = useState<'landing' | 'chat' | 'loading' | 'result'>('landing');
    const [message, setMessage] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [pdfText, setPdfText] = useState<string>('');
    const [resultData, setResultData] = useState<any>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const parser = api.pdf.extract.useMutation();

    const chatSend = api.analyze.analyze.useMutation({
        onSuccess: (data) => {
            setResultData(data.result);
            setView('result');
        },
        onError: () => setView('chat'),
    });

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] || null;
        if (!selected) return;
        setFile(selected);
        try {
            const base64 = await new Promise<string>((res, rej) => {
                const reader = new FileReader();
                reader.onload = () => {
                    if (typeof reader.result === 'string') res(reader.result.split(',')[1] || '');
                    else rej(new Error('Unable to read file'));
                };
                reader.onerror = (err) => rej(err);
                reader.readAsDataURL(selected);
            });
            const { text } = await parser.mutateAsync({ base64 });
            setPdfText(text);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStart = () => setView('chat');
    const handleLaunch = async () => {
        if (!message) return;
        setView('loading');
        const prompt = `You are a competent Analyst that scouts for startup companies. Evaluate ${message} and return a JSON with 'result' object containing scores, justifications, and summary. Use this context: ${pdfText} REMEMBER, the company is ${message}, it might be called different in the context, please ignore that.`;
        try {
            await chatSend.mutateAsync({ message: prompt });
        } catch { }
    };
    const handleGoBack = () => setView('chat');

    return (
        <>
            {view === 'loading' ? (
                <LoadingScreen />
            ) : view === 'landing' ? (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                    <img src="/logo.png" alt="Logo" className="" />
                    <motion.h1
                        className="text-6xl font-extrabold text-white mb-8"
                        animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Smarter startup evaluations, powered by AI.
                    </motion.h1>
                    <button
                        onClick={handleStart}
                        className="px-6 py-3 bg-white font-semibold rounded-lg hover:bg-gray-100 transition"
                    >
                        start
                    </button>
                </div>
            ) : view === 'chat' ? (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                    <img src="/logo.png" alt="Logo" className="mb-6" />
                    <UploadContext.Provider value={{ file, setFile }}>
                        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl">
                            <h1 className="text-3xl font-bold text-center mb-6 text-purple-600">
                                Enter the Companies Name
                            </h1>
                            <textarea
                                className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                rows={4}
                                placeholder="Type your message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <h2 className="text-lg font-semibold mb-2 text-purple-600">You can also upload additional information.</h2>
                            <FileUpload onFileChange={handleFileChange} />
                            {pdfText && (
                                <textarea
                                    className="w-full h-40 mt-4 p-2 border rounded-lg bg-gray-50"
                                    readOnly
                                    value={pdfText}
                                />
                            )}
                            <button
                                onClick={handleLaunch}
                                className="w-full mt-4 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
                            >
                                Launch 🚀
                            </button>
                        </div>
                    </UploadContext.Provider>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8">
                    <div className="w-full max-w-5xl bg-white p-6 rounded-2xl shadow-lg relative">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="absolute top-4 right-4 text-purple-600 hover:underline"
                        >
                            Open Chat
                        </button>
                        <button
                            onClick={handleGoBack}
                            className="mb-6 text-purple-600 font-semibold hover:underline"
                        >
                            &larr; Go Back
                        </button>

                        <Dashboard
                            scores={resultData}
                            justifications={resultData.justifications}
                            companyInfo={resultData.companyInfo}
                        />
                    </div>
                    <AnimatePresence>
                        {sidebarOpen && <SidebarChat score={resultData} onClose={() => setSidebarOpen(false)} />}
                    </AnimatePresence>
                </div>

            )}
        </>
    );
};

export default App;
