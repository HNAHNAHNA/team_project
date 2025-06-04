import Logo from "../features/nav/Logo"
import "../styles/footer.css"

function Footer() {
    return (
        <div className="h-[334px] w-full bg-gray-400">
            <div className="max-w-7xl mx-auto h-full flex flex-raw items-center justify-between px-4">
                <div>
                    <Logo />
                </div>
                <section className="w-1/4 ml-3 flex flex-col items-start">
                    <h3 className="text-center">About</h3>
                    <ul className="leading-loose self-start text-left">
                        <li><a href="#" className="text-sm hover:underline">こんにちは！</a></li>
                        <li><a href="#" className="text-sm hover:underline">Liです！</a></li>
                        <li><a href="#" className="text-sm hover:underline">初めまして！</a></li>
                    </ul>
                </section>
                <section className="w-1/4 ml-3 flex flex-col items-start">
                    <h3 className="text-center">About</h3>
                    <ul className=" mt-2 leading-loose self-start text-left">
                        <li><a href="#" className="text-sm hover:underline">こんにちは！</a></li>
                        <li><a href="#" className="text-sm hover:underline">Liです！</a></li>
                        <li><a href="#" className="text-sm hover:underline">初めまして！</a></li>
                    </ul>
                </section>
                <section className="w-1/4 ml-3 flex flex-col items-start">
                    <h3 className="text-center">About</h3>
                    <ul className="mt-2 leading-loose self-start text-left">
                        <li><a href="#" className="text-sm hover:underline">こんにちは！</a></li>
                        <li><a href="#" className="text-sm hover:underline">Liです！</a></li>
                        <li><a href="#" className="text-sm hover:underline">初めまして！</a></li>
                    </ul>
                </section>
                <section className="w-1/4 ml-3 flex flex-col items-start">
                    <h3 className="text-center">About</h3>
                    <ul className="mt-2 leading-loose self-start text-left">
                        <li><a href="#" className="text-sm hover:underline">こんにちは！</a></li>
                        <li><a href="#" className="text-sm hover:underline">Liです！</a></li>
                        <li><a href="#" className="text-sm hover:underline">初めまして！</a></li>
                    </ul>
                </section>
            </div>
        </div>
    )
}

export default Footer