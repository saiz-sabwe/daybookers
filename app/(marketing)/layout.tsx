export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="theme-client min-h-screen bg-background text-foreground">
            {children}
        </div>
    )
}
