// Quantum Pokemon Battle System
class QuantumPokemonBattle {
    constructor() {
        this.gameState = {
            player: {
                name: 'Charizard',
                maxHp: 120,
                currentHp: 120,
                level: 30,
                emoji: '🔥',
                attacks: ['Flamethrower', 'Dragon Claw', 'Solar Beam', 'Fire Blast']
            },
            enemy: {
                name: 'Pikachu',
                maxHp: 100,
                currentHp: 100,
                level: 25,
                emoji: '⚡',
                attacks: ['Thunderbolt', 'Quick Attack', 'Thunder Wave', 'Agility']
            },
            turn: 'player',
            battleCount: 0,
            wins: 0,
            isDefending: false,
            healingItems: 3,
            specialUses: 2
        };
        
        this.enemies = [
            { name: 'Pikachu', maxHp: 100, level: 25, emoji: '⚡', attacks: ['Thunderbolt', 'Quick Attack', 'Thunder Wave', 'Agility'] },
            { name: 'Bulbasaur', maxHp: 110, level: 28, emoji: '🌱', attacks: ['Vine Whip', 'Razor Leaf', 'Sleep Powder', 'Growth'] },
            { name: 'Squirtle', maxHp: 95, level: 22, emoji: '🐢', attacks: ['Water Gun', 'Bubble Beam', 'Withdraw', 'Tackle'] },
            { name: 'Gengar', maxHp: 130, level: 35, emoji: '👻', attacks: ['Shadow Ball', 'Hypnosis', 'Dream Eater', 'Night Shade'] },
            { name: 'Machamp', maxHp: 140, level: 38, emoji: '💪', attacks: ['Dynamic Punch', 'Cross Chop', 'Seismic Toss', 'Bulk Up'] }
        ];
        
        this.initializeGame();
        this.bindEvents();
        this.updateDisplay();
    }
    
    initializeGame() {
        this.addLogEntry('Quantum Pokemon Battle System initialized!');
        this.addLogEntry('Neural pathways synchronized. Ready for battle!');
        this.spawnRandomEnemy();
    }
    
    bindEvents() {
        document.getElementById('attack-btn').addEventListener('click', () => this.playerAttack());
        document.getElementById('defend-btn').addEventListener('click', () => this.playerDefend());
        document.getElementById('special-btn').addEventListener('click', () => this.playerSpecial());
        document.getElementById('heal-btn').addEventListener('click', () => this.playerHeal());
    }
    
    spawnRandomEnemy() {
        const randomEnemy = this.enemies[Math.floor(Math.random() * this.enemies.length)];
        this.gameState.enemy = {
            ...randomEnemy,
            currentHp: randomEnemy.maxHp
        };
        
        this.updateEnemyDisplay();
        this.addLogEntry(`Wild ${this.gameState.enemy.name} appeared!`);
    }
    
    updateDisplay() {
        this.updatePlayerDisplay();
        this.updateEnemyDisplay();
        this.updateStats();
    }
    
    updatePlayerDisplay() {
        const player = this.gameState.player;
        document.getElementById('player-name').textContent = player.name;
        document.getElementById('player-level').textContent = `LVL ${player.level}`;
        document.getElementById('player-health-text').textContent = `${player.currentHp}/${player.maxHp}`;
        
        const healthPercentage = (player.currentHp / player.maxHp) * 100;
        const healthBar = document.getElementById('player-health');
        healthBar.style.width = `${healthPercentage}%`;
        
        if (healthPercentage <= 25) {
            healthBar.style.background = 'linear-gradient(90deg, #ff1744 0%, #ff6f00 100%)';
        } else if (healthPercentage <= 50) {
            healthBar.style.background = 'linear-gradient(90deg, #ff6f00 0%, #ffc107 100%)';
        } else {
            healthBar.style.background = 'linear-gradient(90deg, #00ff88 0%, #00e5ff 100%)';
        }
        
        document.querySelector('.player-sprite .pokemon-image').textContent = player.emoji;
    }
    
