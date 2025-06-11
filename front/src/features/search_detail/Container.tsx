import React from 'react';

interface ContainerProps {
    hotelList: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ hotelList, mapArea }) => {
    return (
        <div className='
            flex
            flex-row
            p-6
            m-auto
            h-full
            w-full
        '>
            <div className='
                bg-white
                mr-4
                w-1/3
                rounded-xl
                h-screen
                overflow-y-scroll
            '>
                {hotelList}
            </div>
            <div className="w-2/3 bg-gray-500">
                <div className="w-full h-full text-white flex items-center justify-center">
                    dd
                </div>
            </div>
        </div>
    );
};

export default Container;