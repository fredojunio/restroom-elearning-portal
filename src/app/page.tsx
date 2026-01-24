// app/page.tsx
"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">📚</span>
            </div>
            <span className="font-bold text-xl text-gray-900">EduLearn</span>
          </div>

          <div className="flex gap-4">
            <Link
              href="/auth/login"
              className="px-6 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
          Transform Learning with
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">
            Interactive Education
          </span>
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          A comprehensive e-learning platform designed for primary school
          students and teachers. Engage, learn, and succeed with interactive
          modules, quizzes, and real-time progress tracking.
        </p>

        <div className="flex gap-4 justify-center mb-12">
          <Link
            href="/auth/register"
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
          >
            Get Started Now →
          </Link>
          <Link
            href="#features"
            className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
          >
            Learn More
          </Link>
        </div>

        {/* Hero Image */}
        <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 to-blue-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-4 p-8">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="text-4xl mb-2">📖</div>
                <p className="text-sm font-semibold">Interactive Modules</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="text-4xl mb-2">🎮</div>
                <p className="text-sm font-semibold">Engaging Games</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-sm font-semibold">Track Progress</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Powerful Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Interactive Modules
              </h3>
              <p className="text-gray-600">
                Engaging learning modules organized by grade and subject.
                Students can learn at their own pace with structured lessons and
                content.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
              <div className="text-5xl mb-4">🎮</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Activity Games
              </h3>
              <p className="text-gray-600">
                Drag-and-drop activities, matching games, and interactive
                exercises that make learning fun and memorable for young
                students.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
              <div className="text-5xl mb-4">❓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Smart Quizzes
              </h3>
              <p className="text-gray-600">
                Three quiz types: Multiple Choice, True/False with instant
                grading, and Long Text answers for deeper assessment and teacher
                feedback.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Progress Tracking
              </h3>
              <p className="text-gray-600">
                Real-time progress tracking with timestamps. Teachers can
                monitor student performance and identify areas needing support.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Certificates
              </h3>
              <p className="text-gray-600">
                Automatic certificate generation upon module completion.
                Professional certificates that motivate and recognize
                achievement.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
              <div className="text-5xl mb-4">🔐</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                School Email Auth
              </h3>
              <p className="text-gray-600">
                Secure authentication using school email domains. Role-based
                access for students and teachers with school code verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Types Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Three Quiz Types for Every Need
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Multiple Choice */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Multiple Choice
              </h3>
              <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Instant automatic grading</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Multiple answer options (4-10)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Immediate certificates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Answer review included</span>
                </li>
              </ul>
              <p className="text-sm text-blue-600 font-semibold">
                Best for: Knowledge recall & comprehension
              </p>
            </div>

            {/* True/False */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-4xl mb-4">T/F</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                True/False
              </h3>
              <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Quick concept checks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Binary true/false statements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Instant feedback</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Perfect for younger students</span>
                </li>
              </ul>
              <p className="text-sm text-green-600 font-semibold">
                Best for: Concept verification
              </p>
            </div>

            {/* Long Text */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-4xl mb-4">✎</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Long Text
              </h3>
              <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Manual teacher grading</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Essay-style responses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Word count validation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Detailed feedback</span>
                </li>
              </ul>
              <p className="text-sm text-purple-600 font-semibold">
                Best for: Analysis & creativity
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Register</h3>
              <p className="text-gray-600">
                Sign up with your school email and get instant access
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Enroll</h3>
              <p className="text-gray-600">
                Choose modules that match your grade and subject
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Learn</h3>
              <p className="text-gray-600">
                Complete lessons and activities at your own pace
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Succeed</h3>
              <p className="text-gray-600">
                Pass quizzes and earn certificates
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students and teachers using EduLearn to make
            education more interactive and engaging.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition shadow-lg"
            >
              Start Learning Today
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">📚</span>
                </div>
                <span className="font-bold text-white">EduLearn</span>
              </div>
              <p className="text-sm text-gray-400">
                Transforming primary education through interactive learning.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-white transition">
                    Quiz Types
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 EduLearn. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
