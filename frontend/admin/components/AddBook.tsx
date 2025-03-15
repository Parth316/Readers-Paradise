import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {ToastContainer,toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { CheckCircle } from 'lucide-react';
const AddBook: React.FC = () => {
  const [message, setMessage] = useState('');

  // Genre options for the dropdown
  const genreOptions = [
    'New Arrivals',
    'Best Sellers',
    'Fiction',
    'Non-Fiction',
    'Science Fiction',
    'Fantasy',
    'Mystery',
    'Thriller',
    'Romance',
    'Biography',
    'History',
    'Self-Help',
    'Children',
    'Other',
    'Arts & Crafts',
    'Cooking',
    'Education',
    'Business & Finance',
    'Health & Fitness',
    'Sports & Recreation',
    'Travel & Adventure',
    'Religion & Spirituality',
    'Science & Medicine',
    'Technology',
    'Gaming',
    'Movies',
    'Music',
    'Newspapers',
    'Magazines',
    'Comics',
  ];

  const showSuccessToast = (message) => {
    toast.success(message, {
      icon: <CheckCircle />,
      position: "top-right",
      autoClose: 5000, // 5 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  
// Function to show error toast
const showErrorToast = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000, // 5 seconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
const resetFormData = (resetForm) => {
  resetForm({
    values: {
      title: '',
      author: '',
      isbn: '',
      description: '',
      qty: '',
      genre: '',
      publisher: '',
      publishedDate: '',
      pages: '',
      price: '',
      images: [],
    },
  });
};
const handleSubmit = async (values, { setSubmitting, resetForm }) => {
  const formData = new FormData();

  // Append text fields
  formData.append('title', values.title);
  formData.append('author', values.author);
  formData.append('isbn', values.isbn);
  formData.append('description', values.description);
  formData.append('qty', values.qty);
  formData.append('genre', values.genre);
  formData.append('publisher', values.publisher);
  formData.append('published_date', values.publishedDate); // Match backend field name
  formData.append('pages', values.pages);
  formData.append('price', values.price);

  // Append images
  values.images.forEach((image) => {
    formData.append('images', image);
  });

  try {
    const response = await axios.post('http://localhost:5000/api/admin/addBooks', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 400) {
      setMessage('Book alredy exists');
    } 
    showSuccessToast('Book added successfully');
    resetFormData(resetForm); // Reset form data
    setSubmitting(false);
  } catch (error) {
    showErrorToast('Failed to add book. ' + error.message);
    setSubmitting(false);
  }
};
  return (

    <>
    <ToastContainer />
    <Formik
      initialValues={{
        title: '',
        author: '',
        isbn: '',
        description: '',
        qty: '',
        genre: '',
        publisher: '',
        publishedDate: '',
        pages: '',
        price: '',
        images: [],
      }}
      validationSchema={Yup.object({
        title: Yup.string()
          .required('Title is required')
          .min(3, 'Title must be at least 3 characters'),
        author: Yup.string()
          .required('Author is required')
          .min(3, 'Author must be at least 3 characters'),
        isbn: Yup.string()
          .required('ISBN is required')
          .matches(/^[0-9-]+$/, 'ISBN must contain only numbers and hyphens'),
        description: Yup.string()
          .required('Description is required')
          .min(10, 'Description must be at least 10 characters'),
        qty: Yup.number()
          .required('Quantity is required')
          .min(1, 'Quantity must be at least 1'),
        genre: Yup.string().required('Genre is required'),
        publisher: Yup.string()
          .required('Publisher is required')
          .min(2, 'Publisher must be at least 2 characters'),
        publishedDate: Yup.date()
          .required('Published date is required')
          .max(new Date(), 'Published date cannot be in the future'),
        pages: Yup.number()
          .required('Number of pages is required')
          .min(1, 'Pages must be at least 1'),
        price: Yup.number()
          .required('Price is required')
          .min(1, 'Price must be at least 1'),
        images: Yup.array()
          .min(1, 'At least one image is required')
          .required('Images are required'),
        status: Yup.string(),
      })}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <div className="container mx-auto pt-20 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-3xl font-bold mb-6">Add a New Book</h2>
            {message && <p className="text-center text-green-500 mb-4">{message}</p>}
            <Form>
              {/* Title and Author */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                    Title
                  </label>
                  <Field
                    type="text"
                    id="title"
                    name="title"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter book title"
                  />
                  <ErrorMessage name="title" component="div" className="text-red-500 text-xs italic" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="author">
                    Author
                  </label>
                  <Field
                    type="text"
                    id="author"
                    name="author"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter author name"
                  />
                  <ErrorMessage name="author" component="div" className="text-red-500 text-xs italic" />
                </div>
              </div>

              {/* ISBN and Quantity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="isbn">
                    ISBN
                  </label>
                  <Field
                    type="text"
                    id="isbn"
                    name="isbn"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter ISBN number"
                  />
                  <ErrorMessage name="isbn" component="div" className="text-red-500 text-xs italic" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="qty">
                    Quantity
                  </label>
                  <Field
                    type="text"
                    id="qty"
                    name="qty"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter quantity"
                  />
                  <ErrorMessage name="qty" component="div" className="text-red-500 text-xs italic" />
                </div>
              </div>

              {/* Genre and Publisher */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="genre">
                    Genre
                  </label>
                  <Field
                    as="select"
                    id="genre"
                    name="genre"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Select a genre</option>
                    {genreOptions.map((genre, index) => (
                      <option key={index} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="genre" component="div" className="text-red-500 text-xs italic" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publisher">
                    Publisher
                  </label>
                  <Field
                    type="text"
                    id="publisher"
                    name="publisher"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter publisher name"
                  />
                  <ErrorMessage name="publisher" component="div" className="text-red-500 text-xs italic" />
                </div>
              </div>

              {/* Published Date and Pages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publishedDate">
                    Published Date
                  </label>
                  <Field
                    type="date"
                    id="publishedDate"
                    name="publishedDate"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <ErrorMessage name="publishedDate" component="div" className="text-red-500 text-xs italic" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pages">
                    Pages
                  </label>
                  <Field
                    type="number"
                    id="pages"
                    name="pages"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter number of pages"
                  />
                  <ErrorMessage name="pages" component="div" className="text-red-500 text-xs italic" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pages">
                    Price
                  </label>
                  <Field
                    type="number"
                    id="price"
                    name="price"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter the price"
                  />
                  <ErrorMessage name="price" component="div" className="text-red-500 text-xs italic" />
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter book description"
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-xs italic" />
              </div>

              {/* Images Upload */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="images">
                  Images
                </label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  onChange={(event) => {
                    const files = event.currentTarget.files;
                    if (files) {
                      setFieldValue('images', Array.from(files));
                    }
                  }}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <ErrorMessage name="images" component="div" className="text-red-500 text-xs italic" />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                  disabled={isSubmitting}
                >
                  Add Book
                </button>
              </div>
            </Form>

            {/* Image Previews */}
            <div className="mt-4">
              <h3 className="text-lg font-bold">Selected Images:</h3>
              <div className="flex flex-wrap">
                {values.images && values.images.map((image: File, index: number) => (
                  <div key={index} className="w-1/4 p-2">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Selected ${index}`}
                      className="w-full h-auto rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Formik>
    </>

  );
};

export default AddBook;