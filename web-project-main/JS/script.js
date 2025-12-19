// /**
//  * ========================================
//  * EduTrack Pro - Student Management System
//  * Core JavaScript Logic with Password Validation
//  * ========================================
//  */

// // --- GLOBAL DATA STORAGE (INITIALIZED EMPTY) ---
// let students = [];
// let attendanceRecords = [];
// let isEditing = false;
// let currentEditID = null;

// // --- UTILITY FUNCTIONS ---

// /**
//  * Generates a unique, short ID.
//  * @returns {string} A unique ID string.
//  */
// function generateUniqueID() {
//   return "_" + Math.random().toString(36).substr(2, 9);
// }

// /**
//  * Displays a Bootstrap Toast notification.
//  * @param {string} message - The content of the toast.
//  * @param {string} type - 'success', 'danger', 'warning', or 'info'.
//  */
// function showToast(message, type = "info") {
//   const toastContainer = document.getElementById("toast-container");
//   const toastHTML = `
//         <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="4000">
//             <div class="d-flex">
//                 <div class="toast-body fw-bold">
//                     ${message}
//                 </div>
//                 <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
//             </div>
//         </div>
//     `;

//   // Append the toast HTML to the container
//   toastContainer.insertAdjacentHTML("beforeend", toastHTML);

//   // Initialize and show the new toast
//   const newToastEl = toastContainer.lastElementChild;
//   const toast = new bootstrap.Toast(newToastEl);
//   toast.show();

//   // Remove the element from DOM after it's hidden
//   newToastEl.addEventListener("hidden.bs.toast", () => newToastEl.remove());
// }

// /**
//  * Validates a password against the security policy.
//  * Policy: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character.
//  * @param {string} password - The password string to validate.
//  * @returns {string|null} Error message if validation fails, otherwise null.
//  */
// function validatePassword(password) {
//   const errors = [];

//   if (password.length < 8) {
//     errors.push("Password must be at least 8 characters long.");
//   }
//   if (!/[A-Z]/.test(password)) {
//     errors.push("Password must contain at least one uppercase letter (A-Z).");
//   }
//   if (!/[a-z]/.test(password)) {
//     errors.push("Password must contain at least one lowercase letter (a-z).");
//   }
//   if (!/[0-9]/.test(password)) {
//     errors.push("Password must contain at least one number (0-9).");
//   }
//   if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
//     errors.push(
//       "Password must contain at least one special character (!@#$%^&* etc.)."
//     );
//   }

//   return errors.length === 0 ? null : errors.join(" ");
// }

// /**
//  * Sets up real-time password validation UI with visual feedback.
//  */
// function setupPasswordValidation() {
//   const passwordInput = document.getElementById("studentPassword");
//   const validationFeedback = document.getElementById(
//     "passwordValidationFeedback"
//   );

//   if (!passwordInput || !validationFeedback) return;

//   // Create a div to show real-time requirements
//   const requirementsContainer = document.createElement("div");
//   requirementsContainer.className = "password-requirements mt-2";
//   requirementsContainer.style.fontSize = "0.75rem";
//   requirementsContainer.innerHTML = `
//         <div class="requirements-list">
//             <div class="requirement" data-check="length">
//                 <i class="fa-solid fa-circle me-1" style="color: #ccc; font-size: 0.6rem;"></i>
//                 <span>At least 8 characters</span>
//             </div>
//             <div class="requirement" data-check="uppercase">
//                 <i class="fa-solid fa-circle me-1" style="color: #ccc; font-size: 0.6rem;"></i>
//                 <span>One uppercase letter</span>
//             </div>
//             <div class="requirement" data-check="lowercase">
//                 <i class="fa-solid fa-circle me-1" style="color: #ccc; font-size: 0.6rem;"></i>
//                 <span>One lowercase letter</span>
//             </div>
//             <div class="requirement" data-check="number">
//                 <i class="fa-solid fa-circle me-1" style="color: #ccc; font-size: 0.6rem;"></i>
//                 <span>One number</span>
//             </div>
//             <div class="requirement" data-check="special">
//                 <i class="fa-solid fa-circle me-1" style="color: #ccc; font-size: 0.6rem;"></i>
//                 <span>One special character</span>
//             </div>
//         </div>
//     `;

