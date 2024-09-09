export const checkRole = (user, requiredRole) => {
    if (!user || !user.role) return false;
    return user.role === requiredRole;
};
