const bcrypt = require('bcryptjs');

// Mock users database
// In a real app, this would come from MongoDB/PostgreSQL.
const users = [
  {
    id: "1",
    email: "admin@aigenius.com",
    password: bcrypt.hashSync("Admin@123", 10),
    role: "Admin",
  },
  {
    id: "2",
    email: "premium@aigenius.com",
    password: bcrypt.hashSync("Premium@123", 10),
    role: "Premium_User",
  },
  {
    id: "3",
    email: "free@aigenius.com",
    password: bcrypt.hashSync("Free@123", 10),
    role: "Free_User",
  },
];

// Refresh token whitelist storage
const refreshTokens = [];

const findUserByEmail = (email) => {
  return users.find((user) => user.email === email);
};

const findUserById = (id) => {
  return users.find((user) => user.id === id);
};

const saveRefreshToken = (userId, token) => {
  refreshTokens.push({ userId, token });
};

const findRefreshToken = (token) => {
  return refreshTokens.find((item) => item.token === token);
};

const removeRefreshToken = (token) => {
  const index = refreshTokens.findIndex((item) => item.token === token);
  if (index !== -1) {
    refreshTokens.splice(index, 1);
  }
};

module.exports = {
  users,
  refreshTokens,
  findUserByEmail,
  findUserById,
  saveRefreshToken,
  findRefreshToken,
  removeRefreshToken,
};