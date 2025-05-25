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
    
    // Initialize Code Defender Game
    initCodeDefenderGame();
});

// Code Defender Game Implementation
function initCodeDefenderGame() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Game state
    let gameState = {
        running: false,
        paused: false,
        health: 100,
        score: 0,
        credits: 50,
        wave: 1,
        selectedTower: null,
        enemies: [],
        towers: [],
        projectiles: [],
        lastEnemySpawn: 0,
        enemySpawnRate: 2000,
        waveEnemyCount: 5,
        enemiesSpawned: 0,
        waveComplete: false
    };
    
    // Game elements
    const path = [
        {x: 0, y: 250},
        {x: 200, y: 250},
        {x: 200, y: 150},
        {x: 400, y: 150},
        {x: 400, y: 350},
        {x: 600, y: 350},
        {x: 600, y: 200},
        {x: 800, y: 200}
    ];
    
    const towerTypes = {
        antivirus: {
            cost: 10,
            damage: 15,
            range: 80,
            fireRate: 1000,
            color: '#10b981',
            icon: '🛡️'
        },
        firewall: {
            cost: 15,
            damage: 25,
            range: 100,
            fireRate: 1500,
            color: '#ef4444',
            icon: '🔥'
        },
        tester: {
            cost: 20,
            damage: 35,
            range: 120,
            fireRate: 2000,
            color: '#8b5cf6',
            icon: '🧪'
        }
    };
    
    const enemyTypes = [
        { name: 'Bug', health: 50, speed: 1, reward: 5, color: '#ef4444', icon: '🐛' },
        { name: 'Virus', health: 80, speed: 0.8, reward: 8, color: '#dc2626', icon: '🦠' },
        { name: 'Malware', health: 120, speed: 0.6, reward: 12, color: '#7c2d12', icon: '💀' }
    ];
    
    // Game classes
    class Enemy {
        constructor(type, pathIndex = 0) {
            this.type = type;
            this.health = type.health;
            this.maxHealth = type.health;
            this.speed = type.speed;
            this.reward = type.reward;
            this.pathIndex = pathIndex;
            this.progress = 0;
            this.x = path[0].x;
            this.y = path[0].y;
        }
        
        update() {
            if (this.pathIndex < path.length - 1) {
                const current = path[this.pathIndex];
                const next = path[this.pathIndex + 1];
                const dx = next.x - current.x;
                const dy = next.y - current.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                this.progress += this.speed;
                
                if (this.progress >= distance) {
                    this.progress = 0;
                    this.pathIndex++;
                    if (this.pathIndex < path.length) {
                        this.x = path[this.pathIndex].x;
                        this.y = path[this.pathIndex].y;
                    }
                } else {
                    const ratio = this.progress / distance;
                    this.x = current.x + dx * ratio;
                    this.y = current.y + dy * ratio;
                }
            }
        }
        
        draw() {
            // Draw enemy icon
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.type.icon, this.x, this.y + 8);
            
            // Draw health bar
            const barWidth = 30;
            const barHeight = 4;
            const healthRatio = this.health / this.maxHealth;
            
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(this.x - barWidth/2, this.y - 20, barWidth, barHeight);
            ctx.fillStyle = '#10b981';
            ctx.fillRect(this.x - barWidth/2, this.y - 20, barWidth * healthRatio, barHeight);
        }
        
        takeDamage(damage) {
            this.health -= damage;
            return this.health <= 0;
        }
        
        reachedEnd() {
            return this.pathIndex >= path.length - 1;
        }
    }
    
    class Tower {
        constructor(type, x, y) {
            this.type = type;
            this.x = x;
            this.y = y;
            this.lastFire = 0;
            this.target = null;
        }
        
        update() {
            this.findTarget();
            this.fire();
        }
        
        findTarget() {
            this.target = null;
            let closestDistance = Infinity;
            
            gameState.enemies.forEach(enemy => {
                const dx = enemy.x - this.x;
                const dy = enemy.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance <= this.type.range && distance < closestDistance) {
                    this.target = enemy;
                    closestDistance = distance;
                }
            });
        }
        
        fire() {
            if (this.target && Date.now() - this.lastFire >= this.type.fireRate) {
                gameState.projectiles.push(new Projectile(this, this.target));
                this.lastFire = Date.now();
            }
        }
        
        draw() {
            // Draw tower
            ctx.fillStyle = this.type.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw icon
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'white';
            ctx.fillText(this.type.icon, this.x, this.y + 6);
            
            // Draw range when selected
            if (gameState.selectedTower === this.type) {
                ctx.strokeStyle = this.type.color;
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.type.range, 0, Math.PI * 2);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
    }
    
    class Projectile {
        constructor(tower, target) {
            this.x = tower.x;
            this.y = tower.y;
            this.target = target;
            this.damage = tower.type.damage;
            this.speed = 5;
        }
        
        update() {
            if (!this.target) return false;
            
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 10) {
                this.target.takeDamage(this.damage);
                return false;
            }
            
            const vx = (dx / distance) * this.speed;
            const vy = (dy / distance) * this.speed;
            
            this.x += vx;
            this.y += vy;
            
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
    function spawnEnemy() {
        if (gameState.enemiesSpawned < gameState.waveEnemyCount) {
            const typeIndex = Math.floor(Math.random() * Math.min(enemyTypes.length, Math.floor(gameState.wave / 2) + 1));
            const enemy = new Enemy(enemyTypes[typeIndex]);
            gameState.enemies.push(enemy);
            gameState.enemiesSpawned++;
        }
    }
    
    function updateGame() {
        if (!gameState.running || gameState.paused) return;
        
        // Spawn enemies
        if (Date.now() - gameState.lastEnemySpawn >= gameState.enemySpawnRate) {
            spawnEnemy();
            gameState.lastEnemySpawn = Date.now();
        }
        
        // Update enemies
        gameState.enemies = gameState.enemies.filter(enemy => {
            enemy.update();
            
            if (enemy.health <= 0) {
                gameState.score += enemy.reward;
                gameState.credits += enemy.reward;
                updateUI();
                return false;
            }
            
            if (enemy.reachedEnd()) {
                gameState.health -= 10;
                updateUI();
                if (gameState.health <= 0) {
                    endGame();
                }
                return false;
            }
            
            return true;
        });
        
        // Update towers
        gameState.towers.forEach(tower => tower.update());
        
        // Update projectiles
        gameState.projectiles = gameState.projectiles.filter(projectile => projectile.update());
        
        // Check wave completion
        if (gameState.enemiesSpawned >= gameState.waveEnemyCount && gameState.enemies.length === 0) {
            nextWave();
        }
    }
    
    function drawGame() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw path
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 30;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();
        
        // Draw path direction
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw towers
        gameState.towers.forEach(tower => tower.draw());
        
        // Draw enemies
        gameState.enemies.forEach(enemy => enemy.draw());
        
        // Draw projectiles
        gameState.projectiles.forEach(projectile => projectile.draw());
        
        // Draw tower placement preview
        if (gameState.selectedTower && gameState.running) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = gameState.mouseX - rect.left;
            const mouseY = gameState.mouseY - rect.top;
            
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = gameState.selectedTower.color;
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    function gameLoop() {
        updateGame();
        drawGame();
        requestAnimationFrame(gameLoop);
    }
    
    function startGame() {
        gameState.running = true;
        gameState.paused = false;
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        gameState.lastEnemySpawn = Date.now();
    }
    
    function pauseGame() {
        gameState.paused = !gameState.paused;
        document.getElementById('pauseBtn').textContent = gameState.paused ? 'Resume' : 'Pause';
    }
    
    function resetGame() {
        gameState = {
            running: false,
            paused: false,
            health: 100,
            score: 0,
            credits: 50,
            wave: 1,
            selectedTower: null,
            enemies: [],
            towers: [],
            projectiles: [],
            lastEnemySpawn: 0,
            enemySpawnRate: 2000,
            waveEnemyCount: 5,
            enemiesSpawned: 0,
            waveComplete: false
        };
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = 'Pause';
        
        updateUI();
        updateTowerShop();
    }
    
    function endGame() {
        gameState.running = false;
        const highScore = localStorage.getItem('codeDefenderHighScore') || 0;
        if (gameState.score > highScore) {
            localStorage.setItem('codeDefenderHighScore', gameState.score);
            document.getElementById('highScore').textContent = gameState.score;
            alert(`New High Score: ${gameState.score}!`);
        } else {
            alert(`Game Over! Final Score: ${gameState.score}`);
        }
        resetGame();
    }
    
    function nextWave() {
        gameState.wave++;
        gameState.waveEnemyCount = Math.floor(5 + gameState.wave * 2);
        gameState.enemiesSpawned = 0;
        gameState.enemySpawnRate = Math.max(800, 2000 - gameState.wave * 100);
        gameState.credits += 20;
        updateUI();
    }
    
    function updateUI() {
        document.getElementById('health').textContent = gameState.health;
        document.getElementById('score').textContent = gameState.score;
        document.getElementById('credits').textContent = gameState.credits;
        document.getElementById('wave').textContent = gameState.wave;
    }
    
    function updateTowerShop() {
        document.querySelectorAll('.tower-item').forEach(item => {
            const cost = parseInt(item.dataset.cost);
            item.classList.remove('affordable', 'expensive', 'selected');
            
            if (cost <= gameState.credits) {
                item.classList.add('affordable');
            } else {
                item.classList.add('expensive');
            }
            
            if (gameState.selectedTower && gameState.selectedTower === towerTypes[item.dataset.tower]) {
                item.classList.add('selected');
            }
        });
    }
    
    function placeTower(x, y) {
        if (!gameState.selectedTower || gameState.credits < gameState.selectedTower.cost) return;
        
        // Check if position is valid (not on path and not too close to other towers)
        const minDistance = 40;
        for (let tower of gameState.towers) {
            const dx = tower.x - x;
            const dy = tower.y - y;
            if (Math.sqrt(dx * dx + dy * dy) < minDistance) return;
        }
        
        // Check if too close to path
        for (let point of path) {
            const dx = point.x - x;
            const dy = point.y - y;
            if (Math.sqrt(dx * dx + dy * dy) < 40) return;
        }
        
        gameState.towers.push(new Tower(gameState.selectedTower, x, y));
        gameState.credits -= gameState.selectedTower.cost;
        updateUI();
        updateTowerShop();
    }
    
    // Event listeners
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('pauseBtn').addEventListener('click', pauseGame);
    document.getElementById('resetBtn').addEventListener('click', resetGame);
    
    document.querySelectorAll('.tower-item').forEach(item => {
        item.addEventListener('click', () => {
            const towerType = item.dataset.tower;
            const cost = parseInt(item.dataset.cost);
            
            if (gameState.credits >= cost) {
                gameState.selectedTower = towerTypes[towerType];
                updateTowerShop();
            }
        });
    });
    
    canvas.addEventListener('click', (e) => {
        if (!gameState.running || !gameState.selectedTower) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        placeTower(x, y);
    });
    
    canvas.addEventListener('mousemove', (e) => {
        gameState.mouseX = e.clientX;
        gameState.mouseY = e.clientY;
    });
    
    // Initialize
    updateUI();
    updateTowerShop();
    
    // Load high score
    const savedHighScore = localStorage.getItem('codeDefenderHighScore') || 0;
    document.getElementById('highScore').textContent = savedHighScore;
    
    // Start game loop
    gameLoop();
}