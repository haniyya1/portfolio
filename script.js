//skills
const container = document.getElementById("container");
const skills = Array.from(document.querySelectorAll(".skill"));

const SPEED = 1.1; // normal movement speed
const BOUNCE_SPEED = 1.1; // speed after bouncing

// Initialize skill data
const skillData = skills.map(skill => {
    const maxX = container.clientWidth - skill.offsetWidth;
    const maxY = container.clientHeight - skill.offsetHeight;

    return {
        el: skill,
        x: Math.random() * maxX,
        y: Math.random() * maxY,
        vx: (Math.random() - 0.5) * SPEED * 2,
        vy: (Math.random() - 0.5) * SPEED * 2
    };
});

function randomDirection(speed) {
    const angle = Math.random() * Math.PI * 2;
    return { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed };
}

function update() {
    const maxX = container.clientWidth;
    const maxY = container.clientHeight;

    for (let i = 0; i < skillData.length; i++) {
        let s = skillData[i];

        // Move
        s.x += s.vx;
        s.y += s.vy;

        let bounced = false;

        // Wall collision
        if (s.x <= 0 || s.x + s.el.offsetWidth >= maxX) {
            bounced = true;
            s.x = Math.max(0, Math.min(s.x, maxX - s.el.offsetWidth));
        }
        if (s.y <= 0 || s.y + s.el.offsetHeight >= maxY) {
            bounced = true;
            s.y = Math.max(0, Math.min(s.y, maxY - s.el.offsetHeight));
        }

        // Collision with other skills
        for (let j = i + 1; j < skillData.length; j++) {
            let o = skillData[j];
            const dx = (s.x + s.el.offsetWidth / 2) - (o.x + o.el.offsetWidth / 2);
            const dy = (s.y + s.el.offsetHeight / 2) - (o.y + o.el.offsetHeight / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = (s.el.offsetWidth / 2 + o.el.offsetWidth / 2);

            if (distance < minDistance) {
                bounced = true;

                const overlap = minDistance - distance;
                const halfOverlap = overlap / 2;
                s.x += (dx / distance) * halfOverlap;
                s.y += (dy / distance) * halfOverlap;
                o.x -= (dx / distance) * halfOverlap;
                o.y -= (dy / distance) * halfOverlap;

                // Give both a new random direction
                const dir1 = randomDirection(BOUNCE_SPEED);
                const dir2 = randomDirection(BOUNCE_SPEED);
                s.vx = dir1.vx; s.vy = dir1.vy;
                o.vx = dir2.vx; o.vy = dir2.vy;
            }
        }

        // If it bounced (wall or skill), change direction randomly
        if (bounced) {
            const dir = randomDirection(BOUNCE_SPEED);
            s.vx = dir.vx;
            s.vy = dir.vy;
        }

        // Apply position
        s.el.style.transform = `translate(${s.x}px, ${s.y}px)`;
    }

    requestAnimationFrame(update);
}

update();
