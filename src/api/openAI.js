import { apiKey } from "../constants";

const clientHeaders = {
  "Authorization": "Bearer " + apiKey,
  "Content-Type": "application/json"
};

const chatgptUrl = 'https://api.openai.com/v1/chat/completions';
const dalleUrl = 'https://api.openai.com/v1/images/generations';

export const apiCall = async (prompt, messages) => {
  // Create a reusable function to handle fetch requests
  const fetchJson = async (url, body) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: clientHeaders,
      body: JSON.stringify(body),
    });
    return await response.json();
  };

  // Logic 1 : Check if user wants to generate an AI picture
  try {
    const chatRes = await fetchJson(chatgptUrl, {
      model: "gpt-3.5-turbo",
      messages: [{
        role: 'user',
        content: `Does this message want to generate an AI picture, image, art or anything similar? ${prompt}. Simply answer with a yes or no.`
      }]
    });

    const isArt = chatRes?.choices[0]?.message?.content?.trim().toLowerCase();
    if (isArt.includes('yes')) {
      console.log('dalle api call');
      return dalleApiCall(prompt, messages);
    } else {
      console.log('chatgpt api call');
      return chatgptApiCall(prompt, messages);
    }
  } catch (err) {
    console.log('error: ', err);
    return Promise.resolve({ success: false, msg: err.message });
  }
};

const chatgptApiCall = async (prompt, messages) => {
  try {
    const res = await fetchJson(chatgptUrl, {
      model: "gpt-3.5-turbo",
      messages
    });

    let answer = res?.choices[0]?.message?.content?.trim();
    messages.push({ role: 'assistant', content: answer });
    // console.log('got chat response', answer);
    return Promise.resolve({ success: true, data: messages });
  } catch (err) {
    console.log('error: ', err);
    return Promise.resolve({ success: false, msg: err.message });
  }
};

const dalleApiCall = async (prompt, messages) => {
  try {
    const res = await fetchJson(dalleUrl, {
      prompt,
      n: 1,
      size: "512x512"
    });

    let url = res?.data[0]?.url;
    // console.log('got image url: ',url);
    messages.push({ role: 'assistant', content: url });
    return Promise.resolve({ success: true, data: messages });
  } catch (err) {
    console.log('error: ', err);
    return Promise.resolve({ success: false, msg: err.message });
  }
};
