import React from "react";

function ProductCard({ name, price, inStock }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "10px",
      padding: "16px",
      margin: "10px",
      width: "220px",
      textAlign: "center",
      boxShadow: "2px 2px 6px rgba(0,0,0,0.1)"
    }}>
      <h2>{name}</h2>
      <p>💲 Price: ${price}</p>
      <p style={{ color: inStock ? "green" : "red" }}>
        {inStock ? "In Stock ✅" : "Out of Stock ❌"}
      </p>
    </div>
  );
}

export default function App() {
  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <ProductCard name="Laptop" price={750} inStock={true} />
      <ProductCard name="Smartphone" price={500} inStock={false} />
      <ProductCard name="Headphones" price={120} inStock={true} />
    </div>
  );
}
