export function ErrorBanner({ message }: { message: string }) {
    return (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{message}</p>
    );
}