//   // Insert after the password input
//   passwordInput.parentNode.insertBefore(
//     requirementsContainer,
//     passwordInput.nextSibling
//   );

//   // Real-time validation on input
//   passwordInput.addEventListener("input", function () {
//     const password = this.value;

//     // Check each requirement
//     const checks = {
//       length: password.length >= 8,
//       uppercase: /[A-Z]/.test(password),
//       lowercase: /[a-z]/.test(password),
//       number: /[0-9]/.test(password),
//       special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
//     };

//     // Update requirement indicators
//     Object.keys(checks).forEach((check) => {
//       const requirementEl = requirementsContainer.querySelector(
//         `[data-check="${check}"]`
//       );
//       const icon = requirementEl.querySelector("i");
//       const span = requirementEl.querySelector("span");

//       if (checks[check]) {
//         icon.style.color = "#28a745";
//         span.style.color = "#28a745";
//       } else {
//         icon.style.color = "#ccc";
//         span.style.color = "#6c757d";
//       }
//     });

//     // Clear any previous validation messages
//     if (password.length > 0) {
//       const error = validatePassword(password);
//       if (error) {
//         this.classList.remove("is-valid");
//         this.classList.add("is-invalid");
//         validationFeedback.textContent = error;
//       } else {
//         this.classList.remove("is-invalid");
//         this.classList.add("is-valid");
//         validationFeedback.textContent = "";
//       }
//     } else {
//       this.classList.remove("is-valid", "is-invalid");
//       validationFeedback.textContent = "";
//     }
//   });

//   // Add show/hide password toggle
//   const toggleButton = document.createElement("button");
//   toggleButton.type = "button";
//   toggleButton.className = "btn btn-sm btn-outline-secondary position-absolute";
//   toggleButton.style.top = "50%";
//   toggleButton.style.right = "10px";
//   toggleButton.style.transform = "translateY(-50%)";
//   toggleButton.style.zIndex = "5";
//   toggleButton.innerHTML = '<i class="fa-solid fa-eye"></i>';

//   passwordInput.parentNode.style.position = "relative";
//   passwordInput.parentNode.appendChild(toggleButton);

//   toggleButton.addEventListener("click", function () {
//     const type =
//       passwordInput.getAttribute("type") === "password" ? "text" : "password";
//     passwordInput.setAttribute("type", type);
//     this.innerHTML =
//       type === "password"
//         ? '<i class="fa-solid fa-eye"></i>'
//         : '<i class="fa-solid fa-eye-slash"></i>';
//   });

//   // Clear validation on form reset
//   const form = document.getElementById("student-form");
//   form.addEventListener("reset", () => {
//     passwordInput.classList.remove("is-valid", "is-invalid");
//     validationFeedback.textContent = "";

//     // Reset requirement indicators
//     const requirements = requirementsContainer.querySelectorAll(".requirement");
//     requirements.forEach((req) => {
//       const icon = req.querySelector("i");
//       const span = req.querySelector("span");
//       icon.style.color = "#ccc";
//       span.style.color = "#6c757d";
//     });
//   });
// }

// /**
//  * Custom confirmation dialog (since alert/confirm are blocked in Canvas).
//  */
// function confirmCustom(message) {
//   console.warn(
//     `Confirmation required: "${message}" -> Assuming 'Yes' (True) for Canvas execution.`
//   );
//   return true;
// }

// // --- DOM MANIPULATION AND RENDERING ---

