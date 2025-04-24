import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export const LoadingScreen: React.FC = () => {
    const tooltips = [
        "attend industry meetups and demo days to discover promising startups early.",
        "ensure the startup is solving a real pain point before diving in deeper.",
        "map out the landscape to spot the next unicorn in the making.",
        "follow platforms like Crunchbase or AngelList to see which startups are raising capital.",
        "monitor Twitter and LinkedIn for chatter around emerging companies.",
        "look for founders with proven track records and complementary skill sets.",
        "big markets breed unicorns—seek startups tackling billion-dollar industries.",
        "monthly active users, revenue growth, and churn rates reveal true momentum.",
        "hands-on trials uncover which solutions have that magical unicorn spark.",
        "subscribe to newsletters like TechCrunch or Product Hunt to spot early-stage gems.",
        "angel and VC communities often share insider tips on potential unicorns.",
        "acquisitions and IPO filings can signal which startups might join the unicorn club.",
        "maintain open communication channels with founders to help their growth.",
        "advise startups to balance rapid growth with operational stability to avoid flaming out.",
        "recognizing progress—no matter how small—can keep teams motivated toward unicorn status."
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
                        transition={{ duration: 0.7, ease: 'easeInOut' }}
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