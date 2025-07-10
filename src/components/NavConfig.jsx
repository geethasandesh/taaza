// Navigation items and icons for both mobile and desktop nav bars
export const navItems = [
  {
    id: 'home',
    label: 'Taaza',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto">
        <path d="M12 17c2.5 0 4.5-2 4.5-4.5" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="8.5" cy="10" r="1" fill="currentColor"/>
        <circle cx="15.5" cy="10" r="1" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'categories',
    label: 'Categories',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto">
        <rect x="4" y="4" width="16" height="3" rx="1.5" fill="none" strokeWidth="1.5"/>
        <rect x="4" y="10.5" width="16" height="3" rx="1.5" fill="none" strokeWidth="1.5"/>
        <rect x="4" y="17" width="16" height="3" rx="1.5" fill="none" strokeWidth="1.5"/>
      </svg>
    )
  },
  {
    id: 'search',
    label: 'Search',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto">
        <circle cx="11" cy="11" r="6" strokeWidth="1.5"/>
        <line x1="16.5" y1="16.5" x2="21" y2="21" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'account',
    label: 'Account',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto">
        <circle cx="12" cy="8" r="4" strokeWidth="1.5"/>
        <path d="M4 20c0-2.2 3.6-4 8-4s8 1.8 8 4" strokeWidth="1.5"/>
      </svg>
    )
  }
]; 