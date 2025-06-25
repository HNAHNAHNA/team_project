interface StayButtonProps {
    buttonName: string;
    colorClass?: string;
    onClick?: () => void;
}

function StayButton({ buttonName, colorClass = "bg-gray-200", onClick }: StayButtonProps) {
    return (
        <button 
            onClick={onClick}
            className={`cursor-pointer border-[2px] py-2 px-4 rounded-2xl ${colorClass}`}
            >
            {buttonName}
        </button>
    )
}

export default StayButton
