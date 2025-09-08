
import { GoogleGenAI, Type } from "@google/genai";
import type { ComicPanelScript, ComicPanel } from '../types';

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey });

const generateComicScript = async (storyPrompt: string, characterPrompt: string): Promise<ComicPanelScript[]> => {
    const prompt = `
        You are a master comic book writer.
        Based on the following story idea and character description, create a 4-panel comic script.
        Each panel must have a "scene_description" for the illustrator and "text" for the narration or dialogue.
        The "scene_description" should be detailed and visually descriptive.
        The "text" should be concise and impactful, like in a real comic book.
        Ensure the story flows logically across the four panels.

        Story Idea: "${storyPrompt}"
        Main Character: "${characterPrompt}"

        Return the result as a JSON array.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            scene_description: {
                                type: Type.STRING,
                                description: "A detailed visual description of the scene for the illustrator."
                            },
                            text: {
                                type: Type.STRING,
                                description: "The narration or dialogue text for the panel."
                            }
                        },
                        required: ["scene_description", "text"]
                    }
                }
            }
        });
        
        const jsonText = response.text.trim();
        const script = JSON.parse(jsonText) as ComicPanelScript[];
        
        if (!Array.isArray(script) || script.length === 0) {
            throw new Error("AI failed to generate a valid comic script.");
        }
        
        return script;
    } catch (error) {
        console.error("Error generating comic script:", error);
        throw new Error("Failed to generate comic script from AI.");
    }
};

const panelsToScript = (panels: ComicPanel[]): ComicPanelScript[] => {
    return panels.map(p => ({
        scene_description: p.description,
        text: p.text
    }));
};

const generateContinuationScript = async (
    storyPrompt: string,
    characterPrompt: string,
    existingScript: ComicPanelScript[],
    nextStoryPart: string
): Promise<ComicPanelScript[]> => {
    const prompt = `
        You are a master comic book writer continuing a story.
        The original story idea was: "${storyPrompt}"
        The main character is: "${characterPrompt}"
        Here is the script for the panels so far: ${JSON.stringify(existingScript)}
        The user wants the next part of the story to be about: "${nextStoryPart}"

        Based on all this context, create the next 4-panel comic script. Maintain the story's tone and continuity.
        The character's appearance should remain consistent based on the main character description.
        Each panel must have a "scene_description" for the illustrator and "text" for the narration or dialogue.
        
        Return the result as a JSON array of 4 new panels.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            scene_description: {
                                type: Type.STRING,
                                description: "A detailed visual description of the scene for the illustrator."
                            },
                            text: {
                                type: Type.STRING,
                                description: "The narration or dialogue text for the panel."
                            }
                        },
                        required: ["scene_description", "text"]
                    }
                }
            }
        });
        
        const jsonText = response.text.trim();
        const script = JSON.parse(jsonText) as ComicPanelScript[];
        
        if (!Array.isArray(script) || script.length === 0) {
            throw new Error("AI failed to generate a valid continuation script.");
        }
        
        return script;
    } catch (error) {
        console.error("Error generating continuation script:", error);
        throw new Error("Failed to generate continuation script from AI.");
    }
};

const generatePanelImage = async (panelDescription: string, characterPrompt: string): Promise<string> => {
    // Use a reliable placeholder service that works
    try {
        // Use picsum.photos for reliable placeholder images
        const randomId = Math.floor(Math.random() * 1000);
        const placeholderUrl = `https://picsum.photos/400/400?random=${randomId}`;
        
        console.log("Using placeholder image for:", panelDescription);
        return placeholderUrl;
        
    } catch (error) {
        console.error("Error generating panel image:", error);
        
        // Return a basic fallback using a different service
        return `https://picsum.photos/400/400?random=999`;
    }
};

export const generateComicPanels = async (storyPrompt: string, characterPrompt: string): Promise<ComicPanel[]> => {
    const script = await generateComicScript(storyPrompt, characterPrompt);

    const imageGenerationPromises = script.map(panel => 
        generatePanelImage(panel.scene_description, characterPrompt)
    );

    const imageUrls = await Promise.all(imageGenerationPromises);

    return script.map((panel, index) => ({
        id: index + 1,
        imageUrl: imageUrls[index],
        text: panel.text,
        description: panel.scene_description,
    }));
};

export const continueComicPanels = async (
    nextStoryPart: string,
    characterPrompt: string,
    storyPrompt: string,
    existingPanels: ComicPanel[]
): Promise<ComicPanel[]> => {
    const existingScript = panelsToScript(existingPanels);
    const newScript = await generateContinuationScript(storyPrompt, characterPrompt, existingScript, nextStoryPart);

    const imageGenerationPromises = newScript.map(panel => 
        generatePanelImage(panel.scene_description, characterPrompt)
    );

    const imageUrls = await Promise.all(imageGenerationPromises);

    const lastPanelId = existingPanels.length > 0 ? existingPanels[existingPanels.length - 1].id : 0;

    return newScript.map((panel, index) => ({
        id: lastPanelId + index + 1,
        imageUrl: imageUrls[index],
        text: panel.text,
        description: panel.scene_description,
    }));
};
