export function ProductGrid({ children }: { children: React.ReactNode }) {
    return (
     <div className="grid grid-cols-2 gap-2 md:gap-6 md:grid-cols-3 lg:grid-cols-3">
        {children}
      </div>
    )
  }
  
