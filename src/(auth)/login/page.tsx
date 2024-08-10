import { useAuthStore } from "@/store/Auth";
import React, { useState } from "react";

const LoginPage = () => {
	const { login } = useAuthStore();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		//collect  data from form
		const formData = new FormData(e.currentTarget);
		const email = formData.get("email");
		const password = formData.get("password");
		// validate
		if (!email || !password) {
			setError("All fields are required");
			return;
		}
		//call store function to login
		setIsLoading(true);
		setError("");
		const loginResponse = await login(email?.toString(), password?.toString());
		if (loginResponse.error) {
			setError(loginResponse.error!.message);
		}
		setIsLoading(false);
	};
	return <div>LogIn Page</div>;
};

export default LoginPage;
