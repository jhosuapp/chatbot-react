import { pythonApi } from "../../../api";
import { TextAnalizeResponse } from "../interfaces/textAnalize.interface";

const getAnalizeTextAction = async(text:string):Promise<TextAnalizeResponse> => {
    const { data } = await pythonApi.get<TextAnalizeResponse>(`api/recommend/?text=${text}`);
  
    return data;
}


export { getAnalizeTextAction }