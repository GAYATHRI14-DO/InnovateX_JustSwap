
export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  location: string;
  imageUrl: string;
  ownerId: string;
  ownerName: string;
  createdAt: string;
}

export interface SwapProposal {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toItemId: string;
  offeredItemIds: string[];
  status: 'Pending' | 'Accepted' | 'Declined';
  createdAt: string;
}

export const ITEMS: Item[] = [
  {
    id: '1',
    title: 'Vintage Film Camera',
    description: 'A beautifully preserved vintage film camera, perfect for photography enthusiasts. Fully functional with minor wear.',
    category: 'Electronics',
    condition: 'Good',
    location: 'Brooklyn, NY',
    imageUrl: 'https://picsum.photos/seed/swap1/600/400',
    ownerId: 'user1',
    ownerName: 'Alice Green',
    createdAt: '2023-10-01'
  },
  {
    id: '2',
    title: 'Mountain Bike',
    description: 'Sturdy mountain bike, 21-speed, great for trails. Recently tuned up.',
    category: 'Sporting Goods',
    condition: 'Like New',
    location: 'Portland, OR',
    imageUrl: 'https://picsum.photos/seed/swap2/600/400',
    ownerId: 'user2',
    ownerName: 'Bob Smith',
    createdAt: '2023-10-05'
  },
  {
    id: '3',
    title: 'Wireless Headphones',
    description: 'High-quality noise-cancelling headphones. Comes with original case and charger.',
    category: 'Electronics',
    condition: 'New',
    location: 'Austin, TX',
    imageUrl: 'https://picsum.photos/seed/swap3/600/400',
    ownerId: 'user3',
    ownerName: 'Charlie Brown',
    createdAt: '2023-10-10'
  },
  {
    id: '4',
    title: 'Large Monstera Plant',
    description: 'Very healthy Monstera deliciosa. About 3 feet tall, including the pot.',
    category: 'Home & Garden',
    condition: 'Good',
    location: 'Seattle, WA',
    imageUrl: 'https://picsum.photos/seed/swap4/600/400',
    ownerId: 'user1',
    ownerName: 'Alice Green',
    createdAt: '2023-10-12'
  },
  {
    id: '5',
    title: 'Leather Designer Watch',
    description: 'Elegant leather strap watch. Needs a new battery but otherwise perfect.',
    category: 'Fashion',
    condition: 'Like New',
    location: 'Chicago, IL',
    imageUrl: 'https://picsum.photos/seed/swap5/600/400',
    ownerId: 'user4',
    ownerName: 'Diana Prince',
    createdAt: '2023-10-15'
  },
  {
    id: '6',
    title: 'Portable Bluetooth Speaker',
    description: 'Waterproof speaker with 20 hours of battery life. Great sound quality.',
    category: 'Electronics',
    condition: 'Good',
    location: 'Miami, FL',
    imageUrl: 'https://picsum.photos/seed/swap6/600/400',
    ownerId: 'user2',
    ownerName: 'Bob Smith',
    createdAt: '2023-10-20'
  }
];

export const CURRENT_USER = {
  id: 'me',
  name: 'Sam Swap',
  email: 'sam@example.com',
  avatar: 'https://picsum.photos/seed/me/100/100'
};

export const MY_ITEMS: Item[] = [
  {
    id: 'my-1',
    title: 'Espresso Machine',
    description: 'Manual espresso machine, works great. Upgrading to a semi-automatic.',
    category: 'Home & Garden',
    condition: 'Good',
    location: 'Brooklyn, NY',
    imageUrl: 'https://picsum.photos/seed/myitem1/600/400',
    ownerId: 'me',
    ownerName: 'Sam Swap',
    createdAt: '2023-11-01'
  },
  {
    id: 'my-2',
    title: 'Board Game Collection',
    description: 'A set of 5 classic board games including Settlers of Catan and Ticket to Ride.',
    category: 'Entertainment',
    condition: 'Like New',
    location: 'Brooklyn, NY',
    imageUrl: 'https://picsum.photos/seed/myitem2/600/400',
    ownerId: 'me',
    ownerName: 'Sam Swap',
    createdAt: '2023-11-05'
  }
];
