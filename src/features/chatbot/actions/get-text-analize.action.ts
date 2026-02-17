import axios from "axios";
import { TextAnalizeResponse } from "../interfaces/textAnalize.interface";

const getAnalizeTextAction = async(text:string):Promise<TextAnalizeResponse> => {
    const { data } = await axios.get<TextAnalizeResponse>(`https://q0vzfx61-8001.use2.devtunnels.ms/api/recommend/?text=${text}`);
  
    return data;
}


export { getAnalizeTextAction }