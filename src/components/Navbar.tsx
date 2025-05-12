
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Explore Projects", href: "/explore" },
    { name: "About", href: "#about" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glassmorphism py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-8 h-8 rounded-md flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <span className="text-xl font-bold">StartBridge</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <div className="flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  link.href.startsWith("#") 
                    ? "cursor-pointer"
                    : ""
                )}
                onClick={(e) => {
                  if (link.href.startsWith("#")) {
                    e.preventDefault();
                    const element = document.querySelector(link.href);
                    if (element) {
                      element.scrollIntoView({
                        behavior: "smooth",
                      });
                    }
                  }
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center ml-6 space-x-3">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm">Sign Up</Button>
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-4 py-5 bg-background border-t">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm font-medium py-2 transition-colors hover:text-primary"
                  onClick={(e) => {
                    if (link.href.startsWith("#")) {
                      e.preventDefault();
                      setIsMenuOpen(false);
                      const element = document.querySelector(link.href);
                      if (element) {
                        element.scrollIntoView({
                          behavior: "smooth",
                        });
                      }
                    } else {
                      setIsMenuOpen(false);
                    }
                  }}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col pt-2 space-y-3">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
                <Button size="sm">Sign Up</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
