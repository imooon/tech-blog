// Function to handle login form submission
const loginForm = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
  
    const username = document.querySelector('#username-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
  
    // Check if both username and password are provided
    if (username && password) {
      // Send a POST request to the login endpoint with username and password
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        // Redirect to the dashboard page if login is successful
        document.location.replace('/dashboard');
      } else {
        // Display an alert with the error message if login fails
        alert(response.statusText);
      }
    }
  };
  
  // Event listener for form submission, calls loginForm function
  document
    .querySelector('.login-form')
    .addEventListener('submit', loginForm);
  