const STORAGE_KEY = "miniSupportDeskTickets";

const sampleTickets = [
  {
    id: crypto.randomUUID(),
    title: "Login issue",
    client: "ABC Corporation",
    priority: "High",
    status: "Open",
    createdDate: "2026-09-25"
  },
  {
    id: crypto.randomUUID(),
    title: "Invoice download not working",
    client: "Bright Solutions",
    priority: "Medium",
    status: "In Progress",
    createdDate: "2026-09-26"
  },
  {
    id: crypto.randomUUID(),
    title: "API response is slow",
    client: "Nova Technologies",
    priority: "High",
    status: "Open",
    createdDate: "2026-09-26"
  },
  {
    id: crypto.randomUUID(),
    title: "Change account email",
    client: "GreenLeaf Ltd",
    priority: "Low",
    status: "Resolved",
    createdDate: "2026-09-27"
  },
  {
    id: crypto.randomUUID(),
    title: "Dashboard data mismatch",
    client: "Orbit Systems",
    priority: "High",
    status: "In Progress",
    createdDate: "2026-09-27"
  },
  {
    id: crypto.randomUUID(),
    title: "Password reset request",
    client: "ABC Corporation",
    priority: "Medium",
    status: "Resolved",
    createdDate: "2026-09-28"
  },
  {
    id: crypto.randomUUID(),
    title: "Unable to upload document",
    client: "Sunrise Media",
    priority: "Medium",
    status: "Open",
    createdDate: "2026-09-28"
  },
  {
    id: crypto.randomUUID(),
    title: "User permission update",
    client: "BluePeak Inc.",
    priority: "Low",
    status: "Resolved",
    createdDate: "2026-09-29"
  },
  {
    id: crypto.randomUUID(),
    title: "Notification emails delayed",
    client: "Nova Technologies",
    priority: "High",
    status: "In Progress",
    createdDate: "2026-09-29"
  },
  {
    id: crypto.randomUUID(),
    title: "Mobile layout issue",
    client: "GreenLeaf Ltd",
    priority: "Low",
    status: "Open",
    createdDate: "2026-09-30"
  }
];

let tickets = loadTickets();
let ticketToDelete = null;

const ticketList = document.getElementById("ticketList");
const emptyState = document.getElementById("emptyState");
const resultCount = document.getElementById("resultCount");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const priorityFilter = document.getElementById("priorityFilter");

const formModal = document.getElementById("formModal");
const detailsModal = document.getElementById("detailsModal");
const deleteModal = document.getElementById("deleteModal");
const ticketForm = document.getElementById("ticketForm");

function loadTickets() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTickets));
  return [...sampleTickets];
}

function saveTickets() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function getFilteredTickets() {
  const search = searchInput.value.trim().toLowerCase();
  const selectedStatus = statusFilter.value;
  const selectedPriority = priorityFilter.value;

  return tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(search) ||
      ticket.client.toLowerCase().includes(search);

    const matchesStatus =
      selectedStatus === "all" || ticket.status === selectedStatus;

    const matchesPriority =
      selectedPriority === "all" || ticket.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });
}

function priorityClass(priority) {
  return `priority-${priority.toLowerCase()}`;
}

function statusClass(status) {
  if (status === "In Progress") return "status-progress";
  return `status-${status.toLowerCase()}`;
}

function renderTickets() {
  const filteredTickets = getFilteredTickets();

  ticketList.innerHTML = "";

  filteredTickets.forEach((ticket) => {
    const card = document.createElement("article");
    card.className = "ticket-card";

    card.innerHTML = `
      <div class="ticket-main">
        <h3 class="ticket-title">${escapeHTML(ticket.title)}</h3>
        <p class="ticket-client">${escapeHTML(ticket.client)}</p>

        <div class="ticket-meta">
          <span class="badge ${priorityClass(ticket.priority)}">
            ${escapeHTML(ticket.priority)}
          </span>

          <span class="badge ${statusClass(ticket.status)}">
            ${escapeHTML(ticket.status)}
          </span>

          <span class="date">
            Created: ${formatDate(ticket.createdDate)}
          </span>
        </div>
      </div>

      <div class="ticket-actions">
        <button class="icon-btn" onclick="viewTicket('${ticket.id}')">
          View
        </button>
        <button class="icon-btn" onclick="editTicket('${ticket.id}')">
          Edit
        </button>
        <button class="icon-btn" onclick="askDelete('${ticket.id}')">
          Delete
        </button>
      </div>
    `;

    ticketList.appendChild(card);
  });

  resultCount.textContent =
    `${filteredTickets.length} ${filteredTickets.length === 1 ? "ticket" : "tickets"}`;

  emptyState.classList.toggle("hidden", filteredTickets.length !== 0);
  updateStats();
}

