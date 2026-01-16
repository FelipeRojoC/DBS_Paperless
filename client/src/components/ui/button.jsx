import React from "react"

export function Button({ className, variant = "default", size = "default", ...props }) {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none"
    // Minimal variant handling just to not break if classes are missing, 
    // but mostly relying on className passed from parent
    return <button className={`${baseStyles} ${className}`} {...props} />
}
