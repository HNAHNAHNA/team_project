import React from 'react'

interface StayButtonProps {
    buttonName: string;
    colorClass?: string;
}

function StayButton({ buttonName, colorClass = "bg-gray-200" }: StayButtonProps) {
    return (
        <button className={`cursor-pointer border-[2px] py-2 px-4 rounded-2xl ${colorClass}`}>
            {buttonName}
        </button>
    )
}

export default StayButton
