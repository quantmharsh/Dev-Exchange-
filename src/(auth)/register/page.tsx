import { useAuthStore } from "@/store/Auth";
import React, { useState } from "react";

const RegisterPage = () => {
	const { createAccount, login } = useAuthStore();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	// function to handle submit
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		//collect data from from
		const formData = new FormData(e.currentTarget);
		const firstname = formData.get("firstname");
		const lastname = formData.get("lastname");
		const email = formData.get("email");
		const password = formData.get("password");
		//Validation check
		if (!firstname || !lastname || !email || !password) {
			setError(() => "All fields are required");
			//if error then return . otherwise typescript will mad you
			return;
		}
		//Call Store function  to createAccount
		setIsLoading(true);
		setError("");
		const response = await createAccount(
			`${firstname} ${lastname} `,
			email?.toString(),
			password?.toString()
		);
		//if getting error while creatingaccount through appwrite we get this error
		if (response.error) {
			//explicitly taking out message from response
			setError(() => response.error!.message);
		}
		//if we get succesfull response we will redirexct  user to login
		else {
			const loginResponse = await login(
				email?.toString(),
				password?.toString()
			);
			if (loginResponse.error) {
				setError(() => loginResponse.error!.message);
			}
		}
		setIsLoading(false);
	};
	return <div>Register Page</div>;
};

export default RegisterPage;
