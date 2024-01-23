import { Progress } from "@nextui-org/react";

interface ProgressBarProps {
    level: number;
}

const  ProgressBar = ({ level }: ProgressBarProps) => {
    return(
        <div className="w-full bg-white rounded-3xl">
  <div
    className="h-full rounded-3xl flex justify-center items-center text-white text-center w-full"
    style={{
        background: `linear-gradient(to right, #3af8c7 ${level}%, #00ced1 ${level}%)`,
      }}
      role="progressbar"
      aria-valuenow={level}
      aria-valuemin={0}
      aria-valuemax={21}
  >
    {level}%
  </div>
</div>
    ) 
}

export default ProgressBar;