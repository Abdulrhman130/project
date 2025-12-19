/**
 * ========================================
 * EduTrack Pro - Student Management System
 * Final Fixed Core JavaScript with localStorage
 * ========================================
 */

/* 1. GLOBAL STATE */
let students = [];
let attendanceRecords = [];
let isEditing = false;
let currentEditID = null;

/* 2. UTILITY FUNCTIONS */
const generateUniqueID = () => "_" + Math.random().toString(36).substring(2, 11);
const confirmCustom = (message) => confirm(message);

function validatePassword(password) {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Needs an uppercase letter.";
  if (!/[a-z]/.test(password)) return "Needs a lowercase letter.";
  if (!/[0-9]/.test(password)) return "Needs a number.";
  if (!/[!@#$%^&*]/.test(password)) return "Needs a special char.";
  return null;
}

/* 2.1 LocalStorage Helpers */
function saveToLocalStorage() {
  localStorage.setItem("students", JSON.stringify(students));
  localStorage.setItem("attendanceRecords", JSON.stringify(attendanceRecords));
}

/* 3. UI & DOM MANIPULATION */
function showToast(message, type = "info") {
  const toastContainer = document.getElementById("toast-container");
  const toastHTML = `
        <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body fw-bold">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>`;

  toastContainer.insertAdjacentHTML("beforeend", toastHTML);
  const newToastEl = toastContainer.lastElementChild;
  const toast = new bootstrap.Toast(newToastEl);
  toast.show();
  newToastEl.addEventListener("hidden.bs.toast", () => newToastEl.remove());
}

function updateStats() {
  document.getElementById("stat-total-students").textContent = students.length;
  document.getElementById("stat-fees-pending").textContent = students.filter(
    (s) => !s.feesPaid
  ).length;

  const today = new Date().toISOString().split("T")[0];
  const todayAtt = attendanceRecords.filter(
    (a) => a.date === today && a.status === "Present"
  ).length;
  document.getElementById("stat-attendance-today").textContent = todayAtt;
}

function renderStudents(list = students) {
  const container = document.getElementById("student-container");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `<div class="col-12 text-center py-5"><h5 class="text-muted">No Students Found</h5></div>`;
    return;
  }

  list.forEach((student) => {
    const feeBadge = student.feesPaid
      ? '<span class="badge bg-success-subtle text-success">Paid</span>'
      : '<span class="badge bg-danger-subtle text-danger">Pending</span>';

    container.insertAdjacentHTML(
      "beforeend",
      `
            <div class="col-xl-4 col-md-6">
                <div class="student-card p-4 d-flex align-items-start">
                    <div class="me-3 fs-2 text-primary"><i class="fa-solid fa-user-circle"></i></div>
                    <div class="flex-grow-1">
                        <h6 class="fw-bold mb-1">${student.name}</h6>
                        <small class="text-muted d-block mb-2">ID: ${student.id} | Year ${student.year}</small>
                        <div class="d-flex gap-2 flex-wrap mb-3">
                            <span class="badge bg-primary">${student.department}</span>
                            <span class="badge bg-info text-dark">Grade: ${student.grade}</span>
                            ${feeBadge}
                        </div>
                        <div>
                            <button class="btn btn-sm btn-outline-warning me-1 rounded-pill" onclick="editStudent('${student.uniqueID}')">Edit</button>
                            <button class="btn btn-sm btn-outline-danger rounded-pill" onclick="deleteStudent('${student.uniqueID}')">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    );
  });
}

function renderAttendanceDropdown() {
  const select = document.getElementById("attendance-student");
  if (!select) return;

  select.innerHTML =
    '<option value="" selected disabled>Choose student...</option>';
  students.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s.uniqueID;
    opt.textContent = `${s.name} (${s.id})`;
    select.appendChild(opt);
  });
}

function renderAttendanceTable() {
  const tbody = document.getElementById("attendance-table");
  tbody.innerHTML = "";

  if (attendanceRecords.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">No records found.</td></tr>`;
    return;
  }

  [...attendanceRecords]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach((record) => {
      const student = students.find((s) => s.uniqueID === record.studentID);
      const name = student ? student.name : "Unknown";
      const color =
        record.status === "Present"
          ? "success"
          : record.status === "Late"
            ? "warning"
            : "danger";

      tbody.insertAdjacentHTML(
        "beforeend",
        `
            <tr>
                <td>${name}</td>
                <td>${record.date}</td>
                <td><span class="badge bg-${color}-subtle text-${color}">${record.status}</span></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-warning rounded-circle me-1" onclick="editAttendance('${record.uniqueID}')"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-sm btn-outline-danger rounded-circle" onclick="deleteAttendance('${record.uniqueID}')"><i class="fa-solid fa-times"></i></button>
                </td>
            </tr>
        `
      );
    });
}

function setupPasswordValidation() {
  const pwInput = document.getElementById("studentPassword");
  const feedback = document.getElementById("passwordValidationFeedback");
  if (!pwInput) return;

  if (!pwInput.parentElement.querySelector(".btn-outline-secondary")) {
    const toggleBtn = document.createElement("button");
    toggleBtn.className =
      "btn btn-sm btn-outline-secondary position-absolute end-0 top-50 translate-middle-y me-2";
    toggleBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
    toggleBtn.type = "button";
    pwInput.parentElement.style.position = "relative";
    pwInput.parentElement.appendChild(toggleBtn);

    toggleBtn.onclick = () => {
      const isPass = pwInput.type === "password";
      pwInput.type = isPass ? "text" : "password";
      toggleBtn.innerHTML = isPass
        ? '<i class="fa-solid fa-eye-slash"></i>'
        : '<i class="fa-solid fa-eye"></i>';
    };
  }

  pwInput.addEventListener("input", function () {
    if (this.value) {
      const err = validatePassword(this.value);
      this.classList.toggle("is-invalid", !!err);
      this.classList.toggle("is-valid", !err);
      feedback.textContent = err || "";
    } else {
      this.classList.remove("is-valid", "is-invalid");
      feedback.textContent = "";
    }
  });
}

function renderReports() {
  document.getElementById("report-total-students").textContent = students.length;
  document.getElementById("report-fees-paid").textContent = students.filter(s => s.feesPaid).length;
  document.getElementById("report-fees-pending").textContent = students.filter(s => !s.feesPaid).length;
  document.getElementById("report-attendance-records").textContent = attendanceRecords.length;

  // Attendance Summary
  document.getElementById("report-present").textContent = attendanceRecords.filter(a => a.status === "Present").length;
  document.getElementById("report-late").textContent = attendanceRecords.filter(a => a.status === "Late").length;
  document.getElementById("report-absent").textContent = attendanceRecords.filter(a => a.status === "Absent").length;

  // Department Distribution
  document.getElementById("report-cs").textContent = students.filter(s => s.department === "CS").length;
  document.getElementById("report-it").textContent = students.filter(s => s.department === "IT").length;
  document.getElementById("report-is").textContent = students.filter(s => s.department === "IS").length;
  document.getElementById("report-ai").textContent = students.filter(s => s.department === "AI").length;
}

function renderAll() {
  updateStats();
  renderStudents();
  renderAttendanceTable();
  renderAttendanceDropdown();
  renderReports();
}

function navigateTo(viewName) {
  document
    .querySelectorAll(".content-section")
    .forEach((v) => v.classList.remove("active"));
  document.getElementById(`view-${viewName}`).classList.add("active");
  document
    .querySelectorAll(".nav-link")
    .forEach((l) => l.classList.remove("active"));
  document
    .querySelector(`.nav-link[data-view="${viewName}"]`)
    ?.classList.add("active");
}

/* 4. STUDENT LOGIC */
function handleStudentFormSubmit(e) {
  if (e) e.preventDefault(); // Handle event

  const form = document.getElementById("student-form");
  const idInput = document.getElementById("studentID");
  const pwInput = document.getElementById("studentPassword");

  form.classList.remove("was-validated");
  idInput.classList.remove("is-invalid");
  if (pwInput) pwInput.classList.remove("is-invalid");

  const rawData = {
    id: idInput.value.trim(),
    name: document.getElementById("studentName").value.trim(),
    password: pwInput ? pwInput.value : "",
    age: document.getElementById("studentAge").value,
    department: document.getElementById("studentDepartment").value,
    grade: document.getElementById("studentGrade").value,
    year: document.getElementById("studentYear").value,
    feesPaid: document.getElementById("studentFee").checked,
  };

  let isValid = true;
  if (!rawData.id) {
    idInput.classList.add("is-invalid");
    isValid = false;
  }
  if (!isEditing && students.some((s) => s.id === rawData.id)) {
    idInput.classList.add("is-invalid");
    idInput.nextElementSibling.textContent = "ID exists.";
    isValid = false;
  }

  if (pwInput) {
    if (!isEditing && !rawData.password) {
      pwInput.classList.add("is-invalid");
      isValid = false;
    } else if (rawData.password && validatePassword(rawData.password)) {
      pwInput.classList.add("is-invalid");
      isValid = false;
    }
  }

  if (!isValid || !form.checkValidity()) {
    form.classList.add("was-validated");
    showToast("Please fix errors.", "danger");
    return;
  }

  if (isEditing) {
    const idx = students.findIndex((s) => s.uniqueID === currentEditID);
    if (idx > -1) {
      students[idx] = {
        ...students[idx],
        ...rawData,
        password: rawData.password || students[idx].password,
      };
      showToast("Updated successfully.", "success");
      saveToLocalStorage();

      isEditing = false;
      currentEditID = null;
      document.getElementById("addBtn").classList.remove("d-none");
      document.getElementById("updateBtn").classList.add("d-none");
      idInput.disabled = false;
    }
  } else {
    students.push({ ...rawData, uniqueID: generateUniqueID() });
    showToast("Added successfully.", "success");
    saveToLocalStorage();
  }

  form.reset();
  if (pwInput) pwInput.classList.remove("is-valid");
  renderAll();
}

function editStudent(uid) {
  const s = students.find((x) => x.uniqueID === uid);
  if (!s) return;

  isEditing = true;
  currentEditID = uid;
  document.querySelector(".glass-panel").scrollIntoView({ behavior: "smooth" });

  document.getElementById("studentID").value = s.id;
  document.getElementById("studentID").disabled = true;
  document.getElementById("studentName").value = s.name;
  document.getElementById("studentAge").value = s.age;
  document.getElementById("studentDepartment").value = s.department;
  document.getElementById("studentGrade").value = s.grade;
  document.getElementById("studentYear").value = s.year;
  document.getElementById("studentFee").checked = s.feesPaid;

  const pwInput = document.getElementById("studentPassword");
  if (pwInput) {
    pwInput.value = "";
    pwInput.placeholder = "Leave blank to keep current";
    pwInput.classList.remove("is-valid", "is-invalid");
  }

  document.getElementById("addBtn").classList.add("d-none");
  const updateBtn = document.getElementById("updateBtn");
  updateBtn.classList.remove("d-none");

  updateBtn.onclick = handleStudentFormSubmit;
}

function deleteStudent(uid) {
  if (!confirmCustom("Delete this student?")) return;
  students = students.filter((s) => s.uniqueID !== uid);
  attendanceRecords = attendanceRecords.filter((a) => a.studentID !== uid);
  saveToLocalStorage();
  renderAll();
  showToast("Student deleted.", "warning");
}

function searchStudent(q) {
  if (!q.trim()) return renderStudents();
  const term = q.toLowerCase();
  renderStudents(
    students.filter(
      (s) => s.name.toLowerCase().includes(term) || s.id.includes(term)
    )
  );
}

/* 5. ATTENDANCE LOGIC */
function markAttendance() {
  const sID = document.getElementById("attendance-student").value;
  const date = document.getElementById("attendance-date").value;
  if (!sID || !date) return showToast("Select student and date.", "warning");

  const status = document.querySelector('input[name="status"]:checked').value;
  const exists = attendanceRecords.find(
    (r) => r.studentID === sID && r.date === date
  );

  if (exists) {
    exists.status = status;
    showToast("Attendance updated.", "info");
  } else {
    attendanceRecords.push({
      uniqueID: generateUniqueID(),
      studentID: sID,
      date,
      status,
    });
    showToast("Attendance recorded.", "success");
  }
  saveToLocalStorage();
  renderAll();
}

function editAttendance(uid) {
  const rec = attendanceRecords.find((r) => r.uniqueID === uid);
  if (!rec) return;
  document.getElementById("attendance-student").value = rec.studentID;
  document.getElementById("attendance-date").value = rec.date;
  document.querySelector(
    `input[name="status"][value="${rec.status}"]`
  ).checked = true;

  const btn = document.getElementById("btn-mark");
  btn.textContent = "Update Record";
  btn.onclick = () => {
    const updateRec = attendanceRecords.find((r) => r.uniqueID === uid);
    if (updateRec) {
      updateRec.studentID = document.getElementById("attendance-student").value;
      updateRec.date = document.getElementById("attendance-date").value;
      updateRec.status = document.querySelector(
        'input[name="status"]:checked'
      ).value;
    }
    saveToLocalStorage();
    btn.textContent = "Mark Attendance";
    btn.onclick = markAttendance;
    document.getElementById("attendance-student").value = "";
    renderAll();
    showToast("Record updated.", "success");
  };
}

function deleteAttendance(uid) {
  if (!confirmCustom("Delete record?")) return;
  attendanceRecords = attendanceRecords.filter((r) => r.uniqueID !== uid);
  saveToLocalStorage();
  renderAll();
}

/* 6. INITIALIZATION */
document.addEventListener("DOMContentLoaded", () => {
  // Load from localStorage
  const storedStudents = localStorage.getItem("students");
  const storedAttendance = localStorage.getItem("attendanceRecords");
  try {
    if (storedStudents) students = JSON.parse(storedStudents);
    if (storedAttendance) attendanceRecords = JSON.parse(storedAttendance);
  } catch (e) {
    console.error("Error parsing localStorage data:", e);
    students = [];
    attendanceRecords = [];
  }

  document.getElementById("attendance-date").value = new Date()
    .toISOString()
    .split("T")[0];
  renderAll();
  setupPasswordValidation();
  navigateTo("students");

  document
    .getElementById("student-form")
    .addEventListener("submit", handleStudentFormSubmit);
  document.getElementById("btn-mark").addEventListener("click", markAttendance);

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo(e.currentTarget.getAttribute("data-view"));
    });
  });
});

