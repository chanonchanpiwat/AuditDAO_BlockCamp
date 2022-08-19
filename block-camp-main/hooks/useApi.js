import axios from "axios";

export function useApi() {
  async function getBountys() {
    let res = {};
    try {
      res = await axios.get(`https://block-camp.herokuapp.com/tasks`);
    } catch (e) {
      console.log(e);
    }
    return res;
  }
  async function getBounty(taskId) {
    let res = {};
    try {
      res = await axios.get(`https://block-camp.herokuapp.com/tasks/${taskId}`);
    } catch (e) {
      console.log(e);
    }
    return res;
  }
  async function getComment(taskId) {
    let res = {};
    try {
      res = await axios.get(`https://block-camp.herokuapp.com/comments/${taskId}`);
    } catch (e) {
      console.log(e);
    }
    return res;
  }

  async function addComment(task_id,comment,user_addr) {
    let res = {};
    try {
      res = await axios.post(`https://block-camp.herokuapp.com/comment`,{task_id,comment,user_addr});
    } catch (e) {
      console.log(e);
    }
    return res;
  }
  async function postPoposal(form) {
    try {
      await axios.post(`https://block-camp.herokuapp.com/task`,form);
    console.log(form)
    } catch (e) {
      console.log(e);
    }
  }
  return { getBountys,getBounty,getComment,addComment,postPoposal };
}
