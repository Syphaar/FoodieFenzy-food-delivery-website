import React, { useState } from 'react'
import { styles } from '../assets/dummyadmin';
import { FiHeart, FiStar, FiUpload } from 'react-icons/fi';
import { FaDollarSign } from "react-icons/fa";
import axios from 'axios'

const AddItems = () => {
    const initialFormData = {
        name: '',
        description: '',
        category: '',
        price: '',
        rating: 0,
        hearts: 0,
        total: 0,
        image: null,
        preview: ''
    };
    const [formData, setFormData] = useState({
        ...initialFormData
    });
    const [submitMessage, setSubmitMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories] = useState([
        'Breakfast', 'Lunch', 'Dinner', 'Mexican', 'Italian', 'Desserts', 'Drinks'
    ]);

    const [hoverRating, setHoverRating] = useState(0);

    const handleInputChange = inputChange => {
        const { name, value } = inputChange.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    // FOR IMAGE HANDLING
    const handleInputUpload = fileUploadEvent => {
        const file = fileUploadEvent.target.files[0];
        if(file) {
            setFormData(prev => ({
                ...prev,
                image: file,
                preview: URL.createObjectURL(file)
            }))
        }
    }

    const handleRating = rating => setFormData(prev => ({ ...prev, rating }));

    const handleHearts = () => setFormData(prev => ({ ...prev, hearts: prev.hearts + 1}));

    const handleSubmit = async submitEvent => {
        submitEvent.preventDefault();
        setSubmitMessage('');
        setIsError(false);
        setIsSubmitting(true);

        try {
            const payload = new FormData();
            Object.entries(formData).forEach(([key, val]) => {
                if (key === 'preview') return;
                payload.append(key, typeof val === 'string' ? val.trim() : val)
            });

            const res = await axios.post(
                'https://foodie-fenzy-delivery-backend.vercel.app/api/items', payload, { headers: { 'Content-Type': 'multipart/form-data' }}
            );
            setFormData({ ...initialFormData })
            setSubmitMessage('Item added successfully');
            console.log(res.data);
        }
        catch (err) {
            const message = err.response?.data?.message || err.message || 'Error uploading item';
            setIsError(true);
            setSubmitMessage(message);
            console.error('Error uploading item', message);
        }
        finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className={styles.formWrapper}>
            <div className="max-w-4xl mx-auto">
                <div className={styles.formCard}>
                    <h2 className={styles.formTitle}>Add new menu Item</h2>

                    <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
                        <div className={styles.uploadWrapper}>
                            <label className={styles.uploadLabel}>
                                {formData.preview ? (
                                    <img src={formData.preview} alt="preview" className={styles.previewImage} />
                                ) : (
                                    <div className="text-center p-4">
                                        <FiUpload className={styles.uploadIcon} />
                                        <p className={styles.uploadText}>Click to upload product image</p>
                                    </div>
                                )}
                                {/* <input type="file" accept='image/*' onChange={handleInputUpload} className='hidden' required /> */}
                                <input type="file" accept='image/*' onChange={handleInputUpload} className='sr-only' required />
                            </label>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block mb-2 text-base sm:text-lg text-amber-400">
                                    Product Name
                                </label>
                                <input type="text" name='name' value={formData.name} onChange={handleInputChange} className={styles.inputField} 
                                    placeholder='Enter product name' required 
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-base sm:text-lg text-amber-400">
                                    Description
                                </label>
                                <textarea name='description' value={formData.description} onChange={handleInputChange} placeholder='Enter product description' 
                                    className={styles.inputField + 'h-32 sm:h-40'} required 
                                />
                            </div>

                            <div className={styles.gridTwoCols}>
                                <div>
                                    <label className="block mb-2 text-base sm:text-lg text-amber-400">
                                        Category
                                    </label>
                                    <select name='category' value={formData.category} onChange={handleInputChange} className={styles.inputField} required>
                                        <option value="">Select Category</option>
                                        {categories.map(category => (
                                            <option key={category} value={category} className='bg-[#3a2b2b]'>{category}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2 text-base sm:text-lg text-amber-400">
                                        Price ($)
                                    </label>
                                    <div className={styles.relativeInput}>
                                        <FaDollarSign className={styles.FaDollarSign} />
                                        <input type="number" name='price' value={formData.price} onChange={handleInputChange} className={styles.inputField + 'pl-10 sm:pl-12'} 
                                            placeholder='Enter price' min='0' step='0.01' required 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.gridTwoCols}>
                                <div>
                                    <label className=" block mb-2 text-base sm:text-lg text-amber-400">
                                        Rating
                                    </label>
                                    <div className="flex gap-2">
                                        {[1,2,3,4,5].map(star => (
                                            <button key={star} type='button' onClick={() => handleRating(star)} onMouseEnter={() => setHoverRating(star)} 
                                                onMouseLeave={() => setHoverRating(0)} className='text-2xl sm:text-3xl transition-transform hover:scale-110'
                                            >
                                                <FiStar className={star <= (hoverRating || formData.rating) ? 'text-amber-400 fill-current' : 'text-amber-10/30'} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className=" block mb-2 text-base sm:text-lg text-amber-400">
                                        Popularity
                                    </label>
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <button type='button' onClick={handleHearts} className="text-2xl sm:text-3xl text-amber-400 hover:text-amber-300 transition-colors animate-pulse">
                                            <FiHeart />
                                        </button>
                                        <input type="number" name='hearts' value={formData.hearts} onChange={handleInputChange} className={styles.inputField + 'pl-10 sm:pl-12'} 
                                            placeholder='Enter likes' min='0' required 
                                        />
                                    </div>
                                </div>
                            </div>

                            <button type='submit' className={styles.actionBtn}>
                                {isSubmitting ? 'Adding...' : 'Add To Menu'}
                            </button>
                            {submitMessage && (
                                <p className={`text-center text-sm ${isError ? 'text-red-400' : 'text-green-400'}`}>
                                    {submitMessage}
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddItems
