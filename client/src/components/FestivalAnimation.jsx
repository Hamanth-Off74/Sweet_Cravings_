import { useEffect, useState, useMemo } from 'react';
import '../styles/FestivalAnimations.css';

// Fireworks Animation (for New Year, Diwali)
function FireworksAnimation() {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const createFirework = () => {
            const centerX = Math.random() * 100;
            const centerY = 20 + Math.random() * 40;
            const colors = ['#ff6b6b', '#ffd700', '#00ff88', '#ff69b4', '#00bfff', '#ff4500'];

            const newParticles = Array.from({ length: 12 }).map((_, i) => ({
                id: Date.now() + i,
                x: centerX,
                y: centerY,
                angle: (i * 30) * (Math.PI / 180),
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 3 + Math.random() * 4
            }));

            setParticles(prev => [...prev, ...newParticles]);

            setTimeout(() => {
                setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
            }, 1500);
        };

        createFirework();
        const interval = setInterval(createFirework, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="festival-animation fireworks-container">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="firework-particle"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        '--angle': `${p.angle}rad`,
                        backgroundColor: p.color,
                        width: p.size,
                        height: p.size
                    }}
                />
            ))}
        </div>
    );
}

// Snowfall Animation (for Christmas, Winter)
function SnowfallAnimation() {
    const snowflakes = useMemo(() =>
        Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 3 + Math.random() * 4,
            size: 10 + Math.random() * 15,
            opacity: 0.4 + Math.random() * 0.6
        })), []
    );

    return (
        <div className="festival-animation snowfall-container">
            {snowflakes.map(flake => (
                <div
                    key={flake.id}
                    className="snowflake"
                    style={{
                        left: `${flake.left}%`,
                        animationDelay: `${flake.delay}s`,
                        animationDuration: `${flake.duration}s`,
                        fontSize: flake.size,
                        opacity: flake.opacity
                    }}
                >
                    ❄
                </div>
            ))}
        </div>
    );
}

// Confetti Animation (for Celebrations, Birthdays)
function ConfettiAnimation() {
    const confetti = useMemo(() =>
        Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 3,
            duration: 2 + Math.random() * 3,
            color: ['#ff6b6b', '#ffd700', '#00ff88', '#ff69b4', '#00bfff', '#9b59b6'][Math.floor(Math.random() * 6)],
            rotation: Math.random() * 360,
            size: 8 + Math.random() * 8
        })), []
    );

    return (
        <div className="festival-animation confetti-container">
            {confetti.map(c => (
                <div
                    key={c.id}
                    className="confetti-piece"
                    style={{
                        left: `${c.left}%`,
                        animationDelay: `${c.delay}s`,
                        animationDuration: `${c.duration}s`,
                        backgroundColor: c.color,
                        transform: `rotate(${c.rotation}deg)`,
                        width: c.size,
                        height: c.size * 0.6
                    }}
                />
            ))}
        </div>
    );
}

// Hearts Animation (for Valentine's)
function HeartsAnimation() {
    const hearts = useMemo(() =>
        Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 4,
            duration: 4 + Math.random() * 3,
            size: 15 + Math.random() * 20,
            opacity: 0.5 + Math.random() * 0.5
        })), []
    );

    return (
        <div className="festival-animation hearts-container">
            {hearts.map(heart => (
                <div
                    key={heart.id}
                    className="floating-heart"
                    style={{
                        left: `${heart.left}%`,
                        animationDelay: `${heart.delay}s`,
                        animationDuration: `${heart.duration}s`,
                        fontSize: heart.size,
                        opacity: heart.opacity
                    }}
                >
                    ❤
                </div>
            ))}
        </div>
    );
}

// Diwali Lights Animation
function DiwaliLightsAnimation() {
    const lights = useMemo(() =>
        Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            left: (i / 30) * 100,
            delay: Math.random() * 2,
            color: ['#ffd700', '#ff6b00', '#ff0000', '#ffff00'][Math.floor(Math.random() * 4)]
        })), []
    );

    return (
        <div className="festival-animation diwali-container">
            <div className="diya-string">
                {lights.map(light => (
                    <div
                        key={light.id}
                        className="diya-light"
                        style={{
                            left: `${light.left}%`,
                            animationDelay: `${light.delay}s`,
                            backgroundColor: light.color,
                            boxShadow: `0 0 15px ${light.color}, 0 0 30px ${light.color}`
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

// Holi Colors Animation
function HoliColorsAnimation() {
    const colors = useMemo(() =>
        Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 3,
            duration: 2 + Math.random() * 2,
            color: ['#ff0080', '#00ff00', '#ffff00', '#ff6600', '#0066ff', '#9900ff'][Math.floor(Math.random() * 6)],
            size: 20 + Math.random() * 30
        })), []
    );

    return (
        <div className="festival-animation holi-container">
            {colors.map(c => (
                <div
                    key={c.id}
                    className="color-splash"
                    style={{
                        left: `${c.left}%`,
                        animationDelay: `${c.delay}s`,
                        animationDuration: `${c.duration}s`,
                        backgroundColor: c.color,
                        width: c.size,
                        height: c.size
                    }}
                />
            ))}
        </div>
    );
}

// Balloons Animation (for Birthday, Celebrations)
function BalloonsAnimation() {
    const balloons = useMemo(() =>
        Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 6 + Math.random() * 4,
            color: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#ff69b4', '#87ceeb', '#dda0dd'][Math.floor(Math.random() * 6)],
            size: 25 + Math.random() * 15
        })), []
    );

    return (
        <div className="festival-animation balloons-container">
            {balloons.map(b => (
                <div
                    key={b.id}
                    className="balloon"
                    style={{
                        left: `${b.left}%`,
                        animationDelay: `${b.delay}s`,
                        animationDuration: `${b.duration}s`,
                        backgroundColor: b.color,
                        width: b.size,
                        height: b.size * 1.2
                    }}
                >
                    <div className="balloon-string" />
                </div>
            ))}
        </div>
    );
}

// Main export - selects animation based on type
function FestivalAnimation({ type }) {
    if (!type || type === 'none') return null;

    const animations = {
        fireworks: FireworksAnimation,
        snowfall: SnowfallAnimation,
        confetti: ConfettiAnimation,
        hearts: HeartsAnimation,
        diwali_lights: DiwaliLightsAnimation,
        holi_colors: HoliColorsAnimation,
        balloons: BalloonsAnimation
    };

    const AnimationComponent = animations[type];
    return AnimationComponent ? <AnimationComponent /> : null;
}

export default FestivalAnimation;
