# GoT Character Galaxy | 3D t-SNE

A web-based 3D visualization tool that explores the linguistic similarities between Game of Thrones characters. The application maps characters into a 3D space using t-SNE (t-Distributed Stochastic Neighbor Embedding) based on dialogue cluster analysis, creating an interactive "galaxy" of characters.

## 🚀 Features

- **3D Interactive Galaxy**: Explorable 3D force-directed graph rendering characters as textual nodes in a dynamic starfield.
- **Linguistic Clustering**: Characters are clustered mathematically based on their dialogue similarities. Proximity implies similar speech patterns and vocabulary.
- **K-Nearest Neighbors Analysis**: Clicking on any character automatically glides the camera to their node, highlights them, and uses Euclidean distance to locate and highlight their Top 3 "Linguistic Neighbors".
- **Dynamic Search Mechanism**: Search bar with real-time autocomplete suggestions to quickly find any character in the massive dataset.
- **System Dashboard & Info Panel**: Responsive UI elements that provide systemic feedback, node counts, and detailed neighbor lists upon selection.
- **Fully Responsive**: Adapts seamlessly to different screen sizes and supports window resizing dynamically.

## 🛠️ Technology Stack

- **HTML5 & CSS3**: For semantic layout, modern styling, and responsive UI structures via media queries.
- **Vanilla JavaScript**: Handles interactivity, Euclidean math calculations, and DOM manipulation without heavy frameworks.
- **Three.js**: WebGL framework for handling the intricate 3D environment and the ambient starfield background.
- **3D Force Graph**: Lightweight wrapper around Three.js and d3-force-3d for handling the force-directed layout and user camera interactions.
- **Three-Spritetext**: Renders crisp textual labels floating directly in 3D space.

## 📂 Project Structure

- `index.html` - The main structure of the web application.
- `style.css` - Custom styling, including futuristic fonts, glowing effects, dashboard layouts, and mobile-responsive queries.
- `script.js` - Core application logic connecting the UI to the 3D canvas, handling search, camera animations, node generation, and distance algorithms.
- `data.js` - Statically loaded JSON/JS data file of the characters, containing pre-calculated `x, y, z` coordinates from a t-SNE dimensionality reduction model.
- `got_nodes.json` - Original raw dataset mapping for character entities. 

## ⚙️ How to Run

Because the project loads a static JavaScript payload (`data.js`) rather than pulling from external JSON asynchronously via Fetch API, it bypasses standard CORS issues. You can simply:

1. Clone or download the repository.
2. Double-click `index.html` to open it directly in any modern web browser (Google Chrome, Firefox, Safari, Edge).

## 💡 How to Use

1. **Rotate/Pan**: Left-click and drag the background to rotate the 3D galaxy. Right-click and drag to pan.
2. **Zoom**: Scroll your mouse wheel to zoom in and out of the cluster.
3. **Select a Character**: Single-click any golden character name to lock onto them. The system will reveal their 3 most heavily correlated linguistic peers.
4. **Search**: Don't want to hunt manually? Type a character's name in the top-left search bar. Select a suggestion from the dropdown to instantly warp to their node.
