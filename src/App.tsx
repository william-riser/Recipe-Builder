import GeminiText from "./components/GeminiText";
import "./index.css";

function App() {
  const options = [
    { label: "Chicken", value: "chicken" },
    { label: "Rice", value: "rice" },
    { label: "Cheese", value: "cheese" },
    { label: "Tofu", value: "tofu" },
    { label: "Pasta", value: "pasta" },
    { label: "Beef", value: "beef" },
    { label: "Pork", value: "pork" },
    { label: "Fish", value: "fish" },
    { label: "Avocado", value: "avocado" },
    { label: "Tomato", value: "tomato" },
    { label: "Potato", value: "potato" },
  ];

  return (
    <>
      <GeminiText options={options} />
    </>
  );
}

export default App;
