import { useLabelQuery } from "../hooks";

const Labels = ():React.JSX.Element => {
    const { labelQuery } = useLabelQuery(); 

    if(labelQuery.isFetching){
        return <p className="text-center w-full h-[100px] flex items-center justify-center">Loading...</p>
    }
    
    if(!labelQuery.data){
        return <p className="text-center w-full h-[100px] flex items-center justify-center">there are no labels</p>
    }

    console.log(labelQuery.data);

    return (
        <>
            {labelQuery.data.map(( { name, color } )=>(
            <span
                key={name}
                className={`px-2 py-1 animate-fadeIn rounded-full font-semibold cursor-pointer transition-all`}
                style={{ border: `1px solid #${color}` }}
            >
                { name }
            </span>
            ))}
        </>
    )
}

export { Labels }