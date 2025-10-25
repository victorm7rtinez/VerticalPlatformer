# Vertical Platformer

Pixel art platformer prototype built with vanilla JavaScript and HTML5 canvas. The game focuses on climbing and descending a vertical level while colliding with platforms and world bounds.

## Features
- Parallax-style background with camera panning tied to player movement.
- Collision system for solid ground and one-way platforms.
- Animated warrior character with directional idle, run, jump, and fall sprites.
- Debug toggles for collision guides and camera boxes to help with level tuning.

## Controls
- `A` / `D` — Move left / right  
- `W` — Jump (while on the ground)

## Getting Started
1. Clone the repository:
   ```bash
   git clone https://github.com/victorm7rtinez/VerticalPlatformer.git
   cd VerticalPlatformer
   ```
2. Open `index.html` in a modern browser (Chrome, Firefox, Edge, Safari).
3. Use the controls above to explore the map.

## Debug Tips
- Collision guides are hidden by default. To re-enable them for level editing, set `showCollisionBlocks` to `true` in `index.js`.
- Camera limits are preconfigured so you never scroll beyond the painted background.

## License
This project is provided as-is for portfolio and learning purposes. Adapt and extend it for your own experiments.
