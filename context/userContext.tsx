import { createContext, useState } from "react";

type UserContextType = {
	lang: string;
	setLang: (lang: string) => void;
};

export const UserContext = createContext<UserContextType>({
	lang: "",
	setLang: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [lang, setLang] = useState("");

	return (
		<UserContext.Provider value={{ lang, setLang }}>
			{children}
		</UserContext.Provider>
	);
};
