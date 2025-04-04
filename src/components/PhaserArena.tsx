import { useEffect, useRef, useState } from 'react'
import Phaser from 'phaser'

export default function PhaserArena() {
  const gameRef = useRef<Phaser.Game | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [battleLog, setBattleLog] = useState<string[]>([])
  const [result, setResult] = useState<string | null>(null)

  useEffect(() => {
    let playerHP = 100
    let enemyHP = 100
    let log: string[] = []
    let gameOver = false

    class BattleScene extends Phaser.Scene {
      player!: Phaser.GameObjects.Sprite
      enemy!: Phaser.GameObjects.Sprite
      playerHealthText!: Phaser.GameObjects.Text
      enemyHealthText!: Phaser.GameObjects.Text
      background!: Phaser.GameObjects.Image

      preload() {
        this.load.image('player', '/images/player1.jpeg')
        this.load.image('enemy', '/images/player2.png')
        this.load.image('background', '/images/fon.jpeg') // Загрузка фона
      }

      create() {
        // Добавляем фон, растягиваем его на всю игровую область
        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0)
        this.background.setDisplaySize(600, 320) // Устанавливаем размер фона

        this.add.text(180, 10, '⚔️ Battle Arena', { fontSize: '20px', color: 'black' })

        this.player = this.add.sprite(150, 200, 'player').setDisplaySize(200, 200)
        this.enemy = this.add.sprite(450, 200, 'enemy').setDisplaySize(200, 200)

        this.playerHealthText = this.add.text(120, 280, `You HP: ${playerHP}`, { fontSize: '16px', color: '#0f0' })
        this.enemyHealthText = this.add.text(400, 280, `Enemy HP: ${enemyHP}`, { fontSize: '16px', color: '#f00' })

        // Клик мышки — запускаем шаг
        this.input.on('pointerdown', () => {
          if (!gameOver) {
            this.attackTurn()
          }
        })
      }

      attackTurn() {
        if (playerHP <= 0 || enemyHP <= 0) return

        const attacker = Phaser.Math.Between(0, 1) === 0 ? 'You' : 'Enemy'
        const damage = Phaser.Math.Between(5, 20)

        if (attacker === 'You') {
          enemyHP = Math.max(0, enemyHP - damage)
          log.push(`🧬 You hit for ${damage} damage!`)
        } else {
          playerHP = Math.max(0, playerHP - damage)
          log.push(`🤖 Enemy hits you for ${damage} damage!`)
        }

        this.playerHealthText.setText(`You HP: ${playerHP}`)
        this.enemyHealthText.setText(`Enemy HP: ${enemyHP}`)

        if (playerHP <= 0 || enemyHP <= 0) {
          const winner = playerHP > enemyHP ? '🎉 Victory!' : '💀 Defeat!'
          log.push(winner)
          gameOver = true
          setResult(winner)
        }

        setBattleLog([...log])
      }
    }

    if (!gameRef.current) {
      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 600,
        height: 320,
        backgroundColor: '#1e1e2f',
        parent: containerRef.current!,
        scene: [BattleScene],
      })
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [])

  return (
    <div>
      <div ref={containerRef} className="rounded-xl overflow-hidden shadow-lg mb-4 cursor-pointer" />
      <div className="bg-gray-800 text-white p-4 rounded-xl h-48 overflow-auto text-sm">
        {battleLog.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      {result && (
        <div className="text-center text-xl font-bold mt-4">{result}</div>
      )}
    </div>
  )
}
