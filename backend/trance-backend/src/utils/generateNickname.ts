import { randomBytes } from "crypto";

export const generateNickname = async (login: string): Promise<string> => {
	// const randomValue = randomBytes(4).toString('hex'); // Adjust the length of the random value as needed
	// return `${login}${randomValue}`;
	return (login);
}
