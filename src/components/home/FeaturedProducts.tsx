import Image from "next/image";

const products = [
  {
    id: 1,
    name: "Handmade Clay Vase",
    price: "$45",
    image: "/images/products/pottery.png",
  },
  {
    id: 2,
    name: "Woven Storage Basket",
    price: "$38",
    image: "/images/products/baskets.jfif",
  },
  {
    id: 3,
    name: "Wooden Art",
    price: "$60",
    image: "/images/products/wood-art.jpg",
  },
  {
    id: 4,
    name: "Scented Soy Candle",
    price: "$25",
    image: "/images/products/candle.jfif",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="featured-products">
      <h2>Featured Products</h2>

      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-image">
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={300}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                }}
              />
            </div>

            <h3>{product.name}</h3>

            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}