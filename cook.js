import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs, onSnapshot, orderBy, query, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔹 AI Recipe Generator (Using Groq API)
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("generateRecipe").addEventListener("click", async () => {
        const recipeQuery = document.getElementById("recipeQuery").value.trim();

        if (!recipeQuery) {
            alert("Please enter a dish name!");
            return;
        }

        document.getElementById("recipeResult").innerHTML = "⏳ Generating recipe...";

        const apiKey = "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"; // Replace with your actual API key
        const apiUrl = "https://api.groq.com/openai/v1/chat/completions";  

        const requestBody = {
            model: "llama3-8b-8192",
            messages: [{ role: "user", content: `Generate a recipe for: ${recipeQuery}` }],
            max_tokens: 500,
        };

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const recipeText = data.choices?.[0]?.message?.content || "⚠️ No recipe found!";
            
            // Call the typewriter effect function
            typeWriterEffect(recipeText);
        } catch (error) {
            console.error("❌ Error fetching AI recipe:", error);
            document.getElementById("recipeResult").innerHTML = "⚠️ Failed to generate recipe!";
        }
    });

    function typeWriterEffect(text) {
        const resultElement = document.getElementById("recipeResult");
        resultElement.innerHTML = ""; // Clear previous content
        let index = 0;
        const speed = 30; // Speed in milliseconds

        function type() {
            if (index < text.length) {
                const char = text[index] === "\n" ? "<br>" : text[index]; // Handle line breaks
                resultElement.innerHTML += char;
                index++;
                setTimeout(type, speed);
            }
        }
        type();
    }
});

// ✅ Post a Recipe and Ensure It Appears in "Community Recipes"
document.getElementById("postRecipe").addEventListener("click", async () => {
    const title = document.getElementById("recipeTitle").value.trim();
    const content = document.getElementById("recipeContent").value.trim();

    if (!title || !content) {
        alert("Please fill in all fields before posting!");
        return;
    }

    try {
        await addDoc(collection(db, "recipes"), { 
            title, 
            content, 
            timestamp: new Date() 
        });

        alert("Recipe posted successfully!");

        // Clear input fields after posting
        document.getElementById("recipeTitle").value = "";
        document.getElementById("recipeContent").value = "";

    } catch (error) {
        console.error("Error posting recipe:", error);
        alert("Failed to post recipe. Try again later.");
    }
});

// ✅ Fetch & Display Recipes in "Community Recipes" Section
const fetchRecipes = () => {
    const recipesList = document.getElementById("recipesList");

    if (!recipesList) {
        console.error("❌ Error: Community Recipes section not found in HTML!");
        return;
    }

    recipesList.innerHTML = "⏳ Loading recipes..."; // Show loading message

    const q = query(collection(db, "recipes"), orderBy("timestamp", "desc"));

    onSnapshot(q, (snapshot) => {
        recipesList.innerHTML = ""; // Clear the list before updating

        if (snapshot.empty) {
            recipesList.innerHTML = "⚠️ No recipes available yet!";
            return;
        }

        snapshot.forEach((docSnapshot) => {
            const recipe = docSnapshot.data();
            const recipeId = docSnapshot.id;

            const recipeElement = document.createElement("div");
            recipeElement.classList.add("recipe-item");
            recipeElement.id = `recipe-${recipeId}`;

            recipeElement.innerHTML = `
                <h3>${recipe.title}</h3>
                <p>${recipe.content}</p>
            `;

            recipesList.appendChild(recipeElement);
        });
    });
};




// ✅ Fetch recipes on page load
fetchRecipes();

// 🔹 Ask the Community (Save Request to Firestore)
document.getElementById("submitRequest").addEventListener("click", async () => {
    const requestTitle = document.getElementById("recipeRequestTitle").value;
    const requestContent = document.getElementById("recipeRequestContent").value;

    if (!requestTitle || !requestContent) {
        alert("Please fill in all fields before submitting!");
        return;
    }

    try {
        await addDoc(collection(db, "recipeRequests"), {
            title: requestTitle,
            content: requestContent,
            timestamp: new Date(),
        });

        alert("Request submitted successfully!");
        document.getElementById("recipeRequestTitle").value = "";
        document.getElementById("recipeRequestContent").value = "";
    } catch (error) {
        console.error("Error submitting request:", error);
        alert("Failed to submit request. Try again later.");
    }
});

// 🔹 SEARCH FUNCTION
document.getElementById("searchRecipe").addEventListener("click", async () => {
    const searchQuery = document.getElementById("searchQuery").value.trim().toLowerCase();

    if (!searchQuery) {
        alert("Please enter a recipe name to search!");
        return;
    }

    const searchResult = document.getElementById("searchResult");
    searchResult.innerHTML = "🔍 Searching...";

    try {
        const querySnapshot = await getDocs(collection(db, "recipes"));
        
        let foundRecipes = [];
        querySnapshot.forEach((docSnapshot) => {
            const recipe = docSnapshot.data();
            if (recipe.title.toLowerCase().includes(searchQuery)) {
                foundRecipes.push(recipe);
            }
        });

        searchResult.innerHTML = "";
        if (foundRecipes.length === 0) {
            searchResult.innerHTML = "⚠️ No recipes found!";
            return;
        }

        foundRecipes.forEach((recipe) => {
            const recipeElement = document.createElement("div");
            recipeElement.classList.add("recipe-item");
            recipeElement.innerHTML = `<h3>${recipe.title}</h3><p>${recipe.content}</p>`;
            searchResult.appendChild(recipeElement);
        });

    } catch (error) {
        console.error("❌ Error searching recipes:", error);
        searchResult.innerHTML = "⚠️ Search failed!";
    }
});

// 🔹 Fetch & Display Recipe Requests from Firestore
const fetchRequests = () => {
    const requestsList = document.getElementById("requestsList");
    if (!requestsList) return;

    onSnapshot(collection(db, "recipeRequests"), (snapshot) => {
        requestsList.innerHTML = snapshot.empty ? "⚠️ No requests available yet!" : "";
        snapshot.forEach((doc) => {
            const request = doc.data();
            requestsList.innerHTML += `<div class="request-item"><h3>${request.title}</h3><p>${request.content}</p></div>`;
        });
    });
};

// ✅ Fetch recipe requests on page load
fetchRequests();




