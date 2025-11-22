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

      <!-- Lista de chats -->
      <div id="friendsView">
        <div class="messages-header">
          <h2>💬 Chats</h2>
          <button id="btnNew">➕</button>
        </div>
        <div id="friendsList"></div>
      </div>

      <!-- Vista del chat -->
      <div id="chatView" class="chat-view" style="display:none; flex-direction:column; height:100%;">
        
        <div class="messages-header chat-header-fixed">
          <button id="backToList" class="back-btn">⬅</button>
          <img id="chatAvatar" src="" class="chat-avatar">
          <strong id="chatHeader"></strong>
        </div>

        <div class="chat-messages-wrapper">
          <div id="messagesContainer" class="messages-box"></div>
        </div>

        <div class="chat-input-container">
          <input id="chatInput" class="chat-input" placeholder="Escribe un mensaje...">
          <button id="sendMsg" class="chat-send-btn">Enviar</button>
        </div>
      </div>
    </div>
  `;

  const friendsList = document.getElementById("friendsList");
  const chatView = document.getElementById("chatView");
  const friendsView = document.getElementById("friendsView");
  const messagesContainer = document.getElementById("messagesContainer");
  const chatHeader = document.getElementById("chatHeader");
  const chatAvatar = document.getElementById("chatAvatar");
  const btnNew = document.getElementById("btnNew");
  const backToList = document.getElementById("backToList");
  const chatInput = document.getElementById("chatInput");
  const sendMsg = document.getElementById("sendMsg");

  function renderFriends() {
    const friends = getFriends();

    friendsList.innerHTML = friends.map(f => `
      <div class="friend-item" data-id="${f.id}">
        <img src="${f.avatar}">
        <div class="friend-info">
          <strong>${f.name}</strong>
          <small>Tap para chatear</small>
        </div>
        <button class="delete-btn" data-delete="${f.id}">🗑</button>
      </div>
    `).join("");
  }

  function openChat(friendId) {
    const friend = getFriends().find(f => f.id === friendId);

    // Actualizamos avatar y nombre
    chatAvatar.src = friend.avatar;
    chatHeader.textContent = friend.name;

    friendsView.style.display = "none";
    chatView.style.display = "flex";

    renderMessages(friendId);
  }

  function renderMessages(friendId) {
    const msgs = getChats()[friendId] || [];

    messagesContainer.innerHTML = msgs
      .map(msg => `
        <div class="msg ${msg.from === "me" ? "mine" : "other"}">
          <p>${msg.text}</p>
          <span class="time">${new Date(msg.ts).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
        </div>
      `)
      .join("");

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
    friendsView.style.display = "block";
  });

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
