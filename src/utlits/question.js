
/*
mode:easy hard and only control operator
*/
export const generateQuestions = (count = 30, max = 10,min=0, mode = 'easy') => {
  const questions = [];
  for (let i = 1; i <= count; i++) {
    let a = Math.floor(Math.random() * (max - min + 1)) + min;
    // const op = Math.random() > 0.5 ? '+' : '-' 
    const op = '+';
    let b = op === '+'
      ? Math.floor(Math.random() * (max - min + 1)) + min
      : Math.floor(Math.random() * (a - 10 + 1)) + 10; // 保证不负数
    const result = op === '+' ? a + b : a - b;

    let hide = [];
    // if (mode === 'operator') {
    //   hide = [1]; // 只隐藏运算符
    // } else if (mode === 'hard') {
    //   hide = Array.from({ length: 2 }, () => Math.floor(Math.random() * 4)); // 随机挖2个
    //   if (new Set(hide).size !== hide.length) hide = [0, 1]; // 保证不重复
    // } else {
    //   hide = [Math.floor(Math.random() * 4)]; // easy: 挖1个
    // }

    questions.push({ id: i, left: a, op, right: b, result });
  }
  return questions;
};

