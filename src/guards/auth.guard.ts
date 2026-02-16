import { LoaderFunction } from "react-router-dom";

const auth = (): LoaderFunction => async () => {
  
    return {
        user: 'test',
    };
};
  
export { auth };
  