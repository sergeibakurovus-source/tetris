# System Design Document

## Implementation approach
Приложение следует паттерну **Game Loop** (для цикла обновления/рендеринга) и **MVC (Model-View-Controller)** для разделения логики и интерфейса.
Вся реализация выполнена на Vanilla JavaScript и CSS3, без сторонних библиотек. Для микро-анимаций используется CSS-транзиции, а для основного физического цикла — `requestAnimationFrame`.
Проект разделен на директории `src/` для исходного кода и `tests/` для модульного тестирования.

## Python package name
tetris_totoro_web

## File list
```text
projects/tetris/
├── docs/
│   ├── PRD.md
│   └── System_Design.md
├── src/
│   ├── index.html
│   ├── css/
│   │   ├── style.css
│   │   └── animations.css
│   └── js/
│       ├── main.js
│       ├── Game.js
│       ├── Board.js
│       ├── Tetromino.js
│       ├── InputManager.js
│       ├── UIManager.js
│       ├── ParticleManager.js
│       ├── Storage.js
│       └── constants.js
└── tests/
    ├── Board.test.js
    ├── Tetromino.test.js
    └── Game.test.js
```

## Data structures and interface definitions

```javascript
export class ParticleManager {
    constructor(container)
    createFirework(x, y, count = 25)
    triggerLineClearExplosion(rowY, width)
    update()
    clear()
}
```

```mermaid
classDiagram
    class Game {
        +start()
        +pause()
        +reset()
        +update(deltaTime)
        +handleInput(action)
        +gameOver()
        +hardDrop()
        +getGhostPosition()
    }
    class Board {
        +isValidMove(piece, nextX, nextY, nextMatrix)
        +lockPiece(piece)
        +clearLines()
    }
    class ParticleManager {
        +createFirework(x, y, count)
        +triggerLineClearExplosion(rowY, width)
        +update()
        +clear()
    }
    class UIManager {
        +render(boardState, activePiece)
        +updateScore(currentScore, highScore)
        +renderNextPiece(nextPiece)
        +triggerAnimation(type, params)
        +toggleOverlay(state)
        +renderLeaderboard(scores)
        +renderGhostPiece(ghostPiece)
    }
    class InputManager {
        +bindKeys(callbacks)
        +unbindKeys()
    }
    class Storage {
        +getHighScore()
        +saveHighScore(score)
        +getLeaderboard()
        +saveToLeaderboard(score)
    }
    Game --> Board
    Game --> UIManager
    Game --> InputManager
    Game --> Storage
    UIManager --> ParticleManager
```

## Program call flow
```mermaid
sequenceDiagram
    participant User
    participant InputManager
    participant Game
    participant Board
    participant UIManager
    participant ParticleManager
    participant Storage
    
    User->>InputManager: Нажатие клавиши (ArrowLeft)
    InputManager->>Game: handleInput('LEFT')
    Game->>Board: isValidMove()
    alt Движение валидно
        Board-->>Game: true
        Game->>Game: Обновить позицию X
        Game->>Game: getGhostPosition()
        Game->>UIManager: render()
        Game->>UIManager: renderGhostPiece()
    else Движение невалидно
        Board-->>Game: false
    end
    
    User->>InputManager: Нажатие клавиши (Space)
    InputManager->>Game: handleInput('HARD_DROP')
    Game->>Game: hardDrop()
    Game->>Board: lockPiece()
    Board->>Board: clearLines()
    Game->>UIManager: animateClearLines()
    UIManager->>ParticleManager: triggerLineClearExplosion()
    
    loop requestAnimationFrame
        Game->>Game: update(deltaTime)
        alt Время падения истекло
            Game->>Board: isValidMove(down)
            alt Коллизия (достигли дна)
                Game->>Board: lockPiece()
                Board->>Board: clearLines()
                Game->>UIManager: animateClearLines()
                UIManager->>ParticleManager: triggerLineClearExplosion()
            end
        end
        Game->>Game: getGhostPosition()
        Game->>UIManager: render()
        Game->>UIManager: renderGhostPiece()
        Game->>UIManager: particles.update()
    end
    
    opt Игра окончена
        Game->>Game: gameOver()
        Game->>Storage: saveToLeaderboard(score)
        Storage-->>Game: top5Scores
        Game->>UIManager: renderLeaderboard(top5Scores)
    end
```

## Anything UNCLEAR
Все требования согласованы с PRD.md. Модуль ParticleManager изолирован и интегрируется через UIManager.
