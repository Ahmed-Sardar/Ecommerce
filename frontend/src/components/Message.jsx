const Message = ({ variant = 'info', children }) => {
    let colorClass = 'bg-blue-100 text-blue-700 border-blue-400';
    if (variant === 'danger' || variant === 'error') colorClass = 'bg-red-100 text-red-700 border-red-400';
    if (variant === 'success') colorClass = 'bg-green-100 text-green-700 border-green-400';
    if (variant === 'warning') colorClass = 'bg-yellow-100 text-yellow-700 border-yellow-400';

    return (
        <div className={`border-l-4 p-4 mb-4 ${colorClass}`} role="alert">
            {children}
        </div>
    );
};

export default Message;
