import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs, onSnapshot, orderBy, query, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
document.getElementById('nannyBookingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('nanny-profile').style.display = 'block';
});

document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('responseMessage').textContent = 'Thank you for your message! We will get back to you soon.';
});

// Function to handle physical fitness program registration
document.getElementById('physicalFitnessForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/physical-fitness-register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.text();
        document.getElementById('registrationResponse').textContent = result;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('registrationResponse').textContent = 'An error occurred. Please try again.';
    }
});

// Functions to view schedules
function viewYogaSchedule() {
    alert('Redirecting to the Yoga schedule...');
    // You can redirect to a schedule page or open a modal
}

function viewStrengthSchedule() {
    alert('Redirecting to the Strength Training schedule...');
    // You can redirect to a schedule page or open a modal
}

function viewCardioSchedule() {
    alert('Redirecting to the Cardio schedule...');
    // You can redirect to a schedule page or open a modal
}
// Function to generate the calendar
function generateCalendar() {
    const calendar = document.getElementById('calendar');
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendar.innerHTML = ''; // Clear the calendar

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;

        // Mark today's date
        if (date.toDateString() === today.toDateString()) {
            dayElement.classList.add('active');
        }

        calendar.appendChild(dayElement);
    }
}

// Function to handle streak logging
document.getElementById('streakLogForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/log-streak', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.text();
        document.getElementById('logResponse').textContent = result;
        generateCalendar(); // Refresh the calendar
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('logResponse').textContent = 'An error occurred. Please try again.';
    }
});

// Initialize the calendar when the page loads
window.onload = generateCalendar;
