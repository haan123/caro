import { defineStore } from "pinia";

export const useSocketStore = defineStore("socket", () => {
  const url = "/api/server";

  return { url };
});
