import React from 'react';

const LandingPage = () => {
  const handleLoginChoice = (type) => {
    if (type === 'tpo') {
      // Replace with your navigation logic
      console.log('Navigate to /tpo/login');
    } else if (type === 'admin') {
      // Replace with your navigation logic
      console.log('Navigate to /admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-black opacity-40"></div>
      
      {/* Geometric Patterns */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full animate-bounce opacity-60"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-purple-400 rounded-full animate-bounce delay-300 opacity-60"></div>
      <div className="absolute bottom-32 left-32 w-3 h-3 bg-cyan-400 rounded-full animate-bounce delay-700 opacity-60"></div>
      <div className="absolute bottom-20 right-40 w-5 h-5 bg-pink-400 rounded-full animate-bounce delay-1000 opacity-60"></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-16 max-w-5xl">
          <div className="mb-12">
            {/* Logo with enhanced design */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl">
                <div className="relative">
                  <svg className="w-16 h-16 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8h5" />
                  </svg>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-tight tracking-tight">
              <span className="block bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                Placement
              </span>
              <span className="block text-5xl md:text-7xl bg-gradient-to-r from-blue-200 via-cyan-200 to-indigo-200 bg-clip-text text-transparent font-extrabold">
                Management
              </span>
              <span className="block text-4xl md:text-6xl text-blue-100 font-light tracking-wide">
                Portal
              </span>
            </h1>
            
            <div className="relative">
              <p className="text-xl md:text-2xl text-blue-100/90 font-light max-w-3xl mx-auto leading-relaxed">
                Transform your placement process with our cutting-edge management system
              </p>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-60"></div>
            </div>
            
            <div className="flex items-center justify-center space-x-8 mt-8">
              <div className="flex items-center space-x-2 text-blue-200/80">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live System</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-200/80">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Secure Platform</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-200/80">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Login Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full mb-16">
          {[
            {
              type: 'tpo',
              title: 'TPO Login',
              description: 'Training & Placement Officers can manage student placements, company interactions, and track placement statistics with advanced analytics',
              iconGradient: 'from-blue-400 via-cyan-400 to-blue-500',
              bgGradient: 'from-blue-500/20 to-cyan-500/20',
              borderGradient: 'from-blue-400/50 to-cyan-400/50',
              glowColor: 'shadow-blue-500/20',
            },
            {
              type: 'admin',
              title: 'Admin Login',
              description: 'System administrators can manage user accounts, oversee system operations, and configure platform settings with comprehensive controls',
              iconGradient: 'from-purple-400 via-pink-400 to-purple-500',
              bgGradient: 'from-purple-500/20 to-pink-500/20',
              borderGradient: 'from-purple-400/50 to-pink-400/50',
              glowColor: 'shadow-purple-500/20',
            },
          ].map((card) => (
            <div
              key={card.type}
              onClick={() => handleLoginChoice(card.type)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' ? handleLoginChoice(card.type) : null)}
              className="group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-3 focus:outline-none"
            >
              <div className={`relative bg-gradient-to-br ${card.bgGradient} backdrop-blur-xl rounded-3xl p-8 shadow-2xl ${card.glowColor} border border-white/20 hover:border-white/40 transition-all duration-500 hover:shadow-3xl overflow-hidden`}>
                {/* Card glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${card.borderGradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl blur-xl`}></div>
                
                {/* Content */}
                <div className="relative text-center">
                  <div className={`relative w-20 h-20 mx-auto mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <div className={`absolute inset-0 bg-gradient-to-r ${card.iconGradient} rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-500`}></div>
                    <div className={`relative w-full h-full bg-gradient-to-br ${card.iconGradient} rounded-2xl flex items-center justify-center shadow-xl`}>
                      <svg className="w-10 h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {card.type === 'tpo' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        )}
                      </svg>
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-black text-white mb-4 tracking-tight">{card.title}</h3>
                  <p className="text-blue-100/90 mb-8 leading-relaxed text-lg">{card.description}</p>
                  
                  <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-3 text-blue-200 group-hover:text-white transition-colors duration-300 bg-white/10 group-hover:bg-white/20 rounded-full px-6 py-3 backdrop-blur-sm border border-white/20 group-hover:border-white/40">
                      <span className="font-semibold text-lg">Continue as {card.type.toUpperCase()}</span>
                      <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Features Section */}
        <div className="mt-8 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose Our Platform?</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
            {[
              { 
                title: 'Lightning Fast', 
                desc: 'Ultra-responsive interface with real-time updates and instant notifications',
                icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                gradient: 'from-yellow-400 to-orange-400',
                bgColor: 'from-yellow-500/20 to-orange-500/20'
              },
              { 
                title: 'Smart Analytics', 
                desc: 'AI-powered insights with predictive analytics and comprehensive reporting dashboard',
                icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
                gradient: 'from-green-400 to-emerald-400',
                bgColor: 'from-green-500/20 to-emerald-500/20'
              },
              { 
                title: 'Team Collaboration', 
                desc: 'Seamless communication tools with integrated chat and workflow management',
                icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
                gradient: 'from-purple-400 to-pink-400',
                bgColor: 'from-purple-500/20 to-pink-500/20'
              },
            ].map((feature, index) => (
              <div key={feature.title} className="group hover:scale-105 transition-transform duration-300">
                <div className={`bg-gradient-to-br ${feature.bgColor} backdrop-blur-xl rounded-2xl p-6 border border-white/20 group-hover:border-white/40 transition-all duration-300 shadow-xl group-hover:shadow-2xl h-full`}>
                  <div className={`relative w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-xl blur-lg opacity-60`}></div>
                    <div className={`relative w-full h-full bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                      <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-white font-bold text-xl mb-3 text-center">{feature.title}</h4>
                  <p className="text-blue-200/90 text-center leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl w-full mb-16">
          {[
            { number: '10K+', label: 'Students Placed' },
            { number: '500+', label: 'Partner Companies' },
            { number: '95%', label: 'Success Rate' },
            { number: '24/7', label: 'Support' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white mb-2 bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-blue-200/80 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Enhanced Footer */}
        <footer className="text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-blue-400"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-transparent"></div>
          </div>
          <p className="text-blue-200/70 text-sm font-medium">
            © 2025 Placement Management Portal. All rights reserved.
          </p>
          <p className="text-blue-300/50 text-xs mt-2">
            Empowering careers, connecting futures
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;