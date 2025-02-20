import React, {useEffect, useRef} from "react";

export const Temperature = React.memo(() => {
    const drawAt = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (drawAt.current === null) return;
        const container = drawAt.current;
    }, []);

    return (
        <div ref={drawAt}/>
    )
})