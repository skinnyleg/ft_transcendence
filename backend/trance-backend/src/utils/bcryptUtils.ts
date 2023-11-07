
import * as bcrypt from 'bcrypt'

export const hashPass = async (password : string) => {
	const SALT_ROUNDS = 10;
	return await bcrypt.hash(password, SALT_ROUNDS);
}


export const compareHash = async (password:string, hashedPassword:string) => {

	return await bcrypt.compare(password,hashedPassword);
}
	
