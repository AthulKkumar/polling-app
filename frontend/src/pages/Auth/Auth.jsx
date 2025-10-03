import React, { useState } from "react";

import AuthForm from "../../components/AuthForm/AuthForm";

const AuthPage = () => {

    return (
        <>
        < div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh"}}>
            <h1 style={{margin: "0"}}>Welcome</h1>
            <AuthForm />
        </div>
        </>
    );
};

export default AuthPage;
