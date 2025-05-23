/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("../config/superbaseClient.js", () => ({
  default: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    delete: vi.fn().mockResolvedValue({ data: [], error: null }),
    auth: {
      signUp: vi.fn().mockResolvedValue({ data: { user: { id: "abc" } }, error: null }),
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "abc" } }, error: null }),
    },
  },
}));

vi.mock("../config/supabase1.js", () => ({
  default: {
    auth: {
      admin: {
        deleteUser: vi.fn().mockResolvedValue({ error: null }),
      },
    },
  },
}));

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(() => Promise.resolve({ isConfirmed: true })),
  },
}));

describe("users_admin.js integrated tests", () => {
  beforeEach(() => {
    // Set up the DOM BEFORE import so the elements exist
    document.body.innerHTML = `
      <section id="users">
        <p class="no-tasks">No users yet.</p>
      </section>
      <section id="admins">
        <p class="no-tasks">No admins yet.</p>
        <form id="adminForm" style="display:none">
          <input id="adminFName" />
          <input id="adminLName" />
          <input id="adminEmail" />
          <input id="password" />
          <select id="adminRole"></select>
          <button id="addAdmin">Submit</button>
        </form>
      </section>
      <p class="greeting"></p>
    `;

    // Now import your module so it runs with the DOM ready
    // Use dynamic import inside beforeEach to import fresh each time
    return import("../Admin/users_admin.js").then((module) => {
      // Optional: expose module if needed
      // this.usersAdminModule = module;
    });
  });

  it("toggles admin form display", () => {
    const form = document.getElementById("adminForm");
    expect(form.style.display).toBe("none");

    // toggleForm is attached to window globally
    window.toggleForm();
    expect(form.style.display).toBe("block");

    window.toggleForm();
    expect(form.style.display).toBe("none");
  });

  it("submits admin form and calls supabase.auth.signUp", async () => {
    const supabase = (await import("../config/superbaseClient.js")).default;
    const form = document.getElementById("adminForm");
    const addAdminBtn = document.getElementById("addAdmin");

    form.style.display = "block";

    document.getElementById("adminFName").value = "Test";
    document.getElementById("adminLName").value = "User";
    document.getElementById("adminEmail").value = "test@example.com";
    document.getElementById("password").value = "password123";
    document.getElementById("adminRole").value = "admin";

    // Fire submit event on form
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    // Wait a tick for async actions

  });
});
