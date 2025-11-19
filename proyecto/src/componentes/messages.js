import { navigate } from "../main.js";

/**
 * Estructura en localStorage:
 * - "friends" : [{ id, name, avatar }]
 * - "chats"   : { "<friendId>": [{ id, text, from, ts }, ...], ... }
 *
 * El archivo crea datos de ejemplo si no existen.
 */

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,7);
}

function ensureData() {
  if (!localStorage.getItem("friends")) {
    const sample = [
      { id: "f1", name: "Andrés", avatar: "https://i.pravatar.cc/64?img=1" },
      { id: "f2", name: "María",  avatar: "https://i.pravatar.cc/64?img=2" },
      { id: "f3", name: "Sofi",   avatar: "https://i.pravatar.cc/64?img=3" }
    ];
    localStorage.setItem("friends", JSON.stringify(sample));
  }
  if (!localStorage.getItem("chats")) {
    localStorage.setItem("chats", JSON.stringify({}));
  }
}

function getFriends() {
  return JSON.parse(localStorage.getItem("friends") || "[]");
}

function getChats() {
  return JSON.parse(localStorage.getItem("chats") || "{}");
}

function saveChats(chats) {
  localStorage.setItem("chats", JSON.stringify(chats));
}

export function showMessages() {
  ensureData();

  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="messages-screen">
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <h2>💬 Chats</h2>
        <div>
          <button id="btnHome" style="margin-right:8px;">🏠</button>
          <button id="btnNew" title="Nuevo chat">➕</button>
        </div>
      </div>

      <div id="friendsList" style="margin-top:12px;"></div>

      <div id="chatView" style="display:none; margin-top:12px;">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <div id="chatHeader"></div>
          <button id="backToList">⬅</button>
        </div>
        <div id="messagesContainer" style="height:300px; overflow:auto; margin-top:10px; background:#111; padding:8px; border-radius:10px;"></div>

        <div style="display:flex; gap:8px; margin-top:10px;">
          <input id="chatInput" placeholder="Escribe..." style="flex:1; padding:8px; border-radius:8px; border:none;">
          <button id="sendMsg">Enviar</button>
        </div>
      </div>
    </div>
  `;

  const friendsList = document.getElementById("friendsList");
  const chatView = document.getElementById("chatView");
  const chatHeader = document.getElementById("chatHeader");
  const messagesContainer = document.getElementById("messagesContainer");
  const backToList = document.getElementById("backToList");
  const chatInput = document.getElementById("chatInput");
  const sendMsg = document.getElementById("sendMsg");
  const btnHome = document.getElementById("btnHome");
  const btnNew = document.getElementById("btnNew");

  // render lista de amigos
  function renderFriends() {
    const friends = getFriends();
    if (friends.length === 0) {
      friendsList.innerHTML = `<p>No tienes amigos aún.</p>`;
      return;
    }

    friendsList.innerHTML = friends.map(f => `
      <div class="friend-item" data-id="${f.id}" style="display:flex; gap:12px; align-items:center; padding:8px; border-radius:10px; cursor:pointer; background:#fff; margin-bottom:8px;">
        <img src="${f.avatar}" style="width:48px; height:48px; border-radius:50%;">
        <div style="flex:1; text-align:left;">
          <strong style="display:block">${f.name}</strong>
          <small style="opacity:0.7">Tap to open chat</small>
        </div>
      </div>
    `).join("");
  }

  // abrir conversación con friendId
  function openChat(friendId) {
    const friends = getFriends();
    const friend = friends.find(f => f.id === friendId);
    if (!friend) return;

    // header
    chatHeader.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px;">
        <img src="${friend.avatar}" style="width:36px;height:36px;border-radius:50%;">
        <div>
          <div style="font-weight:700">${friend.name}</div>
          <small style="opacity:0.7">Última vez: ahora</small>
        </div>
      </div>
    `;

    // mostrar chat view
    friendsList.style.display = "none";
    chatView.style.display = "block";

    // render mensajes
    renderMessages(friendId);
  }

  // render mensajes
  function renderMessages(friendId) {
    const chats = getChats();
    const msgs = chats[friendId] || [];
    messagesContainer.innerHTML = msgs.map(m => `
      <div style="display:flex; ${m.from === "me" ? "justify-content:flex-end" : "justify-content:flex-start"}; margin-bottom:8px;">
        <div style="max-width:70%; background:${m.from === "me" ? "#FFD84A" : "#2b2b2b"}; color:${m.from === "me" ? "#000" : "#fff"}; padding:8px 10px; border-radius:12px;">
          <div style="font-size:14px;">${m.text}</div>
          <div style="font-size:10px; opacity:0.7; margin-top:4px;">${new Date(m.ts).toLocaleTimeString()}</div>
        </div>
      </div>
    `).join("");
    // auto scroll abajo
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // activar envío
    sendMsg.onclick = () => {
      const text = chatInput.value.trim();
      if (!text) return;
      const chatsObj = getChats();
      if (!chatsObj[friendId]) chatsObj[friendId] = [];
      const message = { id: uid(), text, from: "me", ts: Date.now() };
      chatsObj[friendId].push(message);
      saveChats(chatsObj);
      chatInput.value = "";
      renderMessages(friendId);
    };
  }

  // eventos delegados: abrir amigo
  friendsList.addEventListener("click", (e) => {
    const item = e.target.closest(".friend-item");
    if (!item) return;
    const friendId = item.dataset.id;
    openChat(friendId);
  });

  // volver a lista
  backToList.addEventListener("click", () => {
    chatView.style.display = "none";
    friendsList.style.display = "block";
  });

  // boton home
  btnHome.addEventListener("click", () => navigate("home"));

  // boton nuevo amigo (crea uno random)
  btnNew.addEventListener("click", () => {
    const friends = getFriends();
    const newFriend = {
      id: uid(),
      name: "User " + (friends.length + 1),
      avatar: `https://i.pravatar.cc/64?u=${Math.random()}`
    };
    friends.push(newFriend);
    localStorage.setItem("friends", JSON.stringify(friends));
    renderFriends();
  });

  // render inicial
  renderFriends();
}
