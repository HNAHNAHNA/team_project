function AccountMenu() {
    return (
        <div
            className="absolute flex flex-col justify-center items-center p-2 top-2 right-2 border border-gray-100 rounded-full"
        >
            <div
                className="rounded-full hover:shadow-xl"
            >
                <a href="/login">
                아이디
                </a>
            </div>
            <div>
                <a href="/signup">회원가입</a>
            </div>
        </div>
    )
}

export default AccountMenu