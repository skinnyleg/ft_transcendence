import { BadRequestException } from "@nestjs/common"
import { Request } from "express"

export const getId = (req: Request) => {

	const idString = req.cookies.id
	const id = parseInt(idString, 10)
	if (isNaN(id))
		throw new BadRequestException('id not valid number')
	return (id);
}
