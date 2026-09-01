const MainLayout = ({ children }) => {
    return (
        <div className="flex h-screen items-center justify-center">
            {children}
        </div>
    );
};

export default MainLayout;