// /**
//  * Updates the main statistics cards at the top of the dashboard.
//  */
// function updateStats() {
//   // 1. Total Students
//   const totalStudents = students.length;
//   document.getElementById("stat-total-students").textContent = totalStudents;

//   // 2. Fees Pending (Example logic: students not marked 'feesPaid')
//   const feesPending = students.filter((s) => !s.feesPaid).length;
//   document.getElementById("stat-fees-pending").textContent = feesPending;

//   // 3. Today's Attendance
//   const today = new Date().toISOString().split("T")[0];
//   const todayAttendance = attendanceRecords.filter(
//     (a) => a.date === today && a.status === "Present"
//   ).length;
//   document.getElementById("stat-attendance-today").textContent =
//     todayAttendance;
// }

// /**
//  * Renders the student roster cards in the student directory.
//  * @param {Array} studentList - The list of students to render.
//  */
// function renderStudents(studentList = students) {
//   const container = document.getElementById("student-container");
//   container.innerHTML = ""; // Clear existing cards

//   if (studentList.length === 0) {
//     container.innerHTML = `
//             <div class="col-12 text-center py-5">
//                 <i class="fa-solid fa-graduation-cap fa-3x text-muted mb-3"></i>
//                 <h5 class="text-muted fw-bold">No Students Registered Yet</h5>
//                 <p class="text-secondary">Use the 'New Admission' panel above to add your first student.</p>
//             </div>
//         `;
//     return;
//   }

//   studentList.forEach((student) => {
//     const feeStatus = student.feesPaid
//       ? '<span class="badge bg-success-subtle text-success fw-bold">Paid</span>'
//       : '<span class="badge bg-danger-subtle text-danger fw-bold">Pending</span>';

//     const cardHTML = `
//             <div class="col-xl-4 col-md-6">
//                 <div class="student-card p-4 d-flex align-items-start">
//                     <div class="me-3 fs-2 text-primary">
//                         <i class="fa-solid fa-user-circle"></i>
//                     </div>

//                     <div class="flex-grow-1">
//                         <h6 class="fw-bold mb-1">${student.name}</h6>
//                         <small class="text-muted d-block mb-2">ID: ${student.id} | Year ${student.year}</small>

//                         <div class="d-flex flex-wrap gap-2 mb-3">
//                             <span class="badge bg-primary">${student.department}</span>
//                             <span class="badge bg-secondary">Grade: ${student.grade}</span>
//                             ${feeStatus}
//                         </div>

//                         <div class="card-actions mt-3">
//                             <button class="btn btn-sm btn-outline-warning me-2 rounded-pill" onclick="editStudent('${student.uniqueID}')">
//                                 <i class="fa-solid fa-edit"></i> Edit
//                             </button>
//                             <button class="btn btn-sm btn-outline-danger rounded-pill" onclick="deleteStudent('${student.uniqueID}')">
//                                 <i class="fa-solid fa-trash-alt"></i> Delete
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         `;
//     container.insertAdjacentHTML("beforeend", cardHTML);
//   });
// }

// /**
//  * Renders the list of students in the attendance dropdown.
//  */
// function renderAttendanceDropdown() {
//   const select = document.getElementById("attendance-student");
//   select.innerHTML =
//     '<option value="" selected disabled>Choose student...</option>';

//   students.forEach((student) => {
//     const option = document.createElement("option");
//     option.value = student.uniqueID;
//     option.textContent = `${student.name} (${student.id})`;
//     select.appendChild(option);
//   });
// }

// /**
//  * Renders the attendance history table.
//  */
// function renderAttendanceTable() {
//   const tbody = document.getElementById("attendance-table");
//   tbody.innerHTML = ""; // Clear existing rows

//   if (attendanceRecords.length === 0) {
//     tbody.innerHTML = `
//             <tr>
//                 <td colspan="4" class="text-center text-muted py-4">
//                     No attendance records found.
//                 </td>
//             </tr>
//         `;
//     return;
//   }

