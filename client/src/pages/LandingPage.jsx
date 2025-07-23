import React from 'react';
import { Link } from 'react-router-dom';
import { Wand2, FileText, MessageSquare, ArrowRight, CheckCircle, Zap, Target, Users, Github, Star } from 'lucide-react';
import gradelyLogo from '../assets/gradely-images/gradely-logo.png';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center max-w-7xl">
          <div className="flex items-center gap-3">
            <img src={gradelyLogo} alt="Gradely Logo" className="w-8 h-8 object-contain" />
            <span className="text-2xl font-normal text-gray-700">
              Gradely
            </span>
          </div>
          <nav className="flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-800 font-normal transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-800 font-normal transition-colors">
              How it Works
            </a>
            <Link to="/login" className="text-gray-600 hover:text-gray-800 font-normal transition-colors">
              Sign in
            </Link>
            <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-normal mb-6 leading-tight text-gray-800">
            Make your writing
            <br />
            <span className="text-blue-600">shine</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-8 font-normal leading-relaxed">
            Get instant, intelligent feedback that helps you write better essays. 
            Simple, fast, and designed to help you succeed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition-colors flex items-center gap-2">
              Get started
            </Link>
            <a href="#features" className="text-blue-600 hover:text-blue-700 px-8 py-3 font-medium transition-colors">
              Learn more
            </a>
          </div>

          {/* Hero Visual - Clean Google-style */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="ml-4 text-gray-500 text-sm">essay.gradely.com</span>
                </div>
                <div className="text-left space-y-4">
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                  <div className="h-3 bg-gray-100 rounded w-4/5"></div>
                  <div className="h-3 bg-blue-50 rounded w-3/4 relative">
                    <div className="absolute -right-1 -top-6 bg-blue-600 text-white text-xs px-2 py-1 rounded text-center">
                      ✓ Clear
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                  <div className="h-3 bg-green-50 rounded w-2/3 relative">
                    <div className="absolute -right-1 -top-6 bg-green-600 text-white text-xs px-2 py-1 rounded">
                      ✓ Strong
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-normal text-gray-800 mb-4">
              Everything you need to improve
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-normal">
              Simple tools that help you write better essays and build confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wand2 size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-800">Instant feedback</h3>
              <p className="text-gray-600 leading-relaxed font-normal">
                Get detailed feedback on grammar, structure, and clarity in seconds.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText size={24} className="text-green-600" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-800">Stay organized</h3>
              <p className="text-gray-600 leading-relaxed font-normal">
                Keep all your essays and feedback in one clean, simple dashboard.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare size={24} className="text-yellow-600" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-800">Ask questions</h3>
              <p className="text-gray-600 leading-relaxed font-normal">
                Chat with AI to understand your feedback and learn how to improve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-normal text-gray-800 mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-600 font-normal">
              Three simple steps to better writing
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-lg font-medium text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-medium mb-3 text-gray-800">Upload</h3>
              <p className="text-gray-600 leading-relaxed font-normal">
                Paste your essay or upload a file
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-lg font-medium text-green-600">2</span>
              </div>
              <h3 className="text-lg font-medium mb-3 text-gray-800">Analyze</h3>
              <p className="text-gray-600 leading-relaxed font-normal">
                Get instant AI feedback and suggestions
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-lg font-medium text-yellow-600">3</span>
              </div>
              <h3 className="text-lg font-medium mb-3 text-gray-800">Improve</h3>
              <p className="text-gray-600 leading-relaxed font-normal">
                Apply changes and write with confidence
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-normal text-gray-800 mb-6">
                Built for students
              </h2>
              <p className="text-lg text-gray-600 mb-8 font-normal">
                Simple tools designed to help you succeed in school and beyond.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle size={14} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Fast results</h4>
                    <p className="text-gray-600 font-normal">Get feedback in seconds, perfect for any deadline</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Target size={14} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Personal help</h4>
                    <p className="text-gray-600 font-normal">AI that adapts to your writing style and needs</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users size={14} className="text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Education focused</h4>
                    <p className="text-gray-600 font-normal">Designed to support learning and skill development</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="text-center mb-6">
                <div className="text-3xl font-normal text-gray-800 mb-2">Better writing</div>
                <p className="text-gray-600 font-normal">starts here</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center border border-blue-100">
                  <div className="text-xl font-medium text-blue-600 mb-1">Instant</div>
                  <p className="text-gray-600 text-sm font-normal">feedback</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center border border-green-100">
                  <div className="text-xl font-medium text-green-600 mb-1">Smart</div>
                  <p className="text-gray-600 text-sm font-normal">suggestions</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg text-center border border-yellow-100">
                  <div className="text-xl font-medium text-yellow-600 mb-1">Easy</div>
                  <p className="text-gray-600 text-sm font-normal">to use</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg text-center border border-red-100">
                  <div className="text-xl font-medium text-red-600 mb-1">Always</div>
                  <p className="text-gray-600 text-sm font-normal">learning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Feature Spotlight */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-6 border border-blue-100">
              <Star size={14} />
              New
            </div>
            <h2 className="text-3xl font-normal text-gray-800 mb-4">
              Grammar correction
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-normal">
              Fix grammar mistakes as you type with our smart correction feature.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
            <div className="bg-white rounded-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <span className="text-gray-700 font-medium">Essay Editor</span>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                  <Wand2 size={14} />
                  Check grammar
                </button>
              </div>
              <div className="space-y-3 text-left">
                <p className="text-gray-800 font-normal">
                  Technology has <span className="bg-blue-100 text-blue-800 px-1 rounded">revolutionized</span> education.
                </p>
                <p className="text-gray-800 font-normal">
                  Students now have access to <span className="bg-green-100 text-green-800 px-1 rounded">unlimited</span> resources.
                </p>
                <p className="text-gray-800 font-normal">
                  This makes learning <span className="bg-yellow-100 text-yellow-800 px-1 rounded">more effective</span> than before.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-3xl font-normal text-white mb-4">
            Ready to improve your writing?
          </h2>
          <p className="text-lg text-blue-100 mb-8 font-normal">
            Join thousands of students who are already writing better essays.
          </p>
          <Link to="/signup" className="bg-white hover:bg-gray-50 text-blue-600 px-8 py-3 rounded-md font-medium transition-colors inline-flex items-center gap-2">
            Get started
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={gradelyLogo} alt="Gradely Logo" className="w-6 h-6 object-contain" />
                <span className="text-lg font-normal text-gray-700">Gradely</span>
              </div>
              <p className="text-gray-600 font-normal text-sm leading-relaxed">
                AI-powered writing feedback for students worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Product</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm font-normal">Features</a>
                <a href="#" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm font-normal">Pricing</a>
                <a href="#" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm font-normal">API</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm font-normal">About</a>
                <a href="#" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm font-normal">Blog</a>
                <a href="#" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm font-normal">Careers</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm font-normal">Help</a>
                <a href="#" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm font-normal">Contact</a>
                <a href="#" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm font-normal">Privacy</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm font-normal">
              © {new Date().getFullYear()} Gradely. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm font-normal">Made by</span>
              <a 
                href="https://github.com/Jedyviageiro" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Github size={14} />
                <span className="text-sm font-normal">Jedyviageiro</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;