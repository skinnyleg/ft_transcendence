import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useState } from 'react';

interface PowerUpsProps { handlePowerUpChange:(powerup: string) => void; }

const PowerUps = ({handlePowerUpChange}: PowerUpsProps) => {

  const [powerup, setPowerup] = useState('');
  const powerupshandle = (newPowerup : string) => {
    console.log(newPowerup);
    setPowerup(newPowerup);
    handlePowerUpChange(newPowerup);
  }
  const powerups = ['FireBall', 'IceBall', 'LightningBall', 'WaterBall', 'EarthBall', 'AirBall'];

  return (
      <div className="bg-neonpink p-4 rounded-md lg:col-span-3 col-span-1 h-[200px] lg:w-full mt-20 row-start-3 row-end-4 shadow-md">
          <h4 className="text-2xl font-bold mb-4">Power Ups</h4>
          <div className="flex space-x-2 overflow-x-auto h-[150px]">
            <Swiper
              spaceBetween={8}
              slidesPerView={4}
              onSlideChange={() => console.log('slide change')}
              onSwiper={(swiper) => console.log(swiper)}>
              {['/52.jpg', '/yo.jpg', '/yo1.jpg', '/42.jpg', '/yo1.jpg', '/yo.jpg'].map((image, index) => (
            <SwiperSlide 
            key={index}
            className="relative rounded-md">
                <img onClick={() => powerupshandle(powerups[index])} src={image} className="w-3/5 h-3/5 mt-5 rounded-full" />
            </SwiperSlide>
          ))}
        </Swiper>
          </div>
      </div>
  )
};

export default PowerUps;