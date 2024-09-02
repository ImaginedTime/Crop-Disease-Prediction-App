import { createContext, useContext } from "react";

type UserContextType = {
  lang: string;
  setLang: (value: string) => void
};

const UserContext = createContext({
  lang: "en",
  setLang: () => {}
} as UserContextType);


const UserContextProvider = ({children}: {children: React.ReactNode}) => {
    const [lang, setLang] = useState<string>('en');

    return (
        <UserContext.Provider
            value={{
                lang,
                setLang,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}