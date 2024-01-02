'use client'
import React, { useEffect, useRef } from "react"
import { render } from "react-dom";


const play = () => {
    const canvasRef = useRef<HTMLCanvasElement>()
    
    let leftPaddle = {
        x : 0,
        y: 150,
        width: 10,
        height: 100,
        score : 0,
    }

    let rightPaddle = {
        x : 590,
        y: 150,
        width: 10,
        height: 100,
        score : 0,
    }

    let Ball  = {
        x: 300,
        y: 200,
        raduis: 20,
        speed: 5,
        velocityX: 5,
        velocityY: 5
    }

    const drawPaddles = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.rect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
        ctx.rect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
        ctx.fill();
    }

    const drawText = (ctx: CanvasRenderingContext2D, Score : number, x: number, y:number) => {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = "45px fantasy";
        ctx.fillText(Score.toString(), x, y);
    }

    const drawBall = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(Ball.x, Ball.y, Ball.raduis, 0, Math.PI * 2, false);
        ctx.fill();
    }

    const drawframe = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.rect(0, 0, 600, 400);
        ctx.fill();
    };

    const render = (context: CanvasRenderingContext2D) => {
        drawframe(context);
        drawBall(context);
        drawPaddles(context);
        drawText(context, leftPaddle.score, 150, 40);
        drawText(context, rightPaddle.score, 450, 40);
    }
    
    const handleKeyMouvment = (event: KeyboardEvent) => {
        if (event.key === 'ArrowUp' && rightPaddle.y > 0) {
            rightPaddle.y -= 20;
          } else if (event.key === 'ArrowDown' && rightPaddle.y < canvasRef.current!.height - rightPaddle.height) {
            rightPaddle.y += 20;
          }
    }       

    const Collision = (b, p) => {

        b.top = b.y - b.raduis;
        b.bottom = b.y + b.raduis;
        b.left = b.x - b.raduis;
        b.right = b.x + b.raduis;
    
        p.top = p.y;
        p.bottom = p.y + p.height;
        p.left = p.x;
        p.right = p.x + p.width; 
    
        return (
            b.right > p.left &&
            b.bottom > p.top &&
            b.left < p.right &&
            b.top < p.bottom
        );
    };

    const resetBall = () => {
        Ball.x = 300;
        Ball.y = 200;
        Ball.velocityX = -Ball.velocityX;
    }

    const update = (context : CanvasRenderingContext2D) => {
        Ball.x += Ball.velocityX;
        Ball.y += Ball.velocityY;
        if (Ball.x + Ball.raduis > 600 || Ball.x - Ball.raduis < 0){
            if(Ball.x + Ball.raduis > 600) {
                leftPaddle.score += 1;
            }
            if(Ball.x + Ball.raduis < 0) {
                rightPaddle.score += 1;
            }     
            resetBall();
        }
        leftPaddle.y += (Ball.y - (leftPaddle.y + leftPaddle.height / 2));
                                                                                                                                                                                      
        if (Ball.y + Ball.raduis > 400 || Ball.y - Ball.raduis < 0) {
            Ball.velocityY = -Ball.velocityY;
        }


        let player: typeof leftPaddle = Ball.x < 300 ? leftPaddle : rightPaddle;
    
        if (Collision(Ball, player)) {
            var colidePoint = (Ball.y - (player.y + player.height / 2))
            colidePoint /= player.height / 2;
            var angle = colidePoint * Math.PI / 4;
            let direction = (Ball.x < 300 ? 1 : -1);
            Ball.velocityX = direction * Ball.speed * Math.cos(angle);
            Ball.velocityY = direction * Ball.speed * Math.sin(angle);
        }
    };
    

    window.addEventListener('keydown', handleKeyMouvment);

    const game = () => {
        if (!canvasRef.current)
            return ;
        const context = canvasRef.current.getContext('2d');
        if(context){
            render(context);
            update(context);
        }
    }
    const gameLoop = () => {
        game();
        window.requestAnimationFrame(gameLoop);
    };
    
    window.requestAnimationFrame(gameLoop);
    // const FramePerSecond = 50;
    // setInterval(game, 1000/ FramePerSecond);
    return (
        <main className="flex items-center justify-center bg-main h-screen overflow-hidden">
            <div className="relative flex h-full bg-main lg:w-[600px] max-w-[600px] flex-col space-y-2.5 p-4 mt-60 md:w-[600px]">
                <canvas id="pong" ref={canvasRef} height={400} width={600}></canvas>
            </div>
        </main>
    );
}


export default play;