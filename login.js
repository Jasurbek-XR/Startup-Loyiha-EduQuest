let selectedRole = 'student'; // Standart holatda O'quvchi tanlangan

function selectRole(role) {
    selectedRole = role;
    
    const studentBtn = document.getElementById('roleStudent');
    const parentBtn = document.getElementById('roleParent');
    const inputLabel = document.getElementById('inputLabel');
    const usernameInput = document.getElementById('usernameInput');

    if (role === 'student') {
        studentBtn.className = "py-2.5 rounded-lg text-sm font-medium transition bg-indigo-600 text-white";
        parentBtn.className = "py-2.5 rounded-lg text-sm font-medium transition text-slate-400 hover:text-white";
        
        inputLabel.innerText = "O'quvchi kodi yoki Email";
        usernameInput.placeholder = "Masalan: EQ-8923";
    } else {
        parentBtn.className = "py-2.5 rounded-lg text-sm font-medium transition bg-indigo-600 text-white";
        studentBtn.className = "py-2.5 rounded-lg text-sm font-medium transition text-slate-400 hover:text-white";
        
        inputLabel.innerText = "Ota-ona kodi yoki Telefon raqam";
        usernameInput.placeholder = "Masalan: EQ-P782 yoki +998901234567";
    }
}

function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    // Oddiy tekshirish mantiqi (Demo uchun)
    if (username && password) {
        // Rol va ma'lumotni saqlab qo'yamiz
        localStorage.setItem('userRole', selectedRole);
        localStorage.setItem('username', username);

        if (selectedRole === 'student') {
            // O'quvchi sahifasiga o'tkazish
            window.location.href = 'index.html'; 
        } else {
            // Ota-ona sahifasiga o'tkazish
            window.location.href = 'parent.html'; 
        }
    } else {
        errorMessage.innerText = "Iltimos, barcha maydonlarni to'ldiring!";
        errorMessage.classList.remove('hidden');
    }
}