// create a custom hook to change the language of the content in the app

import { useContext, useEffect, useState } from "react";

import { UserContext } from "@/context/userContext";

import langMap, { ContentType, LangMap } from "@/data";

export default function useContent() {
	const { lang } = useContext(UserContext);

	const [content, setContent] = useState<ContentType>(langMap.en);

	useEffect(() => {
		if (lang === "") {
			setContent(langMap["en" as keyof LangMap]);
			return;
		}

		setContent(langMap[lang as keyof LangMap]);
	}, [lang]);

	return content;
}
