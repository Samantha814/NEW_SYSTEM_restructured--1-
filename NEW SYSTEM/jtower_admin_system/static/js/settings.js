// static/js/settings.js

document.addEventListener('DOMContentLoaded', function() {
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        const newPassword = document.getElementById('new_password');
        const confirmPassword = document.getElementById('confirm_password');
        const errorDiv = document.getElementById('password-match-error');

        const validatePasswords = () => {
            if (newPassword.value && confirmPassword.value && newPassword.value !== confirmPassword.value) {
                errorDiv.style.display = 'block';
                confirmPassword.setCustomValidity("Passwords do not match.");
            } else {
                errorDiv.style.display = 'none';
                confirmPassword.setCustomValidity("");
            }
        };

        newPassword.addEventListener('input', validatePasswords);
        confirmPassword.addEventListener('input', validatePasswords);

        passwordForm.addEventListener('submit', validatePasswords);
    }
});