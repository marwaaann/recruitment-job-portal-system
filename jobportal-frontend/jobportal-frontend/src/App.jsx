import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { initializeCsrf } from "./services/csrfService";

function App() {

    useEffect(() => {
        initializeCsrf();
    }, []);

    return <AppRouter />;
}

export default App;