"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useProducts } from "@/context/ProductsContext";
import { Product } from "@/types/product";

interface EditProductFormProps {
productId: string;
}

export default function EditProductForm({
productId,
}: EditProductFormProps) {
const router = useRouter();

const {
products,
updateProduct,
} = useProducts();

const product = products.find(
(item) => item.id === productId
);

const [formData, setFormData] =
useState<Product | null>(
product ?? null
);

function handleChange(
e: React.ChangeEvent<
HTMLInputElement |
HTMLTextAreaElement |
HTMLSelectElement
>
) {
if (!formData) return;


setFormData({
  ...formData,
  [e.target.name]:
    e.target.name === "price"
      ? Number(e.target.value)
      : e.target.value,
});


}

function handleImageChange(
e: React.ChangeEvent<HTMLInputElement>
) {
if (!formData) return;


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

async function handleSubmit(
e: React.FormEvent<HTMLFormElement>
) {
e.preventDefault();


if (!formData) return;

try {
  await updateProduct(
    productId,
    formData
  );

  router.push(
    `/products/${productId}`
  );
} catch (error) {
  console.error(
    "Failed to update product:",
    error
  );
}


}

if (!formData) {
return ( <p>
Product not found. </p>
);
}

return ( <section className="edit-product-form-section"> <form
     className="edit-product-form"
     onSubmit={handleSubmit}
   > <div className="form-group"> <label>
Product Name </label>

```
      <input
        type="text"
        name="name"
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
        value={formData.seller}
        onChange={handleChange}
        required
      />
    </div>

    <div className="form-group">
      <label>
        Product Image
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />

      {formData.image && (
        <div className="image-preview">
          <Image
            src={formData.image}
            alt={formData.name}
            width={300}
            height={300}
            className="image-preview"
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
        value={formData.description}
        onChange={handleChange}
        required
      />
    </div>

    <button
      type="submit"
      className="submit-product-btn"
    >
      Save Changes
    </button>
  </form>
</section>


);
}
