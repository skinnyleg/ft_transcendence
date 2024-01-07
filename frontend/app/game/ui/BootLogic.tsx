import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import gameSocket from './gameSockets';


const PongZoneBoot = () => {

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
        let paddleLeft = Bodies.rectangle(minX + width, midleVertical, width, height, { isStatic: true });
        let paddleRight = Bodies.rectangle(maxX - width, midleVertical, width, height, { isStatic: true });
        console.log('render == ', render.bounds.max.x)

        
        let currentPositionLeft = { x: (minX + width), y: midleVertical };
        const handleKey = (event) => {
            const newPositionLeft = { ...currentPositionLeft }; 
            switch (event.key) {
                case 'ArrowUp':
                    newPositionLeft.y -= speedR;
                    gameSocket.emit('ArrowUp'); 
                    break;
                case 'ArrowDown':
                    newPositionLeft.y += speedR;
                    gameSocket.emit('ArrowDown'); 
                    break;
            }
            newPositionLeft.y = Math.max(minY + height/2, Math.min(newPositionLeft.y, maxY- height/2));
            console.log('y: ',  newPositionLeft.y)
            Matter.Body.setPosition(paddleLeft, newPositionLeft, []);
            currentPositionLeft = newPositionLeft;
        };

        document.addEventListener('keydown', handleKey);

        let currentPositionRight = { x: (maxX - width), y: midleVertical };
        setInterval(() => {   
            const newPositionRight = { ...currentPositionRight };
            if (newPositionRight.y >=  (maxY - height/2))
                speedL = -speedL;
            if (newPositionRight.y >=  (minY + height/2))
                speedL *= -1;
            newPositionRight.y += speedL;
            newPositionRight.y = Math.max(minY + height/2, Math.min(newPositionRight.y, maxY - height/2));
            Matter.Body.setPosition(paddleRight, newPositionRight);
            currentPositionRight = newPositionRight;
        }, 150);

        gameSocket.on('moveUp', (data) => {
            Matter.Body.setPosition(paddleRight, newPositionRight);
        });
        gameSocket.on('moveDown', (data) => {
            Matter.Body.setPosition(paddleRight, newPositionRight);
        });
        
        Composite.add(engine.world, [paddleLeft, paddleRight, ball]);
        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);

        return () => {
            Render.stop(render);
        };

    }, []);

    return (
        <div className="bg-transparent w-[100%] h-[80%] rounded-[10px] justify-center absolute bottom-0">
            <canvas ref={canvasRef} className='bg-transparent w-[100%] h-[100%] rounded-[10px]'/>
        </div>
    );
};

export default PongZoneBoot;