//   // Sort by date descending
//   const sortedRecords = [...attendanceRecords].sort(
//     (a, b) => new Date(b.date) - new Date(a.date)
//   );

//   sortedRecords.forEach((record) => {
//     const student = students.find((s) => s.uniqueID === record.studentID);
//     const studentName = student
//       ? `${student.name} / ${student.id}`
//       : "Unknown Student";

//     let statusClass = "";
//     if (record.status === "Present") statusClass = "success";
//     else if (record.status === "Late") statusClass = "warning";
//     else if (record.status === "Absent") statusClass = "danger";

//     const rowHTML = `
//             <tr>
//                 <td>${studentName}</td>
//                 <td>${record.date}</td>
//                 <td><span class="badge bg-${statusClass}-subtle text-${statusClass} fw-bold">${record.status}</span></td>
//                 <td class="text-end">
//                     <button class="btn btn-sm btn-outline-warning rounded-circle me-1" title="Edit Record" onclick="editAttendance('${record.uniqueID}')">
//                         <i class="fa-solid fa-pen"></i>
//                     </button>
//                     <button class="btn btn-sm btn-outline-danger rounded-circle" title="Delete Record" onclick="deleteAttendance('${record.uniqueID}')">
//                         <i class="fa-solid fa-times"></i>
//                     </button>
//                 </td>
//             </tr>
//         `;
//     tbody.insertAdjacentHTML("beforeend", rowHTML);
//   });
// }

// /**
//  * Renders all dynamic sections of the app.
//  */
// function renderAll() {
//   updateStats();
//   renderStudents();
//   renderAttendanceDropdown();
//   renderAttendanceTable();
// }

// // --- STUDENT MANAGEMENT LOGIC ---

// /**
//  * Handles the submission of the student form (Add or Update).
//  * @param {Event} e - The form submission event.
//  */
// function handleStudentFormSubmit(e) {
//   e.preventDefault();
//   const form = document.getElementById("student-form");
//   const studentIDInput = document.getElementById("studentID");
//   const studentNameInput = document.getElementById("studentName");
//   const studentPasswordInput = document.getElementById("studentPassword");

//   // Clear previous validation
//   form.classList.remove("was-validated");
//   studentIDInput.classList.remove("is-invalid");
//   studentNameInput.classList.remove("is-invalid");
//   if (studentPasswordInput) {
//     studentPasswordInput.classList.remove("is-invalid");
//   }

//   let isValid = true;

//   // Collect form data
//   const studentID = studentIDInput.value.trim();
//   const name = studentNameInput.value.trim();
//   const password = studentPasswordInput ? studentPasswordInput.value : "";
//   const age = parseInt(document.getElementById("studentAge").value);
//   const department = document.getElementById("studentDepartment").value;
//   const grade = document.getElementById("studentGrade").value;
//   const year = document.getElementById("studentYear").value;
//   const feesPaid = document.getElementById("studentFee").checked;

//   // --- Enhanced Password Validation ---
//   if (studentPasswordInput) {
//     if (!isEditing) {
//       // New admission: Password is required
//       if (password.length === 0) {
//         studentPasswordInput.classList.add("is-invalid");
//         document.getElementById("passwordValidationFeedback").textContent =
//           "Password is required for new admissions.";
//         isValid = false;
//       } else {
//         const passwordError = validatePassword(password);
//         if (passwordError) {
//           studentPasswordInput.classList.add("is-invalid");
//           document.getElementById("passwordValidationFeedback").textContent =
//             passwordError;
//           isValid = false;
//         }
//       }
//     } else if (isEditing && password.length > 0) {
//       // Editing: Only validate if password is being changed
//       const passwordError = validatePassword(password);
//       if (passwordError) {
//         studentPasswordInput.classList.add("is-invalid");
//         document.getElementById("passwordValidationFeedback").textContent =
//           passwordError;
//         isValid = false;
//       }
//     }
//   }

