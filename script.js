// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Cache header element reference
    const header = document.querySelector('.header');
    
    // Add smooth scrolling to all links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active state to navigation links
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    function setActiveLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Add scroll event listener for active navigation
    window.addEventListener('scroll', setActiveLink);
    
    // Header background opacity on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections and cards
    const animatedElements = document.querySelectorAll('.service-card, .stat, .tech-category, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Initialize the game if canvas exists
    if (document.getElementById('gameCanvas')) {
        initGame();
    }
});

// Code Defender Tower Defense Game
function initGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Game state
    let gameState = {
        health: 100,
        money: 150,
        wave: 1,
        score: 0,
        isRunning: false,
        selectedTower: null,
        enemies: [],
        towers: [],
        projectiles: [],
        path: [
            {x: 0, y: 200},
            {x: 150, y: 200},
            {x: 150, y: 100},
            {x: 300, y: 100},
            {x: 300, y: 300},
            {x: 450, y: 300},
            {x: 450, y: 150},
            {x: 600, y: 150}
        ]
    };
    
    // Tower types
    const towerTypes = {
        antivirus: { damage: 25, range: 80, speed: 60, cost: 50, color: '#3b82f6' },
        firewall: { damage: 40, range: 60, speed: 40, cost: 75, color: '#ef4444' },
        unittest: { damage: 60, range: 100, speed: 90, cost: 100, color: '#10b981' }
    };
    
    // Enemy types
    const enemyTypes = {
        bug: { health: 50, speed: 1, reward: 15, color: '#fbbf24', emoji: '🐛' },
        virus: { health: 30, speed: 2, reward: 20, color: '#f87171', emoji: '🦠' },
        malware: { health: 120, speed: 0.8, reward: 50, color: '#6b7280', emoji: '💀' }
    };
    
    // Game classes
    class Enemy {
        constructor(type, pathIndex = 0) {
            this.type = type;
            this.health = enemyTypes[type].health;
            this.maxHealth = this.health;
            this.speed = enemyTypes[type].speed;
            this.reward = enemyTypes[type].reward;
            this.pathIndex = pathIndex;
            this.x = gameState.path[0].x;
            this.y = gameState.path[0].y;
            this.progress = 0;
        }
        
        update() {
            if (this.pathIndex < gameState.path.length - 1) {
                const current = gameState.path[this.pathIndex];
                const next = gameState.path[this.pathIndex + 1];
                
                const dx = next.x - current.x;
                const dy = next.y - current.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                this.progress += this.speed / distance;
                
                if (this.progress >= 1) {
                    this.pathIndex++;
                    this.progress = 0;
                }
                
                if (this.pathIndex < gameState.path.length - 1) {
                    const currentPoint = gameState.path[this.pathIndex];
                    const nextPoint = gameState.path[this.pathIndex + 1];
                    
                    this.x = currentPoint.x + (nextPoint.x - currentPoint.x) * this.progress;
                    this.y = currentPoint.y + (nextPoint.y - currentPoint.y) * this.progress;
                }
            }
        }
        
        draw() {
            // Draw enemy body
            ctx.fillStyle = enemyTypes[this.type].color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw emoji
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(enemyTypes[this.type].emoji, this.x, this.y + 7);
            
            // Draw health bar
            const barWidth = 30;
            const barHeight = 4;
            const healthPercent = this.health / this.maxHealth;
            
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(this.x - barWidth/2, this.y - 25, barWidth, barHeight);
            
            ctx.fillStyle = '#10b981';
            ctx.fillRect(this.x - barWidth/2, this.y - 25, barWidth * healthPercent, barHeight);
        }
        
        takeDamage(damage) {
            this.health -= damage;
            return this.health <= 0;
        }
        
        reachedEnd() {
            return this.pathIndex >= gameState.path.length - 1;
        }
    }
    
    class Tower {
        constructor(x, y, type) {
            this.x = x;
            this.y = y;
            this.type = type;
            this.damage = towerTypes[type].damage;
            this.range = towerTypes[type].range;
            this.speed = towerTypes[type].speed;
            this.lastShot = 0;
            this.target = null;
        }
        
        update() {
            const now = Date.now();
            if (now - this.lastShot < this.speed * 16) return;
            
            // Find target
            this.target = null;
            let closestDistance = this.range;
            
            gameState.enemies.forEach(enemy => {
                const distance = Math.sqrt(
                    Math.pow(enemy.x - this.x, 2) + Math.pow(enemy.y - this.y, 2)
                );
                if (distance < closestDistance) {
                    this.target = enemy;
                    closestDistance = distance;
                }
            });
            
            // Shoot at target
            if (this.target) {
                gameState.projectiles.push(new Projectile(this.x, this.y, this.target, this.damage));
                this.lastShot = now;
            }
        }
        
        draw() {
            // Draw tower base
            ctx.fillStyle = towerTypes[this.type].color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 20, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw tower emoji
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            let emoji = this.type === 'antivirus' ? '🛡️' : 
                       this.type === 'firewall' ? '🔥' : '🧪';
            ctx.fillText(emoji, this.x, this.y + 8);
            
            // Draw range when selected
            if (gameState.selectedTower === this.type) {
                ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }
    
    class Projectile {
        constructor(x, y, target, damage) {
            this.x = x;
            this.y = y;
            this.target = target;
            this.damage = damage;
            this.speed = 5;
        }
        
        update() {
            if (!this.target || this.target.health <= 0) return false;
            
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 10) {
                // Hit target
                if (this.target.takeDamage(this.damage)) {
                    // Enemy destroyed
                    gameState.money += this.target.reward;
                    gameState.score += this.target.reward * 10;
                    const index = gameState.enemies.indexOf(this.target);
                    if (index > -1) gameState.enemies.splice(index, 1);
                }
                return false;
            }
            
            // Move towards target
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
            
            return true;
        }
        
        draw() {
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Game functions
    function spawnWave() {
        const waveEnemies = Math.min(5 + gameState.wave, 15);
        const enemyTypesList = ['bug', 'virus'];
        
        if (gameState.wave > 3) enemyTypesList.push('malware');
        
        for (let i = 0; i < waveEnemies; i++) {
            setTimeout(() => {
                const randomType = enemyTypesList[Math.floor(Math.random() * enemyTypesList.length)];
                gameState.enemies.push(new Enemy(randomType));
            }, i * 800);
        }
    }
    
    function gameLoop() {
        if (!gameState.isRunning) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw path
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 40;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(gameState.path[0].x, gameState.path[0].y);
        for (let i = 1; i < gameState.path.length; i++) {
            ctx.lineTo(gameState.path[i].x, gameState.path[i].y);
        }
        ctx.stroke();
        
        // Update and draw towers
        gameState.towers.forEach(tower => {
            tower.update();
            tower.draw();
        });
        
        // Update and draw projectiles
        gameState.projectiles = gameState.projectiles.filter(projectile => {
            const alive = projectile.update();
            if (alive) projectile.draw();
            return alive;
        });
        
        // Update and draw enemies
        gameState.enemies.forEach((enemy, index) => {
            enemy.update();
            enemy.draw();
            
            if (enemy.reachedEnd()) {
                gameState.health -= 10;
                gameState.enemies.splice(index, 1);
            }
        });
        
        // Check wave completion
        if (gameState.enemies.length === 0 && gameState.isRunning) {
            gameState.wave++;
            gameState.money += 50;
            gameState.isRunning = false;
            updateUI();
        }
        
        // Check game over
        if (gameState.health <= 0) {
            gameOver();
            return;
        }
        
        updateUI();
        requestAnimationFrame(gameLoop);
    }
    
    function updateUI() {
        document.getElementById('health').textContent = gameState.health;
        document.getElementById('money').textContent = gameState.money;
        document.getElementById('wave').textContent = gameState.wave;
        document.getElementById('score').textContent = gameState.score;
        
        // Update tower buttons
        document.querySelectorAll('.tower-btn').forEach(btn => {
            const cost = parseInt(btn.dataset.cost);
            btn.disabled = gameState.money < cost;
        });
        
        // Update start button
        const startBtn = document.getElementById('start-btn');
        startBtn.disabled = gameState.isRunning;
        startBtn.textContent = gameState.isRunning ? 'Wave in Progress' : `Start Wave ${gameState.wave}`;
    }
    
    function gameOver() {
        gameState.isRunning = false;
        const highScore = localStorage.getItem('codeDefenderHighScore') || 0;
        if (gameState.score > highScore) {
            localStorage.setItem('codeDefenderHighScore', gameState.score);
            document.getElementById('high-score').textContent = gameState.score;
            alert(`New High Score: ${gameState.score}!`);
        } else {
            alert(`Game Over! Final Score: ${gameState.score}`);
        }
    }
    
    function resetGame() {
        gameState = {
            health: 100,
            money: 150,
            wave: 1,
            score: 0,
            isRunning: false,
            selectedTower: null,
            enemies: [],
            towers: [],
            projectiles: [],
            path: gameState.path
        };
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateUI();
        
        // Clear tower selection
        document.querySelectorAll('.tower-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
    }
    
    // Event listeners
    document.getElementById('start-btn').addEventListener('click', () => {
        if (!gameState.isRunning) {
            gameState.isRunning = true;
            spawnWave();
            gameLoop();
        }
    });
    
    document.getElementById('reset-btn').addEventListener('click', resetGame);
    
    // Tower selection
    document.querySelectorAll('.tower-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const towerType = btn.id.replace('-btn', '');
            
            // Clear previous selection
            document.querySelectorAll('.tower-btn').forEach(b => b.classList.remove('selected'));
            
            if (gameState.selectedTower === towerType) {
                gameState.selectedTower = null;
            } else {
                gameState.selectedTower = towerType;
                btn.classList.add('selected');
            }
        });
    });
    
    // Canvas click for tower placement
    canvas.addEventListener('click', (e) => {
        if (!gameState.selectedTower) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Check if position is valid (not on path, not too close to other towers)
        let canPlace = true;
        
        // Check path collision
        for (let i = 0; i < gameState.path.length - 1; i++) {
            const p1 = gameState.path[i];
            const p2 = gameState.path[i + 1];
            
            const distance = distanceToLineSegment(x, y, p1.x, p1.y, p2.x, p2.y);
            if (distance < 35) {
                canPlace = false;
                break;
            }
        }
        
        // Check tower collision
        gameState.towers.forEach(tower => {
            const distance = Math.sqrt(Math.pow(tower.x - x, 2) + Math.pow(tower.y - y, 2));
            if (distance < 50) canPlace = false;
        });
        
        if (canPlace && gameState.money >= towerTypes[gameState.selectedTower].cost) {
            gameState.towers.push(new Tower(x, y, gameState.selectedTower));
            gameState.money -= towerTypes[gameState.selectedTower].cost;
            updateUI();
        }
    });
    
    // Helper function for line distance
    function distanceToLineSegment(px, py, x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        if (length === 0) return Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1));
        
        const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (length * length)));
        const projX = x1 + t * dx;
        const projY = y1 + t * dy;
        
        return Math.sqrt((px - projX) * (px - projX) + (py - projY) * (py - projY));
    }
    
    // Initialize high score display
    const savedHighScore = localStorage.getItem('codeDefenderHighScore') || 0;
    document.getElementById('high-score').textContent = savedHighScore;
    
    // Initial UI update
    updateUI();
}