document.getElementById("submit-btn").addEventListener("click", () => {
    const answers = {
        q1: "b",
        q2: "a",
        q3: "a",
        q4: "c",
        q5: "b",
        q6: "b",
        q7: "b",
        q8: "b",
        q9: "a",
        q10: "a"
    };

    const totalQuestions = Object.keys(answers).length;
    const userResponses = [];

    for (const key in answers) {
      const selected = document.querySelector(`input[name="${key}"]:checked`);
      const response = selected ? selected.value : null;
      userResponses.push({
        question: key,
        correctAnswer: answers[key],
        userAnswer: response,
        isCorrect: response === answers[key]
      });
    }

    // Redirect to results page with user responses
    const encodedData = encodeURIComponent(JSON.stringify(userResponses));
    window.location.href = `results.html?data=${encodedData}&total=${totalQuestions}`;
  });