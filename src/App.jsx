/* eslint-disable no-unused-vars */
import "regenerator-runtime/runtime";

import React, { useState, useEffect } from "react";
import axios from "axios";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";
import { useSpeechSynthesis } from "react-speech-kit";

function App() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const { transcript, resetTranscript } = useSpeechRecognition();
    const { speak } = useSpeechSynthesis();

    useEffect(() => {
        // Fetch questions from Django API
        axios.get("http://localhost:8000/api/questions/").then((response) => {
            setQuestions(response.data);
        });
    }, []);

    const askQuestion = () => {
        const question = questions[currentQuestion];
        if (question) {
            speak({ text: question.text });
        }
    };

    const handleNextQuestion = () => {
        setCurrentQuestion((prev) => prev + 1);
        resetTranscript();
    };

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return <div>Your browser doesnt support speech recognition.</div>;
    }

    return (
        <>
            <div className="App">
                <h1>Quiz Time</h1>
                {questions.length > 0 && (
                    <div>
                        <h2>{questions[currentQuestion]?.text}</h2>
                        <button onClick={askQuestion}>Ask Question</button>
                        <button onClick={SpeechRecognition.startListening}>
                            Start Answering
                        </button>
                        <p>Your answer: {transcript}</p>
                        <button onClick={handleNextQuestion}>
                            Next Question
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default App;
