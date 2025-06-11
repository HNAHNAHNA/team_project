import type { MenuItemProps } from "../../types/MenuItemProps"

function MenuItem({ onClick, label }: MenuItemProps) {
    return (
        <div
            onClick={onClick}
            className="
                px-4
                py-3
                hover:bg-neutral-100
                transition
                font-semibold
            "
        >
            {label}
        </div>
    )
}

export default MenuItem