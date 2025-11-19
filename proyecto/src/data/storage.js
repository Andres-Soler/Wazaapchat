// Obtener todos los snaps
export function getSnaps() {
    return JSON.parse(localStorage.getItem("snaps") || "[]");
}

// Guardar snaps en localStorage
export function saveSnaps(snaps) {
    localStorage.setItem("snaps", JSON.stringify(snaps));
}

// Guardar un nuevo snap
export function saveSnap(image) {
    const snaps = getSnaps();
    snaps.push({
        id: Date.now().toString(), // ID como string
        img: image,
        seen: false
    });
    saveSnaps(snaps);
}

// Borrar un snap por ID
export function deleteSnap(id) {
    const snaps = getSnaps();
    const index = snaps.findIndex(s => s.id === id);
    if (index !== -1) {
        snaps.splice(index, 1);
        saveSnaps(snaps);
    }
}

// Marcar snap como visto
export function markSeen(id) {
    const snaps = getSnaps();
    const snap = snaps.find(s => s.id === id);
    if (snap) {
        snap.seen = true;
        saveSnaps(snaps);
    }
}
