import { generateQuestions } from "@/utlits/question";
import { defineStore } from "pinia";
export const useQuestion = defineStore('questions', {
  state: () => ({
    quesHistory: [],
    
  }),
  actions: {
    addQuestion(item) { 
      this.quesHistory.push(item);
    }
  }
});