// src/context/ProductContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Optional: for loading state
  const [error, setError] = useState(null);     // Optional: for error handling

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/`);
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addProduct = (product) => {
    const newProduct = {
      id: products.length + 1,
      ...product,
      price: `$${product.price}`,
      location: "Unknown", // or you can add location input
      image: URL.createObjectURL(product.image), // For preview
    };
    setProducts([...products, newProduct]);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
