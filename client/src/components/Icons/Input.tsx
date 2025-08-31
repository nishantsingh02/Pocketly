interface InputProps {
    reference: React.RefObject<HTMLInputElement | null>;
    placeholder: string;
    className?: string;  // Make className optional
}

export const Input: React.FC<InputProps> = ({ reference, placeholder, className }) => {
    return (
        <input
            ref={reference}
            type="text"
            placeholder={placeholder}
            className={`rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${className || ''}`}
        />
    );
};