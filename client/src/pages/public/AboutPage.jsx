import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Shield,
  Zap,
  Layers,
  Users,
  CheckCircle2,
  Code2,
  Database,
  Cpu,
  Globe,
} from 'lucide-react';

export const AboutPage = () => {
  const stack = [
    { name: 'React 18 & Vite', desc: 'Blazing fast frontend rendering with modern Hooks and modular architecture.', icon: Code2 },
    { name: 'Node.js & Express', desc: 'RESTful API endpoints with robust route guards and rate limiters.', icon: Cpu },
    { name: 'MongoDB & Mongoose', desc: 'Flexible NoSQL document models with relational references and indexed lookups.', icon: Database },
    { name: 'Socket.IO Real-time', desc: 'Live bi-directional WebSocket alerts for instant campus communication.', icon: Globe },
    { name: 'Tailwind CSS', desc: 'Modern responsive design with dark navy glassmorphism aesthetic.', icon: Layers },
    { name: 'JWT & bcrypt', desc: 'Role-based access control and high-security encrypted credentials.', icon: Shield },
  ];

  return (
    <div className="bg-slate-900 text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-400">
            About CampusNumberOne
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            The Digital Operating System for Modern Universities
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            CampusNumberOne bridges the fragmentation in university life by bringing student organizations, faculty administration, academic records, achievements, and events into a single unified workspace.
          </p>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Our Vision</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              To empower universities worldwide with an intuitive, unified, and collaborative digital experience where no student misses an opportunity, no event goes unnoticed, and academic collaboration happens effortlessly.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Built for Everyone</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Designed specifically with three first-class user roles: empowering Students to discover and build portfolios, helping Faculty publish course materials and grade assignments, and providing Admins complete institutional oversight.
            </p>
          </div>
        </div>

        {/* Tech Stack Grid */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">
              Engineering Architecture
            </h2>
            <p className="text-2xl font-bold text-white">Full-Stack MERN Architecture</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stack.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-700 text-cyan-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">{item.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900/60 to-cyan-950/60 border border-slate-700 text-center space-y-6">
          <h2 className="text-2xl font-bold text-white">Ready to join your campus network?</h2>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow transition-all"
            >
              Get Started Now
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
