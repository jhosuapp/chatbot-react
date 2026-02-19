import { pythonApi } from "../../../api";
import { UsageBody } from "../interfaces/usage.interface";

const postUsageAction = async(body: UsageBody):Promise<any> => {
    const { data } = await pythonApi.post<any>('/api/usage/log/', body);
  
    return data;
}


export { postUsageAction }