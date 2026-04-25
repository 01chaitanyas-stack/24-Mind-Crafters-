export const createUser = (email, password, name) => {
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[email]) return { error: 'User already exists' };
  users[email] = { password, name };
  localStorage.setItem('users', JSON.stringify(users));
  return { success: true };
};

export const getUser = (email, password) => {
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[email] && users[email].password === password) {
    return { email, name: users[email].name };
  }
  return null;
};

export const saveSession = (user) => {
  localStorage.setItem('session', JSON.stringify(user));
};

export const getSession = () => {
  return JSON.parse(localStorage.getItem('session'));
};

export const isLoggedIn = () => {
  return !!localStorage.getItem('session');
};

export const clearSession = () => {
  localStorage.removeItem('session');
};
