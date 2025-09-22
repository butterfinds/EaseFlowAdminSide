async function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  const result = await window.electronAPI.login(email, password);

  if (result.success) {
    localStorage.setItem('adminEmail', result.email);
    localStorage.setItem('adminToken', result.token); // ✅ Store token
    window.location.href = 'dashboard.html';
  } else {
    document.getElementById('error').innerText = result.message;
  }
}
