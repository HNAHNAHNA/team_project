import { AiOutlineMenu } from "react-icons/ai"
import Avatar from "./Avatar"
import { useState, useCallback, useRef, useEffect } from "react"
import MenuItem from "./MenuItem"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

function UserMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    }

    const { user, isLoggedIn, logout } = useAuth();

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value)
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                menuRef.current &&
                buttonRef.current &&
                !menuRef.current.contains(target) &&
                !buttonRef.current.contains(target)
            ) {
                setIsOpen((value) => !value);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative">
            <div
                className="flex flex-row items-center gap-3">
                <div
                    onClick={() => { }}
                    className="
                          hidden
                          md:block
                          text-sm
                          font-semibold
                          py-3
                          px-4
                          rounded-full 
                          hover:bg-neutral-100
                          transition
                          cursor-pointer  
                        ">
                    {isLoggedIn ?
                        <div>
                            {user?.name}さん！こんいちは！
                        </div>
                        : <div>
                            ログインしてね！
                        </div>}

                </div>
                <div
                    ref={buttonRef}
                    onClick={toggleOpen}
                    className="
                            md:py-1
                            md:px-2
                            border-[1px]
                            border-neutral-200
                            flex
                            flex-row
                            items-center
                            gap-3
                            rounded-full
                            cursor-pointer
                            hover:shadow-md
                            transition
                        ">
                    <AiOutlineMenu />
                    <div className="gidden md:block">
                        <Avatar />
                    </div>
                </div>
            </div>

            {isOpen && (
                <div
                    ref={menuRef}
                    className="
                        absolute
                        rounded-xl
                        shadow-md
                        w-[40vw]
                        md:w-3/4
                        bg-white
                        overflow-hidden
                        right-0
                        top-12
                        text-sm
                    ">
                    <div className="flex flex-col cursor-pointer">
                        <>
                            {isLoggedIn ? (
                                <>
                                    <MenuItem
                                        onClick={() => {
                                            setIsOpen(false)
                                            navigate('/mypage')
                                        }}
                                        label="マイページ"
                                    />
                                    <MenuItem
                                        onClick={() => {
                                            setIsOpen(false)
                                            navigate('/mypage?tab=reservations')
                                        }}
                                        label="予約情報"
                                    />
                                    <MenuItem 
                                        onClick={() => {
                                            setIsOpen(false)
                                            navigate('/mypage?tab=favorites')
                                        }}
                                        label="いいね！"
                                    />
                                    <MenuItem
                                        onClick={handleLogout}
                                        label="ログアウト"
                                    />
                                </>
                            ) : (
                                <MenuItem
                                    onClick={() => {
                                        setIsOpen(false);
                                        navigate('/login')
                                    }}
                                    label="ログイン"
                                />
                            )}
                        </>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserMenu