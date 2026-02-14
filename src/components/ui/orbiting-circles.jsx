import React from "react";
import { cn } from "../../utils/cn";

export default function OrbitingCircles({
    className,
    children,
    reverse,
    duration = 20,
    delay = 10,
    radius = 50,
    path = true,
}) {
    return (
        <>
            {path && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    className="pointer-events-none absolute inset-0 h-full w-full"
                >
                    <circle
                        className="stroke-white/10 stroke-1"
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="none"
                        strokeDasharray={"4 4"}
                    />
                </svg>
            )}

            <div
                style={{
                    "--duration": duration,
                    "--radius": radius,
                    "--delay": -delay,
                }}
                className={cn(
                    "absolute flex h-full w-full transform-gpu items-center justify-center rounded-full border-none animate-orbit",
                    { "[animation-direction:reverse]": reverse },
                    className
                )}
            >
                {children}
            </div>
        </>
    );
}
