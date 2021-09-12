import App from "./App.svelte";

const app = new App({
  target: document.getElementById("main"),
  props: {
    name: "Devs for Revolution",
  },
});

export default app;
