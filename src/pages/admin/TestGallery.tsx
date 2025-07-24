// src/pages/admin/TestGallery.tsx
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const TestGallery = () => {
  const [form, setForm] = useState({ title: "", category: "", image_url: "" });

  const handleClick = async () => {
    console.log("Button clicked!");
    alert("Submitting...");

    const { data, error } = await supabase.from("gallery").insert([form]);

    if (error) {
      console.error("Insert error:", error.message);
      alert("Error: " + error.message);
    } else {
      console.log("Inserted:", data);
      alert("Success!");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="border px-2 py-1 block mb-2 w-full"
      />
      <input
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="border px-2 py-1 block mb-2 w-full"
      />
      <input
        placeholder="Image URL"
        value={form.image_url}
        onChange={(e) => setForm({ ...form, image_url: e.target.value })}
        className="border px-2 py-1 block mb-4 w-full"
      />
      <button
        onClick={handleClick}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Image
      </button>
    </div>
  );
};

export default TestGallery;
