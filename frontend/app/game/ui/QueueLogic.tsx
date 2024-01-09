import { useContext, useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import gameSocket, { GameContext } from '../../context/gameSockets';
import { ballCoordinates, pladdleCoordinates, playersCoordinates } from '../types/interfaces';
import { usePathname } from 'next/navigation';


const PongZoneQueue = () => {

    const canvasRef = useRef(null);

    const width = 20;
    const height = 150;
    // let speedR = 20;
    // let speedL = 20;
    
    const   [matchready, setMatchready] = useState<boolean>(false);
    const   [pongzone, setPongzone] = useState({width: 0, height: 0});
    const   {data, setData, gameId, setGameId} = useContext(GameContext);
    
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
        setPongzone({width: maxX, height: maxY});
        // console.log(`front : h-${maxY} & w-${maxX}`);
    
        const midleVertical = ((maxY - minY) / 2) + minY;
        const midleCanvas = ((maxX- minX) / 2) + minX;

        const ball = Matter.Bodies.circle(midleCanvas, midleVertical, 10, {
            // isStatic: false,
            restitution: 0.8, // Bounciness of the ball
            friction: 0.1, // Friction of the ball
            density: 0.04, // Density of the ball
            render: {
                fillStyle: 'red', // Color of the ball
                strokeStyle: 'green', // Border color of the ball
                lineWidth: 5, // Border width of the ball
            },
        });
        ball.force.y = 0;
        let paddleLeft = Bodies.rectangle(minX + width, midleVertical, width, height, { isStatic: true });
        let paddleRight = Bodies.rectangle(maxX - width, midleVertical, width, height, { isStatic: true });
        var floor = Matter.Bodies.rectangle(maxX / 2, maxY, maxX, 5, {
            isStatic: true,
            render: {
               visible: true,
            }
          });          

        var world = Matter.World.create({
            gravity: { x: 0, y: 0 }
         });
        Composite.add(engine.world, [paddleLeft, paddleRight, ball, floor]);
        Matter.Events.on(engine, 'beforeUpdate', function() {
            engine.world.gravity.y = 0;
        });          
        
        const handleKey = (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    console.log('times--')
                    gameSocket.emit('arrow', 'UP');
                    break;
                case 'ArrowDown':
                    console.log('times++')
                    gameSocket.emit('arrow', 'DOWN'); 
                    break;
            }
        };
        document.addEventListener('keydown', handleKey);

        gameSocket.on('leftPaddle', (Cordinates: any) => {
            console.log('Coordinates left : ', Cordinates);
            const paddleL: pladdleCoordinates  = {x: Cordinates.x, y: Cordinates.y};
            Matter.Body.setPosition(paddleLeft, paddleL);
        });

        gameSocket.on('rightPaddle', (Cordinates: any) => {
            console.log('Coordinates right : ', Cordinates);
            const paddleL: pladdleCoordinates  = {x: Cordinates.x, y: Cordinates.y};
            Matter.Body.setPosition(paddleRight, paddleL);
        });
        
        gameSocket.on('drawBall', (Cordinates: any) => {
            console.log('Coordinates ball : ', Cordinates)
            const ballCordinates: ballCoordinates  = {x: Cordinates.veloX, y: Cordinates.veloY};
            // Matter.Body.setVelocity(ball, { x: 3.5, y: -3.5 });
            Matter.Body.setVelocity(ball, ballCordinates);
        });

        
        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);
        
        return () => {
            Render.stop(render);
            World.clear(engine.world);
            Engine.clear(engine);
            gameSocket.off('drawBall');
            gameSocket.off('leftPaddle');
            gameSocket.off('rightPaddle');
        };
        
    }, [matchready]);

    const path = usePathname();
    const startGame = () => {
        console.log('path name: ', path);
        setMatchready(true);
        console.log('startGame: ', matchready);
        gameSocket.emit('startGame', {roomId: gameId, ...pongzone});
    };

    return (
        <div className="bg-transparent w-[100%] h-[80%] rounded-[10px] justify-center absolute bottom-0">
            { !matchready && <button onClick={startGame}>START GAME</button>}
            { matchready && <canvas ref={canvasRef} className='bg-transparent w-[100%] h-[100%] rounded-[10px]'/>}
        </div>
    );
};

export default PongZoneQueue;