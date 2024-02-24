import { useContext, useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { GameContext, gameSocketContext } from '../../context/gameSockets';
import { ballCoordinates, pladdleCoordinates, playersCoordinates } from '../types/interfaces';
import { usePathname, useRouter } from 'next/navigation';
import StartButton from './StartButton';


const PongZoneQueue = () => {

    const   canvasRef = useRef<HTMLCanvasElement>(null);
    const gameSocket = useContext(gameSocketContext)
    const   route = useRouter();
    const   [matchready, setMatchready] = useState<boolean>(false);
    const   [pongzone, setPongzone] = useState({width: 0, height: 0});
    const   {powerUps, score, setScore, gameId, settings} = useContext(GameContext);

    const width = 20;
    const height = 150;
    let   ExtraTime : number;
    let   speedMeterL: {x: number, y: number};
    let   speedMeterR: {x: number, y: number};
    let   ZoomInR: number = 150;
    let   ZoomInL: number = 150;
    let   ShrinkR: number = 150;
    let speedR = 20;
    let   ShrinkL: number = 150;


    

    useEffect(() => {
        if (settings.id === 0) {
            speedMeterL = (settings.power === 'speedMeter') ? {x: 9 , y: 9 } : {x:6 , y: 6};
            ZoomInL = (settings.power === 'ZoomIn') ? 225 : 150;
            ShrinkR = (settings.power === 'Shrink') ? 100 : 150;
            ExtraTime = (settings.power === 'ExtraTime' || settings.powerOpponenent === 'ExtraTime') ? 5 : 4;
            speedMeterR = (settings.powerOpponenent === 'speedMeter') ? {x: 9 , y: 9 } : {x:6 , y: 6};
            ZoomInR = (settings.powerOpponenent === 'ZoomIn') ? 225 : 150;
            ShrinkL = (settings.powerOpponenent === 'Shrink') ? 100 : 150;
            
        }
        else if (settings.id === 1) {
            speedMeterR = (settings.power === 'speedMeter') ? {x: 9 , y: 9 } : {x:6 , y: 6};
            ZoomInR = (settings.power === 'ZoomIn') ? 225 : 150;
            ShrinkL = (settings.power === 'Shrink') ? 100 : 150;
            ExtraTime = (settings.power === 'ExtraTime' || settings.powerOpponenent === 'ExtraTime') ? 5 : 4;
            speedMeterL = (settings.powerOpponenent === 'speedMeter') ? {x: 9 , y: 9 } : {x:6 , y: 6};
            ZoomInL = (settings.powerOpponenent === 'ZoomIn') ? 225 : 150;
            ShrinkR = (settings.powerOpponenent === 'Shrink') ? 100 : 150;
        }
        ShrinkL = (ShrinkL === 100) ? ShrinkL : ZoomInL;
        ShrinkR = (ShrinkR === 100) ? ShrinkR : ZoomInR;
        const { Engine, Render, World, Bodies, Composite, Runner} = Matter;
        
        const engine = Engine.create({
            gravity: {x: 0, y: 0, scale: 0},
            positionIterations: 10,
            velocityIterations: 8,
        });
        
        const render = Render.create({
            canvas: canvasRef.current === null ? undefined : canvasRef.current,
            engine: engine,
            options: {
                background: 'transparent',
                wireframes: false,
            } 
        });
    
        const minY = render.bounds.min.y;
        const minX = render.bounds.min.x;
        const maxY = render.bounds.max.y;
        const maxX = render.bounds.max.x;
        setPongzone({width: maxX, height: maxY});
    
        const midleVertical = ((maxY - minY) / 2) + minY;
        const midleCanvas = ((maxX- minX) / 2) + minX;

        let wallTop = Bodies.rectangle(400, 0, maxX, 5, { isStatic: true });
        let wallBottom = Bodies.rectangle(400, 600, maxX, 5, { isStatic: true });
        let wallLeft = Bodies.rectangle(0, 300, 5, maxY, { isStatic: true });
        let wallRight = Bodies.rectangle(800, 300, 5, maxY, { isStatic: true });

        Composite.add(engine.world, [wallTop, wallBottom, wallLeft, wallRight]);

        const   ball = Matter.Bodies.circle(midleCanvas, midleVertical, 10, {
            isStatic: false,
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
        const   paddleLeft = Bodies.rectangle(minX + width, midleVertical, width, ShrinkL, { isStatic: true });
        const   paddleRight = Bodies.rectangle(maxX - width, midleVertical, width, ShrinkR, { isStatic: true });
                
        Composite.add(engine.world, [paddleLeft, paddleRight, ball]);    
        
        const handleKey = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowUp':
                    gameSocket.emit('arrow', {move: 'UP'});
                    break;
                case 'ArrowDown':
                    gameSocket.emit('arrow', {move: 'DOWN'}); 
                    break;
            }
        };
        document.addEventListener('keydown', handleKey);
                

        let   currentPositionLeft = { x: (minX + width), y: midleVertical };
        let   currentPositionRight = { x: (maxX - width), y: midleVertical };

        const handleLeft = (move: string) => {

            let   newPositionLeft = { ...currentPositionLeft }; 

            switch (move) {
                case 'UP':
                    newPositionLeft.y -= speedR;
                    break;
                case 'DOWN':
                    newPositionLeft.y += speedR;
                    break;
            }
            newPositionLeft.y = Math.max(minY + ZoomInL/2, Math.min(newPositionLeft.y, maxY- ZoomInL/2));
            Matter.Body.setPosition(paddleLeft, newPositionLeft);
            currentPositionLeft = newPositionLeft;
        };

        const handleRight = (move: string) => {

            let   newPositionRight = { ...currentPositionRight }; 

            switch (move) {
                case 'UP':
                    newPositionRight.y -= speedR;
                    break;
                case 'DOWN':
                    newPositionRight.y += speedR;
                    break;
            }
            newPositionRight.y = Math.max(minY + ZoomInR/2, Math.min(newPositionRight.y, maxY- ZoomInR/2));
            Matter.Body.setPosition(paddleRight, newPositionRight);
            currentPositionRight = newPositionRight;
        };

        gameSocket.on('leftPaddle', (Cordinates: any) => {
            handleLeft(Cordinates);
        });
        gameSocket.on('rightPaddle', (Cordinates: any) => {
            handleRight(Cordinates);
        });
        gameSocket.on('redirectToDashboard', () => {
            route.push('/Dashboard');
        })
        gameSocket.on('StartDrawing', () => {
            Matter.Body.setVelocity(ball, { x: 6, y: 6 })
        });


        gameSocket.on('abortGame', () => {
            Matter.Body.setPosition(ball, { x: midleCanvas, y: midleVertical });
            Matter.Body.setVelocity(ball, { x: 0, y: 0 });
            route.push('/Dashboard');
        })

        gameSocket.on('abort', (data: boolean) => {
            if (data === true)
            {
                Matter.Body.setPosition(ball, { x: midleCanvas, y: midleVertical });
                Matter.Body.setVelocity(ball, { x: 0, y: 0 });
                route.push('/Dashboard');
            }
        })

        const handleCollision = (event: any) => {
            var pairs = event.pairs;
            for (var i = 0, j = pairs.length; i != j; ++i) {
                var pair = pairs[i];
                if ((pair.bodyA === ball && pair.bodyB === wallLeft) || (pair.bodyA === wallLeft && pair.bodyB === ball))
                {
                    setScore({playerL: score.playerL, playerR: (++score.playerR)});
                    Matter.Body.setPosition(ball, { x: midleCanvas, y: midleVertical });
                    Matter.Body.setVelocity(ball, { x: 5, y: 5 });
                    if (score.playerR === ExtraTime || score.playerL === ExtraTime) {
                        Matter.Body.setPosition(ball, { x: midleCanvas, y: midleVertical });
                        Matter.Body.setVelocity(ball, { x: 0, y: 0 });
                        gameSocket.emit('EndGame', {playerL: {score: score.playerL}, playerR: {score: score.playerR}});
                    }
                }
                else if ((pair.bodyA === ball && pair.bodyB === wallRight) || (pair.bodyA === wallRight && pair.bodyB === ball))
                {
                    setScore({playerL: (++score.playerL), playerR: score.playerR});
                    Matter.Body.setPosition(ball, { x: midleCanvas, y: midleVertical });
                    Matter.Body.setVelocity(ball, { x: -5, y: 5 })
                    if (score.playerR === ExtraTime || score.playerL === ExtraTime) {
                        Matter.Body.setPosition(ball, { x: midleCanvas, y: midleVertical });
                        Matter.Body.setVelocity(ball, { x: 0, y: 0 });
                        gameSocket.emit('EndGame', {playerL: {score: score.playerL}, playerR: {score: score.playerR}});
                    }
                }
                if ((pair.bodyA === ball && pair.bodyB === paddleRight) || (pair.bodyA === paddleRight && pair.bodyB === ball)) {
                    Matter.Body.setVelocity(ball, { x: speedMeterR.x, y: speedMeterR.y })
                }
                else if ((pair.bodyA === ball && pair.bodyB === paddleLeft) || (pair.bodyA === paddleLeft && pair.bodyB === ball)) {
                    Matter.Body.setVelocity(ball, { x: speedMeterL.x, y: speedMeterL.y })
                }
            }
        }
        Matter.Events.on(engine, 'collisionStart', handleCollision);
        
        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);
        
        return () => {
            gameSocket.off('StartDrawing');
            gameSocket.off('leftPaddle');
            gameSocket.off('rightPaddle');
            gameSocket.off('redirectToDashboard');
            gameSocket.off('abort')
            gameSocket.off('abortGame')
            document.removeEventListener('keydown', handleKey);
            Matter.Events.off(engine, 'collisionStart',handleCollision)
            Render.stop(render);
            Engine.clear(engine);
        };
        
    }, [matchready]);


    const path = usePathname();
    const startGame = () => {
        setMatchready(true);
        gameSocket.emit('startGame', {roomId: gameId, ...pongzone});
    };

    return (
        <div
        style={{ '--image-url': `url(${settings.theme})` } as React.CSSProperties}
        className="bg-transparent bg-cover bg-center bg-[image:var(--image-url)] w-[100%] h-[80%] rounded-[10px] flex items-center justify-center absolute bottom-0">
            { !matchready && <StartButton startGame={startGame}/>}
            { matchready && <canvas ref={canvasRef} className='w-[100%] h-[100%] rounded-[10px]'/>}
        </div>
    );
};

export default PongZoneQueue;