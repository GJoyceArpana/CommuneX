const API_KEY = "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"; // Replace with your actual API key
const API_URL = "https://api.groq.com/openai/v1/chat/completions"; // Correct Groq API endpoint

async function fetchAIResponse(prompt) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", // Correct model name
                messages: [
                    { "role": "system", "content": "You are a helpful assistant for creating diet and workout plans." },
                    { "role": "user", "content": prompt }
                ],
                temperature: 1,
                max_tokens: 1024,
                top_p: 1
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Full API Response:", data);

        // Extract and return the AI-generated response
        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content.trim();
        } else {
            throw new Error("Unexpected API response format");
        }

    } catch (error) {
        console.error("Error fetching AI response:", error);
        return "Error: Could not fetch AI response. Check console for details.";
    }
}

async function generatePlan() {
    let userInput = document.getElementById("userInput").value;

    if (userInput.trim() === "") {
        alert("Please enter your fitness needs.");
        return;
    }

    let dietPrompt = `Based on the user input, form a proper diet plan:\n${userInput}`;
    let workoutPrompt = `Based on the user input, form a proper workout plan:\n${userInput}`;

    try {
        console.log("Fetching AI-generated diet plan...");
        let dietPlan = await fetchAIResponse(dietPrompt);
        console.log("Diet Plan Response:", dietPlan);

        console.log("Fetching AI-generated workout plan...");
        let workoutPlan = await fetchAIResponse(workoutPrompt);
        console.log("Workout Plan Response:", workoutPlan);

        function formatAndDisplay(text, elementId, title) {
            let outputElement = document.getElementById(elementId);
            outputElement.innerHTML = ""; // Clear previous content

            // Add title for section
            let titleElement = document.createElement("h3");
            titleElement.textContent = title;
            titleElement.style.color = "white"; // Ensure visibility on dark background
            titleElement.style.marginBottom = "10px";
            outputElement.appendChild(titleElement);

            // Split text into paragraphs
            let paragraphs = text.split("\n\n").map(p => p.trim()).filter(p => p !== ""); 

            paragraphs.forEach(paragraph => {
                let p = document.createElement("p");
                p.textContent = paragraph;
                p.style.marginBottom = "12px"; // Space between paragraphs
                p.style.textAlign = "justify"; // Proper text alignment
                p.style.padding = "10px";
                p.style.background = "rgba(255, 255, 255, 0.1)"; // Light background for readability
                p.style.borderRadius = "8px"; // Rounded corners
                p.style.lineHeight = "1.5"; // Better readability
                outputElement.appendChild(p);
            });
        }

        formatAndDisplay(dietPlan, "dietPlan", "🍽️ Personalized Diet Plan");
        formatAndDisplay(workoutPlan, "workoutPlan", "💪 Personalized Workout Plan");

    } catch (error) {
        console.error("Error fetching AI response:", error);
        alert("Something went wrong! Check the console for details.");
    }
}

// Function to schedule group fitness activities
function scheduleActivity() {
    let activity = document.getElementById("activity").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;

    if (activity.trim() === "" || date.trim() === "" || time.trim() === "") {
        alert("Please enter all details to schedule an activity.");
        return;
    }

    let activityList = document.getElementById("activityList");
    let listItem = document.createElement("li");
    listItem.textContent = `${activity} - ${date} at ${time}`;
    
    activityList.appendChild(listItem);

    // Clear input fields after scheduling
    document.getElementById("activity").value = "";
    document.getElementById("date").value = "";
    document.getElementById("time").value = "";
}
