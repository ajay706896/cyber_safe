document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Close mobile menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header .nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 100) { // 100px offset
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // --- ScrollReveal Animations ---
    if (typeof ScrollReveal !== 'undefined') {
        const sr = ScrollReveal({
            reset: false, // Animations only play once
            distance: '60px',
            duration: 1500,
            delay: 200,
            easing: 'ease-out'
        });

        // Hero animation
        sr.reveal('.reveal', { origin: 'bottom', interval: 100 });
        sr.reveal('.reveal-hero-title', { origin: 'top', duration: 2000, delay: 300 });
        
    } else {
        console.warn('ScrollReveal library not loaded. Animations disabled.');
        // Fallback: make all elements visible
        document.querySelectorAll('.reveal').forEach(el => el.style.visibility = 'visible');
    }
    
    // --- Quiz Logic ---
    const quizData = [
        {
            question: "What is 'phishing'?",
            options: [
                "A type of fishing sport.",
                "A secure way to store passwords.",
                "A fraudulent attempt to obtain sensitive information (like passwords or credit card details) by disguising as a trustworthy entity.",
                "A software that protects your computer from viruses."
            ],
            answer: "A fraudulent attempt to obtain sensitive information (like passwords or credit card details) by disguising as a trustworthy entity."
        },
        {
            question: "What does 'HTTPS' stand for?",
            options: [
                "HyperText Transfer Protocol Secure",
                "High-Tech Transfer Protocol Standard",
                "Hyperlink Text Transfer Page Service",
                "Home Transfer Protection System"
            ],
            answer: "HyperText Transfer Protocol Secure"
        },
        {
            question: "Which of the following is the STRONGEST password?",
            options: [
                "Password123",
                "MyDogFluffy",
                "12345678",
                "qE!8k$zW2@pL"
            ],
            answer: "qE!8k$zW2@pL"
        },
        {
            question: "What is 2FA (Two-Factor Authentication)?",
            options: [
                "A password that is twice as long.",
                "An extra layer of security that requires a second form of verification.",
                "A type of computer virus.",
                "A social media platform."
            ],
            answer: "An extra layer of security that requires a second form of verification."
        },
        {
            question: "What is the main purpose of a VPN (Virtual Private Network)?",
            options: [
                "To make your internet connection faster.",
                "To block all advertisements.",
                "To encrypt your internet traffic and hide your IP address.",
                "To get free access to streaming services."
            ],
            answer: "To encrypt your internet traffic and hide your IP address."
        },
        {
            question: "An email from your CEO asks you to urgently buy gift cards for a client. What should you do?",
            options: [
                "Reply to the email to confirm the amount.",
                "Buy the gift cards immediately to be helpful.",
                "Independently verify the request by calling your CEO or asking a manager in person.",
                "Forward the email to the client."
            ],
            answer: "Independently verify the request by calling your CEO or asking a manager in person."
        },
        {
            question: "What is 'malware' short for?",
            options: [
                "Malicious Hardware",
                "Malicious Software",
                "Malevolent Warfare",
                "Many Wares"
            ],
            answer: "Malicious Software"
        },
        {
            question: "What is a 'DDoS' attack?",
            options: [
                "An attempt to overwhelm a server with traffic from many sources.",
                "A way to download data securely.",
                "A type of physical security breach.",
                "A new brand of antivirus software."
            ],
            answer: "An attempt to overwhelm a server with traffic from many sources."
        }
    ];

    const quizContainer = document.getElementById('quiz-container');
    const scoreContainer = document.getElementById('score-container');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const retryBtn = document.getElementById('retry-btn');
    const scoreText = document.getElementById('score-text');
    const scoreFeedback = document.getElementById('score-feedback');

    let currentQuestion = 0;
    let score = 0;
    let userAnswers = [];

    function loadQuiz() {
        // Clear previous options
        optionsContainer.innerHTML = '';
        
        const currentQuizData = quizData[currentQuestion];
        questionText.innerText = currentQuizData.question;

        // Create and shuffle options
        const shuffledOptions = [...currentQuizData.options].sort(() => Math.random() - 0.5);

        shuffledOptions.forEach((option, index) => {
            const optionId = `option-${index}`;
            const optionElement = document.createElement('div');
            optionElement.classList.add('quiz-option');
            optionElement.innerHTML = `
                <input type="radio" name="quiz-option" id="${optionId}" value="${option}">
                <label for="${optionId}" class="w-full block cursor-pointer">${option}</label>
            `;
            optionsContainer.appendChild(optionElement);
        });

        // Manage button visibility
        if (currentQuestion === quizData.length - 1) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }
    }

    function getSelectedAnswer() {
        const selected = document.querySelector('input[name="quiz-option"]:checked');
        return selected ? selected.value : null;
    }

    function showScore() {
        quizContainer.classList.add('hidden');
        scoreContainer.classList.remove('hidden');

        scoreText.innerText = `You Scored ${score} out of ${quizData.length}`;

        let feedback = '';
        const percentage = (score / quizData.length) * 100;
        if (percentage === 100) {
            feedback = "Flawless! You're a cybersecurity expert!";
            scoreText.classList.add('text-neon-green');
        } else if (percentage >= 75) {
            feedback = "Great job! You have a solid understanding of online safety.";
            scoreText.classList.add('text-neon-blue');
        } else if (percentage >= 50) {
            feedback = "Good effort! A little more review will make you a pro.";
            scoreText.classList.add('text-yellow-400');
        } else {
            feedback = "Don't worry! Review the sections on this site and try again. Practice makes perfect!";
            scoreText.classList.add('text-red-500');
        }
        scoreFeedback.innerText = feedback;
    }

    function handleNext() {
        const answer = getSelectedAnswer();
        if (answer) {
            if (answer === quizData[currentQuestion].answer) {
                score++;
            }
            userAnswers.push(answer);
            currentQuestion++;
            if (currentQuestion < quizData.length) {
                loadQuiz();
            }
        } else {
            // Simple validation: You could replace this with a modal
            alert('Please select an answer before proceeding.');
        }
    }

    function handleSubmit() {
        const answer = getSelectedAnswer();
         if (answer) {
            if (answer === quizData[currentQuestion].answer) {
                score++;
            }
            userAnswers.push(answer);
            showScore();
         } else {
            alert('Please select an answer to submit.');
         }
    }
    
    function handleRetry() {
        currentQuestion = 0;
        score = 0;
        userAnswers = [];
        scoreContainer.classList.add('hidden');
        quizContainer.classList.remove('hidden');
        scoreText.classList.remove('text-neon-green', 'text-neon-blue', 'text-yellow-400', 'text-red-500');
        loadQuiz();
    }

    // Check if all elements exist before adding listeners
    if (quizContainer && scoreContainer && questionText && optionsContainer && nextBtn && submitBtn && retryBtn && scoreText && scoreFeedback) {
        nextBtn.addEventListener('click', handleNext);
        submitBtn.addEventListener('click', handleSubmit);
        retryBtn.addEventListener('click', handleRetry);

        // Initial load
        loadQuiz();
    } else {
        console.warn('Quiz elements not found. Quiz functionality may be broken.');
    }
});
