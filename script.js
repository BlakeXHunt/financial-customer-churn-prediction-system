// Simple JavaScript for smooth scrolling
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Button event listeners
document.getElementById('login').addEventListener('click', function() {
    alert('Login button clicked!');
});

document.getElementById('signup').addEventListener('click', function() {
    alert('Sign Up button clicked!');
});

// Example: Alert on page load
window.addEventListener('load', function() {
    console.log('Website loaded successfully!');
});
window.addEventListener('load', function() {
    console.log('Website loaded successfully!');
});