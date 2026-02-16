import { useQuery } from "@tanstack/react-query";
import { getLabels } from "../actions";

const useLabelQuery = () => {

    const labelQuery = useQuery({
        queryKey: ['labels'],
        queryFn: getLabels,
        staleTime: 1000 * 60 * 60,
    });

    return {
        labelQuery
    }
}

export { useLabelQuery }