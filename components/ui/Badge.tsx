import React from 'react'

interface BadgeProps {
    children: React.ReactNode
    variant?: 'pending' | 'production' | 'shipped' | 'completed' | 'default'
    className?: string
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    className = '',
}) => {
    const variants = {
        pending: 'badge-pending',
        production: 'badge-production',
        shipped: 'badge-shipped',
        completed: 'badge-completed',
        default: 'bg-gray-100 text-gray-800',
    }

    return (
        <span className={`badge ${variants[variant]} ${className}`}>
            {children}
        </span>
    )
}
