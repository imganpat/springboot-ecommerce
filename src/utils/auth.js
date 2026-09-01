export const getToken = () => {
    return localStorage.getItem("token");
};

export const getAuthSession = () => {
    const session = localStorage.getItem("auth_session");

    if (!session) {
        return {
            token: getToken(),
            user: null,
        };
    }

    try {
        const parsedSession = JSON.parse(session);
        return {
            token: parsedSession.token || getToken(),
            user: parsedSession.user || null,
        };
    } catch {
        return {
            token: getToken(),
            user: null,
        };
    }
};

export const setAuthSession = (token, user = null) => {
    localStorage.setItem("token", token);
    localStorage.setItem("auth_session", JSON.stringify({ token, user }));
};

export const setToken = (token) => {
    localStorage.setItem("token", token);

    const session = getAuthSession();
    if (session.user) {
        localStorage.setItem("auth_session", JSON.stringify({ token, user: session.user }));
    }
};

export const removeToken = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth_session");
};