const categories = [
  {
    id: 1,
    icon: "🏺",
    name: "Pottery",
    description: "Beautiful handcrafted ceramic pieces for your home.",
  },
  {
    id: 2,
    icon: "💍",
    name: "Jewelry",
    description: "Unique handmade accessories crafted with care.",
  },
  {
    id: 3,
    icon: "🪵",
    name: "Woodwork",
    description: "Rustic wooden creations made by skilled artisans.",
  },
  {
    id: 4,
    icon: "🏡",
    name: "Home Décor",
    description: "Decorative pieces that add warmth and character.",
  },
  {
    id: 5,
    icon: "🕯️",
    name: "Candles",
    description: "Hand-poured soy candles with delightful fragrances.",
  },
  {
    id: 6,
    icon: "🎨",
    name: "Artwork",
    description: "Original paintings and handcrafted artistic creations.",
  },
];

export default function Categories() {
  return (
    <section className="categories">
      <h2>Browse Categories</h2>

      <p>
        Explore a wide variety of handcrafted products created by talented
        artisans.
      </p>

      <div className="category-grid">
        {categories.map((category) => (
          <div className="category-card" key={category.id}>
            <div className="category-icon">{category.icon}</div>

            <h3>{category.name}</h3>

            <p>{category.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}