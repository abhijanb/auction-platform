export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-white rounded-2xl shadow-lg p-8 ${className}`}>
            {children}
        </div>
    );
}