//   // --- Duplicate ID Check ---
//   if (!isEditing && students.some((s) => s.id === studentID)) {
//     studentIDInput.classList.add("is-invalid");
//     studentIDInput.nextElementSibling.textContent = `Student ID ${studentID} already exists.`;
//     isValid = false;
//   }

//   // --- Required Fields Validation ---
//   if (!studentID) {
//     studentIDInput.classList.add("is-invalid");
//     studentIDInput.nextElementSibling.textContent = "Student ID is required.";
//     isValid = false;
//   }

//   if (!name) {
//     studentNameInput.classList.add("is-invalid");
//     isValid = false;
//   }

//   // --- Final Check ---
//   if (!isValid) {
//     form.classList.add("was-validated");
//     showToast(
//       "Please correct the highlighted errors before submission.",
//       "danger"
//     );
//     return;
//   }

//   // Continue with existing save/update logic...
//   if (isEditing) {
//     // Update existing student
//     const studentIndex = students.findIndex(
//       (s) => s.uniqueID === currentEditID
//     );
//     if (studentIndex > -1) {
//       students[studentIndex] = {
//         ...students[studentIndex],
//         name,
//         password:
//           password.length > 0 ? password : students[studentIndex].password,
//         age,
//         department,
//         grade,
//         year,
//         feesPaid,
//       };
//       showToast(`Student ${name} updated successfully.`, "success");

//       // Reset form
//       isEditing = false;
//       currentEditID = null;
//       document.getElementById("addBtn").classList.remove("d-none");
//       document.getElementById("updateBtn").classList.add("d-none");
//       studentIDInput.disabled = false;

//       if (studentPasswordInput) {
//         studentPasswordInput.placeholder = "";
//         studentPasswordInput.classList.remove("is-valid");
//       }
//       form.reset();
//     }
//   } else {
//     // Add new student
//     const newStudent = {
//       uniqueID: generateUniqueID(),
//       id: studentID,
//       name,
//       password, // Store validated password
//       age,
//       department,
//       grade,
//       year,
//       feesPaid,
//     };
//     students.push(newStudent);
//     showToast(`New student ${name} added successfully.`, "success");
//     form.reset();

//     // Clear password validation styling
//     if (studentPasswordInput) {
//       studentPasswordInput.classList.remove("is-valid");
//     }
//   }

//   renderAll();
// }

// /**
//  * Sets up the form for editing a student.
//  * @param {string} uniqueID - The unique ID of the student to edit.
//  */
// function editStudent(uniqueID) {
//   const student = students.find((s) => s.uniqueID === uniqueID);
//   if (!student) return;

//   // Scroll to form
//   document.querySelector(".glass-panel").scrollIntoView({ behavior: "smooth" });

//   // Set editing state
//   isEditing = true;
//   currentEditID = uniqueID;

//   // Populate form
//   const studentIDInput = document.getElementById("studentID");
//   const studentPasswordInput = document.getElementById("studentPassword");

//   studentIDInput.value = student.id;
//   studentIDInput.disabled = true;
//   document.getElementById("studentName").value = student.name;
//   document.getElementById("studentAge").value = student.age;
//   document.getElementById("studentDepartment").value = student.department;
//   document.getElementById("studentGrade").value = student.grade;
//   document.getElementById("studentYear").value = student.year;
//   document.getElementById("studentFee").checked = student.feesPaid;

//   // Handle password field
//   if (studentPasswordInput) {
//     studentPasswordInput.value = "";
//     studentPasswordInput.placeholder = "Leave blank to keep current password";
//     studentPasswordInput.classList.remove("is-invalid", "is-valid");
//   }

//   // Clear validation
//   document.getElementById("student-form").classList.remove("was-validated");
//   studentIDInput.classList.remove("is-invalid");

//   // Toggle buttons
//   document.getElementById("addBtn").classList.add("d-none");
//   document.getElementById("updateBtn").classList.remove("d-none");
//   document.getElementById("updateBtn").onclick = (e) =>
//     handleStudentFormSubmit(e);
// }

