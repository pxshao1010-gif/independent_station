import React from 'react'

// Small Icon component to centralize SVGs used across forms.
// Usage: <Icon name="email" /> | name: 'email' | 'lock' | 'user'
export default function Icon({ name, className = '', width, height, stroke = '#6b4a3a', ...props }) {
  const w = width || (name === 'lock' ? 16 : 18)
  const h = height || (name === 'lock' ? 16 : 18)

  if (name === 'email') {
    return (
      <svg className={className} width={w} height={h} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M3 6.5C3 5.67157 3.67157 5 4.5 5H19.5C20.3284 5 21 5.67157 21 6.5V17.5C21 18.3284 20.3284 19 19.5 19H4.5C3.67157 19 3 18.3284 3 17.5V6.5Z" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 6L12 13L3 6" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }

  if (name === 'lock') {
    return (
      <svg className={className} width={w} height={h} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="3" y="11" width="18" height="10" rx="2" stroke={stroke} strokeWidth="1.2"/>
        <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }

  if (name === 'user' || name === 'person') {
    return (
      <svg className={className} width={w} height={h} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }

  // Fallback: empty span to avoid breaking layout
  return <span />
}
