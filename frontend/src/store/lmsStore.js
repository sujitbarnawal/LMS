import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const lmsStore = (set) => ({
  user: null,
  setUser: (val) => set({ user: val }),
  courseId:"",
  setCourseId: (val) =>set({courseId:val})
  // isAuthenticated: false,
  // setIsAuthenticated: (val) => set({ isAuthenticated: val }),
});

const useLmsStore = create(
  devtools(
    persist(lmsStore, {
      name: "lms-store",
    })
  )
);

export default useLmsStore;
