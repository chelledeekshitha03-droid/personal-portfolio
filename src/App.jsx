
import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

const products = [
  { id: 1, name: "Wireless Headphones", category: "Electronics", price: 1499, emoji: "🎧", description: "Enjoy music anywhere." },
  { id: 2, name: "Smart Watch", category: "Electronics", price: 2299, emoji: "⌚", description: "Stay connected every day." },
  { id: 3, name: "Running Shoes", category: "Fashion", price: 1799, emoji: "👟", description: "Comfort for every step." },
  { id: 4, name: "Backpack", category: "Fashion", price: 999, emoji: "🎒", description: "Carry your essentials." },
  { id: 5, name: "Desk Lamp", category: "Home", price: 699, emoji: "💡", description: "Brighten your workspace." },
  { id: 6, name: "Coffee Mug", category: "Home", price: 299, emoji: "☕", description: "Your favourite daily cup." },
];

function Header({ cartCount }) {
  return (
    <header className="navbar">
      <Link className="brand" to="/">ShopEase<span>.</span></Link>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/about">About</Link>
        <Link className="cart-link" to="/cart">🛒 Cart ({cartCount})</Link>
      </nav>
    </header>
  );
}

function Home() {
  return (
    <section className="hero">
      <p className="eyebrow">YOUR EVERYDAY SHOPPING DESTINATION</p>
      <h1>Find your next<br /><span>favourite thing.</span></h1>
      <p>Discover useful products for your lifestyle, home and everyday adventures.</p>
      <Link className="primary-button" to="/products">Explore Products →</Link>
      <div className="hero-art" aria-label="Shopping bags illustration">🛍️</div>
    </section>
  );
}

function Products({ addToCart }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === "All" || product.category === category)
  );

  return (
    <main className="page">
      <p className="eyebrow">THE COLLECTION</p>
      <h1>Our Products</h1>
      <p className="subtitle">Good finds for every day.</p>

      <div className="filters">
        <input
          aria-label="Search products"
          placeholder="Search products..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select aria-label="Filter by category" value={category} onChange={(event) => setCategory(event.target.value)}>
          {["All", "Electronics", "Fashion", "Home"].map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      <div className="product-grid">
        {filtered.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-art">{product.emoji}</div>
            <p className="category">{product.category}</p>
            <h2>{product.name}</h2>
            <p className="description">{product.description}</p>
            <div className="product-bottom">
              <strong>₹{product.price.toLocaleString("en-IN")}</strong>
              <button onClick={() => addToCart(product)}>Add to cart</button>
            </div>
          </article>
        ))}
      </div>
      {filtered.length === 0 && <p>No products found. Try another search.</p>}
    </main>
  );
}

function Cart({ cart, changeQuantity }) {
  const items = Object.values(cart);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="page">
      <h1>Your Shopping Cart</h1>
      {items.length === 0 ? (
        <p className="subtitle">Your cart is empty. <Link to="/products">Browse products</Link></p>
      ) : (
        <>
          {items.map((item) => (
            <article className="cart-item" key={item.id}>
              <span className="cart-emoji">{item.emoji}</span>
              <div className="cart-details">
                <strong>{item.name}</strong>
                <p>₹{item.price.toLocaleString("en-IN")} each</p>
                <div className="quantity">
                  <button aria-label={`Decrease ${item.name} quantity`} onClick={() => changeQuantity(item.id, -1)}>−</button>
                  <span>{item.quantity}</span>
                  <button aria-label={`Increase ${item.name} quantity`} onClick={() => changeQuantity(item.id, 1)}>+</button>
                </div>
              </div>
              <strong>₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong>
            </article>
          ))}
          <h2 className="total">Total: ₹{total.toLocaleString("en-IN")}</h2>
          <p className="subtitle">Demo catalog only — checkout is not enabled.</p>
        </>
      )}
    </main>
  );
}

function About() {
  return (
    <main className="page">
      <p className="eyebrow">OUR STORY</p>
      <h1>Shopping made simple.</h1>
      <p className="subtitle">ShopEase is a demonstration e-commerce catalog built with React. Explore products, search by name, filter by category and manage your cart.</p>
    </main>
  );
}

function NotFound() {
  return <main className="page"><h1>Page not found</h1><Link to="/">Return home</Link></main>;
}

function App() {
  const [cart, setCart] = useState({});

  function addToCart(product) {
    setCart((previous) => ({
      ...previous,
      [product.id]: {
        ...product,
        quantity: (previous[product.id]?.quantity || 0) + 1,
      },
    }));
  }

  function changeQuantity(id, amount) {
    setCart((previous) => {
      const next = { ...previous };
      const quantity = (next[id]?.quantity || 0) + amount;
      if (quantity <= 0) delete next[id];
      else next[id] = { ...next[id], quantity };
      return next;
    });
  }

  const cartCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <BrowserRouter>
      <Header cartCount={cartCount} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} changeQuantity={changeQuantity} />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer>© 2026 ShopEase · Built with React</footer>
    </BrowserRouter>
  );
}

export default App;
