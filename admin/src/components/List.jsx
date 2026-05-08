import React, { useEffect, useState } from 'react'
import { styles } from '../assets/dummyadmin'
import { FiHeart, FiStar, FiTrash2 } from 'react-icons/fi'
import axios from 'axios'

const API_URL = 'https://foodie-fenzy-delivery-backend.vercel.app';

const List = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const {data} = await axios.get(`${API_URL}/api/items`)
        setItems(data);
      }
      catch (error) {
        console.error('Error fetching Items:', error);
      } 
      finally {
        setLoading(false)
      }
    };
    fetchItems();
  }, [])

  // DELETE ITEMS
  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await axios.delete(`${API_URL}/api/items/${itemId}`);
      setItems(prev => prev.filter(item => item._id !== itemId))
      console.log('Deleted item ID:', itemId);
    }
    catch (err) {
      console.error('Error deleting item:', err)
    }
  }

  const renderStars = (rating) => 
  [...Array(5)].map((_, index) => (
    <FiStar className={`text-xl ${index < rating ? 'text-amber-400 fill-current' : 'text-amber-100/30'}`} 
      key={index} 
    />
  ))

  if (loading) {
    return (
      <div className={styles.pageWrapper.replace(/bg-gradient-to-br.*/, '').concat('flex items-center justify-center font-bold text-2xl text-amber-400')}>
        Loading Menu...
      </div>
    )
  }

  return (
    <div className={styles.pageWrapper}>
      <div className="max-w-7xl mx-auto">
        <div className={styles.cardContainer}>
          <h2 className={styles.title}>Manage Menu Items</h2>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  <th className={styles.th}>Image</th>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Category</th>
                  <th className={styles.th}>Price ($)</th>
                  <th className={styles.th}>Rating</th>
                  <th className={styles.th}>Hearts</th>
                  <th className={styles.thCenter}>Delete</th>
                </tr>
              </thead>

              <tbody>
                {items.map(item => (
                  <tr key={item._id} className={styles.tr}>
                    <td className={styles.imgCell}>
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className={styles.img}
                        />
                      ) : (
                        <div className="text-xs text-amber-200/50">No Image</div>
                      )}
                    </td>
                    <td className={styles.nameCell}>
                      <div className="space-y-1">
                        <p className={styles.nameText}>{item.name}</p>
                        <p className={styles.descText}>{item.description}</p>
                      </div>
                    </td>

                    <td className={styles.categoryCell}>{item.category}</td>
                    <td className={styles.priceCell}>{item.price}</td>
                    <td className={styles.ratingCell}>
                      <div className="flex gap-1">{renderStars(item.rating)}</div>
                    </td>

                    <td className={styles.heartsCell}>
                      <div className={styles.heartsWrapper}>
                        <FiHeart className='text-xl' />
                        <span>{item.hearts}</span>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <button onClick={() => handleDelete(item._id)} className={styles.deleteBtn}>
                        <FiTrash2 className='text-2xl' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {items.length === 0 && (
              <div className={styles.emptyState}>
                No items found in the menu
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default List