// /**
//  * Deletes a student by their unique ID.
//  * @param {string} uniqueID - The unique ID of the student to delete.
//  */
// function deleteStudent(uniqueID) {
//   if (
//     !confirmCustom(
//       "Are you sure you want to delete this student and all associated records?"
//     )
//   )
//     return;

//   const student = students.find((s) => s.uniqueID === uniqueID);

//   // Remove student
//   students = students.filter((s) => s.uniqueID !== uniqueID);

//   // Remove associated attendance records
//   attendanceRecords = attendanceRecords.filter((a) => a.studentID !== uniqueID);

//   showToast(`Student ${student ? student.name : "record"} deleted.`, "danger");
//   renderAll();
// }

// /**
//  * Filters and renders students based on search query.
//  * @param {string} query - The search string.
//  */
// function searchStudent(query) {
//   const q = query.toLowerCase().trim();
//   if (q === "") {
//     renderStudents(students);
//     return;
//   }
//   const filteredStudents = students.filter(
//     (student) =>
//       student.name.toLowerCase().includes(q) ||
//       student.id.toString().includes(q)
//   );
//   renderStudents(filteredStudents);
// }

// // --- ATTENDANCE MANAGEMENT LOGIC ---

// /**
//  * Handles marking attendance for a student.
//  */
// function markAttendance() {
//   const studentID = document.getElementById("attendance-student").value;
//   const date = document.getElementById("attendance-date").value;
//   const status = document.querySelector('input[name="status"]:checked').value;

//   if (!studentID || !date) {
//     showToast("Please select a student and a date.", "warning");
//     return;
//   }

//   const today = new Date().toISOString().split("T")[0];
//   if (date > today) {
//     showToast("Cannot record attendance for a future date.", "warning");
//     return;
//   }

//   // Check for existing record for this student on this date
//   const existingIndex = attendanceRecords.findIndex(
//     (r) => r.studentID === studentID && r.date === date
//   );

//   if (existingIndex !== -1) {
//     // Record exists, update it instead
//     attendanceRecords[existingIndex].status = status;
//     showToast("Attendance record updated.", "warning");
//   } else {
//     // Add new record
//     const newRecord = {
//       uniqueID: generateUniqueID(),
//       studentID,
//       date,
//       status,
//     };
//     attendanceRecords.push(newRecord);
//     showToast("Attendance recorded successfully.", "success");
//   }

//   // Reset form fields
//   document.getElementById("attendance-student").value = "";
//   document.getElementById("attendance-date").value = today; // Reset to today
//   document.getElementById("status-present").checked = true;

//   // Render updates
//   renderAll();
// }

// /**
//  * Sets up the form for editing an attendance record.
//  * @param {string} uniqueID - The unique ID of the attendance record to edit.
//  */
// function editAttendance(uniqueID) {
//   const record = attendanceRecords.find((r) => r.uniqueID === uniqueID);
//   if (!record) return;

//   // Populate form fields
//   document.getElementById("attendance-student").value = record.studentID;
//   document.getElementById("attendance-date").value = record.date;
//   document.querySelector(
//     `input[name="status"][value="${record.status}"]`
//   ).checked = true;

//   // Toggle buttons to Update mode
//   document.getElementById("btn-mark").classList.add("d-none");
//   document.getElementById("btn-update-attendance").classList.remove("d-none");

//   // Set up update handler to look for this specific record
//   document.getElementById("btn-update-attendance").onclick = function () {
//     updateAttendanceRecord(uniqueID);
//   };

//   showToast(
//     'Editing attendance record. Click "Update Record" to save changes.',
//     "info"
//   );
// }

