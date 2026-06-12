// Chatbot Script: Processes user messages and navigates based on event selection

// Function to initialize chatbot and set up event listeners
function initChatbot() {
    const chatInput = document.getElementById("user-input");
    const chatLog = document.getElementById("chat-box");
    const sendButton = document.getElementById("send-btn");

    // Event listener for sending messages
    sendButton.addEventListener("click", () => {
        const userMessage = chatInput.value.trim();
        if (userMessage) {
            addMessageToChatLog("User", userMessage);
            processChatbotResponse(userMessage);
            chatInput.value = ""; // Clear input after sending message
        }
    });

    // Optional: Send message with Enter key
    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendButton.click();
        }
    });
}

// Function to add messages to the chat log
function addMessageToChatLog(sender, message) {
    const messageElement = document.createElement("p");
    messageElement.classList.add(sender === "User" ? "user-message" : "bot-message");
    messageElement.textContent = `${sender}: ${message}`;
    document.getElementById("chat-box").appendChild(messageElement);
    const chatBox = document.getElementById("chat-box");
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}

// Function to handle chatbot responses and navigation
async function processChatbotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();

    // Respond to greeting and show available events
    if (lowerMessage === "hi" || lowerMessage === "hello") {
        const welcomeMessage = "Welcome to the Museum! Here are the upcoming events:\n" +
            "1. Ancient Sculptures Exhibition\n" +
            "2. Historic Paintings Showcase\n" +
            "3. Virtual Reality Museum Tour\n" +
            "4. Guided Museum Walkthrough\n" +
            "5. Photography Workshop\n" +
            "6. Interactive Art Display\n" +
            "Please enter the event number you're interested in, or type 'cancel' to exit.";
        addMessageToChatLog("Bot", welcomeMessage);

    // Handle event selection by number
    } else if (/^\d+$/.test(userMessage)) {
        const eventNumber = parseInt(userMessage);
        let eventUrl = "";

        switch (eventNumber) {
            case 1:
                eventUrl = 'Ancient_Sculptures_Exhibition.html';
                break;
            case 2:
                eventUrl = 'Historic_Paintings_Showcase.html';
                break;
            case 3:
                eventUrl = 'Virtual_Reality_Museum_Tour.html';
                break;
            case 4:
                eventUrl = 'Guided_Museum_Walkthrough.html';
                break;
            case 5:
                eventUrl = 'Photography_Workshop.html';
                break;
            case 6:
                eventUrl = 'Interactive_Art_Display.html';
                break;
            default:
                addMessageToChatLog("Bot", "Invalid event number. Please enter a number between 1 and 6.");
                return;
        }

        if (eventUrl) {
            // Redirect to event form if event is selected
            window.location.href = eventUrl;
        }

    // Provide a default response for unrecognized messages
    } else if (lowerMessage === "cancel") {
        addMessageToChatLog("Bot", "You can return to the home page anytime to view events.");
    } else {
        addMessageToChatLog("Bot", "I'm sorry, I didn't understand that. Please type 'hi' to see available events.");
    }
}

// Initialize chatbot after DOM loads
window.addEventListener("DOMContentLoaded", initChatbot);
