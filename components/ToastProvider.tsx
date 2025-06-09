import { Toaster } from 'react-hot-toast'

interface ToasterProviderProps {
    children: React.ReactNode;
}

export const ToasterProvider = ({ children }: ToasterProviderProps) => {
    return (
        <>
            <Toaster
                position='top-center'
                toastOptions={{
                    style: {
                        background: "#fff",
                        color: "#000",
                    },
                }}
            />
            {children}
        </>
    )
}