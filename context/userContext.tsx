import { setItem } from "@/common/storage";
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
	const [lang, changeLang] = useState("");

	const setLang = (lang: string) => {
		(async () => {
			changeLang(lang);
			await setItem("lang", lang);
		})();
	};

	return (
		<UserContext.Provider value={{ lang, setLang }}>
			{children}
		</UserContext.Provider>
	);
};
