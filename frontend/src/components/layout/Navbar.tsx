import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

interface NavbarProps {
    currentPage: 'analyse' | 'history';
    onPageChange: (page: 'analyse' | 'history') => void;
}

export const Navbar = ({ currentPage, onPageChange }: NavbarProps) => {
    const { user, logout, isAuthenticated, login } = useAuth();

    if (!isAuthenticated) {
        return (
            <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">RefCheck Pro</h1>
                    <Button onClick={login}>
                        Sign in with Google
                    </Button>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">RefCheck Pro</h1>
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <Button
                            variant={currentPage === 'analyse' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => onPageChange('analyse')}
                        >
                            Analyse
                        </Button>
                        <Button
                            variant={currentPage === 'history' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => onPageChange('history')}
                        >
                            History
                        </Button>
                    </div>
                    {user?.avatarUrl && (
                        <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
                    )}
                    <span className="text-gray-700 hidden sm:inline">{user?.name}</span>
                    <Button variant="danger" size="sm" onClick={logout}>
                        Logout
                    </Button>
                </div>
            </div>
        </nav>
    );
};