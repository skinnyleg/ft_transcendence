import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useState } from 'react';

interface PowerUpsProps { handlePowerUpChange:(powerup: string) => void; }

const PowerUps = ({handlePowerUpChange}: PowerUpsProps) => {

  const [powerup, setPowerup] = useState('');
  const powerupshandle = (newPowerup : string) => {
    setPowerup(newPowerup);
    handlePowerUpChange(newPowerup);
  }
  const powerups = ['FireBall', 'IceBall', 'LightningBall', 'WaterBall', 'EarthBall', 'AirBall'];

  return (
    <div className="bg-accents rounded-md lg:col-span-3 col-span-1 lg:w-full md:h-[260px] h-[250px] xl:h-[94%] lg:h-[94%] row-start-3 row-end-4 shadow-md">
      <h4 className="text-2xl pl-[2%] pt-[2%] text-gray-600 font-bold ">Power Ups</h4>
      <div className="flex overflow-x-auto mt-[2%] h-[150px] pl-[2%]  w-full">
        <Swiper
          slidesPerView={4}
          pagination={{ clickable: true }}
          width={1000}
          >
          {['/52.jpg', '/yo.jpg', '/yo1.jpg', '/42.jpg', '/yo1.jpg', '/yo.jpg'].map((image, index) => (
            <SwiperSlide 
            key={index}
            className="relative rounded-md">
                <img onClick={() => powerupshandle(powerups[index])} src={image} alt={`Game Themes`} className="w-[100px] h-[100px] rounded-full" />
          </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default PowerUps;