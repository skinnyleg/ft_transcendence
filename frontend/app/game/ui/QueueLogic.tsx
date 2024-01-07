import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import gameSocket from './gameSockets';
import { ballCoordinates, playersCoordinates } from '../types/interfaces';


const PongZoneQueue = () => {

    const canvasRef = useRef(null);
    const width = 20;
    const height = 150;
    let speedR = 20;
    let speedL = 20;
    
    
    
    useEffect(() => {
        const { Engine, Render, World, Bodies, Composite, Runner} = Matter;
    
        const engine = Engine.create();
        const render = Render.create({
            canvas: canvasRef.current,
            engine: engine,
            options: {
                background: '#ffffff',
                wireframes: false,
            } 
        });
    
        const minY = render.bounds.min.y;
        const minX = render.bounds.min.x;
        const maxY = render.bounds.max.y;
        const maxX = render.bounds.max.x;
    
        const midleVertical = ((maxY - minY) / 2) + minY;
        const midleCanvas = ((maxX- minX) / 2) + minX;
        const ball = Matter.Bodies.circle(midleCanvas, midleVertical, 10, {
            isStatic: true,
            restitution: 0.8, // Bounciness of the ball
            friction: 0.1, // Friction of the ball
            density: 0.04, // Density of the ball
            render: {
                fillStyle: 'red', // Color of the ball
                strokeStyle: 'green', // Border color of the ball
                lineWidth: 5, // Border width of the ball
            },
        });
        const handleKey = (event) => {
            // console.log('dkjhasjd')
            switch (event.key) {
                case 'ArrowUp':
                    gameSocket.emit('arrow', 'UP'); 
                    break;
                case 'ArrowDown':
                    gameSocket.emit('arrow', 'DOWN'); 
                    break;
            }
            // console.log('arrowss front');
        };
        document.addEventListener('keydown', handleKey);


        let paddleLeft = Bodies.rectangle(minX + width, midleVertical, width, height, { isStatic: true });
        let paddleRight = Bodies.rectangle(maxX - width, midleVertical, width, height, { isStatic: true });
        
        gameSocket.on('players-coordinates', (data: playersCoordinates) => {
            console.log('Coordinates: ', data);
            Matter.Body.setPosition(paddleRight, data.playerL);
            Matter.Body.setPosition(paddleRight, data.playerR);
        });

        gameSocket.on('ball-coordinates', (data: ballCoordinates) => {
            Matter.Body.setVelocity(ball, data)
        });
        
        Composite.add(engine.world, [paddleLeft, paddleRight, ball]);
        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);
        
        return () => {
            Render.stop(render);
            World.clear(engine.world);
            Engine.clear(engine);
            gameSocket.off('ball-coordinates');
            gameSocket.off('players-coordinates');
            // if (render.canvas)
            //     render.canvas.remove();
            if (render.context)
                render.context.clearRect(0, 0, render.canvas.width, render.canvas.height);
        };
        
    }, []);
    

    return (
        <div className="bg-transparent w-[100%] h-[80%] rounded-[10px] justify-center absolute bottom-0">
            <canvas ref={canvasRef} className='bg-transparent w-[100%] h-[100%] rounded-[10px]'/>
        </div>
    );
};

export default PongZoneQueue;