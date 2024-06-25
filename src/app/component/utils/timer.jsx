"use client"
import React, { useState, useEffect } from 'react';

function CountdownTimer({ deadline }) {
    const calculateTimeLeft = () => {
        const difference = +new Date(deadline) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60)
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const formatCountdown = ({ days, hours, minutes }) => {
        const formattedDays = `${days} día${days !== 1 ? 's' : ''}`;
        const formattedHours = `${hours} hora${hours !== 1 ? 's' : ''}`;
        const formattedMinutes = `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
        return `Expira en: ${formattedDays}, ${formattedHours} y ${formattedMinutes}`;
    };

    return (
        <div>
            {timeLeft.days > 0 && (
                <span>{formatCountdown(timeLeft)}</span>
            )}
            {timeLeft.days === 0 && timeLeft.hours > 0 && (
                <span>{formatCountdown(timeLeft)}</span>
            )}
            {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes > 0 && (
                <span>{formatCountdown(timeLeft)}</span>
            )}
            {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && (
                <span>{formatCountdown(timeLeft)}</span>
            )}
            {timeLeft.days < 0 && (
                <span>El plazo ha pasado.</span>
            )}
        </div>
    );
}

export default CountdownTimer;
