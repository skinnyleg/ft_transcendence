import { BadRequestException, UnauthorizedException } from "@nestjs/common"
import { Request } from "express"

export const getId = (req: Request) => {

	if (!req || !req.signedCookies)
		throw new BadRequestException('Error Cookies')
	const id = req.signedCookies.id;
	if (id == false)
		throw new UnauthorizedException('Cookie has been compromised')
	return (id);
}
