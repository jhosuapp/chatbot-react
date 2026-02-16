import { Button, Labels } from "../components";

const TestView = (): React.JSX.Element => {

    return (
        <>
            <section className="animate-fadeIn flex flex-col justify-center items-center bg-gray-50 p-10">
                <p className="text-black">Template react with:</p>
                <ul className="text-black my-10">
                    <li>Tailwind v3</li>
                    <li>react router dom v7</li>
                    <li>Tanstack query</li>
                    <li>Axios</li>
                    <li>Zustand</li>
                    <li>Zod</li>
                    <li>Jest</li>
                </ul>
                <Button />
            </section>
            <section className="bg-gray-100 p-10">
                <p className="text-black mb-10">Example request with tanstack query:</p>
                <article className="flex flex-wrap gap-2 justify-center">
                    <Labels />
                </article>
            </section>
        </>
    )
}

export { TestView };