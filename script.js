// 1. Initialize the 3D Graph immediately
const elem = document.getElementById('3d-graph');
let allCharacters = []; 

const Graph = ForceGraph3D()(elem)
    .backgroundColor('#000000') 
    .showNavInfo(false)
    .nodeThreeObject(node => {
        const sprite = new SpriteText(node.character);
        sprite.color = '#c9a227'; 
        sprite.textHeight = 4;    
        sprite.fontFace = 'Cinzel';
        return sprite;
    })
    .onNodeClick(node => focusOnNode(node));

// 2. Add the Starfield (Background Effect)
try {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 0.7 });
    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
        starsVertices.push(
            THREE.MathUtils.randFloatSpread(4000), 
            THREE.MathUtils.randFloatSpread(4000), 
            THREE.MathUtils.randFloatSpread(4000)
        );
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    Graph.scene().add(starField);
    console.log("Starfield added to scene.");
} catch (e) {
    console.error("Starfield error:", e);
}

// 3. Load Data & Initialize Search
// 3. Load Data & Initialize Search
try {
    const data = gotData; // loaded from data.js to prevent CORS Local File errors
    console.log("Data loaded successfully:", data.length, "nodes.");
    allCharacters = data; 
    
    const gData = {
        nodes: data.map(n => ({
            id: n.character,
            character: n.character,
            fx: n.x * 30, // Using fixed coordinates from t-SNE
            fy: n.y * 30, 
            fz: n.z * 30
        })),
        links: [] 
    };
    
    Graph.graphData(gData);

    // Update Dashboard Stats
    document.getElementById('total-count').innerText = `Vectors: ${data.length} Characters`;
} catch (err) {
    console.error("Initialization error:", err);
}

// 4. Search & Autocomplete Logic
const searchInput = document.getElementById('search-input');
const suggBox = document.getElementById('suggestions');

searchInput.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    suggBox.innerHTML = '';
    
    if (val.length < 1) {
        suggBox.style.display = 'none';
        return;
    }

    const matches = allCharacters.filter(c => c.character.toLowerCase().includes(val)).slice(0, 6);
    
    if (matches.length > 0) {
        suggBox.style.display = 'block';
        matches.forEach(m => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerText = m.character;
            div.onclick = () => {
                searchInput.value = m.character;
                suggBox.style.display = 'none';
                const node = Graph.graphData().nodes.find(n => n.id === m.character);
                if (node) focusOnNode(node);
            };
            suggBox.appendChild(div);
        });
    } else {
        suggBox.style.display = 'none';
    }
});

// 5. Corrected Interaction Function with KNN Similarity
function focusOnNode(node) {
    // A. Camera Glide
    const distance = 120;
    const distRatio = 1 + distance / Math.hypot(node.fx, node.fy, node.fz);

    Graph.cameraPosition(
        { x: node.fx * distRatio, y: node.fy * distRatio, z: node.fz * distRatio }, 
        { x: node.fx, y: node.fy, z: node.fz }, 
        2500 
    );

    // B. Similarity Calculation (Euclidean Distance)
    const allNodes = Graph.graphData().nodes;
    const neighbors = allNodes
        .filter(n => n.id !== node.id)
        .map(n => {
            const dist = Math.sqrt(
                Math.pow(node.fx - n.fx, 2) + 
                Math.pow(node.fy - n.fy, 2) + 
                Math.pow(node.fz - n.fz, 2)
            );
            return { character: n.character, distance: dist };
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3); // Top 3 most similar

    // C. Update UI Side Panel
    const nameEl = document.getElementById('char-name');
    const descEl = document.getElementById('char-desc');
    
    nameEl.innerText = node.character;
    descEl.innerHTML = `
        <p style="color: #888; font-size: 0.8rem; margin-bottom: 5px;">DATA ANALYTICS ID: <b>${node.id.toUpperCase()}</b></p>
        <p>Linguistic analysis places this character in the current quadrant.</p>
        <div style="margin-top: 15px; border-top: 1px solid #c9a227; padding-top: 10px;">
            <span style="color: #c9a227; font-weight: bold;">Linguistic Neighbors:</span>
            <ul style="list-style: none; padding: 0; margin: 10px 0 0 0;">
                ${neighbors.map(n => `<li style="margin-bottom: 8px;">⚔️ ${n.character}</li>`).join('')}
            </ul>
        </div>
    `;

    // D. Visual Highlight (Coloring the Neighbors)
    const neighborIds = new Set(neighbors.map(n => n.character));
    Graph.nodeThreeObject(n => {
        const sprite = new SpriteText(n.character);
        if (n.id === node.id) {
            sprite.color = '#ffffff'; // White for selected
            sprite.textHeight = 6;
        } else if (neighborIds.has(n.id)) {
            sprite.color = '#00ff00'; // Green for neighbors
            sprite.textHeight = 5;
        } else {
            sprite.color = '#c9a227'; // Gold for others
            sprite.textHeight = 4;
        }
        return sprite;
    });
}