function updateStats() {
  document.getElementById("totalCount").textContent = tickets.length;
  document.getElementById("openCount").textContent =
    tickets.filter((t) => t.status === "Open").length;
  document.getElementById("progressCount").textContent =
    tickets.filter((t) => t.status === "In Progress").length;
  document.getElementById("resolvedCount").textContent =
    tickets.filter((t) => t.status === "Resolved").length;
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function openModal(modal) {
  modal.classList.remove("hidden");
}

function closeModal(modal) {
  modal.classList.add("hidden");
}

function resetForm() {
  ticketForm.reset();
  document.getElementById("ticketId").value = "";
  document.getElementById("formTitle").textContent = "Create Ticket";
  document.getElementById("priority").value = "Medium";
  document.getElementById("status").value = "Open";
}

document.getElementById("addTicketBtn").addEventListener("click", () => {
  resetForm();
  openModal(formModal);
  document.getElementById("title").focus();
});

ticketForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const id = document.getElementById("ticketId").value;
  const title = document.getElementById("title").value.trim();
  const client = document.getElementById("client").value.trim();
  const priority = document.getElementById("priority").value;
  const status = document.getElementById("status").value;

  if (!title || !client) return;

  if (id) {
    const ticket = tickets.find((item) => item.id === id);

    if (ticket) {
      ticket.title = title;
      ticket.client = client;
      ticket.priority = priority;
      ticket.status = status;
    }
  } else {
    tickets.unshift({
      id: crypto.randomUUID(),
      title,
      client,
      priority,
      status,
      createdDate: new Date().toISOString().slice(0, 10)
    });
  }

  saveTickets();
  renderTickets();
  closeModal(formModal);
  resetForm();
});

function viewTicket(id) {
  const ticket = tickets.find((item) => item.id === id);
  if (!ticket) return;

  document.getElementById("ticketDetails").innerHTML = `
    <h2 id="detailsTitle">${escapeHTML(ticket.title)}</h2>
    <p class="ticket-client">${escapeHTML(ticket.client)}</p>

    <div class="details-grid">
      <div class="detail-item">
        <span>Client</span>
        <strong>${escapeHTML(ticket.client)}</strong>
      </div>

      <div class="detail-item">
        <span>Created Date</span>
        <strong>${formatDate(ticket.createdDate)}</strong>
      </div>

      <div class="detail-item">
        <span>Priority</span>
        <strong>${escapeHTML(ticket.priority)}</strong>
      </div>

      <div class="detail-item">
        <span>Status</span>
        <strong>${escapeHTML(ticket.status)}</strong>
      </div>
    </div>

    <div class="modal-actions">
      <button class="secondary-btn" onclick="editTicket('${ticket.id}')">
        Edit Ticket
      </button>
      <button class="danger-btn" onclick="askDelete('${ticket.id}')">
        Delete Ticket
      </button>
    </div>
  `;

  openModal(detailsModal);
}

function editTicket(id) {
  const ticket = tickets.find((item) => item.id === id);
  if (!ticket) return;

  closeModal(detailsModal);

  document.getElementById("formTitle").textContent = "Edit Ticket";
  document.getElementById("ticketId").value = ticket.id;
  document.getElementById("title").value = ticket.title;
  document.getElementById("client").value = ticket.client;
  document.getElementById("priority").value = ticket.priority;
  document.getElementById("status").value = ticket.status;

  openModal(formModal);
  document.getElementById("title").focus();
}

function askDelete(id) {
  ticketToDelete = id;
  closeModal(detailsModal);
  openModal(deleteModal);
}

document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
  if (!ticketToDelete) return;

  tickets = tickets.filter((ticket) => ticket.id !== ticketToDelete);
  ticketToDelete = null;

  saveTickets();
  renderTickets();
  closeModal(deleteModal);
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => {
    const modalId = button.getAttribute("data-close");
    closeModal(document.getElementById(modalId));
  });
});

[searchInput, statusFilter, priorityFilter].forEach((element) => {
  element.addEventListener("input", renderTickets);
  element.addEventListener("change", renderTickets);
});

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelectorAll(".modal").forEach(closeModal);
  }
});

renderTickets();
