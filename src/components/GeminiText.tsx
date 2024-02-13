import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { generateGeminiText } from "./Gemini.tsx"; // Modify the path accordingly

interface GeminiPromptProps {
  // Add any additional props you might need
}

const GeminiPrompt: React.FC<GeminiPromptProps> = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [geminiResponse, setGeminiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkedOptions, setCheckedOptions] = useState([]);

  const defaultPrompt =
    "Format this in markdown. Make the ingredients, instructions, and tips labels bold. Give me a recipe that contains: ";

  const checkboxOptions = [
    { label: "Chicken", value: "chicken" },
    { label: "Rice", value: "rice" },
    { label: "Cheese", value: "cheese" },
    // Add more options as needed
  ];

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    setCheckedOptions((prevOptions) => {
      if (isChecked) {
        return [...prevOptions, value];
      } else {
        return prevOptions.filter((item) => item !== value);
      }
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await generateGeminiText(userPrompt); // Make sure you send userPrompt here too
      setGeminiResponse(response.text);
    } catch (error) {
      console.error("Error getting Gemini response:", error);
      // Handle error gracefully
    } finally {
      setIsLoading(false);
    }
  };

  // Update combinedPrompt logic when checkedOptions change
  useEffect(() => {
    const combinedPrompt = defaultPrompt + checkedOptions.join(", ") + ". ";
    setUserPrompt(combinedPrompt);
  }, [checkedOptions]);

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white font-bold mb-2">
            Select Modifiers:
          </label>
          {checkboxOptions.map((option) => (
            <div key={option.value}>
              <input
                type="checkbox"
                id={option.value}
                value={option.value}
                checked={checkedOptions.includes(option.value)}
                onChange={handleCheckboxChange}
              />
              <label htmlFor={option.value}>{option.label}</label>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={isLoading}
        >
          {isLoading ? "Thinking..." : "Submit"}
        </button>
      </form>

      {geminiResponse && (
        <div className="mt-4 p-4 border border-gray-200 rounded bg-white">
          <p className="text-gray-700">Gemini's Response:</p>
          <ReactMarkdown>{geminiResponse}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default GeminiPrompt;