// /**
//  * Saves the updated attendance record.
//  * @param {string} uniqueID - The unique ID of the attendance record to update.
//  */
// function updateAttendanceRecord(uniqueID) {
//   const recordIndex = attendanceRecords.findIndex(
//     (r) => r.uniqueID === uniqueID
//   );
//   if (recordIndex === -1) return;

//   const studentID = document.getElementById("attendance-student").value;
//   const date = document.getElementById("attendance-date").value;
//   const status = document.querySelector('input[name="status"]:checked').value;

//   // Update the record
//   attendanceRecords[recordIndex] = {
//     uniqueID,
//     studentID,
//     date,
//     status,
//   };

//   // Reset form to Add mode
//   document.getElementById("attendance-student").value = "";
//   document.getElementById("attendance-date").value = new Date()
//     .toISOString()
//     .split("T")[0];
//   document.getElementById("status-present").checked = true;
//   document.getElementById("btn-mark").classList.remove("d-none");
//   document.getElementById("btn-update-attendance").classList.add("d-none");

//   showToast("Attendance record updated successfully.", "success");
//   renderAll();
// }

// /**
//  * Deletes an attendance record by its unique ID.
//  * @param {string} uniqueID - The unique ID of the record to delete.
//  */
// function deleteAttendance(uniqueID) {
//   if (!confirmCustom("Are you sure you want to delete this attendance record?"))
//     return;

//   attendanceRecords = attendanceRecords.filter((r) => r.uniqueID !== uniqueID);
//   showToast("Attendance record deleted.", "danger");
//   renderAll();
// }

// // --- VIEW ROUTING / DASHBOARD NAVIGATION ---

// /**
//  * Handles navigation between different views (Students, Courses, etc.).
//  * @param {string} viewName - The data-view name of the section to show.
//  */
// function navigateTo(viewName) {
//   // Deactivate all views
//   document.querySelectorAll(".content-section").forEach((view) => {
//     view.classList.remove("active");
//   });

//   // Activate the target view
//   const targetView = document.getElementById(`view-${viewName}`);
//   if (targetView) {
//     targetView.classList.add("active");
//   }

//   // Deactivate all nav links
//   document.querySelectorAll(".nav-link").forEach((link) => {
//     link.classList.remove("active");
//   });

//   // Activate the corresponding nav link
//   const targetLink = document.querySelector(
//     `.nav-link[data-view="${viewName}"]`
//   );
//   if (targetLink) {
//     targetLink.classList.add("active");
//   }
// }

// // --- INITIALIZATION ---

// document.addEventListener("DOMContentLoaded", () => {
//   // Set current date on attendance input
//   document.getElementById("attendance-date").value = new Date()
//     .toISOString()
//     .split("T")[0];

//   // 1. Initial Render
//   renderAll();

//   // 2. Initialize password validation UI
//   setupPasswordValidation();

//   // 3. Initial View: Default to Students view
//   navigateTo("students");

//   // 4. Attach Event Listeners

//   // Student Form Submission
//   document
//     .getElementById("student-form")
//     .addEventListener("submit", handleStudentFormSubmit);

//   // Navigation (Sidebar Links) - ADDED e.preventDefault() fix
//   document.querySelectorAll(".nav-link").forEach((link) => {
//     link.addEventListener("click", (e) => {
//       e.preventDefault(); // Prevents crashes/failed navigation
//       const view = e.currentTarget.getAttribute("data-view");
//       navigateTo(view);
//     });
//   });

//   // Attendance Submission
//   document.getElementById("btn-mark").addEventListener("click", markAttendance);

//   // Form validation check for Bootstrap
//   const forms = document.querySelectorAll(".needs-validation");
//   Array.from(forms).forEach((form) => {
//     form.addEventListener(
//       "submit",
//       (event) => {
//         if (!form.checkValidity()) {
//           event.preventDefault();
//           event.stopPropagation();
//         }
//         // Note: Custom validation is handled separately in handleStudentFormSubmit
//         form.classList.add("was-validated");
//       },
//       false
//     );
//   });
// });
