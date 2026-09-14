// Test uchun soxta ma'lumotlar bazasi (Mock Data)
const mockStudents = {
    "EQ-8923": {
        name: "Jasurbek Salomxonov",
        score: "88 / 100",
        tasks: [
            { subject: "Ingliz tili", title: "Prepare Unit 4 exercises", dueDate: "Bugun, 18:00", status: "Bajarildi", done: true },
            { subject: "Matematika", title: "Kvadrat tenglamalar 10-15 mashq", dueDate: "Ertaga, 12:00", status: "Kutilmoqda", done: false },
            { subject: "Informatika", title: "HTML va CSS asoslari loyihasi", dueDate: "14-Sentabr", status: "Kutilmoqda", done: false }
        ]
    }
};

function linkStudent() {
    const inputCode = document.getElementById("studentCodeInput").value.trim();
    const statusText = document.getElementById("linkStatus");
    const dashboard = document.getElementById("studentDashboard");

    if (!inputCode) {
        statusText.innerText = "Iltimos, taklif kodini kiriting!";
        statusText.className = "mt-2 text-sm text-red-400";
        return;
    }

    if (mockStudents[inputCode]) {
        const student = mockStudents[inputCode];

        statusText.innerText = "O'quvchi muvaffaqiyatli biriktirildi! ✅";
        statusText.className = "mt-2 text-sm text-green-400";

        // Ma'lumotlarni interfeysga yuklash
        document.getElementById("studentName").innerText = student.name;
        document.getElementById("studentScore").innerText = student.score;

        const pendingTasks = student.tasks.filter(t => !t.done).length;
        document.getElementById("pendingTasksCount").innerText = `${pendingTasks} ta`;

        // Jadvalni to'ldirish
        const tableBody = document.getElementById("taskTableBody");
        tableBody.innerHTML = "";

        student.tasks.forEach(task => {
            const row = document.createElement("tr");
            row.className = "border-b border-slate-700";

            const statusBadge = task.done 
                ? `<span class="bg-green-900 text-green-300 text-xs px-2.5 py-1 rounded">Bajarildi</span>`
                : `<span class="bg-yellow-900 text-yellow-300 text-xs px-2.5 py-1 rounded">Bajarilmadi</span>`;

            row.innerHTML = `
                <td class="p-3 font-medium text-white">${task.subject}</td>
                <td class="p-3">${task.title}</td>
                <td class="p-3 text-slate-400">${task.dueDate}</td>
                <td class="p-3">${statusBadge}</td>
            `;
            tableBody.appendChild(row);
        });

        dashboard.classList.remove("hidden");
    } else {
        statusText.innerText = "Bunday kodli o'quvchi topilmadi. Qaytadan tekshiring (Masalan: EQ-8923)";
        statusText.className = "mt-2 text-sm text-red-400";
        dashboard.classList.add("hidden");
    }
}