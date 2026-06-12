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

// Viral Analyzer Elements
const viralConcept = document.getElementById('viral-concept');
const analyzeViralBtn = document.getElementById('analyze-viral-btn');
const viralResults = document.getElementById('viral-results');
const viralLoader = document.getElementById('viral-loader');
const viralContent = document.getElementById('viral-content');

// Caption Formatter Elements
const rawCaption = document.getElementById('raw-caption');
const formatCaptionBtn = document.getElementById('format-caption-btn');

// Calendar Elements
const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const calInputs = {};
days.forEach(day => {
    calInputs[day] = document.getElementById(`cal-${day}`);
});

// Settings Elements
const mollyBrain = document.getElementById('molly-brain');
const saveSettingsBtn = document.getElementById('save-settings-btn');

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

        const brainContext = getMollyBrainContext();
        const prompt = `You are a creative Instagram manager for a cute, slightly stubborn West Highland Terrier named Molly (@mollymcsnuggles). 
${brainContext}
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

        const brainContext = getMollyBrainContext();
        const prompt = `You are Molly the West Highland Terrier's persona (@mollymcsnuggles). A follower just commented: "${comment}". 
${brainContext}
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

    // Viral Analyzer Logic
    analyzeViralBtn.addEventListener('click', async () => {
        const concept = viralConcept.value.trim();
        if (!concept) return alert("Please describe your viral reel first! 📈");

        analyzeViralBtn.disabled = true;
        viralResults.classList.remove('hidden');
        viralLoader.classList.remove('hidden');
        viralContent.innerHTML = '';
        viralContent.classList.add('hidden');

        const brainContext = getMollyBrainContext();
        const prompt = `You are a viral content strategist for a West Highland Terrier named Molly (@mollymcsnuggles). 
${brainContext}
The owner had a reel go viral with this concept: "${concept}".
Analyze why this likely worked, and generate 5 specific "spin-off" reel ideas that follow the same successful formula but with a fresh twist.
Format the response in clean HTML with <h3>, <ul>, and <li> tags. Do not wrap in markdown code blocks.`;

        try {
            const response = await fetchQwen(prompt);
            viralContent.innerHTML = response.replace(/```html/g, '').replace(/```/g, '');
        } catch (error) {
            viralContent.innerHTML = `<p style="color: red;">Error: ${error.message}. <br><br>Make sure the VPS is running!</p>`;
        }

        viralLoader.classList.add('hidden');
        viralContent.classList.remove('hidden');
        analyzeViralBtn.disabled = false;
    });

    // Caption Formatter Logic
    formatCaptionBtn.addEventListener('click', () => {
        const text = rawCaption.value;
        if (!text) return alert("Please write a caption first! 📝");
        
        // Replace empty lines with the Braille Pattern Blank (invisible character \u2800)
        // Instagram respects this and won't collapse the lines.
        const formattedText = text.replace(/(?:\r\n|\r|\n)(?:\s*(?:\r\n|\r|\n))+/g, '\n\u2800\n');
        
        navigator.clipboard.writeText(formattedText).then(() => {
            const originalHTML = formatCaptionBtn.innerHTML;
            formatCaptionBtn.innerHTML = '<i class="fa-solid fa-check"></i> Formatted & Copied!';
            formatCaptionBtn.style.background = '#4CAF50';
            setTimeout(() => {
                formatCaptionBtn.innerHTML = originalHTML;
                formatCaptionBtn.style.background = ''; // reset to default
            }, 2000);
        });
    });

    // Calendar Logic (Load & Save)
    days.forEach(day => {
        const input = calInputs[day];
        if (!input) return;
        // Load existing
        const saved = localStorage.getItem(`molly_cal_${day}`);
        if (saved) input.value = saved;

        // Auto-save on type
        input.addEventListener('input', () => {
            localStorage.setItem(`molly_cal_${day}`, input.value);
        });
    });

    // Molly Brain Logic (Load & Save)
    const savedBrain = localStorage.getItem('molly_brain');
    if (savedBrain) {
        mollyBrain.value = savedBrain;
    }

    saveSettingsBtn.addEventListener('click', () => {
        localStorage.setItem('molly_brain', mollyBrain.value);
        const originalHTML = saveSettingsBtn.innerHTML;
        saveSettingsBtn.innerHTML = '<i class="fa-solid fa-check"></i> Saved!';
        saveSettingsBtn.style.background = '#4CAF50';
        setTimeout(() => {
            saveSettingsBtn.innerHTML = originalHTML;
            saveSettingsBtn.style.background = ''; // reset
        }, 2000);
    });
});

// Helper function to inject Molly Brain
function getMollyBrainContext() {
    const saved = localStorage.getItem('molly_brain');
    if (saved && saved.trim() !== '') {
        return `Background info: ${saved.trim()}`;
    }
    return `Background info: Molly lives in Malta 🇲🇹. Her vibe is "One part marshmallow, two parts menace 🐾", known for "daily Westie chaos".`;
}

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