    updateEnemyDisplay() {
        const enemy = this.gameState.enemy;
        document.getElementById('enemy-name').textContent = `Wild ${enemy.name}`;
        document.getElementById('enemy-level').textContent = `LVL ${enemy.level}`;
        document.getElementById('enemy-health-text').textContent = `${enemy.currentHp}/${enemy.maxHp}`;
        
        const healthPercentage = (enemy.currentHp / enemy.maxHp) * 100;
        const healthBar = document.getElementById('enemy-health');
        healthBar.style.width = `${healthPercentage}%`;
        
        if (healthPercentage <= 25) {
            healthBar.style.background = 'linear-gradient(90deg, #ff1744 0%, #ff6f00 100%)';
        } else if (healthPercentage <= 50) {
            healthBar.style.background = 'linear-gradient(90deg, #ff6f00 0%, #ffc107 100%)';
        } else {
            healthBar.style.background = 'linear-gradient(90deg, #00ff88 0%, #00e5ff 100%)';
        }
        
        document.querySelector('.enemy-sprite .pokemon-image').textContent = enemy.emoji;
    }
    
    updateStats() {
        document.getElementById('wins-count').textContent = this.gameState.wins;
        document.getElementById('energy-level').textContent = '100%';
    }
    
    addLogEntry(message, type = 'normal') {
        const logContent = document.getElementById('log-content');
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = `> ${message}`;
        
        logContent.appendChild(entry);
        logContent.scrollTop = logContent.scrollHeight;
        
        // Keep only last 10 entries
        while (logContent.children.length > 10) {
            logContent.removeChild(logContent.firstChild);
        }
    }
    
    playerAttack() {
        if (this.gameState.turn !== 'player') return;
        
        const damage = this.calculateDamage(20, 40);
        const attackName = this.gameState.player.attacks[Math.floor(Math.random() * this.gameState.player.attacks.length)];
        const isCritical = Math.random() < 0.15;
        
        const finalDamage = isCritical ? Math.floor(damage * 1.5) : damage;
        this.gameState.enemy.currentHp = Math.max(0, this.gameState.enemy.currentHp - finalDamage);
        
        if (isCritical) {
            this.addLogEntry(`${this.gameState.player.name} used ${attackName}! Critical hit!`, 'critical');
            this.createCriticalEffect();
        } else {
            this.addLogEntry(`${this.gameState.player.name} used ${attackName}!`);
        }
        
        this.addLogEntry(`Dealt ${finalDamage} quantum damage!`, 'damage');
        this.updateDisplay();
        
        if (this.gameState.enemy.currentHp <= 0) {
            this.enemyDefeated();
        } else {
            this.gameState.turn = 'enemy';
            setTimeout(() => this.enemyTurn(), 1500);
        }
        
        this.gameState.isDefending = false;
    }
    
    playerDefend() {
        if (this.gameState.turn !== 'player') return;
        
        this.gameState.isDefending = true;
        this.addLogEntry(`${this.gameState.player.name} activates neural shield!`);
        this.addLogEntry('Incoming damage will be reduced by 50%!');
        
        this.gameState.turn = 'enemy';
        setTimeout(() => this.enemyTurn(), 1500);
    }
    
    playerSpecial() {
        if (this.gameState.turn !== 'player' || this.gameState.specialUses <= 0) return;
        
        this.gameState.specialUses--;
        const damage = this.calculateDamage(35, 60);
        const isCritical = Math.random() < 0.25; // Higher crit chance for special
        
        const finalDamage = isCritical ? Math.floor(damage * 2) : damage;
        this.gameState.enemy.currentHp = Math.max(0, this.gameState.enemy.currentHp - finalDamage);
        
        this.addLogEntry(`${this.gameState.player.name} warps reality!`, 'critical');
        this.addLogEntry(`Quantum distortion deals ${finalDamage} damage!`, 'damage');
        
        if (isCritical) {
            this.addLogEntry('Reality collapsed! Massive damage!', 'critical');
            this.createCriticalEffect();
        }
        
        this.updateDisplay();
        this.updateSpecialButton();
        
        if (this.gameState.enemy.currentHp <= 0) {
            this.enemyDefeated();
        } else {
            this.gameState.turn = 'enemy';
            setTimeout(() => this.enemyTurn(), 1500);
        }
        
        this.gameState.isDefending = false;
    }
    
