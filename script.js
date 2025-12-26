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
    let timerInterval;
    let timeLeft = 10;

    /**
     * Parses a raw question string into an object with option_a and option_b.
     * This version is more robust and handles cases where "or" appears inside an option
     * by splitting on the last occurrence of " or ".
     */
    function parseQuestion(questionString) {
        // Remove the prefix and the trailing question mark for easier parsing
        const coreQuestion = questionString
            .replace(/^Would you rather /i, '')
            .slice(0, -1);

        // Find the index of the last " or " to robustly separate the two main options
        const splitIndex = coreQuestion.lastIndexOf(' or ');

        // If " or " is not found, or is at the very beginning/end, the question is malformed.
        if (splitIndex <= 0 || splitIndex >= coreQuestion.length - 4) {
            console.warn('Could not parse question:', questionString);
            return null;
        }

        const optionA = coreQuestion.substring(0, splitIndex).trim();
        const optionB = coreQuestion.substring(splitIndex + 4).trim(); // +4 for the length of " or "

        // A final check to make sure we got two non-empty options
        if (optionA && optionB) {
            return {
                option_a: optionA,
                option_b: optionB
            };
        }

        console.warn('Failed to extract two valid options from:', questionString);
        return null;
    }


    // Fetch questions from the JSON file and parse them
    async function loadQuestions() {
        try {
            const response = await fetch('would_you_rather_gemini2.5pro.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const rawQuestions = await response.json();
            
            // Parse the array of strings into an array of objects
            questions = rawQuestions
                .map(q => parseQuestion(q))
                .filter(q => q !== null); // Filter out any that failed to parse

            if (questions.length === 0) {
                 throw new Error('No valid questions were loaded.');
            }

            displayRandomQuestion();
        } catch (error) {
            questionTextEl.textContent = 'Failed to load questions. Please try refreshing the page.';
            console.error('Error loading questions:', error);
        }
    }

    // Get a random question that hasn't been used yet
    function getRandomQuestion() {
        if (questions.length === 0) {
            console.warn("No questions available to choose from.");
            questionTextEl.textContent = 'No questions available.';
            if(optionABtn) optionABtn.disabled = true;
            if(optionBBtn) optionBBtn.disabled = true;
            if(nextBtn) nextBtn.disabled = true;
            if(shareBtn) shareBtn.disabled = true;
            return null;
        }

        if (usedQuestionIndices.size >= questions.length) {
            // Reset if all questions have been shown
            console.log('All questions shown! Resetting...');
            usedQuestionIndices.clear();
        }

        let randomIndex;
        // Ensure questions array is not empty before entering loop to prevent infinite loop
        if (questions.length === 0) { // This check is redundant if the top check is solid, but good for safety
             console.error("Attempted to get random question from empty list after initial checks.");
             return null;
        }
        do {
            randomIndex = Math.floor(Math.random() * questions.length);
        } while (usedQuestionIndices.has(randomIndex) && usedQuestionIndices.size < questions.length);
        // The condition usedQuestionIndices.size < questions.length in do...while is important
        // to prevent infinite loop if all questions are used and somehow the reset logic fails or is bypassed.

        if (usedQuestionIndices.size < questions.length) { // Only add if we found a new question
            usedQuestionIndices.add(randomIndex);
            return questions[randomIndex];
        } else { // Should ideally be caught by the reset logic, but as a fallback
            console.warn("Could not find an unused question, though all should have been reset.");
            // Attempt to recover by clearing and picking one, or return null
            usedQuestionIndices.clear();
            if (questions.length > 0) {
                randomIndex = Math.floor(Math.random() * questions.length);
                usedQuestionIndices.add(randomIndex);
                return questions[randomIndex];
            }
            return null;
        }
    }

    // Display a new question and reset UI
    function displayRandomQuestion() {
        currentQuestion = getRandomQuestion();
        if (!currentQuestion) {
            // If getRandomQuestion returned null (no questions available),
            // ensure UI reflects this and stop further processing.
            questionTextEl.textContent = 'No more questions or error in loading.';
            optionsContainer.classList.add('hidden');
            resultsContainer.classList.add('hidden');
            if(nextBtn) nextBtn.disabled = true;
            if(shareBtn) shareBtn.disabled = true; // Also disable share if no question
            return;
        }

        questionTextEl.textContent = "Would you rather...";
        optionABtn.textContent = currentQuestion.option_a;
        optionBBtn.textContent = currentQuestion.option_b;

        // Reset UI state
        optionsContainer.classList.remove('hidden');
        resultsContainer.classList.add('hidden');
        nextBtn.disabled = true;
        shareBtn.disabled = false;
        startDecisionTimer();
    }
    
    // Handle user's choice
    function handleOptionClick() {
        stopTimer();
        // Generate a random vote split
        const percentA = Math.floor(Math.random() * 81) + 10; // Random number between 10 and 90
        const percentB = 100 - percentA;

        resultsTextEl.innerHTML = `<strong>${percentA}%</strong> chose "${currentQuestion.option_a}"<br><strong>${percentB}%</strong> chose "${currentQuestion.option_b}"`;

        // Update UI
        optionsContainer.classList.add('hidden');
        resultsContainer.classList.remove('hidden');
        nextBtn.disabled = false;
        nextBtn.focus(); // Make it easy to press Enter for the next question
    }

    // Handle sharing the current question
    async function shareQuestion() {
        const shareText = `Would you rather "${currentQuestion.option_a}" or "${currentQuestion.option_b}"? \n\nAnswer this and more at: ${window.location.href}`;
        try {
            await navigator.clipboard.writeText(shareText);
            
            // Provide user feedback
            const originalText = shareBtn.textContent;
            shareBtn.textContent = 'Copied!';
            shareBtn.style.backgroundColor = '#4caf50'; // Green feedback
            setTimeout(() => {
                shareBtn.textContent = originalText;
                shareBtn.style.backgroundColor = ''; // Revert color
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

    // Timer Functions
    function startDecisionTimer() {
        // Reset timer
        timeLeft = 10;
        document.getElementById('timer-display').textContent = timeLeft;
        document.getElementById('timer-container').style.display = 'block';
        document.querySelector('#timer-bar').style.setProperty('--progress', '100%');

        // Start countdown
        timerInterval = setInterval(() => {
            timeLeft--;
            document.getElementById('timer-display').textContent = timeLeft;

            // Update progress bar
            const percentage = (timeLeft / 10) * 100;
            document.querySelector('#timer-bar').style.setProperty('--progress', percentage + '%');

            // Timer finished
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                document.getElementById('timer-display').textContent = "Time's up!";
                // Hide timer after 2 seconds
                setTimeout(() => {
                    document.getElementById('timer-container').style.display = 'none';
                }, 2000);
            }
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        document.getElementById('timer-container').style.display = 'none';
    }

    // Initial Load
    loadQuestions();
});
