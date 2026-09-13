"use client";

import { useState, useEffect, useCallback } from "react";
import { kosakataData, Kesulitan } from "@/data/kosakata";
import { alfabetData } from "@/data/alfabet";

export interface QuizState {
  mode: "setup" | "playing";
  word: string;
  hurufList: string[];
  currentHurufIndex: number;
  isDisplaying: boolean;
  userAnswer: string;
  feedback: "none" | "correct" | "incorrect";
  score: number;
  totalAttempts: number;
}

export function useQuizEngine(
  kesulitan: Kesulitan,
  kecepatan: "lambat" | "cepat"
) {
  const [state, setState] = useState<QuizState>({
    mode: "setup",
    word: "",
    hurufList: [],
    currentHurufIndex: 0,
    isDisplaying: false,
    userAnswer: "",
    feedback: "none",
    score: 0,
    totalAttempts: 0,
  });

  // Get word by difficulty
  const getRandomWord = useCallback(() => {
    const words = kosakataData.filter((k) => k.kesulitan === kesulitan);
    return words[Math.floor(Math.random() * words.length)].kata;
  }, [kesulitan]);

  // Start quiz
  const startQuiz = useCallback(() => {
    const word = getRandomWord();
    const hurufList = word.split("");

    setState((prev) => ({
      ...prev,
      mode: "playing",
      word,
      hurufList,
      currentHurufIndex: 0,
      isDisplaying: true,
      userAnswer: "",
      feedback: "none",
    }));
  }, [getRandomWord]);

  // Handle display animation
  useEffect(() => {
    if (!state.isDisplaying || state.currentHurufIndex >= state.hurufList.length) {
      setState((prev) => ({ ...prev, isDisplaying: false }));
      return;
    }

    const interval = kecepatan === "lambat" ? 1500 : 700;
    const timer = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        currentHurufIndex: prev.currentHurufIndex + 1,
      }));
    }, interval);

    return () => clearTimeout(timer);
  }, [state.currentHurufIndex, state.hurufList.length, state.isDisplaying, kecepatan]);

  // Submit answer
  const submitJawaban = useCallback((answer: string) => {
    setState((prev) => {
      const isCorrect = answer.toUpperCase() === prev.word.toUpperCase();
      return {
        ...prev,
        feedback: isCorrect ? "correct" : "incorrect",
        score: isCorrect ? prev.score + 1 : prev.score,
        totalAttempts: prev.totalAttempts + 1,
        userAnswer: answer,
      };
    });
  }, []);

  // Replay the sign sequence for the current word
  const replayDisplay = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentHurufIndex: 0,
      isDisplaying: true,
      feedback: "none",
      userAnswer: "",
    }));
  }, []);

  // Next word
  const ulangi = useCallback(() => {
    const word = getRandomWord();
    const hurufList = word.split("");

    setState((prev) => ({
      ...prev,
      word,
      hurufList,
      currentHurufIndex: 0,
      isDisplaying: true,
      userAnswer: "",
      feedback: "none",
    }));
  }, [getRandomWord]);

  // Reset quiz
  const resetQuiz = useCallback(() => {
    setState({
      mode: "setup",
      word: "",
      hurufList: [],
      currentHurufIndex: 0,
      isDisplaying: false,
      userAnswer: "",
      feedback: "none",
      score: 0,
      totalAttempts: 0,
    });
  }, []);

  return {
    ...state,
    startQuiz,
    submitJawaban,
    ulangi,
    replayDisplay,
    resetQuiz,
    currentHuruf: state.hurufList[state.currentHurufIndex] || "",
    currentHurufData: state.hurufList[state.currentHurufIndex]
      ? alfabetData.find(
          (h) => h.huruf === state.hurufList[state.currentHurufIndex]
        )
      : null,
  };
}
