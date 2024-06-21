import React from 'react';
import { Item } from '../helpers/types';

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full hover:bg-sky-100">
      <h2 className="text-lg font-bold mb-2">{item.title}</h2>
      <p className="text-gray-600 mb-2">{item.description}</p>
      <div className="flex justify-between">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 11a1 1 0 0 1 2 0v3a1 1 0 0 1-2 0v-3zm1-5a1 1 0 0 0-1-1h-.293a1 1 0 1 0 0 2H9a1 1 0 0 0 1-1zm2 9a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2h3zm-3-4a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v6a1 1 0 0 1-1 1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-gray-500">{item.duration} min</span>
        </div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 11a1 1 0 0 1 2 0v3a1 1 0 0 1-2 0v-3zm1-5a1 1 0 0 0-1-1h-.293a1 1 0 1 0 0 2H9a1 1 0 0 0 1-1zm2 9a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2h3zm-3-4a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v6a1 1 0 0 1-1 1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-gray-500">${item.cost}</span>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
