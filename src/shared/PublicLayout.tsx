import { Outlet } from "react-router-dom";

const PublicLayout = ():React.JSX.Element => {
    return (
        <main>
            <section className="flex justify-center fixed top-0 left-0 w-full bg-white py-5 z-50">
                <p className="text">Public layout</p>
            </section>
            <Outlet />
        </main>
    )
}

export { PublicLayout }