    playerHeal() {
        if (this.gameState.turn !== 'player' || this.gameState.healingItems <= 0) return;
        
        this.gameState.healingItems--;
        const healAmount = this.calculateDamage(25, 45);
        const oldHp = this.gameState.player.currentHp;
        
        this.gameState.player.currentHp = Math.min(
            this.gameState.player.maxHp, 
            this.gameState.player.currentHp + healAmount
        );
        
        const actualHeal = this.gameState.player.currentHp - oldHp;
        
        this.addLogEntry(`${this.gameState.player.name} uses quantum healing!`, 'heal');
        this.addLogEntry(`Restored ${actualHeal} HP!`, 'heal');
        
        this.updateDisplay();
        this.updateHealButton();
        
        this.gameState.turn = 'enemy';
        setTimeout(() => this.enemyTurn(), 1500);
        
        this.gameState.isDefending = false;
    }
    
    enemyTurn() {
        if (this.gameState.turn !== 'enemy') return;
        
        const attackName = this.gameState.enemy.attacks[Math.floor(Math.random() * this.gameState.enemy.attacks.length)];
        const damage = this.calculateDamage(15, 35);
        const isCritical = Math.random() < 0.1;
        
        let finalDamage = isCritical ? Math.floor(damage * 1.5) : damage;
        
        if (this.gameState.isDefending) {
            finalDamage = Math.floor(finalDamage * 0.5);
            this.addLogEntry('Neural shield absorbs damage!');
        }
        
        this.gameState.player.currentHp = Math.max(0, this.gameState.player.currentHp - finalDamage);
        
        this.addLogEntry(`Wild ${this.gameState.enemy.name} used ${attackName}!`);
        if (isCritical) {
            this.addLogEntry('It was a critical hit!', 'critical');
        }
        this.addLogEntry(`You took ${finalDamage} damage!`, 'damage');
        
        this.updateDisplay();
        
        if (this.gameState.player.currentHp <= 0) {
            this.playerDefeated();
        } else {
            this.gameState.turn = 'player';
        }
        
        this.gameState.isDefending = false;
    }
    
    enemyDefeated() {
        this.gameState.wins++;
        this.gameState.battleCount++;
        
        this.addLogEntry(`Wild ${this.gameState.enemy.name} fainted!`, 'critical');
        this.addLogEntry('Victory! Quantum energy absorbed!', 'heal');
        
        // Heal player slightly after victory
        const healAmount = Math.floor(this.gameState.player.maxHp * 0.1);
        this.gameState.player.currentHp = Math.min(
            this.gameState.player.maxHp,
            this.gameState.player.currentHp + healAmount
        );
        
        this.updateDisplay();
        this.createVictoryEffect();
        
        // Spawn new enemy after delay
        setTimeout(() => {
            this.spawnRandomEnemy();
            this.gameState.turn = 'player';
        }, 3000);
    }
    
    playerDefeated() {
        this.addLogEntry(`${this.gameState.player.name} fainted!`, 'damage');
        this.addLogEntry('Neural link severed... Respawning...', 'critical');
        
        // Reset player
        this.gameState.player.currentHp = this.gameState.player.maxHp;
        this.gameState.healingItems = 3;
        this.gameState.specialUses = 2;
        
        this.updateDisplay();
        this.updateHealButton();
        this.updateSpecialButton();
        
        setTimeout(() => {
            this.addLogEntry('Quantum resurrection complete!', 'heal');
            this.spawnRandomEnemy();
            this.gameState.turn = 'player';
        }, 2000);
    }
    
