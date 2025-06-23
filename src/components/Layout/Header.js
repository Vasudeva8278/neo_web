import React from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { MdArrowDropDown } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import photo from "../../Assets/photo.png";


const Header = ({ user }) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(false);
    const navigate = useNavigate();

    // Detect mobile (optional, you can use a library or context for this)
    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

     const handleProfileClick = () => {
    navigate("/profile");
  };

    return (
        <header className="bg-white shadow-sm border-b border-gray-100 top-0 z-50">
            <div className="p-2 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <div className="text-2xl font-bold text-indigo-600">NEO TEMPLATES</div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <div className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 cursor-pointer transition-colors">
                            <span className="font-medium">Generate</span>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                        <div className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 cursor-pointer transition-colors">
                            <span className="font-medium">Business</span>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                        <div className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 cursor-pointer transition-colors">
                            <span className="font-medium">Plans and Pricing</span>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                        <div className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 cursor-pointer transition-colors">
                            <span className="font-medium">Learn</span>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </nav>

                    {/* Desktop Auth/Profile */}
                    <div className="hidden md:flex items-center space-x-4">
                        {!user ? (
                            <>
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                                    Create Account
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    Log in
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center space-x-2 cursor-pointer" onClick={handleProfileClick}>
                                <img
                                    src={user?.profilePic || photo}
                                    alt="Profile"
                                    className="rounded-full w-12 h-12 border-2 border-transparent hover:border-blue-400 transition-colors duration-200"
                                />
                                <div className="text-center text-gray-800">
                                    <div className="text-sm font-semibold truncate w-full px-1">{user.name}</div>
                                </div>
                                <MdArrowDropDown className="w-6 h-6 mt-2 text-gray-600" />
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-100 py-4">
                        <div className="flex flex-col space-y-4">
                            {!user ? (
                                <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
                                    <button onClick={() => navigate('/signup')} className="text-gray-700 font-medium text-left">
                                        Create Account
                                    </button>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium"
                                    >
                                        Log in
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2 cursor-pointer" onClick={handleProfileClick}>
                                    <img
                                        src={user?.profilePic || photo}
                                        alt="Profile"
                                        className="rounded-full w-6 h-6 border-2 border-transparent hover:border-blue-400 transition-colors duration-200"
                                         onClick={handleProfileClick}
                                    />
                                    <div className="text-center text-gray-800">
                                        <div className="text-sm font-semibold truncate w-full px-1">{user.name}</div>
                                    </div>
                                    <MdArrowDropDown className="w-6 h-6 mt-2 text-gray-600" />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;