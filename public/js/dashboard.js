// Function to handle form submission for creating a new blog
const newBlog = async (event) => {
	event.preventDefault(); // Prevent default form submission behavior

	const title = document.querySelector('#blog-title').value.trim();
	const description = document.querySelector('#blog-desc').value.trim();

	// Check if both title and description are provided
	if (title && description) {
		const response = await fetch(`/api/blogs`, {
			method: 'POST',
			body: JSON.stringify({ title, description }),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (response.ok) {
			document.location.replace('/dashboard');
		} else {
			alert('Failed to create blog!');
		}
	}
};

// Function to handle click events on delete buttons for blogs
const deleteBlog = async (event) => {
	// Check if the clicked element has the 'data-id' attribute
	if (event.target.hasAttribute('data-id')) {
		// Get the value of the 'data-id' attribute
		const id = event.target.getAttribute('data-id');

		// Send a DELETE request to the blogs API endpoint with the blog ID
		const response = await fetch(`/api/blogs/${id}`, {
			method: 'DELETE',
		});

		if (response.ok) {
			document.location.replace('/dashboard');
		} else {
			alert('Failed to delete blog!');
		}
	}
};

// Event listener for newBlog and deleteBlog
document
	.querySelector('.new-blog-form')
	.addEventListener('submit', newBlog);

document
	.querySelector('.blog-list')
	.addEventListener('click', deleteBlog);
