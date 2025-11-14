export const ROLES = {
  
  ADMIN: 'ADMIN',
  USER: 'USER'

};

export const hasRole = (user, requiredRole) => {
  if (!user || !user.role) return false;
  return user.role === requiredRole;
};

export const isAdmin = (user) => hasRole(user, ROLES.ADMIN);

export const isUser = (user) => hasRole(user, ROLES.USER);

export const getRoleLabel = (role) => {
  const labels = {
    ADMIN: 'Administrador',
    USER: 'Miembro'
  };
  return labels[role] || 'Desconocido';
};