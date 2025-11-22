import { navigate } from "../main.js";

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function ensureData() {
  if (!localStorage.getItem("friends")) {
    const sample = [
      { id: "f1", name: "Andrés", avatar: "https://i.pravatar.cc/64?img=1" },
      { id: "f2", name: "María", avatar: "https://i.pravatar.cc/64?img=2" },
      { id: "f3", name: "Sofi", avatar: "https://i.pravatar.cc/64?img=3" }
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

function saveFriends(list) {
  localStorage.setItem("friends", JSON.stringify(list));
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

      <div class="messages-header">
        <h2>💬 Chats</h2>
        <div id="topBtns">
          <button id="btnHome">🏠</button>
          <button id="btnNew">➕</button>
        </div>
      </div>

      <div id="friendsList"></div>

      <div id="chatView" style="display:none; margin-top:12px;">
        <div class="messages-header">
          <div id="chatHeader"></div>
          <button id="backToList">⬅</button>
        </div>

        <div class="messages-box" id="messagesContainer"></div>

        <div class="chat-input-container">
          <input id="chatInput" class="chat-input" placeholder="Escribe un mensaje...">
          <button id="sendMsg" class="chat-send-btn">Enviar</button>
        </div>
      </div>
    </div>
  `;

  const friendsList = document.getElementById("friendsList");
  const chatView = document.getElementById("chatView");
  const messagesContainer = document.getElementById("messagesContainer");
  const chatHeader = document.getElementById("chatHeader");
  const btnNew = document.getElementById("btnNew");
  const btnHome = document.getElementById("btnHome");
  const backToList = document.getElementById("backToList");
  const chatInput = document.getElementById("chatInput");
  const sendMsg = document.getElementById("sendMsg");

  function renderFriends() {
    const friends = getFriends();

    friendsList.innerHTML = friends.map(f => `
      <div class="friend-item" data-id="${f.id}" style="display:flex; align-items:center; background:white; padding:10px; margin-bottom:8px; border-radius:12px; gap:10px;">
        <img src="${f.avatar}" style="width:48px; height:48px; border-radius:50%;">
        <div style="flex:1;">
          <strong>${f.name}</strong><br>
          <small style="opacity:.6;">Tap para chatear</small>
        </div>
        <button class="delete-btn" data-delete="${f.id}">🗑</button>
      </div>
    `).join("");
  }

  function openChat(friendId) {
    const friend = getFriends().find(f => f.id === friendId);
    chatHeader.innerHTML = `
      <img src="${friend.avatar}" style="width:36px;height:36px;border-radius:50%;">
      <strong>${friend.name}</strong>
    `;

    friendsList.style.display = "none";
    chatView.style.display = "block";
    btnNew.style.display = "none";

    renderMessages(friendId);
  }

  function renderMessages(friendId) {
    const msgs = getChats()[friendId] || [];

    messagesContainer.innerHTML = msgs.map(msg => `
      <div class="msg ${msg.from === "me" ? "mine" : ""}">
        <p>${msg.text}</p>
        <span>${new Date(msg.ts).toLocaleTimeString()}</span>
      </div>
    `).join("");

    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    sendMsg.onclick = () => {
      const text = chatInput.value.trim();
      if (!text) return;

      const chats = getChats();
      if (!chats[friendId]) chats[friendId] = [];

      chats[friendId].push({ id: uid(), text, from: "me", ts: Date.now() });
      saveChats(chats);

      chatInput.value = "";
      renderMessages(friendId);
    };
  }

  friendsList.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".delete-btn");
    if (deleteBtn) {
      const id = deleteBtn.dataset.delete;
      saveFriends(getFriends().filter(f => f.id !== id));
      renderFriends();
      return;
    }

    const item = e.target.closest(".friend-item");
    if (item) openChat(item.dataset.id);
  });

  backToList.addEventListener("click", () => {
    chatView.style.display = "none";
    friendsList.style.display = "block";
    btnNew.style.display = "inline-block";
  });

  btnHome.onclick = () => navigate("home");

  btnNew.onclick = () => {
    const friends = getFriends();
    friends.push({
      id: uid(),
      name: `User ${friends.length + 1}`,
      avatar: `https://i.pravatar.cc/64?u=${Math.random()}`
    });
    saveFriends(friends);
    renderFriends();
  };

  renderFriends();
}
