import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Shield, Sparkles, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-cyan-300 flex items-center justify-center shadow-glow">
                <GraduationCap className="w-6 h-6 text-slate-950" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                CampusNumberOne
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              "One Campus. One Platform. Everything Connected." — The all-in-one modern digital operating system unifying students, faculty, clubs, academics, achievements, and events.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" /> 2026 MERN Architecture
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <Shield className="w-3.5 h-3.5" /> High Security JWT
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Campus Modules</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/events" className="hover:text-cyan-400 transition-colors">Events & Hackathons</Link></li>
              <li><Link to="/clubs" className="hover:text-cyan-400 transition-colors">Student Clubs</Link></li>
              <li><Link to="/announcements" className="hover:text-cyan-400 transition-colors">Official Announcements</Link></li>
              <li><Link to="/community" className="hover:text-cyan-400 transition-colors">Social Community Feed</Link></li>
              <li><Link to="/academics" className="hover:text-cyan-400 transition-colors">Course Materials</Link></li>
            </ul>
          </div>

          {/* Student Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Portals</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/achievements" className="hover:text-cyan-400 transition-colors">Student Portfolio</Link></li>
              <li><Link to="/dashboard" className="hover:text-cyan-400 transition-colors">Student Dashboard</Link></li>
              <li><Link to="/faculty" className="hover:text-cyan-400 transition-colors">Faculty Portal</Link></li>
              <li><Link to="/admin" className="hover:text-cyan-400 transition-colors">Admin Console</Link></li>
              <li><Link to="/about" className="hover:text-cyan-400 transition-colors">About & Architecture</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Campus Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs">support@campusnumberone.edu</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs">+1 (555) 019-2026</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">Innovation Complex, Tech Square, Campus City</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 CampusNumberOne. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Engineered with passion for connected campus excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
