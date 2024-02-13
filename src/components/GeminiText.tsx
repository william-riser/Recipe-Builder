import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { generateGeminiText } from "./Gemini.tsx"; // Modify the path accordingly

interface Option {
  label: string;
  value: string;
}

interface GeminiPromptProps {
  options: Option[]; // Our prop for the list of options
}

const GeminiPrompt: React.FC<GeminiPromptProps> = ({ options }) => {
  const [userPrompt, setUserPrompt] = useState("");
  const [geminiResponse, setGeminiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkedOptions, setCheckedOptions] = useState([]);

  const defaultPrompt = `Format this in markdown. Make the ingredients, instructions, and tips labels bold. 
    Give the recipe a name at the beginning. 
    Make the name large and bold.
    Add a time estimate for the recipe.
    List the steps in a numbered list.    
    Give me a recipe that contains: `;

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

    // if (checkedOptions.length === 0) {
    //   alert("Please select at least one ingredient.");
    //   return;
    // }

    setIsLoading(true);

    try {
      if (checkedOptions.length === 0) {
        const response =
          await generateGeminiText(`Format this in markdown. Make the ingredients, instructions, and tips labels bold. 
        Give the recipe a name at the beginning. 
        Make the name large and bold.
        Add a time estimate for the recipe.
        List the steps in a numbered list.    
        Give me an interesting dinner recipe.`);
        setGeminiResponse(response.text);
      } else {
        const response = await generateGeminiText(userPrompt); // Make sure you send userPrompt here too
        setGeminiResponse(response.text);
      }
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
          <label className="block text-black font-bold mb-2">
            Select Ingredients:
          </label>
          <div className="flex flex-wrap">
            {options.map((option) => (
              <div
                key={option.value}
                className="m-3 p-2 bg-blue-700 rounded-md text-white font-bold flex items-center"
              >
                <input
                  className="shrink-0 m-1 h-5 w-15 accent-green-400"
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
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={isLoading}
        >
          {isLoading
            ? "Thinking..."
            : checkedOptions.length > 0
            ? "Generate Recipe!"
            : "Surprise me!"}
        </button>
      </form>

      {geminiResponse && (
        <div className="mt-4 p-4 border border-gray-200 rounded bg-white">
          <ReactMarkdown>{geminiResponse}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default GeminiPrompt;
