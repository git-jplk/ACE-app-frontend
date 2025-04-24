import React, { useState, useEffect, createContext, useContext, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "~/utils/api";
import { ReactSVG } from 'react-svg';
import { Dashboard } from "~/elements/Dashboard";
import { LoadingScreen } from "~/elements/LoadingScreen";
import { SidebarChat } from "~/elements/SidebarChat";
// Context for file upload
export type UploadContextType = {
    file: File | null;
    setFile: (file: File | null) => void;
};
const UploadContext = createContext<UploadContextType>({ file: null, setFile: () => { } });
export const useUpload = () => useContext(UploadContext);

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
                            scores={{
                                market_score: resultData?.market_score ?? 0,
                                product_score: resultData?.product_score ?? 0,
                                traction_score: resultData?.traction_score ?? 0,
                                risk_score: resultData?.risk_score ?? 0,
                                overall_score: resultData?.overall_score ?? 0,
                                team_score: resultData?.team_score ?? 0,
                                summary: resultData?.summary ?? "",
                            }}
                            justifications={resultData.justifications}
                            companyInfo={resultData.company_info}
                            logoUrl={resultData.logo_url}
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
