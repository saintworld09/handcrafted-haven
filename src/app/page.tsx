import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Categories from "@/components/home/Categories";
import CallToAction from "@/components/home/CallToAction";
import Footer from "@/components/layout/Footer";


export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <FeaturedProducts />
        <Categories />
        <CallToAction />
      </main>


    <Footer />
    </>
  );
}