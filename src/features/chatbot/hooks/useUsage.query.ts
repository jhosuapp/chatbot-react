import { useMutation } from "@tanstack/react-query";
import { postUsageAction } from "../actions/post-usage.action";
import { UsageBody } from "../interfaces/usage.interface";


const useUsageQuery = () => {
    const usageMutation = useMutation({
        mutationFn: (body: UsageBody) => postUsageAction(body),
    });

    return usageMutation;
};

export { useUsageQuery };