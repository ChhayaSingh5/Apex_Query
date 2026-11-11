import "dotenv/config";

const getOpenAIAPIResponse = async(messages) => {
    const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` 
    },
    body: JSON.stringify({
      "model": "gpt-6-luna",
      "messages": messages
    })
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", options);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || `AI request failed: ${response.status}`);
    }
    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      throw new Error("AI response did not contain a message");
    }
    return content;

  } catch(err) {
    console.log(err);
    throw err;
  } 
}

export default getOpenAIAPIResponse;