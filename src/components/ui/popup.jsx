import { useEffect } from "react";

import { Button } from "@/components/ui/button";

const Popup = ({
    open,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    children,
    confirmVariant = "default",
}) => {
    useEffect(() => {
        if (!open) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onCancel?.();
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [open, onCancel]);

    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onCancel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-title"
        >
            <div
                className="w-full max-w-md rounded-xl border border-border bg-background p-4! shadow-xl"
                onClick={(event) => event.stopPropagation()}
            >
                {title && (
                    <h2 id="popup-title" className="text-xl font-semibold text-foreground">
                        {title}
                    </h2>
                )}

                {description && (
                    <p className="mt-3 text-sm text-muted-foreground">{description}</p>
                )}

                {children}

                <div className="mt-6 flex justify-end gap-3">
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel}>
                            {cancelText}
                        </Button>
                    )}

                    {onConfirm && (
                        <Button type="button" variant={confirmVariant} onClick={onConfirm}>
                            {confirmText}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Popup;
