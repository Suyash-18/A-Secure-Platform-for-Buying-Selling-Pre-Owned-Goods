// src/pages/AddProduct.jsx
import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import axios from "axios";

/**
 * Production-ready AddProduct page
 * - Clean, scalable UI (Tailwind)
 * - Separate location fields (address, city, state, country)
 * - Drag & drop product images (min 3, preview, remove)
 * - Bills upload (optional, preview list, remove)
 * - Client-side validation (file type/size)
 * - Upload progress indicator
 * - Sends FormData compatible with your backend (images, bills, location JSON)
 */

const MAX_IMAGE_FILES = 10;
const MAX_BILL_FILES = 5;
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB (matches multer)
const ALLOWED_MIME = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export default function AddProduct() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const imageInputRef = useRef(null);
  const billInputRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    condition: "Used",
    category: "",
    warranty: "",
    accessories: "",
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
    },
  });

  const [images, setImages] = useState([]); // File[]
  const [bills, setBills] = useState([]); // File[]

  // ---------- Helpers ----------
  const onTextChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      setProduct((p) => ({ ...p, location: { ...p.location, [key]: value } }));
    } else {
      setProduct((p) => ({ ...p, [name]: value }));
    }
  };

  const validateFiles = (files, { currentCount, maxCount, label }) => {
    const asArray = Array.from(files);
    if (currentCount + asArray.length > maxCount) {
      showToast({
        message: `You can upload a maximum of ${maxCount} ${label}.`,
        type: "error",
      });
      return [];
    }
    const filtered = [];
    for (const f of asArray) {
      if (!ALLOWED_MIME.includes(f.type)) {
        showToast({
          message: `Unsupported file type: ${f.name}. Allowed: JPG, JPEG, PNG, WEBP`,
          type: "error",
        });
        continue;
      }
      if (f.size > MAX_FILE_SIZE_BYTES) {
        showToast({
          message: `${f.name} is larger than 2MB.`,
          type: "error",
        });
        continue;
      }
      filtered.push(f);
    }
    return filtered;
  };

  const handleAddImages = (files) => {
    const valid = validateFiles(files, {
      currentCount: images.length,
      maxCount: MAX_IMAGE_FILES,
      label: "product images",
    });
    if (valid.length) setImages((prev) => [...prev, ...valid]);
  };

  const handleAddBills = (files) => {
    const valid = validateFiles(files, {
      currentCount: bills.length,
      maxCount: MAX_BILL_FILES,
      label: "bills",
    });
    if (valid.length) setBills((prev) => [...prev, ...valid]);
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };
  const removeBill = (idx) => {
    setBills((prev) => prev.filter((_, i) => i !== idx));
  };

  const isFormValid = useMemo(() => {
    const { title, description, price, category, condition, location } =
      product;
    const basics =
      title.trim() &&
      description.trim() &&
      price &&
      Number(price) > 0 &&
      category.trim() &&
      ["New", "Like New", "Used"].includes(condition);
    const loc =
      location.address.trim() &&
      location.city.trim() &&
      location.state.trim() &&
      location.country.trim();
    return basics && loc && images.length >= 3;
  }, [product, images.length]);

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length < 3) {
      showToast({
        message: "Please upload at least 3 product images.",
        type: "error",
      });
      return;
    }

    if (
      !product.location.address ||
      !product.location.city ||
      !product.location.state ||
      !product.location.country
    ) {
      showToast({
        message: "Please complete the location details.",
        type: "error",
      });
      return;
    }

    try {
      setSubmitting(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("title", product.title);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("condition", product.condition);
      formData.append("category", product.category);
      formData.append("warranty", product.warranty);
      formData.append("accessories", product.accessories);
      formData.append("location", JSON.stringify(product.location)); // backend expects JSON string

      images.forEach((file) => formData.append("images", file));
      bills.forEach((file) => formData.append("bills", file)); // optional

      await axios.post("http://localhost:5000/api/products/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      showToast({ message: "Product added successfully", type: "success" });
      navigate("/products");
    } catch (err) {
      console.error("Add Product Error:", err);
      const msg =
        err?.response?.data?.message || err?.message || "Failed to add product";
      showToast({ message: msg, type: "error" });
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 px-4">
      <div className="mx-auto w-full max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Add New Product
          </h1>
          <p className="text-gray-500 mt-1">
            Create a clean, detailed listing with images, location and optional
            bills.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md ring-1 ring-gray-100 p-6 md:p-8 space-y-8"
        >
          {/* Section: Product Details */}
          <Section title="Product Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Title *"
                name="title"
                placeholder="e.g., iPhone 13 Pro"
                value={product.title}
                onChange={onTextChange}
                required
              />
              <Select
                label="Condition *"
                name="condition"
                value={product.condition}
                onChange={onTextChange}
                options={["New", "Like New", "Used"]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Category *"
                name="category"
                placeholder="e.g., Mobile"
                value={product.category}
                onChange={onTextChange}
                required
              />
              <Input
                label="Price (₹) *"
                name="price"
                type="number"
                min="0"
                placeholder="e.g., 45000"
                value={product.price}
                onChange={onTextChange}
                required
              />
            </div>

            <Textarea
              label="Description *"
              name="description"
              placeholder="Describe the condition, usage, and anything a buyer should know."
              rows={4}
              value={product.description}
              onChange={onTextChange}
              required
            />
          </Section>

          {/* Section: Location */}
          <Section title="Location">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Address *"
                name="location.address"
                placeholder="e.g., Akurdi"
                value={product.location.address}
                onChange={onTextChange}
                required
              />
              <Input
                label="City *"
                name="location.city"
                placeholder="e.g., Pune"
                value={product.location.city}
                onChange={onTextChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="State *"
                name="location.state"
                placeholder="e.g., MH"
                value={product.location.state}
                onChange={onTextChange}
                required
              />
              <Input
                label="Country *"
                name="location.country"
                placeholder="e.g., India"
                value={product.location.country}
                onChange={onTextChange}
                required
              />
            </div>
          </Section>

          {/* Section: Additional Info */}
          <Section title="Additional Info">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Warranty (optional)"
                name="warranty"
                placeholder="e.g., valid till 1-Mar-2026"
                value={product.warranty}
                onChange={onTextChange}
              />
              <Input
                label="Accessories (optional)"
                name="accessories"
                placeholder="e.g., Charger, Earphones"
                value={product.accessories}
                onChange={onTextChange}
              />
            </div>
          </Section>

          {/* Section: Uploads */}
          <Section title="Product Images (min 3)">
            <DropZone
              files={images}
              setFiles={setImages}
              onFilesSelect={(f) => handleAddImages(f)}
              inputRef={imageInputRef}
              helpText="JPG, JPEG, PNG, WEBP up to 2MB each. Drag & drop or click to browse."
              maxCount={MAX_IMAGE_FILES}
            />

            {/* Thumbnails */}
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-32 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 inline-flex items-center justify-center rounded-full bg-white/90 hover:bg-white px-2 py-1 text-xs font-medium text-red-600 shadow"
                      aria-label="Remove image"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p
              className={`text-sm mt-2 ${
                images.length < 3 ? "text-red-600" : "text-gray-500"
              }`}
            >
              {images.length < 3
                ? `You have added ${images.length}. Please add at least ${
                    3 - images.length
                  } more image(s).`
                : `Looks good. You have added ${images.length} image(s).`}
            </p>
          </Section>

          <Section title="Bills (optional)">
            <DropZone
              files={bills}
              setFiles={setBills}
              onFilesSelect={(f) => handleAddBills(f)}
              inputRef={billInputRef}
              helpText="Upload invoice/bill images. Drag & drop or click to browse."
              maxCount={MAX_BILL_FILES}
            />
            {bills.length > 0 && (
              <ul className="mt-3 space-y-2">
                {bills.map((file, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2"
                  >
                    <span className="truncate text-sm text-gray-700">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeBill(idx)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          {/* Progress */}
          {submitting && (
            <div className="w-full">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700">Uploading...</span>
                <span className="text-sm text-gray-500">{uploadProgress}%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-purple-600 transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
              onClick={() => navigate(-1)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !isFormValid}
              className={`rounded-lg px-5 py-2.5 font-medium text-white shadow-sm transition
                ${
                  submitting || !isFormValid
                    ? "bg-purple-300 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              title={
                !isFormValid
                  ? "Complete required fields and add at least 3 images"
                  : "Submit"
              }
            >
              {submitting ? "Submitting..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------- Reusable UI ----------

function Section({ title, children }) {
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
      <hr className="mt-6 border-gray-100" />
    </section>
  );
}

function Input({ label, className = "", ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </span>
      <input
        {...props}
        className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition ${className}`}
      />
    </label>
  );
}

function Textarea({ label, className = "", ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </span>
      <textarea
        {...props}
        className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition ${className}`}
      />
    </label>
  );
}

function Select({ label, options = [], ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </span>
      <select
        {...props}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900
          focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function DropZone({
  files,
  setFiles,
  onFilesSelect,
  inputRef,
  helpText,
  maxCount,
}) {
  const handleBrowse = () => inputRef?.current?.click();

  const onDrop = (e) => {
    e.preventDefault();
    const dtFiles = e.dataTransfer.files;
    if (!dtFiles?.length) return;
    onFilesSelect(dtFiles);
  };

  const onInputChange = (e) => {
    if (!e.target.files?.length) return;
    onFilesSelect(e.target.files);
    // reset input so same file can be selected again if needed
    e.target.value = "";
  };

  return (
    <div
      className="rounded-xl border-2 border-dashed border-purple-300 bg-purple-50/40 p-5 text-center hover:bg-purple-50 transition"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      role="region"
      aria-label="File upload dropzone"
    >
      <p className="text-sm text-gray-700">{helpText}</p>
      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleBrowse}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-purple-700 ring-1 ring-purple-200 hover:bg-purple-50"
        >
          Browse files
        </button>
        <span className="text-xs text-gray-500">or drop here</span>
      </div>
      <p className="mt-2 text-xs text-gray-500">Up to {maxCount} files</p>

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/jpg,image/png,image/webp"
        multiple
        hidden
        onChange={onInputChange}
      />
    </div>
  );
}
