"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/context/ProductsContext";

export default function AddProductForm() {
  const router = useRouter();
  const { addProduct } = useProducts();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    seller: "",
    image: "",
    description: "",
  });


  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }


  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;


    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData({
        ...formData,
        image: reader.result as string,
      });
    };


    reader.readAsDataURL(file);
  }



  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();


    addProduct({
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      seller: formData.seller,
      image: formData.image,
      description: formData.description,
    });


    router.push("/products");
  }



  return (
    <section className="add-product-form-section">

      <form
        className="add-product-form"
        onSubmit={handleSubmit}
      >


        <div className="form-group">

          <label>
            Product Name
          </label>

          <input
            type="text"
            name="name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={handleChange}
            required
          />

        </div>



        <div className="form-group">

          <label>
            Category
          </label>


          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >

            <option value="">
              Select Category
            </option>

            <option value="Pottery">
              Pottery
            </option>

            <option value="Home Décor">
              Home Décor
            </option>

            <option value="Woodwork">
              Woodwork
            </option>

            <option value="Candles">
              Candles
            </option>

            <option value="Jewelry">
              Jewelry
            </option>

            <option value="Artwork">
              Artwork
            </option>

          </select>

        </div>




        <div className="form-group">

          <label>
            Price ($)
          </label>


          <input
            type="number"
            name="price"
            placeholder="Enter price"
            value={formData.price}
            onChange={handleChange}
            required
          />

        </div>




        <div className="form-group">

          <label>
            Seller Name
          </label>


          <input
            type="text"
            name="seller"
            placeholder="Enter seller name"
            value={formData.seller}
            onChange={handleChange}
            required
          />

        </div>




        {/* IMAGE UPLOAD */}

        <div className="form-group">

          <label>
            Product Image
          </label>


          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />



          {formData.image && (
            <div className="image-preview">

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formData.image}
                alt="Product Preview"
              />

            </div>
          )}

        </div>





        <div className="form-group">

          <label>
            Description
          </label>


          <textarea
            name="description"
            rows={5}
            placeholder="Describe your handcrafted product..."
            value={formData.description}
            onChange={handleChange}
            required
          />

        </div>





        <button
          type="submit"
          className="submit-product-btn"
        >
          Add Product
        </button>


      </form>

    </section>
  );
}