// DOM Elements
const navItems = document.querySelectorAll('.nav-links li');
const views = document.querySelectorAll('.view-section');
const apiKeyInput = document.getElementById('api-key');
const openaiKeyInput = document.getElementById('openai-key');
const saveKeyBtn = document.getElementById('save-key-btn');

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

// Image Generator Elements
const imagePrompt = document.getElementById('image-prompt');
const generateImageBtn = document.getElementById('generate-image-btn');
const imageResults = document.getElementById('image-results');
const imageLoader = document.getElementById('image-loader');
const imageContent = document.getElementById('image-content');

// Copy Buttons
const copyButtons = document.querySelectorAll('.btn-copy');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Load saved API keys
    const savedKey = localStorage.getItem('openrouter_key');
    if (savedKey) {
        apiKeyInput.value = savedKey;
    }
    const savedOpenAIKey = localStorage.getItem('openai_key');
    if (savedOpenAIKey) {
        openaiKeyInput.value = savedOpenAIKey;
    }

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

    // Save API Keys
    saveKeyBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        const openaiKey = openaiKeyInput.value.trim();
        localStorage.setItem('openrouter_key', key);
        localStorage.setItem('openai_key', openaiKey);
        
        // Simple visual feedback
        const originalText = saveKeyBtn.innerText;
        saveKeyBtn.innerText = 'Saved!';
        saveKeyBtn.style.background = '#ff8fa3';
        saveKeyBtn.style.color = 'white';
        setTimeout(() => {
            saveKeyBtn.innerText = originalText;
            saveKeyBtn.style.background = 'white';
            saveKeyBtn.style.color = '#c9184a';
        }, 2000);
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
            const response = await fetchOpenRouter(prompt);
            ideasContent.innerHTML = response;
        } catch (error) {
            ideasContent.innerHTML = `<p style="color: red;">Error: ${error.message}. <br><br>If you don't have an API key, here's a simulated response:</p>
            <h3>1. The "I Can't Even" Reel</h3>
            <ul>
                <li><strong>Visual:</strong> Molly staring blankly at the camera while ignoring a command.</li>
                <li><strong>Hook:</strong> "When your human says 'sit' but you're a Westie..."</li>
                <li><strong>Caption:</strong> The Westitude is strong today. 🙄 Anybody else have a dog that selective-hears? #westitude</li>
                <li><strong>Audio:</strong> Funny/sarcastic trending sound.</li>
            </ul>`;
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
            const response = await fetchOpenRouter(prompt);
            repliesContent.innerHTML = `<h3>Suggested Replies:</h3>${response}`;
        } catch (error) {
            repliesContent.innerHTML = `<p style="color: red;">Error: ${error.message}. <br><br>Simulated response:</p>
            <h3>Suggested Replies:</h3>
            <ol>
                <li>Aww thank you! She knows she's cute and totally uses it to her advantage! 😂🐾</li>
                <li>Molly says: *boop*! Thanks for the love! 🥰</li>
                <li>She's a Westie, so the fluff is 90% attitude! 🤣 Thanks for commenting!</li>
            </ol>`;
        }

        repliesLoader.classList.add('hidden');
        repliesContent.classList.remove('hidden');
        generateRepliesBtn.disabled = false;
    });

    // Generate Image Logic
    generateImageBtn.addEventListener('click', async () => {
        const promptText = imagePrompt.value.trim();
        if (!promptText) return alert("Please enter a description first! 🐾");

        generateImageBtn.disabled = true;
        imageResults.classList.remove('hidden');
        imageLoader.classList.remove('hidden');
        imageContent.innerHTML = '';
        imageContent.classList.add('hidden');

        try {
            const imageUrl = await fetchOpenAIImage(promptText);
            imageContent.innerHTML = `<img src="${imageUrl}" alt="Generated Image of Molly" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" />
            <p style="margin-top:15px;"><a href="${imageUrl}" target="_blank" class="btn-secondary" style="text-decoration:none;">Open Full Size</a></p>`;
        } catch (error) {
            imageContent.innerHTML = `<p style="color: red;">Error: ${error.message}. <br><br>Make sure you saved a valid OpenAI API key!</p>`;
        }

        imageLoader.classList.add('hidden');
        imageContent.classList.remove('hidden');
        generateImageBtn.disabled = false;
    });
});

// Helper function to call OpenRouter
async function fetchOpenRouter(prompt) {
    const apiKey = localStorage.getItem('openrouter_key');
    if (!apiKey) {
        throw new Error("No OpenRouter API key found. Please save it in the settings.");
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": \`Bearer \${apiKey}\`,
            "HTTP-Referer": "http://localhost:8080",
            "X-Title": "Mollys Hub",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "meta-llama/llama-3-8b-instruct:free",
            "messages": [
                {"role": "user", "content": prompt}
            ]
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to fetch from OpenRouter");
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// Helper function to call OpenAI DALL-E
async function fetchOpenAIImage(prompt) {
    const apiKey = localStorage.getItem('openai_key');
    if (!apiKey) {
        throw new Error("No OpenAI API key found. Please save it in the settings.");
    }

    const fullPrompt = `A cute, slightly stubborn West Highland Terrier dog named Molly (white fluffy fur). ${prompt}. Beautiful lighting, high quality, instagram style photography.`;

    const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
            "Authorization": \`Bearer \${apiKey}\`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "dall-e-3",
            "prompt": fullPrompt,
            "n": 1,
            "size": "1024x1024"
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to fetch from OpenAI");
    }

    const data = await response.json();
    return data.data[0].url;
}