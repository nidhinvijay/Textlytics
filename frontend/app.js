document.addEventListener('DOMContentLoaded', async () => {
    // --- Particle.js Background Initialization ---
    // This loads the particle effect. You can find more configs at https://particles.js.org/
    await tsParticles.load({
        id: "particles-js",
        options: {
            fpsLimit: 60,
            interactivity: {
                events: {
                    onHover: { enable: true, mode: "repulse" },
                    onClick: { enable: true, mode: "push" },
                },
                modes: {
                    repulse: { distance: 100, duration: 0.4 },
                    push: { quantity: 4 },
                },
            },
            particles: {
                color: { value: "#cccccc" },
                links: { color: "#cccccc", distance: 150, enable: true, opacity: 0.4, width: 1 },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: "out",
                    random: false,
                    speed: 2,
                    straight: false,
                },
                number: { density: { enable: true }, value: 80 },
                opacity: { value: 0.5 },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 5 } },
            },
            detectRetina: true,
        },
    });

    // --- Authentication Check ---
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = '/login/';
        return;
    }

    // --- Element Selectors ---
    const submitBtn = document.getElementById('submit-btn');
    const searchBtn = document.getElementById('search-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const resultsContainer = document.getElementById('results-container');
    const emptyState = document.getElementById('empty-state');

    // --- Helper Function for Notifications ---
    const showToast = (text, type = 'success') => {
        const backgroundColor = type === 'success' 
            ? 'linear-gradient(to right, #00b09b, #96c93d)' 
            : 'linear-gradient(to right, #ff5f6d, #ffc371)';
        Toastify({
            text: text,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: { background: backgroundColor },
        }).showToast();
    };

    // --- Event Listeners ---

    // Submit Paragraphs
    submitBtn.addEventListener('click', async () => {
        const textBlock = document.getElementById('text-block');
        if (!textBlock.value.trim()) {
            showToast('Text block cannot be empty.', 'error');
            return;
        }

        const originalButtonText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Submitting...';

        try {
            const response = await fetch('/api/paragraphs/submit/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ text_block: textBlock.value })
            });
            const data = await response.json();
            if (response.ok) {
                showToast(data.message || 'Submission successful!');
                textBlock.value = '';
            } else {
                showToast(data.error || 'Submission failed.', 'error');
            }
        } catch (error) {
            showToast('An unexpected error occurred.', 'error');
            console.error('Submit error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalButtonText;
        }
    });

    // Search for Word
    searchBtn.addEventListener('click', async () => {
        const searchWord = document.getElementById('search-word');
        if (!searchWord.value.trim()) {
            showToast('Please enter a word to search.', 'error');
            return;
        }

        const originalButtonText = searchBtn.innerHTML;
        searchBtn.disabled = true;
        searchBtn.innerHTML = 'Searching...';

        try {
            const response = await fetch(`/api/paragraphs/search/?word=${searchWord.value}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const results = await response.json();
                renderResults(results);
            } else {
                showToast('Failed to fetch results.', 'error');
            }
        } catch (error) {
            showToast('An unexpected error occurred.', 'error');
            console.error('Search error:', error);
        } finally {
            searchBtn.disabled = false;
            searchBtn.innerHTML = originalButtonText;
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        showToast('Logged out successfully!');
        setTimeout(() => window.location.href = '/', 1000); // Wait a bit for toast
    });

    // --- Rendering Function ---
    function renderResults(results) {
        resultsContainer.innerHTML = ''; // Clear previous results
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p class="text-gray-500 text-center fade-in">No results found for your search.</p>';
            return;
        }
        
        results.forEach(item => {
            const div = document.createElement('div');
            // Add the fade-in class for the animation
            div.className = 'p-4 border border-gray-200 rounded-lg bg-gray-50/50 fade-in';
            div.innerHTML = `
                <p class="font-semibold text-gray-800">Frequency: <span class="text-blue-600 font-bold text-lg">${item.frequency}</span></p>
                <p class="text-gray-600 mt-1">${item.content}</p>
            `;
            resultsContainer.appendChild(div);
        });
    }
});