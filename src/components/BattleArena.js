// src/components/BattleArena.js
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Моковые данные для боев
const mockFightLog = [
  { actor: 'You', action: 'Claw Slash', damage: 12 },
  { actor: 'Enemy', action: 'Laser Beam', damage: 15 },
  { actor: 'You', action: 'Toxic Spit', damage: 18 },
  { actor: 'Enemy', action: 'Shield Bash', damage: 7 },
]

export default function BattleArena() {
  const [log, setLog] = useState([])
  const [step, setStep] = useState(0)
  const [playerHP, setPlayerHP] = useState(100)
  const [enemyHP, setEnemyHP] = useState(100)

  useEffect(() => {
    if (step < mockFightLog.length) {
      const timer = setTimeout(() => {
        const entry = mockFightLog[step]
        setLog((prev) => [...prev, entry])
        if (entry.actor === 'You') {
          setEnemyHP((hp) => Math.max(0, hp - entry.damage))
        } else {
          setPlayerHP((hp) => Math.max(0, hp - entry.damage))
        }
        setStep(step + 1)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [step])

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center">⚔️ Battle Arena</h1>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="border p-4">
          <h2 className="font-semibold">🧬 You</h2>
          <p>HP: {playerHP}</p>
        </div>
        <div className="border p-4">
          <h2 className="font-semibold">🤖 Enemy</h2>
          <p>HP: {enemyHP}</p>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-4 text-white h-48 overflow-auto space-y-2">
        {log.map((entry, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-green-400">{entry.actor}</span> used <span className="text-yellow-300">{entry.action}</span> and dealt <span className="text-red-400">{entry.damage} dmg</span>
          </motion.div>
        ))}
      </div>

      {step >= mockFightLog.length && (
        <div className="text-center font-bold text-xl">
          {playerHP > enemyHP ? '🎉 Victory!' : '💀 Defeat!'}
        </div>
      )}

      <div className="text-center">
        <button
          onClick={() => {
            setLog([])
            setStep(0)
            setPlayerHP(100)
            setEnemyHP(100)
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Restart
        </button>
      </div>
    </div>
  )
}
