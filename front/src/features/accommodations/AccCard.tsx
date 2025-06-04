
type HotelInfo = {
    hotelImageUrl: string;
    address2: string;
}

function AccCard ({ hotel }: {hotel: HotelInfo}) {
    return(
        <div className="relative p-2 inline-flex flex-col justify-center bg-white rounded-xl">
            <div className="w-60 h-80 overflow-hidden">
                <img 
                src={hotel.hotelImageUrl} 
                alt="hotelImage" 
                className="w-full h-full rounded-xl object-cover"
                />
            </div>
            <p>{hotel.address2}</p>
        </div>
    )
}

export default AccCard