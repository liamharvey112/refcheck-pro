import { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useToast } from './contexts/ToastContext';
import { AnalyseView } from './views/AnalyseView';
import { HistoryView } from './views/HistoryView';
import { Navbar } from './components/layout/Navbar';
import { ErrorBoundary } from './components/feedback/ErrorBoundary';
import { Spinner } from './components/ui/Spinner';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

type Page = 'analyse' | 'history';

function AppContent() {
    const { loading, isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const [currentPage, setCurrentPage] = useState<Page>('analyse');
    const [hasShownWelcome, setHasShownWelcome] = useState(false);

     useEffect(() => {
        if (isAuthenticated && !hasShownWelcome) {
            showToast('Welcome to RefCheck Pro! 🚀', 'success');
            setHasShownWelcome(true);
        }
    }, [isAuthenticated, showToast, hasShownWelcome]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
            <div className="py-6">
                <ErrorBoundary>
                    {isAuthenticated ? (
                        currentPage === 'analyse' ? <AnalyseView /> : <HistoryView />
                    ) : (
                        <div className="max-w-md mx-auto mt-20 p-6 bg-white border border-gray-200 rounded-lg shadow-sm text-center">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to RefCheck Pro</h2>
                            <p className="text-gray-600">Sign in with Google to start analyzing candidates.</p>
                        </div>
                    )}
                </ErrorBoundary>
            </div>
        </div>
    );
}

function App() {
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center text-red-600">
                    <h1 className="text-2xl font-bold">Configuration Error</h1>
                    <p>Please set VITE_GOOGLE_CLIENT_ID in your .env file</p>
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <AuthProvider>
                    <AppContent />
                </AuthProvider>
            </GoogleOAuthProvider>
        </ErrorBoundary>
    );
}

export default App;