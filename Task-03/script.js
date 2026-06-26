document.addEventListener('DOMContentLoaded', () => {
  
  // STEP 1: PREMIUM CAROUSEL LOGIC WITH DOTS
  const images = document.querySelectorAll('.carousel-images img');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  let currentIndex = 0;
  let carouselTimer;

  function showImage(index) {
    images[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
    
    if (index >= images.length) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = images.length - 1;
    } else {
      currentIndex = index;
    }
    
    images[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
  }

  function startAutoSlide() {
    clearInterval(carouselTimer);
    carouselTimer = setInterval(() => showImage(currentIndex + 1), 5000);
  }

  nextBtn.addEventListener('click', () => {
    showImage(currentIndex + 1);
    startAutoSlide(); // Click par timer reset taaki user ko break mile
  });

  prevBtn.addEventListener('click', () => {
    showImage(currentIndex - 1);
    startAutoSlide();
  });

  // Dots par click toggle features
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showImage(idx);
      startAutoSlide();
    });
  });

  startAutoSlide();


  // STEP 2 (PART 2): INTUITIVE QUIZ LOGIC
  const quizData = [
    {
      question: "Which language runs inside a web browser?",
      options: ["Java", "C", "Python", "JavaScript"],
      answer: "JavaScript"
    },
    {
      question: "What does CSS stand for?",
      options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
      answer: "Cascading Style Sheets"
    },
    {
      question: "Which HTML tag is used to link a JavaScript file?",
      options: ["<script>", "<js>", "<javascript>", "<link>"],
      answer: "<script>"
    }
  ];

  let currentQuestionIndex = 0;
  let score = 0;

  const questionText = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options-container');
  const questionBox = document.getElementById('question-box');
  const resultBox = document.getElementById('result-box');
  const scoreText = document.getElementById('score-text');
  const restartBtn = document.getElementById('restart-btn');

  function loadQuiz() {
    optionsContainer.innerHTML = '';
    questionBox.classList.remove('hidden');
    resultBox.classList.add('hidden');

    const currentQuiz = quizData[currentQuestionIndex];
    questionText.innerText = currentQuiz.question;

    currentQuiz.options.forEach(option => {
      const button = document.createElement('button');
      button.innerText = option;
      button.classList.add('option-btn');
      button.addEventListener('click', (e) => handleAnswer(option, e.target));
      optionsContainer.appendChild(button);
    });
  }

  function handleAnswer(selectedOption, clickedButton) {
    const currentQuiz = quizData[currentQuestionIndex];
    const allButtons = optionsContainer.querySelectorAll('.option-btn');

    // Sabhi buttons ko block karo taaki double click na ho sake
    allButtons.forEach(btn => btn.classList.add('disabled'));

    if (selectedOption === currentQuiz.answer) {
      clickedButton.classList.add('correct');
      score++;
    } else {
      clickedButton.classList.add('incorrect');
      
      // Auto-highlight original correct answer if user clicks wrong
      allButtons.forEach(btn => {
        if (btn.innerText === currentQuiz.answer) {
          btn.classList.add('correct');
        }
      });
    }

    currentQuestionIndex++;

    // 1.2 second hold taaki user colors/animations theek se dekh sake
    setTimeout(() => {
      if (currentQuestionIndex < quizData.length) {
        loadQuiz();
      } else {
        showResults();
      }
    }, 1200);
  }

  function showResults() {
    questionBox.classList.add('hidden');
    resultBox.classList.remove('hidden');
    scoreText.innerText = `You scored ${score} out of ${quizData.length}!`;
  }

  restartBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    loadQuiz();
  });

  loadQuiz();


  // STEP 3: API FETCH LOGIC (Weather Forecast - FIX)

  const loadingText = document.getElementById('loading-text');
  const weatherDataContainer = document.getElementById('weather-data');
  const locationEl = document.getElementById('location');
  const tempEl = document.getElementById('temperature');
  const conditionEl = document.getElementById('condition');
  const refreshBtn = document.getElementById('refresh-btn');

  async function fetchWeather() {
    // 1. Pehle data ko hide karo aur spinner ko screen par lao
    weatherDataContainer.classList.add('hidden');
    loadingText.classList.remove('hidden');

    try {
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current_weather=true');
      if (!response.ok) throw new Error('Data breakdown error');
      
      const data = await response.json();
      
      // 2. Data elements ko screen par update karo
      locationEl.innerText = "London, UK";
      tempEl.innerText = `${Math.round(data.current_weather.temperature)}°C`;
      conditionEl.innerText = `Wind: ${data.current_weather.windspeed} km/h • Scale Control`;
      
      // 3. CRITICAL FIX: Spinner ko hide karo aur weather card ko show karo
      loadingText.classList.add('hidden');
      weatherDataContainer.classList.remove('hidden');
      
    } catch (error) {
      // Agar internet band ho ya error aaye toh loading text par error message aaye aur spinner ruk jaye
      loadingText.innerHTML = "<p style='color: #f87171; font-weight: 600;'>Failed to sync data.</p>";
      console.error("API error details:", error);
    }
  }

  // Pehli baar load hone par run karo aur refresh button par bhi bind karo
  fetchWeather();
  refreshBtn.addEventListener('click', fetchWeather);
});