import { LoaderFunction } from "react-router-dom";

const anonymous = (): LoaderFunction => async () => {

    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        user: 'test',
    };
};
  
export { anonymous };