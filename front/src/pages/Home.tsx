import '../App.css'
import HotelMap from '../features/accommodations/HotelMap'
import Navbar from '../features/nav/Navigation'
import Footer from '../footer/Footer'

function Home() {
    return (
        <div>
            <Navbar />
            <HotelMap />
            <Footer />
        </div>
    )
}

export default Home