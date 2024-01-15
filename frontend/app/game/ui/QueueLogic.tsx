import { useContext, useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import gameSocket, { GameContext } from '../../context/gameSockets';
import { ballCoordinates, pladdleCoordinates, playersCoordinates } from '../types/interfaces';
import { usePathname, useRouter } from 'next/navigation';


const PongZoneQueue = () => {

    const   canvasRef = useRef<HTMLCanvasElement>(null);
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
    let   ShrinkL: number = 150;


        if (settings.id === 0) {
            speedMeterL = (settings.powerUps === 'speedMeter') ? {x: 9 , y: 9 } : {x:6 , y: 6};
            ZoomInL = (settings.powerUps === 'ZoomIn') ? 225 : 150;
            ShrinkR = (settings.powerUps === 'Shrink') ? 100 : 150;
            ExtraTime = (settings.powerUps === 'ExtraTime') ? 5 : 4;
            console.log('settings L : ', settings);
            //
            speedMeterR = (settings.powerOpponenent === 'speedMeter') ? {x: 9 , y: 9 } : {x:6 , y: 6};
            ZoomInR = (settings.powerOpponenent === 'ZoomIn') ? 225 : 150;
            ShrinkL = (settings.powerOpponenent === 'Shrink') ? 100 : 150;
            ExtraTime = (settings.powerOpponenent === 'ExtraTime') ?  8 : 7;
            //
        }
        else if (settings.id === 1) {
            speedMeterR = (settings.powerUps === 'speedMeter') ? {x: 9 , y: 9 } : {x:6 , y: 6};
            ZoomInR = (settings.powerUps === 'ZoomIn') ? 225 : 150;
            ShrinkL = (settings.powerUps === 'Shrink') ? 100 : 150;
            ExtraTime = (settings.powerUps === 'ExtraTime') ? 8 : 7;
            console.log('settings R : ', settings);
            //
            speedMeterL = (settings.powerOpponenent === 'speedMeter') ? {x: 9 , y: 9 } : {x:6 , y: 6};
            ZoomInL = (settings.powerOpponenent === 'ZoomIn') ? 225 : 150;
            ShrinkR = (settings.powerOpponenent === 'Shrink') ? 100 : 150;
            ExtraTime = (settings.powerOpponenent === 'ExtraTime') ? 5 : 4;
            console.log('settings L : ', settings);
            //
        }
        ShrinkL = (ShrinkL === 100) ? ShrinkL : ZoomInL;
        ShrinkR = (ShrinkR === 100) ? ShrinkR : ZoomInR;
    
    useEffect(() => {

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
                // background: '#ffffff',
                background: 'transparent',
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
        
        gameSocket.on('StartDrawing', () => {
            console.log('inside drawing ball');
            Matter.Body.setVelocity(ball, { x: 6, y: 6 })
        });

        Matter.Events.on(engine, 'collisionStart', function(event) {
            var pairs = event.pairs;
            for (var i = 0, j = pairs.length; i != j; ++i) {
                var pair = pairs[i]; 
                (score.playerR === ExtraTime || score.playerL === ExtraTime) && (Matter.Body.setVelocity(ball, { x: 0, y: 0 }));
                (score.playerR === ExtraTime) ? gameSocket.emit('playerRighttWin') : score.playerL === ExtraTime ?  gameSocket.emit('playerLeftWin') : '';
                (score.playerR === ExtraTime || score.playerL === ExtraTime) && route.push('/Dashboard');
                if (score.playerR === ExtraTime || score.playerL === ExtraTime) {
                    gameSocket.emit('EndGame', {playerL: {score: score.playerL}, playerR: {score: score.playerR}});
                    return ;
                }
                if ((pair.bodyA === ball && pair.bodyB === wallLeft) || (pair.bodyA === wallLeft && pair.bodyB === ball))
                {
                    setScore({playerL: score.playerL, playerR: (++score.playerR)});
                    Matter.Body.setPosition(ball, { x: midleCanvas, y: midleVertical });
                    Matter.Body.setVelocity(ball, { x: 5, y: 5 });
                }
                else if ((pair.bodyA === ball && pair.bodyB === wallRight) || (pair.bodyA === wallRight && pair.bodyB === ball))
                {
                    setScore({playerL: (++score.playerL), playerR: score.playerR});
                    Matter.Body.setPosition(ball, { x: midleCanvas, y: midleVertical });
                    Matter.Body.setVelocity(ball, { x: -5, y: 5 })
                }
                if ((pair.bodyA === ball && pair.bodyB === paddleRight) || (pair.bodyA === paddleRight && pair.bodyB === ball)) {
                    Matter.Body.setVelocity(ball, { x: speedMeterR.x, y: speedMeterR.y })
                }
                else if ((pair.bodyA === ball && pair.bodyB === paddleLeft) || (pair.bodyA === paddleLeft && pair.bodyB === ball)) {
                    Matter.Body.setVelocity(ball, { x: speedMeterL.x, y: speedMeterL.y })              
                }
                Matter.Body.set(ball, { restitution: 1, friction: 0 }); // n9adro n7aydoha
            }
        });
        
        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);
        
        return () => {
            Render.stop(render);
            Engine.clear(engine);
            gameSocket.off('StartDrawing');
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
        <div
        style={{ '--image-url': `url(${settings.theme})` } as React.CSSProperties}
        className="bg-transparent bg-cover bg-center bg-[image:var(--image-url)] w-[100%] h-[80%] rounded-[10px] justify-center absolute bottom-0">
            { !matchready && <button onClick={startGame}>START GAME</button>}
            { matchready && <canvas ref={canvasRef} className='w-[100%] h-[100%] rounded-[10px]'/>}
        </div>
    );
};

export default PongZoneQueue;