import React from 'react';
import { Link } from 'react-router-dom';
import { Wand2, FileText, MessageSquare, ArrowRight, CheckCircle, Zap, Target, Users, Github } from 'lucide-react';
import gradelyLogo from '../assets/gradely-images/gradely-logo.png';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            
            {/* Logo with Gradely text - CENTERED and SMALLER */}
            <img 
              src={gradelyLogo} 
              alt="Gradely Logo" 
              className="w-8 h-8 object-contain"
            />

            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Gradely
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              How it Works
            </a>
            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Log In
            </Link>
            <Link to="/signup" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-200 transform hover:scale-105">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Zap size={16} />
              AI-Powered Writing Assistant
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-blue-800 bg-clip-text text-transparent">
                Transform Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Writing Forever
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-12 leading-relaxed">
              Get instant, intelligent feedback that elevates your essays and writing skills. 
              Stop second-guessing your work and start writing with confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link to="/signup" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2">
                Get Started
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8">
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="ml-4 text-gray-500 text-sm">essay-feedback.gradely.ai</span>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-4/5"></div>
                  <div className="h-4 bg-blue-100 rounded w-3/4 relative">
                    <div className="absolute -right-2 -top-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Great flow!
                    </div>
                  </div>
                  <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  <div className="h-4 bg-green-100 rounded w-2/3 relative">
                    <div className="absolute -right-2 -top-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                      Strong argument
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to write better
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful AI tools designed to help you improve your writing and build confidence in your essays.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group">
              <div className="bg-white rounded-2xl p-8 hover:bg-gray-50 transition-all duration-300 transform group-hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Wand2 size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Instant AI Feedback</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Get comprehensive feedback on grammar, structure, clarity, and argument strength within seconds of uploading your essay.
                </p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                  Learn more <ArrowRight size={16} />
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group">
              <div className="bg-white rounded-2xl p-8 hover:bg-gray-50 transition-all duration-300 transform group-hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                  <FileText size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Smart Organization</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Keep all your essays, feedback, and improvements organized in one intuitive dashboard. Track your writing progress over time.
                </p>
                <div className="flex items-center text-green-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                  Learn more <ArrowRight size={16} />
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group">
              <div className="bg-white rounded-2xl p-8 hover:bg-gray-50 transition-all duration-300 transform group-hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <MessageSquare size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Interactive AI Chat</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Ask specific questions about your feedback and get detailed explanations to understand exactly how to improve your writing.
                </p>
                <div className="flex items-center text-purple-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                  Learn more <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Start improving in 3 simple steps
            </h2>
            <p className="text-xl text-gray-600">
              From upload to improvement, we make it effortless
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Upload Your Essay</h3>
              <p className="text-gray-600 leading-relaxed">
                Simply drag and drop your essay or paste your text. We support all common formats.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Get AI Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Our advanced AI analyzes your writing and provides detailed, actionable feedback in seconds.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Improve & Excel</h3>
              <p className="text-gray-600 leading-relaxed">
                Apply the feedback, chat with our AI for clarifications, and watch your writing skills soar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why students choose Gradely
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Transform your writing skills with personalized AI feedback designed to help you succeed.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle size={16} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Instant Results</h4>
                    <p className="text-gray-600">Get feedback in seconds, not days. Perfect for tight deadlines and quick improvements.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Target size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Personalized Learning</h4>
                    <p className="text-gray-600">AI adapts to your writing style and provides targeted suggestions for continuous improvement.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Educational Support</h4>
                    <p className="text-gray-600">Designed with educators in mind to complement classroom learning and writing development.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl p-8">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">Better Writing</div>
                  <p className="text-gray-600">Starts here</p>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">Instant</div>
                    <p className="text-gray-600 text-sm">AI feedback</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">Smart</div>
                    <p className="text-gray-600 text-sm">Organization</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spotlight Feature Section with Glassmorphism */}
      <section className="py-20 bg-gradient-to-br from-blue-900/30 to-indigo-900/40 relative overflow-hidden">
        {/* Glassmorphism background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100/80 backdrop-blur-sm text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-blue-200/30">
              <Zap size={16} />
              New Feature
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Introducing Smart Grammar
              <span className="block bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Correction
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Experience our AI-powered grammar correction feature that instantly identifies and fixes errors while you type, making your writing flawless in real-time.
            </p>
          </div>

          {/* Feature mockup with glassmorphism */}
          <div className="relative max-w-4xl mx-auto mb-16">
            <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/40">
                {/* Browser-like header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200/50">
                  <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                  <span className="ml-4 text-gray-600 text-sm font-medium">Write a New Essay</span>
                </div>

                {/* Essay form mockup */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-800 text-sm font-semibold mb-2">Essay Title *</label>
                    <div className="bg-white/90 border-2 border-gray-300 rounded-lg p-3 shadow-sm">
                      <span className="text-gray-900 font-medium">The Impact of Technology on Education</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-gray-800 text-sm font-semibold">Essay Content *</label>
                      <button className="flex items-center gap-2 bg-blue-200/80 hover:bg-blue-300/80 text-blue-800 px-3 py-1.5 rounded-lg text-sm font-medium transition-all backdrop-blur-sm border border-blue-300/30">
                        <Wand2 size={14} />
                        Correct Grammar
                      </button>
                    </div>
                    <div className="bg-white/90 border-2 border-gray-300 rounded-lg p-4 min-h-32 shadow-sm">
                      <div className="space-y-3">
                        <p className="text-gray-800 leading-relaxed">
                          Technology has <span className="bg-blue-200 text-blue-900 px-1 rounded">revolutionized</span> the way we approach education in the 21st century.
                        </p>
                        <p className="text-gray-800 leading-relaxed">
                          Students now have access to <span className="bg-green-200 text-green-900 px-1 rounded">unprecedented</span> learning resources online.
                        </p>
                        <div className="relative inline-block">
                          <span className="bg-yellow-200 text-yellow-900 px-1 rounded">This transformation</span>
                          <div className="absolute -top-8 left-0 bg-gray-900/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap border border-gray-700">
                            ✨ Grammar improved!
                          </div>
                        </div>
                        <span className="text-gray-800"> has made learning more accessible than ever before.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-indigo-700">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to improve your writing?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Start your journey toward better writing with AI-powered feedback and personalized learning.
          </p>
          <Link to="/signup" className="bg-white hover:bg-gray-100 text-blue-700 px-8 py-4 rounded-full font-bold text-lg transition-all duration-200 transform hover:scale-105 inline-flex items-center gap-2">
            Get Started
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={gradelyLogo}
                  alt="Gradely Logo"
                  className="w-8 h-8 object-contain"
                />

                <span className="text-2xl font-bold text-white">Gradely</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering students worldwide with AI-powered writing feedback and improvement tools.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <div className="space-y-2">
                <a href="#" className="block hover:text-white transition-colors">Features</a>
                <a href="#" className="block hover:text-white transition-colors">Pricing</a>
                <a href="#" className="block hover:text-white transition-colors">API</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block hover:text-white transition-colors">About</a>
                <a href="#" className="block hover:text-white transition-colors">Blog</a>
                <a href="#" className="block hover:text-white transition-colors">Careers</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block hover:text-white transition-colors">Help Center</a>
                <a href="#" className="block hover:text-white transition-colors">Contact</a>
                <a href="#" className="block hover:text-white transition-colors">Privacy</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex justify-between items-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Gradely. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Created by</span>
              <a 
                href="https://github.com/Jedyviageiro" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <Github size={16} />
                <span className="text-sm font-medium">Jedyviageiro</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;