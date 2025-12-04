
import { defineStore } from "pinia";
export const useQuestion = defineStore('questions', {
  state: () => ({
    quesHistory: [],
    
  }),
  getters: {
    allList() { 
      return this.quesHistory;
    }
  },
  actions: {
    addQuestion(item) { 
      this.quesHistory.push(item);
    }
  }
});