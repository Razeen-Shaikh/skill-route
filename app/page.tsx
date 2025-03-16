import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            Master Problem-Solving with Interactive Quizzes
          </h1>
          <p className="text-lg">
            Enhance your coding skills with real-world challenges, track
            progress, and climb the leaderboard!
          </p>
          <div className="mt-6">
            <Link href="/auth/register">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto py-12 px-6">
        <h2 className="text-2xl font-bold text-center mb-6">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 bg-white shadow-md rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-2">Timed Quizzes</h3>
            <p className="text-gray-600">
              Test your speed and accuracy with time-based coding challenges.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-white shadow-md rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-2">Leaderboard System</h3>
            <p className="text-gray-600">
              Compete with others and track your ranking based on points.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-white shadow-md rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-2">Earn Coins & Rewards</h3>
            <p className="text-gray-600">
              Complete challenges and unlock achievements with our reward
              system.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="w-full bg-blue-600 text-white py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Start Your Journey Today!</h2>
        <p>Sign up now and take your skills to the next level.</p>
        <div className="mt-6">
          <Link href="/auth/register">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200">
              Sign Up Now
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
