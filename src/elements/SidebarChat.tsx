import { motion } from "framer-motion";
import { useState } from "react";
import { api } from "~/utils/api";


interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}
export const SidebarChat: React.FC<{ score: any, onClose: () => void }> = ({ score, onClose }) => {
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