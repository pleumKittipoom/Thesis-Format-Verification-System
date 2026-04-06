import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline'
    children: ReactNode
}

export const Button = ({
    variant = 'primary',
    children,
    className = '',
    ...props
}: ButtonProps) => {
    const baseStyles = "px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300 border font-body"

    const getVariantClass = () => {
        switch (variant) {
            case 'primary': return 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-transparent shadow-lg shadow-primary-glow hover:-translate-y-0.5 hover:shadow-xl'
            case 'secondary': return 'bg-surface/50 text-text border-glass-border hover:bg-surface/80 hover:border-text-muted'
            case 'outline': return 'bg-transparent border-text-muted text-text-muted hover:border-primary hover:text-primary'
            default: return ''
        }
    }

    return (
        <button
            className={`${baseStyles} ${getVariantClass()} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}
