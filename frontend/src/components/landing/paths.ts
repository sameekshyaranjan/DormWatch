/** Home route for each signed-in role. */
export const dashboardPath = (role?: string) =>
  role === 'owner' ? '/owner/dashboard' : role === 'admin' ? '/admin' : '/dashboard';
