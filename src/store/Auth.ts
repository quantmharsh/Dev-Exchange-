// imports from zustand side
import { create } from "zustand";
// persist is used to store zustand state in localstorage
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { AppwriteException, ID, Models } from "appwrite";
import { account } from "@/models/client/config";

export interface UserPrefs {
	reputation: number;
}
interface IAuthStore {
	session: Models.Session | null;
	// making user generic type this means it will have at least 1 field which is reputation
	user: Models.User<UserPrefs> | null;
	hydrated: boolean;
	// jwt  we are getting from appwrite
	jwt: string | null;
	//setHydrated is responsible for putting data in hydration  .whether it  is coming back from localstorage or not
	setHydrated(): void;
	// it returns promise
	verifySession(): Promise<void>;
	login(
		email: string,
		password: string
	): Promise<{
		success: boolean;
		error?: AppwriteException | null;
	}>;
	createAccount(
		name: string,
		email: string,
		password: string
	): Promise<{
		success: boolean;
		error?: AppwriteException | null;
	}>;
	logout(): Promise<void>;
}

//Creatina  zustand store
export const useAuthStore = create<IAuthStore>()(
	//it contains all the storeAPIS we are working with
	// 1 st persist(it helps to store  zustand state in localstorage)
	//wrapping everything inside it
	persist(
		//all the functionality that  will write will go  inside immer . it will manage all the states
		//immer have a callback function . whicch have all the metthod sand variable of type IAuthStore
		//it takes set as a parameter whivh is used to set variables by creating a new state
		immer((set) => ({
			session: null,
			user: null,
			jwt: null,
			hydrated: false,
			setHydrated() {
				set({
					hydrated: true,
				});
			},
			//we will get the session when user is logged in
			async verifySession() {
				try {
					const session = await account.getSession("current");
					set({ session: session });
				} catch (error) {}
			},
			async login(email: string, password: string) {
				try {
					const session = await account.createEmailPasswordSession(
						email,
						password
					);
					const [user, { jwt }] = await Promise.all([
						//getting user
						account.get<UserPrefs>(),
						//getting jwt toekn
						account.createJWT(),
						// setting reputation az zero for deault
					]);
					if (!user.prefs?.reputation)
						await account.updatePrefs<UserPrefs>({
							reputation: 0,
						});
					// updating their states
					set({ session, user, jwt });
					return {
						success: true,
					};
				} catch (error) {
					console.log("error occured while login ", error);
					return {
						success: false,
						error: error instanceof AppwriteException ? error : null,
					};
				}
			},

			async createAccount(name: string, email: string, password: string) {
				try {
					await account.create(ID.unique(), email, password, name);
					return {
						success: true,
					};
				} catch (error) {
					return {
						success: false,
						error: error instanceof AppwriteException ? error : null,
					};
				}
			},
			async logout() {
				try {
					await account.deleteSessions();
					set({
						session: null,
						user: null,
						jwt: null,
					});
				} catch (error) {
					console.log("error while signing out", error);
				}
			},
		})),

		// configuration options
		{
			name: "auth",
			//   this method is used to get  state data from local storage
			onRehydrateStorage() {
				return (state, error) => {
					if (!error) {
						state?.setHydrated();
					}
				};
			},
		}
	)
);
