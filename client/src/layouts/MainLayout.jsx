const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen w-full flex justify-center items-center overflow-hidden bg-background text-foreground">
            {children}
        </div>
    );
};

export default MainLayout;