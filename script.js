document.addEventListener('DOMContentLoaded', () => {
    // DOM Element References
    const questionTextEl = document.getElementById('question-text');
    const optionABtn = document.getElementById('option-a-btn');
    const optionBBtn = document.getElementById('option-b-btn');
    const optionsContainer = document.getElementById('options-container');
    const resultsContainer = document.getElementById('results-container');
    const resultsTextEl = document.getElementById('results-text');
    const nextBtn = document.getElementById('next-btn');
    const shareBtn = document.getElementById('share-btn');

    // State
    let questions = [];
    let currentQuestion = {};
    let usedQuestionIndices = new Set();

    // Fetch questions from the JSON file
    async function loadQuestions() {
        try {
            const response = await fetch('would_you_rather_gemini2.5pro.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            questions = await response.json();
            displayRandomQuestion();
        } catch (error) {
            questionTextEl.textContent = 'Failed to load questions. Please try refreshing the page.';
            console.error('Error loading questions:', error);
        }
    }

    // Get a random question that hasn't been used yet
    function getRandomQuestion() {
        if (usedQuestionIndices.size >= questions.length) {
            // Reset if all questions have been shown
            usedQuestionIndices.clear();
        }

        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * questions.length);
        } while (usedQuestionIndices.has(randomIndex));
        
        usedQuestionIndices.add(randomIndex);
        return questions[randomIndex];
    }

    // Display a new question and reset UI
    function displayRandomQuestion() {
        currentQuestion = getRandomQuestion();
        if (!currentQuestion) return;

        questionTextEl.textContent = "Would you rather...";
        optionABtn.textContent = currentQuestion.option_a;
        optionBBtn.textContent = currentQuestion.option_b;

        // Reset UI state
        optionsContainer.classList.remove('hidden');
        resultsContainer.classList.add('hidden');
        nextBtn.disabled = true;
        shareBtn.disabled = false; // Enable share button with new question
    }
    
    // Handle user's choice
    function handleOptionClick() {
        // Generate a random vote split
        const percentA = Math.floor(Math.random() * 81) + 10; // Random number between 10 and 90
        const percentB = 100 - percentA;

        resultsTextEl.textContent = `${percentA}% chose Option A, while ${percentB}% chose Option B!`;

        // Update UI
        optionsContainer.classList.add('hidden');
        resultsContainer.classList.remove('hidden');
        nextBtn.disabled = false;
    }

    // Handle sharing the current question
    async function shareQuestion() {
        const shareText = `Would you rather "${currentQuestion.option_a}" or "${currentQuestion.option_b}"? \n\nAnswer this and more at: ${window.location.href}`;
        try {
            await navigator.clipboard.writeText(shareText);
            
            // Provide user feedback
            const originalText = shareBtn.textContent;
            shareBtn.textContent = 'Copied!';
            setTimeout(() => {
                shareBtn.textContent = originalText;
            }, 2000);

        } catch (err) {
            console.error('Failed to copy: ', err);
            alert('Could not copy to clipboard. Please share manually.');
        }
    }

    // Event Listeners
    optionABtn.addEventListener('click', handleOptionClick);
    optionBBtn.addEventListener('click', handleOptionClick);
    nextBtn.addEventListener('click', displayRandomQuestion);
    shareBtn.addEventListener('click', shareQuestion);

    // Initial Load
    loadQuestions();
});