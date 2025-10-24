import {useEffect} from "react";

export function useKeyboardShortcut(
    key: string,
    callback: () => void,
    options?: {
        ctrl?: boolean;
        shift?: boolean;
        alt?: boolean;
    }
) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement;
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) {
                return;
            }

            const keyMatch = event.key.toLowerCase() === key.toLowerCase();
            const ctrlMatch = options?.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
            const shiftMatch = options?.shift ? event.shiftKey : !event.shiftKey;
            const altMatch = options?.alt ? event.altKey : !event.altKey;

            if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
                event.preventDefault();
                callback();
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [key, callback, options]);
}