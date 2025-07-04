import logo from '../../../public/staynguide_logo_transparent.png'

function Logo () {
    return (
        <a 
            href="/"
            className="flex items-center h-full"
        >
            <img 
            src={logo}
            className="h-26 w-auto object-contain"
            ></img>
        </a>
    )
}

export default Logo