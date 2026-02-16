import { PrivateLayout, PublicLayout } from "./";

const Layout = ():React.JSX.Element => {
    const isUserAuth = false;

    return (
        <>
            {isUserAuth ? (
                <PublicLayout />
            ) : (
                <PrivateLayout />
            )}
        </>
    )
}

export { Layout }