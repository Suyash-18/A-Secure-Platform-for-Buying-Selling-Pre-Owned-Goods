import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductContext } from "../contexts/ProductContext";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { products } = useContext(ProductContext);
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 bg-[#9575cd] text-white px-6 py-2 rounded hover:bg-[#7e57c2]"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleContact = () => {
    if (!user) {
      showToast({ message: "Please login to contact the seller", type: "error" });
      navigate('/login');
      return;
    }
    // Add your contact logic here
    showToast({ message: "Contact request sent!", type: "success" });
  };

  return (
    <div className="min-h-screen bg-[#f9faf9] p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[400px] object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400?text=Image+Not+Found';
              }}
            />
          </div>
          
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-[#9575cd]">{product.price}</span>
                <span className="text-gray-600">{product.location}</span>
              </div>
              
              <div className="border-t border-b py-4">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-600">
                  {product.description || "No description available"}
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Condition:</span>
                    <span className="ml-2 font-medium">Used - Like New</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <span className="ml-2 font-medium">{product.category || "General"}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  onClick={handleContact}
                  className="flex-1 bg-[#9575cd] text-white py-3 px-6 rounded-lg hover:bg-[#7e57c2] transition-colors"
                >
                  Contact Seller
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className="px-6 py-3 border border-[#9575cd] text-[#9575cd] rounded-lg hover:bg-[#9575cd] hover:text-white transition-colors"
                >
                  Back to Products
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
