# 3D Dice Roller 🎲

A mobile-first 3D dice rolling web app with realistic physics simulation. Shake your device to roll dice in a virtual dice cup!

## Features

- **Realistic Physics**: WebAssembly-powered Rapier physics engine for authentic dice tumbling
- **Mobile-First**: Gyroscope and accelerometer controls for immersive experience
- **Shake to Roll**: Detect device shaking to trigger dice rolls with haptic feedback
- **Dynamic Camera**: Top-down view when phone is flat, angled view when tilted
- **Multiple Dice Types**: Support for d4, d6, d8, d10, d12, d20, and d100
- **Roll History**: Track individual dice values and total sums with localStorage persistence
- **Desktop Support**: Mouse drag to simulate shaking with visual feedback
- **Extensible Design**: Prepared architecture for future dice and environment skins

## Tech Stack

- **Frontend**: Nuxt 4.2.2 + Vue 3 (Composition API)
- **3D Rendering**: Three.js via @tresjs/core (Vue renderer for Three.js)
- **Physics**: @dimforge/rapier3d-compat (WebAssembly-based physics)
- **State Management**: Pinia
- **Device APIs**: @vueuse/core (DeviceMotion, DeviceOrientation, Vibration)
- **Styling**: TailwindCSS

## Setup

### Install Dependencies

```bash
npm install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

### Production Build

Build the application for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project Structure

```
app/
├── components/
│   ├── DiceRoller/       # 3D scene, dice cup, individual dice
│   ├── RollHistory/      # Roll history display
│   ├── DiceSelector/     # UI to add/remove dice
│   └── UI/               # Mobile warning, shake indicators
├── composables/
│   ├── physics/          # Rapier physics integration
│   ├── input/            # Device motion, shake detection, haptics
│   ├── dice/             # Dice geometry, rolling, value reading
│   └── camera/           # Orientation-based camera control
├── stores/               # Pinia stores (dice config, history, settings)
├── types/                # TypeScript type definitions
└── utils/                # Constants and helper functions
```

## Implementation Roadmap

See [claude.md](./claude.md) for the detailed implementation plan broken down into 10 phases.

### Phase Overview

1. **Setup & Foundation** - Dependencies, types, stores, basic UI
2. **3D Scene Basics** - TresJS setup, static dice rendering
3. **Physics Integration** - Rapier physics world, dice physics sync
4. **Dice Settling & Reading** - Detect when dice stop, read face values
5. **Mobile Input** - Shake detection, device motion, haptic feedback
6. **Camera Controller** - Orientation-based camera positioning
7. **Desktop Fallback** - Mouse drag simulation, OrbitControls
8. **Multi-Dice & UI Polish** - Support arbitrary dice counts, full UI
9. **Performance & Polish** - Mobile optimization, visual enhancements
10. **Skins Infrastructure** - Prepare for future customization

## Usage

### Mobile (Recommended)

1. Open the app on your mobile device
2. Grant motion permissions when prompted (iOS 13+)
3. Select dice types using the dice selector
4. Shake your device to roll the dice
5. Or tap the "Roll" button for manual rolling
6. View results in the roll history

### Desktop

1. Open the app in a modern browser
2. Use mouse drag to simulate shaking
3. Click the "Roll" button to trigger rolls
4. Note: This app is optimized for mobile - best experienced on a phone!

## Performance Targets

- **Desktop**: 60 FPS
- **High-end mobile**: 60 FPS (iPhone 13+, flagship Android)
- **Mid-range mobile**: 30-45 FPS (acceptable experience)
- **Max dice**: 8 dice for optimal performance
- **Load time**: <1 second for WASM initialization

## Browser Support

- **Mobile**: iOS 13+ (Safari), Android Chrome 90+
- **Desktop**: Chrome/Edge 90+, Firefox 88+, Safari 14+
- **Requirements**: WebGL 2.0, WebAssembly, DeviceMotion API (mobile)

## Development

### Key Composables

- `useRapierWorld()` - Initialize and manage physics world
- `useDicePhysics()` - Sync Three.js meshes with Rapier rigid bodies
- `useShakeDetection()` - Detect shake gestures from accelerometer
- `useDiceReader()` - Determine dice face values after settling
- `useCameraController()` - Control camera based on device orientation

### Key Components

- `DiceScene.vue` - Main TresJS 3D scene container
- `Dice.vue` - Individual die with physics integration
- `DiceCup.vue` - Box-shaped container with physics walls
- `RollControls.vue` - Manual roll button and shake feedback

## Future Enhancements

- [ ] Dice skins (wood, metal, stone, etc.)
- [ ] Environment skins (felt table, leather mat, etc.)
- [ ] Sound effects (dice rattling, rolling, settling)
- [ ] Dice presets for popular games (D&D, Yahtzee, etc.)
- [ ] Multiplayer/shared rolls
- [ ] Roll statistics and analytics
- [ ] PWA support for offline usage

## Contributing

Contributions welcome! Please see the implementation plan in [claude.md](./claude.md) for architecture details.

## License

ISC

## Credits

Built with Claude Code, powered by:
- [Nuxt](https://nuxt.com/)
- [Three.js](https://threejs.org/)
- [TresJS](https://tresjs.org/)
- [Rapier Physics](https://rapier.rs/)
