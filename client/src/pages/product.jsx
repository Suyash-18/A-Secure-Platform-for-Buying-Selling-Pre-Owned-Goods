import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ProductContext } from "../context/productcontext";
import { useAuth } from "../contexts/AuthContext";

const Products = () => {
  const { products } = useContext(ProductContext);
  const { user } = useAuth();

  return (
    <div className="p-8 bg-[#f9faf9] min-h-screen">
      <h2 className="text-[30px] font-bold mb-8 text-gray-800 text-center">Featured Listings</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {products.map((item) => (
          <Link
            key={item.id}
            to={`/products/${item.id}`}
            className="no-underline text-inherit"
          >
            <div className="border border-gray-300 rounded-lg shadow-md hover:shadow-xl transition duration-300 bg-white overflow-hidden flex flex-col">
              <img
                src={item.image}
                alt={item.name}
                className="w-[200px] h-[300px] object-cover"
              />
              <div className="p-4 flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-700 font-medium text-xl mt-1">{item.price}</p>
                <p className="text-sm text-gray-500 mt-1">{item.location}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {user && (
        <div className="fixed bottom-8 right-8">
          <Link 
            to="/product/add"
            className="bg-[#9575cd] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#7e57c2] transition-colors flex items-center space-x-2"
          >
            <span className="text-2xl mr-1">+</span>
            <span>Add Product</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Products;