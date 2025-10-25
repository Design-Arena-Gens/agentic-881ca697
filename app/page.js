'use client';

import { useState, useEffect } from 'react';

const HOUSES = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'];
const SPELLS = [
  { name: 'Expelliarmus', damage: 20, mana: 15 },
  { name: 'Stupefy', damage: 30, mana: 25 },
  { name: 'Protego', heal: 25, mana: 20 },
  { name: 'Expecto Patronum', damage: 50, mana: 40 },
  { name: 'Petrificus Totalus', damage: 35, mana: 30 },
];

const ENEMIES = [
  { name: 'Dementor', hp: 100, damage: 15 },
  { name: 'Death Eater', hp: 80, damage: 20 },
  { name: 'Basilisk', hp: 150, damage: 25 },
  { name: 'Troll', hp: 120, damage: 18 },
];

export default function Home() {
  const [gameState, setGameState] = useState('start'); // start, playing, victory, defeat
  const [playerName, setPlayerName] = useState('');
  const [playerHouse, setPlayerHouse] = useState('');
  const [playerHp, setPlayerHp] = useState(100);
  const [playerMana, setPlayerMana] = useState(100);
  const [playerScore, setPlayerScore] = useState(0);
  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [enemyHp, setEnemyHp] = useState(0);
  const [battleLog, setBattleLog] = useState([]);
  const [round, setRound] = useState(1);

  const addLog = (message) => {
    setBattleLog(prev => [...prev.slice(-4), message]);
  };

  const startGame = () => {
    if (playerName && playerHouse) {
      setGameState('playing');
      spawnEnemy();
      setBattleLog([]);
    }
  };

  const spawnEnemy = () => {
    const enemy = ENEMIES[Math.floor(Math.random() * ENEMIES.length)];
    setCurrentEnemy(enemy);
    setEnemyHp(enemy.hp);
    addLog(`A wild ${enemy.name} appears!`);
  };

  const castSpell = (spell) => {
    if (playerMana < spell.mana) {
      addLog('Not enough mana!');
      return;
    }

    setPlayerMana(prev => prev - spell.mana);

    if (spell.damage) {
      const newEnemyHp = Math.max(0, enemyHp - spell.damage);
      setEnemyHp(newEnemyHp);
      addLog(`You cast ${spell.name}! ${spell.damage} damage dealt.`);

      if (newEnemyHp === 0) {
        setTimeout(() => {
          const newScore = playerScore + 100;
          setPlayerScore(newScore);
          addLog(`${currentEnemy.name} defeated! +100 points`);

          setRound(prev => prev + 1);
          setPlayerMana(prev => Math.min(100, prev + 30));

          setTimeout(() => {
            spawnEnemy();
          }, 1000);
        }, 500);
        return;
      }
    }

    if (spell.heal) {
      setPlayerHp(prev => Math.min(100, prev + spell.heal));
      addLog(`You cast ${spell.name}! Restored ${spell.heal} HP.`);
    }

    // Enemy attacks
    setTimeout(() => {
      const newPlayerHp = Math.max(0, playerHp - currentEnemy.damage);
      setPlayerHp(newPlayerHp);
      addLog(`${currentEnemy.name} attacks! ${currentEnemy.damage} damage taken.`);

      if (newPlayerHp === 0) {
        setGameState('defeat');
      }
    }, 1000);
  };

  const restoreSpell = () => {
    setPlayerMana(prev => Math.min(100, prev + 20));
    addLog('You focus your magic... +20 mana restored.');

    setTimeout(() => {
      const newPlayerHp = Math.max(0, playerHp - currentEnemy.damage);
      setPlayerHp(newPlayerHp);
      addLog(`${currentEnemy.name} attacks! ${currentEnemy.damage} damage taken.`);

      if (newPlayerHp === 0) {
        setGameState('defeat');
      }
    }, 1000);
  };

  const resetGame = () => {
    setGameState('start');
    setPlayerName('');
    setPlayerHouse('');
    setPlayerHp(100);
    setPlayerMana(100);
    setPlayerScore(0);
    setCurrentEnemy(null);
    setEnemyHp(0);
    setBattleLog([]);
    setRound(1);
  };

  const getHouseColor = (house) => {
    const colors = {
      'Gryffindor': '#740001',
      'Slytherin': '#1a472a',
      'Ravenclaw': '#0e1a40',
      'Hufflepuff': '#ecb939'
    };
    return colors[house] || '#333';
  };

  return (
    <div style={styles.container}>
      <div style={{...styles.background, backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'}}>

        {gameState === 'start' && (
          <div style={styles.startScreen}>
            <h1 style={styles.title}>⚡ Harry Potter Wizard Duel ⚡</h1>
            <div style={styles.form}>
              <input
                type="text"
                placeholder="Enter your wizard name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                style={styles.input}
              />
              <div style={styles.houseSelection}>
                <p style={styles.label}>Choose your house:</p>
                <div style={styles.houseButtons}>
                  {HOUSES.map(house => (
                    <button
                      key={house}
                      onClick={() => setPlayerHouse(house)}
                      style={{
                        ...styles.houseButton,
                        backgroundColor: getHouseColor(house),
                        border: playerHouse === house ? '3px solid gold' : '2px solid #666',
                        transform: playerHouse === house ? 'scale(1.05)' : 'scale(1)'
                      }}
                    >
                      {house}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={startGame}
                disabled={!playerName || !playerHouse}
                style={{
                  ...styles.startButton,
                  opacity: !playerName || !playerHouse ? 0.5 : 1,
                  cursor: !playerName || !playerHouse ? 'not-allowed' : 'pointer'
                }}
              >
                Begin Adventure
              </button>
            </div>
          </div>
        )}

        {gameState === 'playing' && currentEnemy && (
          <div style={styles.gameScreen}>
            <div style={styles.header}>
              <div style={styles.playerInfo}>
                <h2 style={styles.playerName}>{playerName}</h2>
                <p style={{...styles.houseBadge, backgroundColor: getHouseColor(playerHouse)}}>{playerHouse}</p>
                <div style={styles.statBar}>
                  <span>HP:</span>
                  <div style={styles.bar}>
                    <div style={{...styles.barFill, width: `${playerHp}%`, backgroundColor: '#e74c3c'}}></div>
                  </div>
                  <span>{playerHp}</span>
                </div>
                <div style={styles.statBar}>
                  <span>Mana:</span>
                  <div style={styles.bar}>
                    <div style={{...styles.barFill, width: `${playerMana}%`, backgroundColor: '#3498db'}}></div>
                  </div>
                  <span>{playerMana}</span>
                </div>
                <p style={styles.score}>Score: {playerScore} | Round: {round}</p>
              </div>

              <div style={styles.enemyInfo}>
                <h2 style={styles.enemyName}>{currentEnemy.name}</h2>
                <div style={styles.statBar}>
                  <span>HP:</span>
                  <div style={styles.bar}>
                    <div style={{...styles.barFill, width: `${(enemyHp/currentEnemy.hp)*100}%`, backgroundColor: '#e74c3c'}}></div>
                  </div>
                  <span>{enemyHp}/{currentEnemy.hp}</span>
                </div>
              </div>
            </div>

            <div style={styles.battleLog}>
              {battleLog.map((log, idx) => (
                <p key={idx} style={styles.logEntry}>{log}</p>
              ))}
            </div>

            <div style={styles.spellGrid}>
              {SPELLS.map(spell => (
                <button
                  key={spell.name}
                  onClick={() => castSpell(spell)}
                  disabled={playerMana < spell.mana}
                  style={{
                    ...styles.spellButton,
                    opacity: playerMana < spell.mana ? 0.5 : 1,
                    cursor: playerMana < spell.mana ? 'not-allowed' : 'pointer'
                  }}
                >
                  <div style={styles.spellName}>{spell.name}</div>
                  <div style={styles.spellStats}>
                    {spell.damage && `⚔️ ${spell.damage}`}
                    {spell.heal && `💚 ${spell.heal}`}
                    {' | '}
                    <span style={{color: '#3498db'}}>✨ {spell.mana}</span>
                  </div>
                </button>
              ))}
              <button onClick={restoreSpell} style={{...styles.spellButton, backgroundColor: '#34495e'}}>
                <div style={styles.spellName}>Restore Mana</div>
                <div style={styles.spellStats}>✨ +20 Mana</div>
              </button>
            </div>
          </div>
        )}

        {gameState === 'defeat' && (
          <div style={styles.endScreen}>
            <h1 style={{...styles.title, color: '#e74c3c'}}>💀 Defeated 💀</h1>
            <p style={styles.endText}>You fought bravely, {playerName} of {playerHouse}!</p>
            <p style={styles.endScore}>Final Score: {playerScore}</p>
            <p style={styles.endScore}>Rounds Survived: {round}</p>
            <button onClick={resetGame} style={styles.startButton}>Try Again</button>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Georgia, serif',
  },
  background: {
    width: '100%',
    minHeight: '100vh',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startScreen: {
    textAlign: 'center',
    maxWidth: '600px',
  },
  title: {
    fontSize: '3rem',
    color: '#f39c12',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    marginBottom: '2rem',
  },
  form: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: '2rem',
    borderRadius: '15px',
    border: '2px solid #f39c12',
  },
  input: {
    width: '100%',
    padding: '15px',
    fontSize: '1.1rem',
    borderRadius: '8px',
    border: '2px solid #f39c12',
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginBottom: '1.5rem',
    boxSizing: 'border-box',
  },
  label: {
    color: '#fff',
    fontSize: '1.2rem',
    marginBottom: '1rem',
  },
  houseSelection: {
    marginBottom: '1.5rem',
  },
  houseButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  houseButton: {
    padding: '15px',
    fontSize: '1.1rem',
    color: '#fff',
    fontWeight: 'bold',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  startButton: {
    padding: '15px 40px',
    fontSize: '1.3rem',
    backgroundColor: '#f39c12',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    transition: 'all 0.3s',
  },
  gameScreen: {
    width: '100%',
    maxWidth: '1200px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  playerInfo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: '1.5rem',
    borderRadius: '10px',
    border: '2px solid #f39c12',
    minWidth: '250px',
  },
  enemyInfo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: '1.5rem',
    borderRadius: '10px',
    border: '2px solid #e74c3c',
    minWidth: '250px',
  },
  playerName: {
    color: '#f39c12',
    margin: '0 0 0.5rem 0',
  },
  enemyName: {
    color: '#e74c3c',
    margin: '0 0 1rem 0',
  },
  houseBadge: {
    display: 'inline-block',
    padding: '5px 15px',
    borderRadius: '20px',
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  statBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '0.5rem',
    color: '#fff',
  },
  bar: {
    flex: 1,
    height: '20px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    transition: 'width 0.3s',
  },
  score: {
    color: '#f39c12',
    marginTop: '1rem',
    fontSize: '1.1rem',
  },
  battleLog: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: '1rem',
    borderRadius: '10px',
    border: '2px solid #95a5a6',
    minHeight: '120px',
    marginBottom: '2rem',
  },
  logEntry: {
    color: '#ecf0f1',
    margin: '0.5rem 0',
    fontSize: '1rem',
  },
  spellGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  spellButton: {
    padding: '1.5rem',
    backgroundColor: '#8e44ad',
    color: '#fff',
    border: '2px solid #9b59b6',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontSize: '1rem',
  },
  spellName: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    marginBottom: '0.5rem',
  },
  spellStats: {
    fontSize: '0.9rem',
    opacity: 0.9,
  },
  endScreen: {
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: '3rem',
    borderRadius: '15px',
    border: '3px solid #e74c3c',
  },
  endText: {
    color: '#fff',
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  endScore: {
    color: '#f39c12',
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: '1rem 0',
  },
};
