interface CompanyInfo {
    company_name?: string;
    founder_name?: string;
    funding_stage?: string;
    funding_amount?: string;
    growth_rate?: string;
    product_stage?: string;
    competitors?: string;
}
interface Scores {
    market_score?: number;
    product_score?: number;
    traction_score?: number;
    risk_score?: number;
    overall_score?: number;
    team_score?: number;
    summary?: string;
}

interface DashboardProps {
    companyInfo?: CompanyInfo;
    scores: Scores,
    justifications: Record<string, string>;
    logoUrl?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
    companyInfo = {},
    scores,
    justifications,
    logoUrl = "https://via.placeholder.com/48?text=Logo"
}) => {


    const metrics = [
        { key: "overall_score", label: "Overall", value: scores.overall_score ?? 0 },
        { key: "market_score", label: "Market", value: scores.market_score ?? 0 },
        { key: "product_score", label: "Product", value: scores.product_score ?? 0 },
        { key: "traction_score", label: "Traction", value: scores.traction_score ?? 0 },
        { key: "risk_score", label: "Risk", value: scores.risk_score ?? 0 },
        { key: "team_score", label: "Team", value: scores.team_score ?? 0 },
    ];

    // If you have comparison data, you can replace 0 with real averages here
    const comparison: Record<string, number> = {
        team_score: 6,
        market_score: 5,
        product_score: 6,
        traction_score: 7,
        risk_score: 4,
        overall_score: 6,
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <img
                    src={logoUrl || "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/company-logo-design-template-19959eda128d9fff1d1f7785460e3a73_screen.jpg?ts=1676285899"}
                    alt={`${companyInfo.company_name || "Company"} logo`}
                    className="w-50 h-50 rounded-full"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/company-logo-design-template-19959eda128d9fff1d1f7785460e3a73_screen.jpg?ts=1676285899";
                    }}
                />
            </div>



            {/* Key Info */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <h4 className="text-xs font-medium text-gray-500">Funding Stage</h4>
                    <p className="mt-1 text-lg font-semibold">{companyInfo.funding_stage}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <h4 className="text-xs font-medium text-gray-500">Funding Amount</h4>
                    <p className="mt-1 text-lg font-semibold">{companyInfo.funding_amount}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <h4 className="text-xs font-medium text-gray-500">Growth Rate</h4>
                    <p className="mt-1 text-lg font-semibold">{companyInfo.growth_rate}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <h4 className="text-xs font-medium text-gray-500">Product Stage</h4>
                    <p className="mt-1 text-lg font-semibold">{companyInfo.product_stage ?? ""}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <h4 className="text-xs font-medium text-gray-500">Competitors</h4>
                    <p className="mt-1 text-lg font-semibold">{companyInfo.competitors}</p>
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-purple-600 mb-2">
                    Executive Summary
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">{scores.summary}</p>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {metrics.map(({ key, label, value }) => {
                    const score = value
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

        </div>
    );
};

