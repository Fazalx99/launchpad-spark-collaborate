
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-8 h-8 rounded-md flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="text-xl font-bold">StartBridge</span>
            </Link>
            <p className="text-gray-600 mb-4">
              Connecting innovators to build the next generation of startups together.
            </p>
            <div className="flex space-x-4">
              {["#", "#", "#", "#"].map((link, i) => (
                <a 
                  key={i} 
                  href={link} 
                  className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <span className="sr-only">Social media</span>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              {["Dashboard", "Explore Projects", "My Projects", "Applications"].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-gray-600 hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {["Blog", "Guide", "Help Center", "FAQ"].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-gray-600 hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {["About", "Careers", "Privacy", "Terms"].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-gray-600 hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} StartBridge. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="#" className="text-gray-500 hover:text-primary text-sm">
              Privacy Policy
            </Link>
            <Link to="#" className="text-gray-500 hover:text-primary text-sm">
              Terms of Service
            </Link>
            <Link to="#" className="text-gray-500 hover:text-primary text-sm">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
