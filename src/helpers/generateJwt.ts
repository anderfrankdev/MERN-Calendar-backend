import jwt from "jsonwebtoken";

const generateJWT = (uid: string): Promise<string | undefined> => {
	return new Promise((resolve, reject) => {
		const payload: any = { uid };
		jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
			expiresIn: "15m",
		}, (err: Error | null, token: string | undefined) => {
			if (err) {
				console.log(err);
				reject("Couldn't generate token");
			} else {
				resolve(token);
			}
		});
	});
};

export default generateJWT;
