interface Tab {
    id: string;
    label: string;
    content?: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    children?: React.ReactNode;
}

export const Tabs = ({ tabs, activeTab, onTabChange, children }: TabsProps) => {
    return (
        <div>
            <div className="border-b border-gray-200">
                <nav className="flex gap-4" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                                px-4 py-2 text-sm font-medium border-b-2 transition-colors
                                ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="mt-4">
                {children || tabs.find(tab => tab.id === activeTab)?.content}
            </div>
        </div>
    );
};