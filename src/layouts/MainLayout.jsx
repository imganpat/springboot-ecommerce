const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex justify-center items-center overflow-hidden bg-background text-foreground">
            {children}
        </div>
    );
};

export default MainLayout;