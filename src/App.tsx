import {
  RouterProvider,
} from "react-router-dom";

import { useAppDispatch } from "./store/hooks";
import { useEffect, useState } from "react";
import { refreshAccessToken } from "./services/operations/refreshToken";
import Spinner from "./components/Spinner";
import { router } from "./routes/router";

function App() {
  const dispatch = useAppDispatch();

  const [bootLoading, setBootLoading] = useState(true); // ✅ app booting state

  useEffect(() => {
    async function init() {
      try {
        await dispatch(refreshAccessToken()); // ✅ Wait for the async thunk to complete
      } catch (error) {
        console.error("Token refresh failed during app boot:", error);
      } finally {
        setBootLoading(false); // ✅ Set to false only after API call completes
      }
    }
    init();
  }, [dispatch]);

  if (bootLoading) {
    return <Spinner/>;  // ✅ Show spinner until refresh token API completes
  }

  return <RouterProvider router={router} />;
}

export default App;