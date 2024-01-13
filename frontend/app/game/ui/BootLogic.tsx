import React, { useContext, useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import gameSocket, { GameContext } from '../../context/gameSockets';
import { useRouter } from 'next/navigation';


const PongZoneBoot = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const width = 20;
    const height = 150;
    let speedR = 20;
    let speedL = 20;

    const   route = useRouter();
    const   [matchready, setMatchready] = useState<boolean>(false);
    const   [pongzone, setPongzone] = useState({width: 0, height: 0});
    const   {score, setScore, gameId} = useContext(GameContext);
    
    useEffect(() => {

        const   { Engine, Render, World, Bodies, Composite, Runner} = Matter;

        const engine = Engine.create({
            gravity: {x: 0, y: 0, scale: 0},
            positionIterations: 10,
            velocityIterations: 8,
        });

        const render = Render.create({
            canvas: canvasRef.current === null ? undefined : canvasRef.current,
            engine: engine,
            options: {
                background: '#ffffff',
                wireframes: false,
            } 
        });
        
        const minY: number = render.bounds.min.y;
        const minX: number = render.bounds.min.x;
        const maxY: number = render.bounds.max.y;
        const maxX: number = render.bounds.max.x;
        setPongzone({width: maxX, height: maxY});

        const midleVertical = ((maxY - minY) / 2) + minY;
        const midleCanvas = ((maxX- minX) / 2) + minX;

        let wallTop = Bodies.rectangle(400, 0, maxX, 5, { isStatic: true });
        let wallBottom = Bodies.rectangle(400, 600, maxX, 5, { isStatic: true });
        let wallLeft = Bodies.rectangle(0, 300, 5, maxY, { isStatic: true });
        let wallRight = Bodies.rectangle(800, 300, 5, maxY, { isStatic: true });

        Composite.add(engine.world, [wallTop, wallBottom, wallLeft, wallRight]);

        const ball = Matter.Bodies.circle(midleCanvas, midleVertical, 10, {
            isStatic: false,
            restitution: 1, // Bounciness of the ball
            friction: 0, // Friction of the ball
            inertia: Infinity,
            frictionAir: 0,
            render: {
                fillStyle: 'red', // Color of the ball
                strokeStyle: 'green', // Border color of the ball
                lineWidth: 5, // Border width of the ball
            },
        });
        let paddleLeft = Bodies.rectangle(minX + width, midleVertical, width, height, { isStatic: true });
        let paddleRight = Bodies.rectangle(maxX - width, midleVertical, width, height, { isStatic: true });
        
        Composite.add(engine.world, [paddleLeft, paddleRight, ball]);

        let   currentPositionLeft = { x: (minX + width), y: midleVertical };

        const handleKey = (event: any) => {

            let   newPositionLeft = { ...currentPositionLeft }; 

            switch (event.key) {
                case 'ArrowUp':
                    newPositionLeft.y -= speedR;
                    break;
                case 'ArrowDown':
                    newPositionLeft.y += speedR;
                    break;
            }
            // console.log('befor y: ',  newPositionLeft.y)
            newPositionLeft.y = Math.max(minY + height/2, Math.min(newPositionLeft.y, maxY- height/2));
            Matter.Body.setPosition(paddleLeft, newPositionLeft);
            currentPositionLeft = newPositionLeft;
        };

        document.addEventListener('keydown', handleKey);

        let currentPositionRight = { x: (maxX - width), y: midleVertical };

        setInterval(() => {   
            const newPositionRight = { ...currentPositionRight };
            // if (newPositionRight.y <=  (maxY - height/2) && (newPositionRight.y !=  (minY + height/2)))
            //     newPositionRight.y += speedL;
            // else if (newPositionRight.y >=  (minY + height/2) && (newPositionRight.y != (maxY - height/2)))
            //     newPositionRight.y -= speedL;
            // speedL *= -1;
            // speedL = -speedL;
            newPositionRight.y = ball.position.y;
            newPositionRight.y = Math.max(minY + height/2, Math.min(newPositionRight.y, maxY - height/2));
            Matter.Body.setPosition(paddleRight, newPositionRight);
            // currentPositionRight = newPositionRight;
        }, 150);

        gameSocket.on('drawBallBot', () => {
            Matter.Body.setVelocity(ball, { x: 5, y: 5 })
            console.log('drawBall event has received');
        });

        Matter.Events.on(engine, 'collisionStart', function(event) {
            console.log('entered collison func')
            var pairs = event.pairs;
            (score.playerR === 3 || score.playerL === 3) && (Matter.Body.setVelocity(ball, { x: 0, y: 0 }));
            (score.playerR === 3 || score.playerL === 3) && (gameSocket.emit('gameBotEnd'));
            (score.playerR === 3 || score.playerL === 3) && route.push('/Dashboard');
            if (score.playerR === 3 || score.playerL === 3)
                return ;
            for (var i = 0, j = pairs.length; i != j; ++i) {
                var pair = pairs[i]; 
                if ((pair.bodyA === ball && pair.bodyB === wallLeft) || (pair.bodyA === wallLeft && pair.bodyB === ball))
                {
                    Matter.Body.setVelocity(ball, { x: 0, y: 0 });
                    // score.playerR += 1
                    console.log('scoore R befor : ', score.playerR)
                    setScore({playerL: score.playerL, playerR: (++score.playerR)});
                    console.log('scoore R after : ', score.playerR)
                    Matter.Body.setPosition(ball, { x: midleCanvas, y: midleVertical });
                    Matter.Body.setVelocity(ball, { x: 5, y: 5 });
                    gameSocket.emit('scoreLeft');
                    break ;
                }
                else if ((pair.bodyA === ball && pair.bodyB === wallRight) || (pair.bodyA === wallRight && pair.bodyB === ball))
                {
                    // score.playerL += 1
                    Matter.Body.setVelocity(ball, { x: 0, y: 0 });
                    console.log('scoore L befor : ', score.playerL)
                    setScore({playerL: (++score.playerL), playerR: score.playerR});
                    console.log('scoore L after : ', score.playerL)
                    Matter.Body.setPosition(ball, { x: midleCanvas, y: midleVertical });
                    Matter.Body.setVelocity(ball, { x: -5, y: 5 })
                    gameSocket.emit('scoreRight');
                    break ;
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
            gameSocket.off('drawBallBot');
        };

    }, [matchready]);

    const startGame = () => {
        setMatchready(true);
        gameSocket.emit('PongZone', {id: '', ...pongzone});
        gameSocket.emit('ballPermission');
    };

    return (
        <div className="bg-transparent w-[100%] h-[80%] rounded-[10px] justify-center absolute bottom-0">
            { !matchready && <button onClick={startGame}>START GAME</button>}
            { matchready && <canvas ref={canvasRef} className='bg-transparent w-[100%] h-[100%] rounded-[10px]'/>}
        </div>
    );
};

export default PongZoneBoot;