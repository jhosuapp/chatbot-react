import { Outlet } from "react-router-dom";

const PrivateLayout = ():React.JSX.Element => {
    return (
        <main>
            <section className="flex justify-center fixed top-0 left-0 w-full bg-primary py-5 z-50">
                <p className="text-white">Private layout</p>
            </section>
            <Outlet />
        </main>
    )
}

export { PrivateLayout }