// DOM Elements
const navItems = document.querySelectorAll('.nav-links li');
const views = document.querySelectorAll('.view-section');

// Login Elements
const loginScreen = document.getElementById('login-screen');
const mainApp = document.getElementById('main-app');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');

// Idea Engine Elements
const ideaTheme = document.getElementById('idea-theme');
const generateIdeasBtn = document.getElementById('generate-ideas-btn');
const ideasResults = document.getElementById('ideas-results');
const ideasLoader = document.getElementById('ideas-loader');
const ideasContent = document.getElementById('ideas-content');

// Comment Assistant Elements
const followerComment = document.getElementById('follower-comment');
const generateRepliesBtn = document.getElementById('generate-replies-btn');
const repliesResults = document.getElementById('replies-results');
const repliesLoader = document.getElementById('replies-loader');
const repliesContent = document.getElementById('replies-content');

// Copy Buttons
const copyButtons = document.querySelectorAll('.btn-copy');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    
    // Login Logic
    loginBtn.addEventListener('click', () => {
        const user = usernameInput.value.trim();
        const pass = passwordInput.value;
        if (user === 'mollymcsnuggles' && pass === 'Enton123!') {
            loginScreen.classList.add('hidden');
            mainApp.classList.remove('hidden');
        } else {
            loginError.classList.remove('hidden');
        }
    });

    // Also allow 'Enter' key to login
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });

    // Navigation Logic
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Update active nav
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Show target view
            const targetId = item.getAttribute('data-view');
            views.forEach(view => {
                if (view.id === targetId) {
                    view.classList.add('active');
                    view.classList.remove('hidden');
                } else {
                    view.classList.remove('active');
                    view.classList.add('hidden');
                }
            });
        });
    });

    // Copy Hashtags
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const textToCopy = document.getElementById(targetId).innerText;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                btn.style.background = 'rgba(201, 24, 74, 0.2)';
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = 'rgba(201, 24, 74, 0.1)';
                }, 2000);
            });
        });
    });

    // Generate Ideas Logic
    generateIdeasBtn.addEventListener('click', async () => {
        const theme = ideaTheme.value.trim();
        if (!theme) return alert("Please enter a theme first! 🐾");

        generateIdeasBtn.disabled = true;
        ideasResults.classList.remove('hidden');
        ideasLoader.classList.remove('hidden');
        ideasContent.innerHTML = '';
        ideasContent.classList.add('hidden');

        const prompt = `You are a creative Instagram manager for a cute, slightly stubborn West Highland Terrier named Molly (@mollymcsnuggles). 
Background info: Molly lives in Malta 🇲🇹. Her vibe is "One part marshmallow, two parts menace 🐾", known for "daily Westie chaos".
The owner needs content ideas based on this theme: "${theme}".
Generate 3 specific post/reel ideas. For each idea, provide:
1. Concept/Visual (What happens in the video/photo)
2. Hook (Text on screen to grab attention)
3. Caption draft
4. Suggested Audio vibe

Format the response in clean HTML with <h3>, <ul>, <li> tags. Do not wrap in markdown code blocks.`;

        try {
            const response = await fetchQwen(prompt);
            // Qwen might return markdown formatting, so let's strip out the raw ```html tags if it does
            ideasContent.innerHTML = response.replace(/```html/g, '').replace(/```/g, '');
        } catch (error) {
            ideasContent.innerHTML = `<p style="color: red;">Error: ${error.message}. <br><br>Make sure the VPS is running!</p>`;
        }

        ideasLoader.classList.add('hidden');
        ideasContent.classList.remove('hidden');
        generateIdeasBtn.disabled = false;
    });

    // Generate Replies Logic
    generateRepliesBtn.addEventListener('click', async () => {
        const comment = followerComment.value.trim();
        if (!comment) return alert("Please enter a comment first! 🐾");

        generateRepliesBtn.disabled = true;
        repliesResults.classList.remove('hidden');
        repliesLoader.classList.remove('hidden');
        repliesContent.innerHTML = '';
        repliesContent.classList.add('hidden');

        const prompt = `You are Molly the West Highland Terrier's persona (@mollymcsnuggles). A follower just commented: "${comment}". 
Molly's Background: She lives in Malta 🇲🇹, her vibe is "One part marshmallow, two parts menace", and she brings "daily Westie chaos".
Generate 3 different fun, engaging, and cute replies that the owner can copy-paste back to the follower. 
Make them sound like they are coming from the owner talking about Molly, or playfully from Molly herself.
Format the response in clean HTML with an ordered list <ol> and <li> tags. Do not wrap in markdown code blocks.`;

        try {
            const response = await fetchQwen(prompt);
            repliesContent.innerHTML = `<h3>Suggested Replies:</h3>${response.replace(/```html/g, '').replace(/```/g, '')}`;
        } catch (error) {
            repliesContent.innerHTML = `<p style="color: red;">Error: ${error.message}. <br><br>Make sure the VPS is running!</p>`;
        }

        repliesLoader.classList.add('hidden');
        repliesContent.classList.remove('hidden');
        generateRepliesBtn.disabled = false;
    });
});

// Helper function to call Ollama on the VPS
async function fetchQwen(prompt) {
    // The VPS IP where Ollama is hosted
    const vpsUrl = "http://37.27.90.154:11434/api/generate";

    const response = await fetch(vpsUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "qwen2.5:1.5b",
            "prompt": prompt,
            "stream": false
        })
    });

    if (!response.ok) {
        throw new Error("Failed to connect to Molly's Brain on the VPS");
    }

    const data = await response.json();
    return data.response;
}