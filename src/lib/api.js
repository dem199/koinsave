const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Generic API call function
async function apiCall(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// Auth API calls
export const authAPI = {
  login: async (email, password) => {
    // Mock authentication - check if user exists in db.json
    const users = await apiCall('/users');
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Generate mock token
    const token = btoa(`${user.id}:${Date.now()}`);
    
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        currency: user.currency,
        accountNumber: user.accountNumber,
      },
      token,
    };
  },

  signup: async (userData) => {
    // Check if user already exists
    const users = await apiCall('/users');
    const existingUser = users.find(u => u.email === userData.email);

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const newUser = {
      id: String(users.length + 1),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      balance: 0,
      currency: 'USD',
      accountNumber: String(Math.floor(Math.random() * 10000000000)),
      createdAt: new Date().toISOString(),
    };

    const createdUser = await apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(newUser),
    });

    // Generate mock token
    const token = btoa(`${createdUser.id}:${Date.now()}`);

    return {
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        balance: createdUser.balance,
        currency: createdUser.currency,
        accountNumber: createdUser.accountNumber,
      },
      token,
    };
  },

  getCurrentUser: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      throw new Error('No token found');
    }

    // Decode token to get user ID
    const userId = atob(token).split(':')[0];
    const user = await apiCall(`/users/${userId}`);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      balance: user.balance,
      currency: user.currency,
      accountNumber: user.accountNumber,
    };
  },
};

// Transaction API calls
export const transactionAPI = {
  getTransactions: async (userId) => {
    const transactions = await apiCall(`/transactions?userId=${userId}`);
    return transactions;
  },

  createTransaction: async (transactionData) => {
    const transaction = await apiCall('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
    return transaction;
  },
};

// User API calls
export const userAPI = {
  updateBalance: async (userId, newBalance) => {
    const user = await apiCall(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ balance: newBalance }),
    });
    return user;
  },
};