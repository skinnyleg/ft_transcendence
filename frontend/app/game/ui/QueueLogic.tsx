import { useContext, useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import gameSocket, { GameContext } from '../../context/gameSockets';
import { ballCoordinates, pladdleCoordinates, playersCoordinates } from '../types/interfaces';
import { usePathname, useRouter } from 'next/navigation';
import { exit } from 'process';


const PongZoneQueue = () => {

    const   canvasRef = useRef(null);
    const   route = useRouter();
    const   [matchready, setMatchready] = useState<boolean>(false);
    const   [pongzone, setPongzone] = useState({width: 0, height: 0});
    const   {score, setScore, gameId} = useContext(GameContext);

    const width = 20;
    const height = 150;
    
    
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

        let wallTop = Bodies.rectangle(400, 0, maxX, 5, { isStatic: true });
        let wallBottom = Bodies.rectangle(400, 600, maxX, 5, { isStatic: true });
        let wallLeft = Bodies.rectangle(0, 300, 5, maxY, { isStatic: true });
        let wallRight = Bodies.rectangle(800, 300, 5, maxY, { isStatic: true });

        Composite.add(engine.world, [wallTop, wallBottom, wallLeft, wallRight]);

        const   ball = Matter.Bodies.circle(midleCanvas, midleVertical, 10, {
            // isStatic: false,
            restitution: 1, // Bounciness of the ball
            friction: 0, // Friction of the ball
            inertia: Infinity,
            frictionAir: 0,
            render: {
                fillStyle: 'black', // Color of the ball
                strokeStyle: 'black', // Border color of the ball
                lineWidth: 10, // Border width of the ball
            },
        });
        const   paddleLeft = Bodies.rectangle(minX + width, midleVertical, width, height, { isStatic: true });
        const   paddleRight = Bodies.rectangle(maxX - width, midleVertical, width, height, { isStatic: true });
                
        Composite.add(engine.world, [paddleLeft, paddleRight, ball]);
        // Matter.Events.on(engine, 'beforeUpdate', function() {
        //     engine.world.gravity = 0;
        // });     
        
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
            Matter.Body.setPosition(paddleRight, {x: paddleRight.position.x, y: paddleL.y});
        });
                
        gameSocket.on('rightPaddle', (Cordinates: any) => {
            const paddleL: pladdleCoordinates  = {x: Cordinates.x, y: Cordinates.y};
            Matter.Body.setPosition(paddleRight, paddleL);
        });
        
        gameSocket.on('drawBall', () => {
            Matter.Body.setVelocity(ball, { x: 5, y: 5 })
        });
        let timer: any;
        Matter.Events.on(engine, 'collisionStart', function(event) {
            var pairs = event.pairs;
            for (var i = 0, j = pairs.length; i != j; ++i) {
                var pair = pairs[i]; 
                    // route.push('/Dashboard');
                    (score.playerR === 3 || score.playerL === 3) && (Matter.Body.setVelocity(ball, { x: 0, y: 0 }));
                    (score.playerR === 3) ? gameSocket.emit('playerRighttWin') : score.playerL === 3 ?  gameSocket.emit('playerLeftWin') : '';
                    (score.playerR === 3 || score.playerL === 3) && route.push('/Dashboard');
                    // return ;
                    // return ;
                if ((pair.bodyA === ball && pair.bodyB === wallLeft) || (pair.bodyA === wallLeft && pair.bodyB === ball))
                {
                    setScore({playerL: score.playerL, playerR: (++score.playerR)});
                    Matter.Body.setPosition(ball, { x: midleCanvas, y: midleVertical });
                    Matter.Body.setVelocity(ball, { x: 5, y: 5 });
                    gameSocket.emit('scoreLeft');
                }
                else if ((pair.bodyA === ball && pair.bodyB === wallRight) || (pair.bodyA === wallRight && pair.bodyB === ball))
                {
                    setScore({playerL: (++score.playerL), playerR: score.playerR});
                    Matter.Body.setPosition(ball, { x: midleCanvas, y: midleVertical });
                    Matter.Body.setVelocity(ball, { x: -5, y: 5 })
                    gameSocket.emit('scoreRight');
                }
                if ((pair.bodyA === ball && pair.bodyB === paddleRight) || (pair.bodyA === paddleRight && pair.bodyB === ball)) {
                    Matter.Body.setVelocity(ball, { x: 8, y: 8 })
                }
                else if ((pair.bodyA === ball && pair.bodyB === paddleLeft) || (pair.bodyA === paddleLeft && pair.bodyB === ball)) {
                    Matter.Body.setVelocity(ball, { x: 5, y: 5 })              
                }
            }
            Matter.Body.set(ball, { restitution: 1, friction: 0 }); // n9adro n7aydoha
        });
        
        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);
        
        return () => {
            Render.stop(render);
            Engine.clear(engine);
            clearTimeout(timer);
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