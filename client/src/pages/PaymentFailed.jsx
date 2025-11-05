import { Link } from "react-router-dom";

export default function PaymentFailed() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center">
        <h1 className="text-2xl font-bold text-red-700">Payment Failed ❌</h1>
        <p className="mt-2 text-gray-700">Your payment could not be verified.</p>
        <Link
          to="/"
          className="inline-block mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}
