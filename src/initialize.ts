// Clear all Supabase and app-specific auth/session keys from localStorage and sessionStorage

// Remove Supabase keys
Object.keys(localStorage).forEach(key => {
  if (
    key.startsWith('supabase.auth.token') ||
    key.startsWith('sb-') && key.endsWith('-auth-token')
  ) {
    localStorage.removeItem(key);
  }
});

// Remove any app-specific keys (add more as needed)
localStorage.removeItem('user');
localStorage.removeItem('auth');
sessionStorage.clear(); // Optional: clear all session storage

// Optionally, clear all localStorage (uncomment if you want a full reset)
// localStorage.clear();