
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import SubmissionForm from './components/SubmissionForm';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import ItemFeed from './components/ItemFeed';
import MyItems from './components/MyItems';
import EditItemModal from './components/EditItemModal';
import VerifyEmail from './components/VerifyEmail';
import { Item, View, ItemType, ItemStatus, Filter, User } from './types';
import { sendVerificationEmail } from './emailService';

// --- Password Hashing Utility ---
// IMPORTANT: This is a simple, client-side hashing demonstration for a school project.
// In a real-world application, password hashing and user authentication MUST be handled
// on a secure server using libraries like bcrypt. Storing password hashes in localStorage
// is not secure.
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.FEED);

  // --- State Management ---
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [filter, setFilter] = useState<Filter>({ type: 'all', location: '', dateSort: 'newest', searchQuery: '' });
  const [emailToVerify, setEmailToVerify] = useState<string | null>(null);

  // --- Data Persistence with localStorage ---
  useEffect(() => {
    // Initialize data from localStorage on first load
    const savedUsers = localStorage.getItem('lostAndFoundUsers');
    const savedItems = localStorage.getItem('lostAndFoundItems');
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Seed an admin user if no users exist
      hashPassword('schooladmin123').then(hash => {
        const adminUser = { id: 'admin-user', email: 'admin@school.com', passwordHash: hash, isAdmin: true, isVerified: true };
        setUsers([adminUser]);
      });
    }

    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      // Seed with mock data
      setItems([
        { id: '1', name: 'Student ID Card', description: 'Belongs to Jane Doe, Grade 11.', location: 'Cafeteria', date: '2024-05-10', type: ItemType.LOST, status: ItemStatus.APPROVED, userId: 'user-1', imageUrl: 'https://picsum.photos/id/101/400/300' },
        { id: '2', name: 'Blue Water Bottle', description: 'HydroFlask with a sticker of a planet.', location: 'Gym', date: '2024-05-12', type: ItemType.FOUND, status: ItemStatus.APPROVED, userId: 'user-2', imageUrl: 'https://picsum.photos/id/102/400/300' },
        { id: '3', name: 'Physics Textbook', description: 'Has highlighting on chapter 3.', location: 'Library', date: '2024-05-09', type: ItemType.LOST, status: ItemStatus.APPROVED, userId: 'user-1', imageUrl: 'https://picsum.photos/id/103/400/300' },
        { id: '4', name: 'Wireless Earbuds', description: 'A single white earbud in its case.', location: 'Courtyard', date: '2024-05-11', type: ItemType.FOUND, status: ItemStatus.PENDING, userId: 'user-2', imageUrl: 'https://picsum.photos/id/104/400/300' },
        { id: '5', name: 'Black Hoodie', description: 'Plain black hoodie, size medium.', location: 'Main Hall', date: '2024-05-13', type: ItemType.FOUND, status: ItemStatus.PENDING, userId: 'admin-user', imageUrl: 'https://picsum.photos/id/106/400/300' },
      ]);
    }
    
    const sessionUser = sessionStorage.getItem('lostAndFoundCurrentUser');
    if(sessionUser) {
        setCurrentUser(JSON.parse(sessionUser));
    }
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('lostAndFoundUsers', JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('lostAndFoundItems', JSON.stringify(items));
    }
  }, [items]);

  // --- Auth Handlers ---
  const handleRegister = async (email: string, password: string): Promise<boolean> => {
    if (users.find(u => u.email === email)) {
      alert('An account with this email already exists.');
      return false;
    }
    const passwordHash = await hashPassword(password);
    const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newUser: User = { id: Date.now().toString(), email, passwordHash, isAdmin: false, isVerified: false, confirmationCode };
    setUsers([...users, newUser]);
    
    // Store the verification code for retrieval
    localStorage.setItem(`verificationCode_${email}`, confirmationCode);
    
    // Try to send verification email
    const emailSent = await sendVerificationEmail(email, confirmationCode);
    
    if (emailSent) {
      alert(`Registration Successful!\n\nA verification code has been sent to ${email}.\n\nPlease check your email and enter the code on the next screen.`);
    } else {
      alert(`Registration Successful!\n\nFor demonstration purposes, your verification code is:\n\n${confirmationCode}\n\n(Email could not be sent. Using demo mode.)`);
    }
    
    setEmailToVerify(email);
    setView(View.VERIFY_EMAIL);
    return true;
  };

  const handleVerifyEmail = async (code: string): Promise<boolean> => {
    const userToVerify = users.find(u => u.email === emailToVerify);
    if (userToVerify && userToVerify.confirmationCode === code) {
      const updatedUser = { ...userToVerify, isVerified: true, confirmationCode: undefined };
      delete updatedUser.confirmationCode; // Clean up the code
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      
      // Clean up stored verification code
      if (emailToVerify) {
        localStorage.removeItem(`verificationCode_${emailToVerify}`);
      }
      
      alert('Email verified successfully! You can now log in.');
      setEmailToVerify(null);
      setView(View.LOGIN);
      return true;
    }
    return false;
  };

  const handleResendCode = async () => {
    const userToVerify = users.find(u => u.email === emailToVerify);
    if (userToVerify) {
      const newConfirmationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const updatedUser = { ...userToVerify, confirmationCode: newConfirmationCode };
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      
      // Update stored verification code
      if (emailToVerify) {
        localStorage.setItem(`verificationCode_${emailToVerify}`, newConfirmationCode);
      }
      
      // Send the new code via email
      const emailSent = await sendVerificationEmail(emailToVerify, newConfirmationCode);
      
      if (emailSent) {
        alert(`A new verification code has been sent to ${emailToVerify}.`);
      } else {
        alert(`A new verification code has been generated:\n\n${newConfirmationCode}\n\n(Email could not be sent. Using demo mode.)`);
      }
    }
  };

  const handleLogin = async (email: string, password: string): Promise<{success: boolean; error?: string}> => {
    const user = users.find(u => u.email === email);
    if (user) {
      const passwordHash = await hashPassword(password);
      if (user.passwordHash === passwordHash) {
        if (!user.isVerified) {
          setEmailToVerify(email);
          setView(View.VERIFY_EMAIL);
          alert('This account is not verified. Please complete the verification step.');
          return { success: false };
        }
        
        setCurrentUser(user);
        sessionStorage.setItem('lostAndFoundCurrentUser', JSON.stringify(user));
        setView(View.FEED);
        return { success: true };
      }
    }
    return { success: false, error: 'Invalid email or password. Please try again.' };
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('lostAndFoundCurrentUser');
    setView(View.FEED);
  };

  // --- Item Handlers ---
  const addItem = (newItem: Omit<Item, 'id' | 'status' | 'userId'>) => {
    if (!currentUser) {
        alert("You must be logged in to submit an item.");
        return;
    }
    setItems(prevItems => [
      ...prevItems,
      { ...newItem, id: Date.now().toString(), status: ItemStatus.PENDING, userId: currentUser.id }
    ]);
    alert('Item submitted for review!');
    setView(View.MY_ITEMS);
  };

  const updateItem = (updatedItem: Item) => {
    setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item));
    setEditingItem(null); // Close modal
  };
  
  const updateItemStatus = (id: string, status: ItemStatus) => {
    setItems(items.map(item => item.id === id ? { ...item, status } : item));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  // --- Memoized Data for Performance ---
  const approvedItems = useMemo(() => items.filter(item => item.status === ItemStatus.APPROVED), [items]);
  const pendingItems = useMemo(() => items.filter(item => item.status === ItemStatus.PENDING), [items]);
  
  const filteredItems = useMemo(() => {
    return approvedItems
      .filter(item => {
        const searchLower = filter.searchQuery.toLowerCase();
        return filter.searchQuery === '' || 
               item.name.toLowerCase().includes(searchLower) ||
               item.description.toLowerCase().includes(searchLower);
      })
      .filter(item => filter.type === 'all' || item.type === filter.type)
      .filter(item => item.location.toLowerCase().includes(filter.location.toLowerCase()))
      .sort((a, b) => {
        if (filter.dateSort === 'newest') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        } else {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
      });
  }, [approvedItems, filter]);
  
  const userItems = useMemo(() => {
      if (!currentUser) return [];
      return items.filter(item => item.userId === currentUser.id)
                  .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [items, currentUser]);


  // --- View Rendering ---
  const renderContent = () => {
    switch (view) {
      case View.SUBMIT:
        return currentUser ? <SubmissionForm onSubmit={addItem} /> : <Login onLogin={handleLogin} setView={setView} />;
      case View.ADMIN:
        return currentUser?.isAdmin ? <AdminDashboard pendingItems={pendingItems} approvedItems={approvedItems} onUpdateStatus={updateItemStatus} onDelete={deleteItem} onEdit={setEditingItem} /> : <div className="text-center p-8"><h2 className="text-2xl font-bold">Access Denied</h2><p>You must be an administrator to view this page.</p></div>;
      case View.LOGIN:
        return <Login onLogin={handleLogin} setView={setView}/>;
      case View.REGISTER:
        return <Register onRegister={handleRegister}/>;
      case View.VERIFY_EMAIL:
        return <VerifyEmail email={emailToVerify} onVerify={handleVerifyEmail} onResend={handleResendCode} setView={setView} />;
      case View.MY_ITEMS:
        return currentUser ? <MyItems items={userItems} /> : <Login onLogin={handleLogin} setView={setView} />;
      case View.FEED:
      default:
        return <ItemFeed items={filteredItems} filter={filter} setFilter={setFilter} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header setView={setView} currentUser={currentUser} onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      {editingItem && currentUser?.isAdmin && (
        <EditItemModal item={editingItem} onUpdate={updateItem} onClose={() => setEditingItem(null)} />
      )}
    </div>
  );
};

export default App;
    