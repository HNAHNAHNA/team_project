import HotelsData from '../../data/hotels.json'

export const locationNames = ['東京都', '大阪', '京都', '福岡', '札幌'];

const allHotels = HotelsData.hotels;

export const locations = locationNames.map(name => {
    return {
        title: `${name}のおすすめホテル`,
        hotels: allHotels.filter(wrapper => {
            const basicInfo = wrapper.hotel.find(item => item.hotelBasicInfo);
            return basicInfo && basicInfo.hotelBasicInfo?.address1 === name;
        })
    };
});