    calculateDamage(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    updateHealButton() {
        const healBtn = document.getElementById('heal-btn');
        const healText = healBtn.querySelector('span:last-child');
        healText.textContent = `QUANTUM HEAL (${this.gameState.healingItems})`;
        
        if (this.gameState.healingItems <= 0) {
            healBtn.disabled = true;
            healBtn.style.opacity = '0.3';
        } else {
            healBtn.disabled = false;
            healBtn.style.opacity = '1';
        }
    }
    
    updateSpecialButton() {
        const specialBtn = document.getElementById('special-btn');
        const specialText = specialBtn.querySelector('span:last-child');
        specialText.textContent = `REALITY WARP (${this.gameState.specialUses})`;
        
        if (this.gameState.specialUses <= 0) {
            specialBtn.disabled = true;
            specialBtn.style.opacity = '0.3';
        } else {
            specialBtn.disabled = false;
            specialBtn.style.opacity = '1';
        }
    }
    
    createCriticalEffect() {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            font-weight: bold;
            color: #ff1744;
            text-shadow: 0 0 20px #ff1744;
            z-index: 1000;
            pointer-events: none;
            animation: criticalEffect 1s ease-out forwards;
        `;
        effect.textContent = 'CRITICAL!';
        document.body.appendChild(effect);
        
        setTimeout(() => effect.remove(), 1000);
    }
    
    createVictoryEffect() {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 2.5rem;
            font-weight: bold;
            color: #00ff88;
            text-shadow: 0 0 20px #00ff88;
            z-index: 1000;
            pointer-events: none;
            animation: victoryEffect 2s ease-out forwards;
        `;
        effect.textContent = 'VICTORY!';
        document.body.appendChild(effect);
        
        setTimeout(() => effect.remove(), 2000);
    }
}

// CSS animations for effects
const style = document.createElement('style');
style.textContent = `
    @keyframes criticalEffect {
        0% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.5); 
        }
        50% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1.2); 
        }
        100% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(1); 
        }
    }
    
    @keyframes victoryEffect {
        0% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.5) rotate(-10deg); 
        }
        50% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1.1) rotate(0deg); 
        }
        100% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(1) rotate(10deg); 
        }
    }
`;
document.head.appendChild(style);

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the pokemon page
    if (window.location.pathname.includes('pokemon.html') || 
        document.querySelector('.pokemon-main')) {
        
        // Wait a bit for the main script to load
        setTimeout(() => {
            window.pokemonBattle = new QuantumPokemonBattle();
        }, 500);
    }
});

// Quantum particle effects for battle arena
function createQuantumParticles() {
    const arena = document.querySelector('.battle-arena');
    if (!arena) return;
    
    setInterval(() => {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #00e5ff;
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: particleFloat 3s linear forwards;
            pointer-events: none;
            z-index: 1;
            box-shadow: 0 0 10px #00e5ff;
        `;
        
        arena.appendChild(particle);
        
        setTimeout(() => particle.remove(), 3000);
    }, 500);
}

// Add particle float animation
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('pokemon.html') || 
        document.querySelector('.pokemon-main')) {
        
        const particleStyle = document.createElement('style');
        particleStyle.textContent = `
            @keyframes particleFloat {
                0% { 
                    opacity: 0; 
                    transform: translateY(0) scale(0); 
                }
                10% { 
                    opacity: 1; 
                    transform: translateY(-10px) scale(1); 
                }
                90% { 
                    opacity: 1; 
                    transform: translateY(-100px) scale(1); 
                }
                100% { 
                    opacity: 0; 
                    transform: translateY(-120px) scale(0); 
                }
            }
        `;
        document.head.appendChild(particleStyle);
        
        // Start particle effects
        setTimeout(createQuantumParticles, 1000);
    }
});