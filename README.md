# Animal Explorer 🦁🐘🐧

An interactive educational app for kids to learn about animals through fun facts, quizzes, and an immersive 3D zoo experience.

## 🌟 Project Overview

Animal Explorer is designed to spark children's curiosity about wildlife through engaging, interactive experiences. The app features colorful animal profiles, educational content, and a unique 3D zoo simulator where kids can virtually walk around and interact with animals.

## 🎮 Features

### Home Page
- Featured animal carousel with fun facts
- Colorful, kid-friendly interface
- Welcome animation with animal parade

### Learning Modes
- **Explore Mode**: Discover animals and their habitats
- **Quiz Challenge**: Test knowledge with fun animal quizzes
- **Collection**: Track animals you've learned about
- **3D Zoo**: Walk around and pet virtual animals in first-person view

### Animal Categories
- Mammals, Birds, Reptiles, Fish, Insects, Amphibians
- Each category features unique animals with educational content

### Daily Challenges
- Daily mystery animal to identify
- New challenges to keep learning fresh and exciting

## 🦒 3D Zoo Simulator

The flagship feature of Animal Explorer is the interactive 3D Zoo where kids can:

- **Explore in First Person**: Walk around a 3D environment using WASD or arrow keys
- **Interact with Animals**: Find and pet animals throughout the zoo
- **Learn While Playing**: Discover animal facts through interactive gameplay
- **Immersive Experience**: Complete with day/night cycle and realistic movement

### Zoo Controls
- **Movement**: WASD or Arrow Keys
- **Look Around**: Mouse movement
- **Jump**: Spacebar
- **Pet Animals**: Left-click when near an animal

## 🛠️ Technologies Used

- **Frontend**: Next.js, React
- **3D Rendering**: Three.js with React Three Fiber
- **Physics**: Cannon.js with React Three Cannon
- **Styling**: CSS Modules
- **Graphics**: SVG animal illustrations

## 📋 Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/animalapp.git
cd animalapp
```

2. Install dependencies:
```
npm install
```

3. Run the development server:
```
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🚀 How to Use

1. On the homepage, explore featured animals and read fun facts
2. Navigate to one of the four learning modes (Explore, Quiz, Collection, or 3D Zoo)
3. For the 3D Zoo:
   - Click "Start Exploring" to begin
   - Use WASD/arrow keys to move around
   - Look around with your mouse
   - Click on animals to pet them
   - Follow on-screen prompts to discover all animals

## 🧩 Project Structure

```
/animalapp
  ├── public/            # Static assets
  │   ├── animals/       # Animal SVG illustrations
  │   │   └── *.svg      # Individual animal SVGs
  │   └── zoo/           # 3D zoo assets
  ├── src/
  │   ├── app/           # Next.js app directory
  │   │   ├── zoo/       # 3D Zoo simulator
  │   │   │   ├── page.js       # Main zoo component
  │   │   │   └── zoo.module.css # Zoo styles
  │   │   ├── page.js    # Home page
  │   │   └── page.module.css # Home page styles
  │   └── components/    # Reusable components
  ├── package.json       # Dependencies
  └── README.md          # This file
```

## 🔮 Future Improvements

- More detailed animal models in the 3D zoo
- Animal animations and behaviors
- Sound effects and animal sounds
- Achievements and badges for discoveries
- Guided educational tours in the zoo
- More interactive elements and mini-games

## 📝 About

Animal Explorer was created to make learning about wildlife fun and engaging for young explorers. The combination of educational content with interactive experiences helps children develop a love for animals and nature.

## 📜 License

MIT License
