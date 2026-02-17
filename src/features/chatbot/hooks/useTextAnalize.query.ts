import { useQuery } from "@tanstack/react-query";
import { getAnalizeTextAction } from "../actions/get-text-analize.action";

const useTextAnalizeQuery = (text: string) => {

    const textAnalizeQuery = useQuery({
        queryKey: ['analizer', text],
        queryFn: ()=> getAnalizeTextAction(text),
        staleTime: Infinity,
        enabled: !!text
    });

    return textAnalizeQuery
}

export { useTextAnalizeQuery }