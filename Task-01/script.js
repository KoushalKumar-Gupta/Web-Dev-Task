document.addEventListener('DOMContentLoaded', function() {
    
    // Select the button by its ID
    const alertButton = document.getElementById('magicBtn');
    
    // Function to show alert message
    function showWelcomeAlert() {
        alert("🎉 Hello from ApexPlanet! 🎉\n\nYou've successfully triggered JavaScript interactivity!\n\n✅ Task 1 Objective Completed: Button + Alert!");
    }
    
    // Attach event listener to button (triggers when clicked)
    if (alertButton) {
        alertButton.addEventListener('click', showWelcomeAlert);
    }
    
    // Optional: Console log to show JS is running
    console.log("✅ JavaScript loaded — page ready. Click the orange button for alert.");
    
    // Bonus: Additional interactive feature - change button text on hover
    if (alertButton) {
        alertButton.addEventListener('mouseenter', function() {
            this.textContent = '🔔 Click now! 🔔';
        });
        
        alertButton.addEventListener('mouseleave', function() {
            this.textContent = '✨ Click me for a surprise ✨';
        });
    }
});