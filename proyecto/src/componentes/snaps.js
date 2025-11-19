import { getSnaps } from "../data/storage.js";

export function renderSnaps() {
    const snaps = getSnaps();

    let html = `<h2>📷 Tus Snaps</h2>`;

    if (snaps.length === 0) {
        html += `<p>No hay fotos aún.</p>`;
    } else {
        html += `<div class="snap-list">`;
        snaps.forEach(snap => {
            html += `
            <div class="snap-item" data-id="${snap.id}">
                <img src="${snap.img}" />
                <p>${snap.seen ? "👁️ Visto" : "✨ Nuevo"}</p>
                <button class="delete-snap">🗑️ Borrar</button>
            </div>`;
        });
        html += `</div>`;
    }

    return html;
}
