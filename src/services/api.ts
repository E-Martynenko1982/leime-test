import axios from "axios";

const API_URL = "https://66d9c42d4ad2f6b8ed55f71a.mockapi.io/api/v1/items";

export interface Meme {
	id: string;
	name: string;
	imgUrl: string;
	likes: number;
}

export const api = {
	// Get all memes
	getAllMemes: async (): Promise<Meme[]> => {
		try {
			const response = await axios.get(API_URL);
			return response.data;
		} catch (error) {
			console.error("Error fetching memes:", error);
			throw error;
		}
	},

	// Get single meme by ID
	getMemeById: async (id: string): Promise<Meme> => {
		try {
			const response = await axios.get(`${API_URL}/${id}`);
			return response.data;
		} catch (error) {
			console.error("Error fetching meme:", error);
			throw error;
		}
	},

	// Create new meme
	createMeme: async (memeData: Omit<Meme, "id">): Promise<Meme> => {
		try {
			const response = await axios.post(API_URL, memeData);
			return response.data;
		} catch (error) {
			console.error("Error creating meme:", error);
			throw error;
		}
	},

	// Update meme
	updateMeme: async (id: string, memeData: Partial<Meme>): Promise<Meme> => {
		try {
			const response = await axios.put(`${API_URL}/${id}`, memeData);
			return response.data;
		} catch (error) {
			console.error("Error updating meme:", error);
			throw error;
		}
	},

	// Delete meme
	deleteMeme: async (id: string): Promise<void> => {
		try {
			await axios.delete(`${API_URL}/${id}`);
		} catch (error) {
			console.error("Error deleting meme:", error);
			throw error;
		}
	},
};
