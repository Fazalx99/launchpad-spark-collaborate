
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/UserMenu";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">StartBridge</Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden ml-10 space-x-8 md:flex">
              <Link to="/" className="text-gray-600 hover:text-gray-900 hover:underline underline-offset-4">
                Home
              </Link>
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 hover:underline underline-offset-4">
                Dashboard
              </Link>
              <Link to="/explore" className="text-gray-600 hover:text-gray-900 hover:underline underline-offset-4">
                Explore
              </Link>
            </nav>
          </div>
          
          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <UserMenu />
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/explore"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Explore
          </Link>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-3">
              <UserMenu />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
