// src/context/ProductContext.jsx
import React, { createContext, useState } from "react";

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Headphones",
      price: "$50",
      location: "Los Angeles",
      image: "https://apollo.olx.in/v1/files/wtlm50if414f3-ADVIN/image;s=780x0;q=60",
    },
    {
      id: 2,
      name: "Coffee Table",
      price: "$80",
      location: "New York",
      image: "https://apollo.olx.in/v1/files/1ffqw2ftrfxf2-ADVIN/image;s=780x0;q=60",
    },
  ]);

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
    <ProductContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
