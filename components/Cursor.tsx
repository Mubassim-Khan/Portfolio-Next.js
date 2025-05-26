'use client';

import { useEffect } from 'react';

import Cursor from "@/assets/images/cursor.png";
import CursorPointer from "@/assets/images/cursor-pointer.png";

const CustomCursor = () => {
    useEffect(() => {
        const cursor = document.querySelector('.cursor') as HTMLDivElement | null;
        const trail = document.querySelector('.cursor-trail') as HTMLDivElement | null;

        const hoverElements = document.querySelectorAll('button, a, .cursor--pointer');

        const isMobileView = (): boolean => {
            return window.innerWidth <= 750 || 'ontouchstart' in window;
        };

        const updateCursorDisplay = () => {
            const display = isMobileView() ? 'none' : 'flex';
            if (cursor) cursor.style.display = display;
            if (trail) trail.style.display = display;
        };

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX: x, clientY: y } = e;
            if (cursor) {
                cursor.style.transform = `translate(${x}px, ${y}px)`;
            }
            if (trail) {
                setTimeout(() => {
                    trail.style.transform = `translate(${x}px, ${y}px)`;
                }, 50);
            }
        };

        updateCursorDisplay();

        if (!isMobileView()) {
            document.addEventListener('mousemove', handleMouseMove);
        }

        window.addEventListener('resize', updateCursorDisplay);

        hoverElements.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                if (cursor) {
                    const img = cursor.querySelector('img') as HTMLImageElement | null;
                        if (img) img.src = CursorPointer.src;
                }
            });

            el.addEventListener('mouseleave', () => {
                if (cursor) {
                    const img = cursor.querySelector('img') as HTMLImageElement | null;
                    if (img) img.src = Cursor.src;
                }
            });
        });

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', updateCursorDisplay);
        };
    }, []);

    return (
        <>
            <div className="cursor z-[99999] pointer-events-none">
                <img
                    src={Cursor.src}
                    alt="cursor"
                    width={32}
                    height={32}
                    draggable={false}
                />
            </div>
            <div className="cursor-trail"></div>
        </>
    );
};

export default CustomCursor;
