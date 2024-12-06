import { create } from "zustand";
export const useColor = create((set) => ({
  settingOptions: JSON.parse(localStorage.getItem("setting")) || {
    color: "primary",
    theme: "white",
    isFullScreen: false,
  },
  getHexaCode: (rcolor) => {
    switch (rcolor) {
      case "info":
        return "#0DCAF0";

      case "warning":
        return "#FFC107";

      case "success":
        return "#198754";

      case "danger":
        return "#dc3545";

      case "secondary":
        return "#6C757D";

      default:
        return "#0d6efd";
    }
  },

  setSettingOptions: (settingOptions) => {
    // console.log("SEt options to ");
    // console.log(settingOptions);
    set({ settingOptions });
  },
}));
