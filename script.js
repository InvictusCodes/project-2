// script.js - Updated to handle photo uploads with Base64 encoding

document.addEventListener('DOMContentLoaded', () => {

    // --- Core Functions for Data Persistence ---

    const loadData = () => {
        try {
            const storedAlumni = localStorage.getItem('alumniData');
            const storedEvents = localStorage.getItem('eventsData');
            
            if (storedAlumni) {
                alumniData = JSON.parse(storedAlumni);
            } else {
                alumniData = [
                    { id: 1, photo: "https://via.placeholder.com/150/ff0000/ffffff?text=JD", name: "Jane Doe", collegeId: "SIT201501", profession: "Software Engineer", year: 2015, description: "A passionate software developer specializing in front-end technologies. Jane has worked on various impactful projects and is eager to mentor.", linkedin: "https://linkedin.com/in/janedoe" },
                    { id: 2, photo: "https://via.placeholder.com/150/0000ff/ffffff?text=JS", name: "John Smith", collegeId: "SIT201802", profession: "Data Scientist", year: 2018, description: "Experienced in machine learning and data analysis. A proud alumni of our college, always keen to connect.", linkedin: "https://linkedin.com/in/johnsmith" },
                    { id: 3, photo: "https://via.placeholder.com/150/008000/ffffff?text=AM", name: "Alice M. Green", collegeId: "SIT201603", profession: "UX Designer", year: 2016, description: "Crafting intuitive and delightful user experiences for leading tech companies. Believes in design thinking and user-centric approaches.", linkedin: "https://linkedin.com/in/alicemgreen" },
                    { id: 4, photo: "https://via.placeholder.com/150/800080/ffffff?text=RB", name: "Robert Brown", collegeId: "SIT201704", profession: "Financial Analyst", year: 2017, description: "Specializes in market research and financial forecasting, helping businesses make informed decisions. An expert in investment strategies.", linkedin: "https://linkedin.com/in/robertbrown" }
                ];
            }

            if (storedEvents) {
                eventsData = JSON.parse(storedEvents);
            } else {
                eventsData = [
                    { id: 101, title: "Annual Alumni Reunion", date: "October 25, 2025", description: "Join us for a night of networking and fun at the Grand Ballroom! Celebrate old memories and make new connections." },
                    { id: 102, title: "Alumni Visit to College", date: "November 10, 2025", description: "Interact with our current students, share your journey, and inspire the next generation. Campus tours and interactive sessions included." },
                    { id: 103, title: "Mentorship Meetup", date: "November 20, 2025", description: "An exclusive event for alumni and students to connect for mentorship opportunities. Find your mentor or become one!" },
                ];
            }
        } catch (e) {
            console.error("Failed to load data from Local Storage", e);
            alumniData = [
                 { id: 1, photo: "https://via.placeholder.com/150/ff0000/ffffff?text=JD", name: "Jane Doe", collegeId: "SIT201501", profession: "Software Engineer", year: 2015, description: "A passionate software developer specializing in front-end technologies. Jane has worked on various impactful projects and is eager to mentor.", linkedin: "https://linkedin.com/in/janedoe" },
                { id: 2, photo: "https://via.placeholder.com/150/0000ff/ffffff?text=JS", name: "John Smith", collegeId: "SIT201802", profession: "Data Scientist", year: 2018, description: "Experienced in machine learning and data analysis. A proud alumni of our college, always keen to connect.", linkedin: "https://linkedin.com/in/johnsmith" },
                { id: 3, photo: "https://via.placeholder.com/150/008000/ffffff?text=AM", name: "Alice M. Green", collegeId: "SIT201603", profession: "UX Designer", year: 2016, description: "Crafting intuitive and delightful user experiences for leading tech companies. Believes in design thinking and user-centric approaches.", linkedin: "https://linkedin.com/in/alicemgreen" },
                { id: 4, photo: "https://via.placeholder.com/150/800080/ffffff?text=RB", name: "Robert Brown", collegeId: "SIT201704", profession: "Financial Analyst", year: 2017, description: "Specializes in market research and financial forecasting, helping businesses make informed decisions. An expert in investment strategies.", linkedin: "https://linkedin.com/in/robertbrown" }
            ];
            eventsData = [
                { id: 101, title: "Annual Alumni Reunion", date: "October 25, 2025", description: "Join us for a night of networking and fun at the Grand Ballroom! Celebrate old memories and make new connections." },
                { id: 102, title: "Alumni Visit to College", date: "November 10, 2025", description: "Interact with our current students, share your journey, and inspire the next generation. Campus tours and interactive sessions included." },
                { id: 103, title: "Mentorship Meetup", date: "November 20, 2025", description: "An exclusive event for alumni and students to connect for mentorship opportunities. Find your mentor or become one!" },
            ];
        }
    };

    const saveData = () => {
        try {
            localStorage.setItem('alumniData', JSON.stringify(alumniData));
            localStorage.setItem('eventsData', JSON.stringify(eventsData));
        } catch (e) {
            console.error("Failed to save data to Local Storage", e);
        }
    };
    
    // --- Initial Data Loading ---
    let alumniData = [];
    let eventsData = [];
    loadData();

    // --- Global DOM Elements ---
    const alumniListDiv = document.getElementById('alumni-list');
    const alumniSearchInput = document.getElementById('alumni-search');
    const alumniModal = document.getElementById('alumni-modal');
    const modalDetailsDiv = document.getElementById('modal-details');
    const closeModalBtn = document.querySelector('.close-button');
    
    // Elements specific to the Admin page
    const adminLoginForm = document.getElementById('admin-login-form');
    const adminDashboard = document.getElementById('admin-dashboard');
    const addAlumniForm = document.getElementById('add-alumni-form');
    const alumniEditList = document.getElementById('alumni-edit-list');
    const adminAddEventForm = document.getElementById('add-event-form');
    const eventListDisplay = document.querySelector('.event-list');

    // --- Core Functions ---

    const renderAlumni = (filter = '') => {
        if (!alumniListDiv) return;
        const filteredData = alumniData.filter(alumnus => 
            alumnus.name.toLowerCase().includes(filter.toLowerCase())
        );
        alumniListDiv.innerHTML = '';
        if (filteredData.length === 0) {
            alumniListDiv.innerHTML = '<p class="no-results">No alumni found. Try a different name.</p>';
            return;
        }
        filteredData.forEach(alumnus => {
            const card = document.createElement('div');
            card.classList.add('alumni-card');
            card.innerHTML = `
                <img src="${alumnus.photo}" alt="${alumnus.name}" class="alumni-photo">
                <h3 class="alumni-name">${alumnus.name}</h3>
                <p class="alumni-details"><strong>Profession:</strong> ${alumnus.profession}</p>
                <p class="alumni-details"><strong>College ID:</strong> ${alumnus.collegeId}</p>
                <p class="alumni-details"><strong>Graduation Year:</strong> ${alumnus.year}</p>
            `;
            card.addEventListener('click', () => showAlumniDetails(alumnus));
            alumniListDiv.appendChild(card);
        });
    };

    const showAlumniDetails = (alumnus) => {
    if (!modalDetailsDiv || !alumniModal) return;

    // We'll use this variable to hold the description text.
    const descriptionContent = alumnus.description || 'No description provided.';

    // This is the correct code to replace.
    // It creates a new <div> with the class "modal-description"
    // to make the content scrollable according to your CSS.
    modalDetailsDiv.innerHTML = `
        <img src="${alumnus.photo}" alt="${alumnus.name}" class="alumni-photo-modal">
        <h3>${alumnus.name}</h3>
        <p><strong>Profession:</strong> ${alumnus.profession}</p>
        <p><strong>College ID:</strong> ${alumnus.collegeId}</p>
        <p><strong>Graduation Year:</strong> ${alumnus.year}</p>
        <div class="modal-description">
            <p><strong>Description:</strong> ${descriptionContent}</p>
        </div>
        ${alumnus.linkedin ? `<p><strong>LinkedIn:</strong> <a href="${alumnus.linkedin}" target="_blank">View Profile</a></p>` : ''}
    `;

    // This line displays the modal after all the content has been added.
    alumniModal.style.display = 'flex';
};

    const renderEvents = () => {
        if (!eventListDisplay) return;
        eventListDisplay.innerHTML = '';
        if (eventsData.length === 0) {
            eventListDisplay.innerHTML = '<p class="no-results">No upcoming events at the moment.</p>';
            return;
        }
        eventsData.forEach(event => {
            const card = document.createElement('div');
            card.classList.add('event-card');
            card.innerHTML = `
                <h4>${event.title}</h4>
                <p class="event-date">${event.date}</p>
                <p class="event-description">${event.description}</p>
            `;
            eventListDisplay.appendChild(card);
        });
    };
    
    const renderAdminAlumniList = () => {
        if (!alumniEditList) return;
        alumniEditList.innerHTML = '';
        if (alumniData.length === 0) {
            alumniEditList.innerHTML = '<p>No alumni to manage. Add some above!</p>';
            return;
        }
        alumniData.forEach(alumnus => {
            const item = document.createElement('div');
            item.classList.add('admin-alumni-item');
            const displayId = alumnus.collegeId || (alumnus.email ? alumnus.email.split('@')[0] : 'No ID');
            item.innerHTML = `
                <span>${alumnus.name} (ID: ${displayId})</span>
                <div class="admin-actions">
                    <button class="edit-btn" data-id="${alumnus.id}">Edit</button>
                    <button class="remove-btn" data-id="${alumnus.id}">Remove</button>
                </div>
            `;
            alumniEditList.appendChild(item);
        });
    };

    // --- Event Listeners and Page-Specific Logic ---
    
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        renderAlumni();
        if (alumniSearchInput) {
            alumniSearchInput.addEventListener('keyup', (e) => renderAlumni(e.target.value));
        }
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => alumniModal.style.display = 'none');
        }
        if (alumniModal) {
            window.onclick = (event) => {
                if (event.target === alumniModal) {
                    alumniModal.style.display = 'none';
                }
            };
        }
    }
    
    if (window.location.pathname.endsWith('events.html')) {
        renderEvents();
    }
    
    if (window.location.pathname.endsWith('admin.html')) {
        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('admin-email').value;
                const password = document.getElementById('admin-password').value;
                if (email.endsWith('@somaiya.edu') && password === 'pixelpirates25') {
                    sessionStorage.setItem('isAdminLoggedIn', 'true');
                    window.location.href = 'admin.html#dashboard';
                } else if (!email.endsWith('@somaiya.edu')) {
                    alert("Please use a @somaiya.edu email to access the Admin section.");
                } else {
                    alert("Incorrect password. Access denied.");
                }
            });
        }

        if (sessionStorage.getItem('isAdminLoggedIn') === 'true' && adminDashboard) {
            if (adminLoginForm) adminLoginForm.style.display = 'none';
            adminDashboard.style.display = 'block';
            renderAdminAlumniList();
        }

        // --- UPDATED ADD ALUMNI FORM LOGIC ---
        if (addAlumniForm) {
            addAlumniForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const fileInput = document.getElementById('alumni-photo-upload');
                const file = fileInput.files[0];

                // Check if a file was uploaded
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const base64Photo = event.target.result;

                        const newAlumnus = {
                            id: Date.now(),
                            photo: base64Photo, // Save the Base64 string
                            name: document.getElementById('alumni-name').value,
                            collegeId: document.getElementById('alumni-college-id').value,
                            profession: document.getElementById('alumni-profession').value,
                            year: parseInt(document.getElementById('alumni-year').value),
                            description: document.getElementById('alumni-desc').value,
                            linkedin: document.getElementById('alumni-linkedin').value
                        };
                        alumniData.push(newAlumnus);
                        addAlumniForm.reset();
                        saveData(); // Save the updated data
                        renderAlumni(); // Re-render the main directory
                        renderAdminAlumniList(); // Re-render the admin's management list
                        alert("Alumni added successfully!");
                    };
                    reader.readAsDataURL(file); // Start reading the file as a Base64 string
                } else {
                    // Handle case where no photo is uploaded (use a default placeholder)
                    const newAlumnus = {
                        id: Date.now(),
                        photo: "https://via.placeholder.com/150/cccccc/ffffff?text=New",
                        name: document.getElementById('alumni-name').value,
                        collegeId: document.getElementById('alumni-college-id').value,
                        profession: document.getElementById('alumni-profession').value,
                        year: parseInt(document.getElementById('alumni-year').value),
                        description: document.getElementById('alumni-desc').value,
                        linkedin: document.getElementById('alumni-linkedin').value
                    };
                    alumniData.push(newAlumnus);
                    addAlumniForm.reset();
                    saveData();
                    renderAlumni();
                    renderAdminAlumniList();
                    alert("Alumni added successfully!");
                }
            });
        }
        
        if (alumniEditList) {
            alumniEditList.addEventListener('click', (e) => {
                const target = e.target;
                const id = parseInt(target.dataset.id);
                if (target.classList.contains('remove-btn')) {
                    alumniData = alumniData.filter(alumnus => alumnus.id !== id);
                    saveData();
                    renderAdminAlumniList();
                    renderAlumni();
                    alert("Alumni removed successfully!");
                }
                if (target.classList.contains('edit-btn')) {
                    alert(`Editing alumni with ID: ${id}. (Feature to be fully implemented)`);
                }
            });
        }
    }

    // --- Footer Feedback Form Logic ---
    const feedbackToggleBtn = document.getElementById('feedback-toggle');
    const feedbackFormContainer = document.getElementById('feedback-form-container');
    const feedbackForm = document.getElementById('feedback-form');
    
    if (feedbackToggleBtn) {
        feedbackToggleBtn.addEventListener('click', () => {
            feedbackFormContainer.style.display = feedbackFormContainer.style.display === 'block' ? 'none' : 'block';
        });
    }

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const feedbackText = document.getElementById('feedback-text').value;
            console.log(`Simulating sending feedback to himanshumakwana.tech@gmail.com: ${feedbackText}`);
            alert("Feedback successfully submitted! Thank you for your comments.");
            feedbackForm.reset();
            feedbackFormContainer.style.display = 'none';
        });
    }
});
