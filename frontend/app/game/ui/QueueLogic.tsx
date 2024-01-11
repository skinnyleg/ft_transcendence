import { useContext, useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import gameSocket, { GameContext } from '../../context/gameSockets';
import { ballCoordinates, pladdleCoordinates, playersCoordinates } from '../types/interfaces';
import { usePathname } from 'next/navigation';
import { exit } from 'process';


const PongZoneQueue = () => {

    const canvasRef = useRef(null);

    const width = 20;
    const height = 150;
    
    const   [matchready, setMatchready] = useState<boolean>(false);
    const   [pongzone, setPongzone] = useState({width: 0, height: 0});
    const   {data, setData, gameId, setGameId} = useContext(GameContext);
    
    useEffect(() => {

        const { Engine, Render, World, Bodies, Composite, Runner} = Matter;
        
        const engine = Engine.create({
            gravity: {x: 0, y: 0, scale: 0},
            positionIterations: 10,
            velocityIterations: 8,
        });
        
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

        let wallTop = Bodies.rectangle(400, 0, 800, 20, { isStatic: true , friction: 0,restitution: 1,});
        let wallBottom = Bodies.rectangle(400, 600, 800, 20, { isStatic: true /*, friction: 0,restitution: 1,*/});
        let wallLeft = Bodies.rectangle(0, 300, 20, 600, { isStatic: true/* , friction: 0,restitution: 1,*/});
        let wallRight = Bodies.rectangle(800, 300, 20, 600, { isStatic: true/*, friction: 0 ,restitution: 1,*/});

        Composite.add(engine.world, [wallTop, wallBottom, wallLeft, wallRight]);

        const ball = Matter.Bodies.circle(midleCanvas, midleVertical, 10, {
            // isStatic: false,
            restitution: 1, // Bounciness of the ball
            friction: 0, // Friction of the ball
            inertia: Infinity,
            frictionAir: 0,
            // density: 0.04, // Density of the ball
            // frictionStatic: 0,
            render: {
                fillStyle: 'red', // Color of the ball
                strokeStyle: 'green', // Border color of the ball
                lineWidth: 5, // Border width of the ball
            },
        });
        let paddleLeft = Bodies.rectangle(minX + width, midleVertical, width, height, {
            isStatic: true,
            // friction: 0,
            // restitution: 1,
        });
        let paddleRight = Bodies.rectangle(maxX - width, midleVertical, width, height, {
            isStatic: true ,
            // friction: 0,
            // restitution: 1,
        });

        // ball.force.y = 0;       
        Matter.Body.applyForce(ball, ball.position, {x: 0.035, y: 0.01});
        // engine.world.gravity.y = 0;

        Composite.add(engine.world, [paddleLeft, paddleRight, ball]);
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
            const paddleL: pladdleCoordinates  = {x: Cordinates.x, y: Cordinates.y};
            Matter.Body.setPosition(paddleLeft, paddleL);
        });

        gameSocket.on('rightPaddle', (Cordinates: any) => {
            const paddleL: pladdleCoordinates  = {x: Cordinates.x, y: Cordinates.y};
            Matter.Body.setPosition(paddleRight, paddleL);
        });

        //==================
        Matter.Events.on(engine, 'collisionStart', function(event) {
            var pairs = event.pairs;
            
            // Change the direction of the ball when it hits a paddle
            for (var i = 0, j = pairs.length; i != j; ++i) {
                var pair = pairs[i];
            
                if ((pair.bodyA === ball && pair.bodyB === paddleLeft) ||
                    (pair.bodyA === paddleLeft && pair.bodyB === ball) ||
                    (pair.bodyA === ball && pair.bodyB === paddleRight) ||
                    (pair.bodyA === paddleRight && pair.bodyB === ball)) {
            
                    // Reverse the horizontal velocity of the ball
                    // ball.velocity.x *= -1;
                    // Matter.Body.set(ball, );
                }
            
                // Scoring
                if ((pair.bodyA === ball && pair.bodyB === paddleLeft) ||
                    (pair.bodyA === paddleLeft && pair.bodyB === ball)) {
            
                    // Increase score for player 2
                    // score2++;
                } else if ((pair.bodyA === ball && pair.bodyB === paddleRight) ||
                            (pair.bodyA === paddleRight && pair.bodyB === ball)) {
            
                    // Increase score for player 1
                    // score1++;
                }
            }
            });
        //==================

        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);
        
        return () => {
            // Render.stop(render);
            // World.clear(engine.world);
            // Engine.clear(engine);
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