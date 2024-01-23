import React, { useContext, useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { GameContext, gameSocketContext } from '../../context/gameSockets';
import { useRouter } from 'next/navigation';
import StartButton from './StartButton';


const PongZoneBoot = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameSocket = useContext(gameSocketContext)
    const width = 20;
    const height = 150;
    let speedR = 20;
    let vilocityBallX = 6;

    const   route = useRouter();
    const   [matchready, setMatchready] = useState<boolean>(false);
    const   [pongzone, setPongzone] = useState({width: 0, height: 0});
    const   {powerUps, gameMape, score, setScore, gameId} = useContext(GameContext);
    

    const   speedMeter = (powerUps == 'speedMeter') ? {x: 9 , y: 9 } : {x:6 , y: 6};
    const   ZoomIn = (powerUps == 'ZoomIn') ? 225 : 150;
    const   Shrink = (powerUps == 'Shrink') ? 100 : 150;
    const   ExtraTime = (powerUps == 'ExtraTime') ? 5 : 4;

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
                // background: '#ffffff',
                background: 'transparent',
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
        let paddleLeft = Bodies.rectangle(minX + width, midleVertical, width, ZoomIn, { isStatic: true });
        let paddleRight = Bodies.rectangle(maxX - width, midleVertical, width, Shrink, { isStatic: true });
        
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
            newPositionLeft.y = Math.max(minY + ZoomIn/2, Math.min(newPositionLeft.y, maxY- ZoomIn/2));
            Matter.Body.setPosition(paddleLeft, newPositionLeft);
            currentPositionLeft = newPositionLeft;
        };

        document.addEventListener('keydown', handleKey);

        let currentPositionRight = { x: (maxX - width), y: midleVertical };

        setInterval(() => {   
            const newPositionRight = { ...currentPositionRight };
            newPositionRight.y = ball.position.y - (speedR + 10);
            newPositionRight.y = Math.max(minY + Shrink/2, Math.min(newPositionRight.y, maxY - Shrink/2));
            Matter.Body.setPosition(paddleRight, newPositionRight);
        }, 500);

        gameSocket.on('drawBallBot', () => {
            Matter.Body.setVelocity(ball, { x: 5, y: 5 })
            // console.log('drawBall event has received');
        });

        gameSocket.on('redirectToDashboard', () => {
            route.push('/Dashboard');
            // return ;
        })


        const handleCollision = (event: any) => {
            var pairs = event.pairs;
            for (var i = 0, j = pairs.length; i != j; ++i) {
                var pair = pairs[i]; 
                if ((pair.bodyA === ball && pair.bodyB === wallLeft) || (pair.bodyA === wallLeft && pair.bodyB === ball))
                {
                    setScore({playerL: score.playerL, playerR: (++score.playerR)});
                    Matter.Body.setPosition(ball, { x: midleCanvas, y: midleVertical });
                    (score.playerR !== ExtraTime && score.playerL !== ExtraTime) && Matter.Body.setVelocity(ball, { x: -vilocityBallX, y: 5 })
                    if (score.playerR === ExtraTime || score.playerL === ExtraTime) {
                        Matter.Body.setVelocity(ball, { x: 0, y: 0 });
                        gameSocket.emit('endBotMatch');
                    }
                }
                else if ((pair.bodyA === ball && pair.bodyB === wallRight) || (pair.bodyA === wallRight && pair.bodyB === ball))
                {
                    setScore({playerL: (++score.playerL), playerR: score.playerR});
                    Matter.Body.setPosition(ball, { x: midleCanvas, y: midleVertical });
                    (score.playerR !== ExtraTime && score.playerL !== ExtraTime) && Matter.Body.setVelocity(ball, { x: -vilocityBallX, y: 5 })
                    if (score.playerR === ExtraTime || score.playerL === ExtraTime) {
                        Matter.Body.setVelocity(ball, { x: 0, y: 0 });
                        gameSocket.emit('endBotMatch');
                    }
                }
                if ((pair.bodyA === ball && pair.bodyB === paddleRight) || (pair.bodyA === paddleRight && pair.bodyB === ball)) {
                    ball.velocity.y *= -1
                    Matter.Body.setVelocity(ball, { x: -vilocityBallX, y: 6 })
                }
                else if ((pair.bodyA === ball && pair.bodyB === paddleLeft) || (pair.bodyA === paddleLeft && pair.bodyB === ball)) {
                    ball.velocity.x *= -1
                    Matter.Body.setVelocity(ball, { x: -speedMeter.x, y: speedMeter.y })
                }
                // (score.playerR === ExtraTime || score.playerL === ExtraTime) && (Matter.Body.setVelocity(ball, { x: 0, y: 0 }));
                // (score.playerR === ExtraTime || score.playerL === ExtraTime) && (gameSocket.emit('gameBotEnd'));
                // (score.playerR === ExtraTime || score.playerL === ExtraTime) && route.push('/Dashboard');
                // if (score.playerR === ExtraTime || score.playerL === ExtraTime) {
                //     Matter.Body.setVelocity(ball, { x: 0, y: 0 });
                //     gameSocket.emit('endBotMatch');
                // }
                Matter.Body.set(ball, { restitution: 1, friction: 0 }); // n9adro n7aydoha
            }
        }


        Matter.Events.on(engine, 'collisionStart', handleCollision);
        
        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);

        return () => {
            gameSocket.off('drawBallBot');
            gameSocket.off('redirectToDashboard');
            document.removeEventListener('keydown', handleKey);
            Matter.Events.off(engine, 'collisionStart',handleCollision)
            Render.stop(render);
            Engine.clear(engine);
        };

    }, [matchready]);

    const startGame = () => {
        setMatchready(true);
        gameSocket.emit('PongZone', {id: '', ...pongzone});
        gameSocket.emit('StartBotGame', {width: pongzone.width, height: pongzone.height})
        gameSocket.emit('ballPermission');
    };

    // // console.log('map == ', gameMape);
    return (
        <div
        style={{ '--image-url': `url(${gameMape})` } as React.CSSProperties} 
        className={`bg-black bg-cover bg-center bg-[image:var(--image-url)] w-[100%] h-[80%] rounded-[10px] flex justify-center  items-center absolute bottom-0`}>
            { !matchready && <StartButton startGame={startGame}/>}
            { matchready && <canvas ref={canvasRef} className='w-[100%] h-[100%] rounded-[10px]'/>}
        </div>
    );
};

export default PongZoneBoot;