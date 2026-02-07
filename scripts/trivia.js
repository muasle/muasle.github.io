document.addEventListener("DOMContentLoaded", () => {
    const questionText = document.getElementById('question-text');
    const answerInput = document.getElementById('answer-input');
    const submitBtn = document.getElementById('submit-btn');
    const messageDisplay = document.getElementById('message');
    // FIX: Change 'next-lvl-btn' to 'next-btn' to match your HTML
    const nextBtn = document.getElementById('next-btn'); 

    const questions = [
        { q: "What month is our anniversary?", correct: ["November", "november"] },
        { q: "What movie did we watch on our second date?", correct: ["Spirited Away", "spirited away"] },
        { q: "How many letters are in the word 'Goose'", correct: ["Five", "five", "5"] },
        { q: "What is my favorite color?", correct: ["Green", "green"] },
        { q: "What was the name of the first apartment we lived in together?", correct: ["Collegian", "collegian", "The Collegian", "The collegian", "the collegian"] },
        { q: "What type of animal did we find at the beach when you visited Coos Bay?", correct: ["starfish", "Starfish", "a starfish", "A starfish", "A purple starfish", "a purple starfish", "Purple Starfish", "purple starfish"] },
        { q: "What is Pixel's favorite color?", correct: ["Pink", "pink"] },
        { q: "What was the first non-classical concert we went to together?", correct: ["Mitski", "mitski"] },
        { q: "Do you love me?", correct: ["Yes", "yes", "y", "Y"] },
        { q: "Will you be my valentine?", correct: ["Yes", "yes", "y", "Y"] }
    ];

    let currentQuestionIndex = 0;
    let isProcessing = false;

    function showQuestion() {
        isProcessing = false;
        answerInput.value = ""; 
        answerInput.style.borderColor = "#fc6dab"; 
        questionText.innerText = questions[currentQuestionIndex].q;
        answerInput.focus();
    }

    function checkAnswer() {
        if (isProcessing) return;

        const userSnapshot = answerInput.value.trim().toLowerCase();
    
        // 1. Get the array of correct answers
        const acceptableAnswers = questions[currentQuestionIndex].correct;

        // 2. Check if the user's answer (lowercase) matches any correct answer (lowercase)
        const isCorrect = acceptableAnswers.some(ans => ans.toLowerCase() === userSnapshot);

        if (isCorrect) {
            isProcessing = true;
            messageDisplay.textContent = "Correct! ✨";
            answerInput.style.borderColor = "#538d4e"; 
        
            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    messageDisplay.textContent = "";
                    showQuestion();
                } else {
                    showWin();
                }
            }, 1000);
        } else {
            messageDisplay.textContent = "Try again! ❌";
            answerInput.style.borderColor = "#ff57a0";
            answerInput.select(); 
        }
    }

    submitBtn.onclick = checkAnswer;

    answerInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") checkAnswer();
    });

    // ... (rest of your existing code above) ...

    function showWin() {      
        // Hide the box so it looks clean while loading
        document.getElementById('question-box').style.display = "none";

        // Immediate redirect to your final page
        window.location.href = "slideshow.html";
    }

    // You can keep this as a backup, but it's no longer strictly needed 
    // since showWin now handles the redirect automatically.
    if (nextBtn) {
        nextBtn.onclick = () => {
            window.location.href = "slideshow.html";
        };
    }

    // Start the game immediately
    showQuestion();
});