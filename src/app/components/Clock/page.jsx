import { useState, useEffect } from "react";

function Clock() {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
    }));

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('th-TH', {
                hour: '2-digit',
                minute: '2-digit',
            }));
        }, 60000);
        return () => clearInterval(interval);
    }, []);
    return <span>{currentTime}</span>
}
export default Clock