import { useParams, Link } from "react-router-dom";

export default function PaymentSuccess() {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center">
        <h1 className="text-2xl font-bold text-green-700">Payment Successful 🎉</h1>
        <p className="mt-2 text-gray-700">Order ID: <span className="font-mono">{orderId}</span></p>
        <Link
          to="/"
          className="inline-block mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
