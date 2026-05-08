import React, { useEffect, useState } from 'react'
import { useCart } from '../../cartContext/useCart';
// import { dummyMenuData } from '../../assets/OmhDD'
import { FaMinus, FaPlus } from "react-icons/fa";
import { Link } from 'react-router-dom'
import axios from 'axios'
import './OurHomeMenu.css'

const API_URL = 'https://foodie-fenzy-delivery-backend.vercel.app';
const categories = ['Breakfast', 'Lunch', 'Dinner', 'Mexican', 'Italian', 'Desserts', 'Drinks'];

const OurHomeMenu = () => {
    const [ activeCategory, setActiveCategory ] = useState(categories[0]);
    const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();
    const [menuData, setMenuData] = useState({});

    useEffect(() => {
        axios.get(`${API_URL}/api/items`)
        .then(res => {
            const grouped = res.data.reduce((account, item) => {
                account[item.category] = account[item.category] || [];
                account[item.category].push(item)
                return account;
            }, {})
            setMenuData(grouped)
            console.log(grouped)
            console.log("item list", res.data)
        })
        .catch(console.error)
    }, [])

    // USE ID TO FIND AND UPDATE
    const getCartEntry = id => cartItems.find(ci => ci.item?._id === id);
    const getQuantity = id => getCartEntry(id)?.quantity || 0;
    const displayItems = (menuData[activeCategory] || []).slice(0, 4);

    if (!menuData || Object.keys(menuData).length === 0) {
        return <div className="text-center text-amber-100">Loading menu...</div>;
    }

    return (
        <div className='bg-linear-to-br from-[#1a120b] via-[#2a1e14] to-[#3e2b1d] min-h-screen py-16 
            px-4 sm:px-6 lg:px-8'
        >
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-12 bg-clip-text 
                    text-transparent bg-linear-to-r from-amber-200 via-amber-300 to-amber-200"
                >
                    <span className="font-dancingscript block text-5xl md:text-7xl sm:text-6xl mb-2">
                        Our Exquisite Menu
                    </span>
                    <span className="block text-xl sm:text-2xl md:text-3xl font-cinzel mt-4 text-amber-100/80">
                        A Symphony of Flavours
                    </span>
                </h2>

                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 sm:px-6 py-2 
                            rounded-full border-2 transition-all duration-300 transform font-cinzel text-sm 
                            sm:text-lg tracking-widest backdrop-blur-sm ${activeCategory === cat ? 
                                'bg-linear-to-r from-amber-900/80 to-amber-700/80 border-amber-800 scale-105 shadow-xl shadow-lime-900/30' 
                                : 'bg-amber-900/20 border-amber-800/30 text-teal-100/80 hover:bg-amber-800/40 hover:scale-95'
                            }`}>
                                {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                    {displayItems.map((item, index) => {
                        const qty = getQuantity(item._id);
                        const cartEntry = getCartEntry(item._id);

                        return (
                            <div key={item._id} className="relative bg-amber-900/20 rounded-2xl overflow-hidden 
                                border border-amber-800/30 backdrop-blur-sm flex flex-col transition-all duration-500"
                                style={{ '--index' : index}}
                            >
                                {/* FIXED: Removed 'required:' */}
                                <div className="h-48 sm:h-56 md:h-60 flex items-center justify-center bg-black/10">
                                    <img src={item.imageUrl} alt={item.name} className='max-h-full max-w-full object-contain
                                        transition-all duration-700' />
                                </div>
                            
                                <div className="p-4 sm:p-6 flex flex-col grow">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-linear-to-r from-transparent via-amber-800/50 to-transparent opacity-50 transition-all duration-300" />
                                    <h3 className="text-xl sm:txt-2xl mb-2 font-dancingscript text-amber-100 transition-colors">
                                        {item.name} 
                                    </h3>
                                    <p className="text-amber-100/80 text-xs sm:text-sm mb-4 font-cinzel leading-relaxed">
                                        {item.description}
                                    </p>

                                    <div className="mt-auto flex items-center gap-4 justify-between">
                                        <div className="bg-amber-100/10 backdrop-blur-sm px-3 py-1 rounded-2xl shadow-lg">
                                            <span className="text-xl font-bold text-amber-300 font-dancingscript">
                                                {/* ${Number(item.price).toFixed(2)} */}
                                                ${(Number(item.price) * qty).toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {qty > 0 ? (
                                                <>
                                                    <button className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-800/50 
                                                        transition-colors" onClick={() => qty > 1 ? updateQuantity(cartEntry._id, qty - 1) : removeFromCart(cartEntry._id)}
                                                    >
                                                        <FaMinus className="text-amber-100" />    
                                                    </button>
                                                    <span className="w-8 text-center text-amber-100">
                                                        {qty}
                                                    </span>
                                                    <button className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-800/50 
                                                        transition-colors" onClick={() => updateQuantity(cartEntry._id, qty + 1)}
                                                    >
                                                        <FaPlus className="text-amber-100" />
                                                    </button>
                                                </>
                                            ) : (
                                                <button onClick={() => addToCart(item, 1)} className='bg-amber-900/40 px-4 py-1.5 rounded-full font-cinzel text-sm uppercase sm:text-sm tracking-wider duration-300 transition-transform 
                                                    hover:scale-110 hover:shadow-lg hover:shadow-amber-900/20 relative overflow-hidden border border-amber-800/50'
                                                >
                                                    <span className="relative z-10 text-sm text-black">
                                                        Add to Cart
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="flex justify-center mt-16">
                    <Link to='/menu' className=' border-2 border-amber-800/30 text-amber-100 px-8 sm:px-10 py-3 rounded-full font-cinzel 
                        uppercase tracking-widest transition-all duration-300 hover:bg-amber-800/40 hover:text-amber-50 hover:scale-105 
                        hover:shadow-lg hover:shadow-amber-900/20 backdrop-blur-sm'
                    >
                        Explore Full Menu
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default OurHomeMenu;
