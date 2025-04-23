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

// Dashboard component
interface DashboardProps {
    scores: Record<string, any>;
    justifications: Record<string, string>;
}
const Dashboard: React.FC<DashboardProps> = ({ scores, justifications }) => {
    const logo = api.logo.fetchLogo.useQuery({ companyName: "Uber" }, { enabled: false });
    const comparison: Record<string, number> = {
        market_score: 6,
        overall_score: 7,
        product_score: 7.5,
        risk_score: 5,
        team_score: 7,
        traction_score: 6,
    };

    const metrics = [
        { key: 'market_score', label: 'Market' },
        { key: 'overall_score', label: 'Overall' },
        { key: 'product_score', label: 'Product' },
        { key: 'risk_score', label: 'Risk' },
        { key: 'team_score', label: 'Team' },
        { key: 'traction_score', label: 'Traction' },
    ];

    return (
        <div>
            <div className="flex justify-end items-center mb-4">
                {logo.data && (
                    <img
                        src={logo.data?.logoUrl}
                        alt="Company Logo"
                        className="w-12 h-12 rounded-full mr-2"
                    />
                )}
                <h2 className="text-xl font-bold text-purple-600">{false || "Company"}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {metrics.map(({ key, label }) => {
                    const score = scores[key] || 0;
                    const comp = comparison[key] || 0;
                    return (
                        <div key={key} className="bg-white p-4 rounded-xl shadow-md">
                            <h3 className="text-lg font-semibold mb-2 text-purple-600">
                                {label} Score: {score}
                            </h3>
                            <div className="space-y-1 mb-2">
                                <div className="flex justify-between text-sm mb-1">
                                    <span>You</span><span>{score}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-purple-600 h-3 rounded-full"
                                        style={{ width: `${(score / 10) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-sm mt-2 mb-1">
                                    <span>Average</span><span>{comp}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-gray-400 h-3 rounded-full"
                                        style={{ width: `${(comp / 10) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <details className="mt-2">
                                <summary className="cursor-pointer text-sm text-gray-700">Justification</summary>
                                <p className="mt-1 text-sm text-gray-600">
                                    {justifications[key]
                                        ? justifications[key]
                                        : "No justification provided."}
                                </p>
                            </details>
                        </div>
                    );
                })}
                <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-4 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-purple-600 mb-2">
                        Executive Summary
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                        {scores.summary || 'No summary available.'}
                    </p>
                </div>
            </div>
        </div>
    );

};

// LoadingScreen component with sexy animations and tooltips
const LoadingScreen: React.FC = () => {
    const tooltips = [
        "Analyzing data...",
        "Crunching numbers...",
        "Evaluating risk...",
        "Polishing insights...",
    ];
    const positions: React.CSSProperties[] = [
        { top: '-32px', left: '50%', transform: 'translateX(-50%)' },
        { top: '50%', right: '-160px', transform: 'translateY(-50%)' },
        { bottom: '-32px', left: '50%', transform: 'translateX(-50%)' },
        { top: '50%', left: '-160px', transform: 'translateY(-50%)' },
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((i) => (i + 1) % tooltips.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 to-purple-50">
            {/* Rotating rings */}
            <motion.div
                className="absolute w-40 h-40 border-2 border-purple-300 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
                className="absolute w-32 h-32 border-2 border-purple-400 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />

            {/* Main spinner */}
            <motion.div
                className="relative w-20 h-20 border-8 border-purple-600 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Tooltip messages */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                    className="absolute"
                    style={positions[index]}
                >
                    <div className="bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg text-sm">
                        {tooltips[index]}
                    </div>
                </motion.div>
            </AnimatePresence>
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
        const prompt = `You are a competent Analyst that scouts for startup companies. Evaluate ${message} and return a JSON with 'result' object containing scores, justifications, and summary. Use this context: ${pdfText}`;
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
                    <motion.h1
                        className="text-6xl font-extrabold text-white mb-8"
                        animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Startups made easy
                    </motion.h1>
                    <button
                        onClick={handleStart}
                        className="px-6 py-3 bg-white font-semibold rounded-lg hover:bg-gray-100 transition"
                    >
                        start
                    </button>
                </div>
            ) : view === 'chat' ? (
                <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                    <UploadContext.Provider value={{ file, setFile }}>
                        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl">
                            <h1 className="text-3xl font-bold text-center mb-6 text-purple-600">
                                🤖 Startup Chat
                            </h1>
                            <textarea
                                className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                rows={4}
                                placeholder="Type your message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
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
