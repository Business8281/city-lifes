
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** city-lifes-1
- **Date:** 2025-12-07
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001
- **Test Name:** User Registration with Email and Password
- **Test Code:** [TC001_User_Registration_with_Email_and_Password.py](./TC001_User_Registration_with_Email_and_Password.py)
- **Test Error:** The registration process could not be fully completed. Although the registration form was accessed multiple times and valid data was input, the form submission did not result in email verification prompt or profile setup page. The user was repeatedly redirected to the login form, preventing completion of the registration flow. Therefore, the task to verify successful new user registration and profile setup is not fully finished.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[ERROR] Warning: React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.%s fetchPriority fetchpriority 
    at img
    at div
    at div
    at Index (http://127.0.0.1:8080/src/pages/Index.tsx:36:43)
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Outlet (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4494:26)
    at div
    at main
    at _c8 (http://127.0.0.1:8080/src/components/ui/sidebar.tsx:322:62)
    at div
    at div
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at http://127.0.0.1:8080/src/components/ui/sidebar.tsx:50:72
    at Layout
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Routes (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4558:5)
    at Suspense
    at Router (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4501:15)
    at BrowserRouter (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:5247:5)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at LocationProvider (http://127.0.0.1:8080/src/contexts/LocationContext.tsx:25:36)
    at AuthProvider (http://127.0.0.1:8080/src/contexts/AuthContext.tsx:26:32)
    at QueryClientProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=590d1dc8:2934:3)
    at App (http://127.0.0.1:8080/src/App.tsx?t=1765040830332:102:5) (at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-F34GCA6J.js?v=590d1dc8:520:37)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6f8d6b34-f1ec-4dfc-b9c2-1a68a05725b9/10e806ff-1e33-4490-8766-106b74f43f53
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002
- **Test Name:** User Login with Google OAuth
- **Test Code:** [TC002_User_Login_with_Google_OAuth.py](./TC002_User_Login_with_Google_OAuth.py)
- **Test Error:** Google OAuth login could not be completed due to security restrictions on the Google sign-in page. The error message 'This browser or app may not be secure' blocked the login process. Further testing cannot proceed until this issue is resolved.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[ERROR] Warning: React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.%s fetchPriority fetchpriority 
    at img
    at div
    at div
    at Index (http://127.0.0.1:8080/src/pages/Index.tsx:36:43)
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Outlet (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4494:26)
    at div
    at main
    at _c8 (http://127.0.0.1:8080/src/components/ui/sidebar.tsx:322:62)
    at div
    at div
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at http://127.0.0.1:8080/src/components/ui/sidebar.tsx:50:72
    at Layout
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Routes (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4558:5)
    at Suspense
    at Router (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4501:15)
    at BrowserRouter (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:5247:5)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at LocationProvider (http://127.0.0.1:8080/src/contexts/LocationContext.tsx:25:36)
    at AuthProvider (http://127.0.0.1:8080/src/contexts/AuthContext.tsx:26:32)
    at QueryClientProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=590d1dc8:2934:3)
    at App (http://127.0.0.1:8080/src/App.tsx?t=1765040830332:102:5) (at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-F34GCA6J.js?v=590d1dc8:520:37)
[WARNING] An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing. (at https://accounts.youtube.com/accounts/CheckConnection?pmpo=https%3A%2F%2Faccounts.google.com&v=-70314796&timestamp=1765048557272:0:0)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A0043A00DC1B0000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at https://accounts.google.com/v3/signin/identifier?opparams=%253Fredirect_to%253Dhttp%25253A%25252F%25252F127.0.0.1%25253A8080%25252Fauth%25252Fcallback&dsh=S1815349520%3A1765048552003839&client_id=481804954423-74mggau4n6ikj6eo1bo3l6llfc9j7p76.apps.googleusercontent.com&o2v=2&prompt=select_account&redirect_uri=https%3A%2F%2Fthxrxacsrwtadvvdwken.supabase.co%2Fauth%2Fv1%2Fcallback&response_type=code&scope=email+profile&service=lso&state=eyJhbGciOiJIUzI1NiIsImtpZCI6IlFXSnZNUURvT3ZBMkhTdksiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE3NjUwNDg4NTAsInNpdGVfdXJsIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6ODA4MC8iLCJpZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImZ1bmN0aW9uX2hvb2tzIjpudWxsLCJwcm92aWRlciI6Imdvb2dsZSIsInJlZmVycmVyIjoiaHR0cDovLzEyNy4wLjAuMTo4MDgwL2F1dGgvY2FsbGJhY2siLCJmbG93X3N0YXRlX2lkIjoiYTBlNDc2ZDEtNzYyMS00NDcyLTlhN2UtN2MyNGY2N2Y4NzI1In0.Fin_EMiFc0Z0-UKH7_i2_8zmsycvu6X1hPhVftQrML8&flowName=GeneralOAuthFlow&continue=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%2Fconsent%3Fauthuser%3Dunknown%26part%3DAJi8hAOTSCpWkJizdySIZkqZS9MB0MaI2osCuc-_85vPlvRl-Ogqu5jc7BRCkqH3PScYciLJ9Y_ck2JijjwRAqwM_Jdvd_eyRIXaOPtnkJODB-WsWZoEqhW6WKU11F4DlZRsHMaKm_MOJk5C0krom7Rc8d3xi8897CRrT3Jvx7KE36fu48qm_mXeBhodzkIW1_FTOUosI3snP9cklBYu2jEWX-3PYR2YUfiEjT71-DVzG_V5ntTkMSQJ15aepDCzlUqelhyIf_XrVADVxJACRSBpj45oKAc9y6FvDrlnGV5vm7uqxLpF0lwUfrqWRJ1kuX3kzMDlbD7CqOMjoSUw-PjZyZTBT-ShIszA85aQgOeA-MqnfgUpVvY8JSe3CaxHOZybdgzPCEe3pqmokGOZbKnsaAADGnZJrBAQtc2yaYB1P6w6YJCgk1ZIYEFQfptBv3OSu_odIC7K4Xu_vLKz3dEa_lkIa0elGuefzACR0_tFhtxGP2d7_v4%26flowName%3DGeneralOAuthFlow%26as%3DS1815349520%253A1765048552003839%26client_id%3D481804954423-74mggau4n6ikj6eo1bo3l6llfc9j7p76.apps.googleusercontent.com%26requestPath%3D%252Fsignin%252Foauth%252Fconsent%23&app_domain=https%3A%2F%2Fthxrxacsrwtadvvdwken.supabase.co&rart=ANgoxcdYOn5e1ls7Cn8oIMuIYMtQCbgZ5ExXQO2_Cao7HoWmMwo_W0x8sGH87mT7_vAM-c4mka3vsSM4CWzyDGG-cKsdzdbqpSHL8jhZxhKl3V-8ErJSS6c:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6f8d6b34-f1ec-4dfc-b9c2-1a68a05725b9/1ca53a46-3eb4-43e7-8d6b-4b99a9f15536
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003
- **Test Name:** Login Failure with Incorrect Credentials
- **Test Code:** [TC003_Login_Failure_with_Incorrect_Credentials.py](./TC003_Login_Failure_with_Incorrect_Credentials.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6f8d6b34-f1ec-4dfc-b9c2-1a68a05725b9/d5a2ad02-542a-4ec1-8735-53f5769ff57d
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004
- **Test Name:** Search Listings with Location and Category Filters
- **Test Code:** [TC004_Search_Listings_with_Location_and_Category_Filters.py](./TC004_Search_Listings_with_Location_and_Category_Filters.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6f8d6b34-f1ec-4dfc-b9c2-1a68a05725b9/9d8829c0-9cd1-4ef8-b754-bf1ef2c27963
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005
- **Test Name:** Search with 'Near Me' Radius Filter Using Geolocation
- **Test Code:** [TC005_Search_with_Near_Me_Radius_Filter_Using_Geolocation.py](./TC005_Search_with_Near_Me_Radius_Filter_Using_Geolocation.py)
- **Test Error:** Stopped testing because geolocation permission cannot be enabled, which is essential for verifying the 'Near Me' filter functionality. The issue has been reported.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[ERROR] Warning: React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.%s fetchPriority fetchpriority 
    at img
    at div
    at div
    at Index (http://127.0.0.1:8080/src/pages/Index.tsx:36:43)
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Outlet (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4494:26)
    at div
    at main
    at _c8 (http://127.0.0.1:8080/src/components/ui/sidebar.tsx:322:62)
    at div
    at div
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at http://127.0.0.1:8080/src/components/ui/sidebar.tsx:50:72
    at Layout
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Routes (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4558:5)
    at Suspense
    at Router (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4501:15)
    at BrowserRouter (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:5247:5)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at LocationProvider (http://127.0.0.1:8080/src/contexts/LocationContext.tsx:25:36)
    at AuthProvider (http://127.0.0.1:8080/src/contexts/AuthContext.tsx:26:32)
    at QueryClientProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=590d1dc8:2934:3)
    at App (http://127.0.0.1:8080/src/App.tsx?t=1765040830332:102:5) (at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-F34GCA6J.js?v=590d1dc8:520:37)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[ERROR] Warning: React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.%s fetchPriority fetchpriority 
    at img
    at div
    at div
    at Index (http://127.0.0.1:8080/src/pages/Index.tsx:36:43)
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Outlet (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4494:26)
    at div
    at main
    at _c8 (http://127.0.0.1:8080/src/components/ui/sidebar.tsx:322:62)
    at div
    at div
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at http://127.0.0.1:8080/src/components/ui/sidebar.tsx:50:72
    at Layout
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Routes (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4558:5)
    at Suspense
    at Router (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4501:15)
    at BrowserRouter (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:5247:5)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at LocationProvider (http://127.0.0.1:8080/src/contexts/LocationContext.tsx:25:36)
    at AuthProvider (http://127.0.0.1:8080/src/contexts/AuthContext.tsx:26:32)
    at QueryClientProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=590d1dc8:2934:3)
    at App (http://127.0.0.1:8080/src/App.tsx?t=1765040830332:102:5) (at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-F34GCA6J.js?v=590d1dc8:520:37)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6f8d6b34-f1ec-4dfc-b9c2-1a68a05725b9/81767f1f-b109-4920-bb25-adf83a95fc5a
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006
- **Test Name:** Create New Listing with Category-Specific Form Fields
- **Test Code:** [TC006_Create_New_Listing_with_Category_Specific_Form_Fields.py](./TC006_Create_New_Listing_with_Category_Specific_Form_Fields.py)
- **Test Error:** Login attempts for listing owner failed using both email and Google methods. Email login redirected back to login options, and Google login failed with a security error. Cannot proceed to create a listing. Reporting the issue and stopping further testing.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[ERROR] Warning: React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.%s fetchPriority fetchpriority 
    at img
    at div
    at div
    at Index (http://127.0.0.1:8080/src/pages/Index.tsx:36:43)
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Outlet (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4494:26)
    at div
    at main
    at _c8 (http://127.0.0.1:8080/src/components/ui/sidebar.tsx:322:62)
    at div
    at div
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at http://127.0.0.1:8080/src/components/ui/sidebar.tsx:50:72
    at Layout
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Routes (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4558:5)
    at Suspense
    at Router (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4501:15)
    at BrowserRouter (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:5247:5)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at LocationProvider (http://127.0.0.1:8080/src/contexts/LocationContext.tsx:25:36)
    at AuthProvider (http://127.0.0.1:8080/src/contexts/AuthContext.tsx:26:32)
    at QueryClientProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=590d1dc8:2934:3)
    at App (http://127.0.0.1:8080/src/App.tsx?t=1765040830332:102:5) (at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-F34GCA6J.js?v=590d1dc8:520:37)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://thxrxacsrwtadvvdwken.supabase.co/auth/v1/token?grant_type=password:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing. (at https://accounts.youtube.com/accounts/CheckConnection?pmpo=https%3A%2F%2Faccounts.google.com&v=2009694769&timestamp=1765048630940:0:0)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A0D83A00BC3F0000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at https://accounts.google.com/v3/signin/identifier?opparams=%253Fredirect_to%253Dhttp%25253A%25252F%25252F127.0.0.1%25253A8080%25252Fauth%25252Fcallback&dsh=S-752236609%3A1765048625800805&client_id=481804954423-74mggau4n6ikj6eo1bo3l6llfc9j7p76.apps.googleusercontent.com&o2v=2&prompt=select_account&redirect_uri=https%3A%2F%2Fthxrxacsrwtadvvdwken.supabase.co%2Fauth%2Fv1%2Fcallback&response_type=code&scope=email+profile&service=lso&state=eyJhbGciOiJIUzI1NiIsImtpZCI6IlFXSnZNUURvT3ZBMkhTdksiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE3NjUwNDg5MjMsInNpdGVfdXJsIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6ODA4MC8iLCJpZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImZ1bmN0aW9uX2hvb2tzIjpudWxsLCJwcm92aWRlciI6Imdvb2dsZSIsInJlZmVycmVyIjoiaHR0cDovLzEyNy4wLjAuMTo4MDgwL2F1dGgvY2FsbGJhY2siLCJmbG93X3N0YXRlX2lkIjoiMGUwODU4NjAtZDU4Yy00ZDkwLWE1MDUtZDEyODJiMmVmZjkzIn0.FT82mMH7WtfJjnH6YGCCSOMsFB5DFJfSscmd6qByDMo&flowName=GeneralOAuthFlow&continue=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%2Fconsent%3Fauthuser%3Dunknown%26part%3DAJi8hAMmI0H4Itvt69IDZTfkSFhNPhmqPdqhhooXKDXkuS68NQN2iqvwwj3xodOIekhaMvbjWgPmmBjWy8MrY2zCKHi_61_cJ0WCTRaJUV4AgR-JuVp8WSs9u1T4GzlM8YW2ItTlJe298zubFVwGsrUkeo3Ys38wWLDmxSvj-PejMmhjV_o5X4qg9807Gh70L9_vjo2Wmo4o1_3IDPeYUUwRQD9lwzjT9gO_zY98AA0tc-5gSTIZgt6G3-2HsbZCr8wyf0uDapcGvrksKPHDA0ctKavQ9OJz2Rx9voRCP6XDMS1mAWPAUpST0zjLicQ-Ci41R6SLCVNZxzRxz4YH9l3ACJJgIKcdjoqsA7_ygfNGZnx7QlsXhKloshGojhM2bT_xzuvtM-gKNOIPlpvOPiowGK2ag22ne9WrTCUpgT8uv35mGxuQiGGARsm_SvjQ4wAWuDelfsBfaD0O74rr4l5fzCJvRlU11Unby5PcGANTQzVqR54Thug%26flowName%3DGeneralOAuthFlow%26as%3DS-752236609%253A1765048625800805%26client_id%3D481804954423-74mggau4n6ikj6eo1bo3l6llfc9j7p76.apps.googleusercontent.com%26requestPath%3D%252Fsignin%252Foauth%252Fconsent%23&app_domain=https%3A%2F%2Fthxrxacsrwtadvvdwken.supabase.co&rart=ANgoxcdxuoO2T3Pli4H37u_w3wxEegZLZnsjwWel-nzDSOAVW7gA74IUUMYX0DJG_ki7U6-7_xZha4-cTK4ziGgSgmVwsWzvZU1VqEIhmjNglQbZi_3Qslg:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6f8d6b34-f1ec-4dfc-b9c2-1a68a05725b9/7fe1f96a-3330-49b0-a02a-285b3be9afa7
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007
- **Test Name:** Fail Listing Creation with Invalid Data Inputs
- **Test Code:** [TC007_Fail_Listing_Creation_with_Invalid_Data_Inputs.py](./TC007_Fail_Listing_Creation_with_Invalid_Data_Inputs.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6f8d6b34-f1ec-4dfc-b9c2-1a68a05725b9/c42107ac-3975-4411-b40a-69011afeed9c
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008
- **Test Name:** View Listing Details Including Images, Pricing, and Reviews
- **Test Code:** [TC008_View_Listing_Details_Including_Images_Pricing_and_Reviews.py](./TC008_View_Listing_Details_Including_Images_Pricing_and_Reviews.py)
- **Test Error:** Unable to verify listing details including image gallery, pricing markers, verified badges, and aggregated reviews because access to listing details requires authentication. The provided test credentials were invalid, and the login process redirects to an external Google sign-in page, preventing further automated access. Please provide valid credentials or a public listing details page to continue verification.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[ERROR] Warning: React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.%s fetchPriority fetchpriority 
    at img
    at div
    at div
    at Index (http://127.0.0.1:8080/src/pages/Index.tsx:36:43)
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Outlet (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4494:26)
    at div
    at main
    at _c8 (http://127.0.0.1:8080/src/components/ui/sidebar.tsx:322:62)
    at div
    at div
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at http://127.0.0.1:8080/src/components/ui/sidebar.tsx:50:72
    at Layout
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Routes (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4558:5)
    at Suspense
    at Router (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4501:15)
    at BrowserRouter (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:5247:5)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at LocationProvider (http://127.0.0.1:8080/src/contexts/LocationContext.tsx:25:36)
    at AuthProvider (http://127.0.0.1:8080/src/contexts/AuthContext.tsx:26:32)
    at QueryClientProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=590d1dc8:2934:3)
    at App (http://127.0.0.1:8080/src/App.tsx?t=1765040830332:102:5) (at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-F34GCA6J.js?v=590d1dc8:520:37)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://thxrxacsrwtadvvdwken.supabase.co/auth/v1/token?grant_type=password:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing. (at https://accounts.youtube.com/accounts/CheckConnection?pmpo=https%3A%2F%2Faccounts.google.com&v=1808857819&timestamp=1765048659997:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6f8d6b34-f1ec-4dfc-b9c2-1a68a05725b9/b0f4c09f-d115-43ab-9fc0-dadb7e6963cb
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009
- **Test Name:** Add Listing to Favorites and Remove
- **Test Code:** [TC009_Add_Listing_to_Favorites_and_Remove.py](./TC009_Add_Listing_to_Favorites_and_Remove.py)
- **Test Error:** Login flow is broken and prevents proceeding with the test to add and remove favorites. Reporting the issue and stopping further testing.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[ERROR] Warning: React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.%s fetchPriority fetchpriority 
    at img
    at div
    at div
    at Index (http://127.0.0.1:8080/src/pages/Index.tsx:36:43)
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Outlet (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4494:26)
    at div
    at main
    at _c8 (http://127.0.0.1:8080/src/components/ui/sidebar.tsx:322:62)
    at div
    at div
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at http://127.0.0.1:8080/src/components/ui/sidebar.tsx:50:72
    at Layout
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Routes (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4558:5)
    at Suspense
    at Router (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4501:15)
    at BrowserRouter (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:5247:5)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at LocationProvider (http://127.0.0.1:8080/src/contexts/LocationContext.tsx:25:36)
    at AuthProvider (http://127.0.0.1:8080/src/contexts/AuthContext.tsx:26:32)
    at QueryClientProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=590d1dc8:2934:3)
    at App (http://127.0.0.1:8080/src/App.tsx?t=1765040830332:102:5) (at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-F34GCA6J.js?v=590d1dc8:520:37)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6f8d6b34-f1ec-4dfc-b9c2-1a68a05725b9/6f312e8a-0eee-4101-90ac-a822a2d28589
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010
- **Test Name:** Contact Listing Owner and Lead Creation Verification
- **Test Code:** [TC010_Contact_Listing_Owner_and_Lead_Creation_Verification.py](./TC010_Contact_Listing_Owner_and_Lead_Creation_Verification.py)
- **Test Error:** Testing stopped due to inability to login as user. Both email and Google OAuth login methods failed. Cannot verify lead creation or owner dashboard linkage without successful user login.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[ERROR] Warning: React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.%s fetchPriority fetchpriority 
    at img
    at div
    at div
    at Index (http://127.0.0.1:8080/src/pages/Index.tsx:36:43)
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Outlet (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4494:26)
    at div
    at main
    at _c8 (http://127.0.0.1:8080/src/components/ui/sidebar.tsx:322:62)
    at div
    at div
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at http://127.0.0.1:8080/src/components/ui/sidebar.tsx:50:72
    at Layout
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Routes (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4558:5)
    at Suspense
    at Router (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4501:15)
    at BrowserRouter (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:5247:5)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at LocationProvider (http://127.0.0.1:8080/src/contexts/LocationContext.tsx:25:36)
    at AuthProvider (http://127.0.0.1:8080/src/contexts/AuthContext.tsx:26:32)
    at QueryClientProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=590d1dc8:2934:3)
    at App (http://127.0.0.1:8080/src/App.tsx?t=1765040830332:102:5) (at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-F34GCA6J.js?v=590d1dc8:520:37)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://thxrxacsrwtadvvdwken.supabase.co/auth/v1/token?grant_type=password:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing. (at https://accounts.youtube.com/accounts/CheckConnection?pmpo=https%3A%2F%2Faccounts.google.com&v=-1929946118&timestamp=1765048608123:0:0)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A0C43A00EC000000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at https://accounts.google.com/v3/signin/identifier?opparams=%253Fredirect_to%253Dhttp%25253A%25252F%25252F127.0.0.1%25253A8080%25252Fauth%25252Fcallback&dsh=S287768700%3A1765048602683683&client_id=481804954423-74mggau4n6ikj6eo1bo3l6llfc9j7p76.apps.googleusercontent.com&o2v=2&prompt=select_account&redirect_uri=https%3A%2F%2Fthxrxacsrwtadvvdwken.supabase.co%2Fauth%2Fv1%2Fcallback&response_type=code&scope=email+profile&service=lso&state=eyJhbGciOiJIUzI1NiIsImtpZCI6IlFXSnZNUURvT3ZBMkhTdksiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE3NjUwNDg5MDAsInNpdGVfdXJsIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6ODA4MC8iLCJpZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImZ1bmN0aW9uX2hvb2tzIjpudWxsLCJwcm92aWRlciI6Imdvb2dsZSIsInJlZmVycmVyIjoiaHR0cDovLzEyNy4wLjAuMTo4MDgwL2F1dGgvY2FsbGJhY2siLCJmbG93X3N0YXRlX2lkIjoiYWQwZGVhZmEtNTNhZC00YWNlLWE4N2ItNWY1MWRiZGM1MjQ5In0.Y3J49WAThi9vAhCCIcEtkenWRwK0h8zU_IxK7LxqSv0&flowName=GeneralOAuthFlow&continue=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%2Fconsent%3Fauthuser%3Dunknown%26part%3DAJi8hAN2etcNuSrjJXkFf9OpBohqMYVyZrrIKyyvACFki5uhqLf7CTPCls3s0CK2ukbPr0YxE1tTXjl4wJE2rQxqS89eqxlObJ4hjfKZzgYoCHzxr07C5dRrO19tQrDHyXhgIxosdUk_v0oEcHEVLDxMzi5QEar352IBPSIAPg2Ta5xxosPZ0hJbUJEcIZIbXEYALUhM4rU4SFGJjd-tStrSPqTgH7-iLFv7WPjx_w1Il707_y-UhLSIEWIyqlhw10O5eIrNvUe3lMLrFPFJI88p0Zo1NmQU55zqzF1BH6IyPmAfRT0gHG6MaU3wCv6t-8TgO8XePDiOKy9LK4z1AWCe37vyEBdvM3-1jIepHnkbXj-6hzX1TyIKK0qnxSAJc0HzZBMkGBzk0v_U1ic5N4GgMYRWSYD7wEvtiP3XAiQgKvFCn4YiMOgHPkej9Z9ipS2tFYV8xHcYiVanmJzo42arDdzMcQIiVG4nk03rNngIkcpJMHkxxpk%26flowName%3DGeneralOAuthFlow%26as%3DS287768700%253A1765048602683683%26client_id%3D481804954423-74mggau4n6ikj6eo1bo3l6llfc9j7p76.apps.googleusercontent.com%26requestPath%3D%252Fsignin%252Foauth%252Fconsent%23&app_domain=https%3A%2F%2Fthxrxacsrwtadvvdwken.supabase.co&rart=ANgoxceAYfmKv7Azz8IoT51pvOD5x6Nj9HL8KdAY-wOLixm78phB5FaTBk1DUFaK2ey1HoaycAhNXziJbeU7N4pGJ_KSNTnB0Z7M1O0BBeXyZZnsTjlDTOE:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6f8d6b34-f1ec-4dfc-b9c2-1a68a05725b9/386d5400-1cc0-49ac-8728-8453e45df8fd
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011
- **Test Name:** Update Lead Status and Add Notes
- **Test Code:** [TC011_Update_Lead_Status_and_Add_Notes.py](./TC011_Update_Lead_Status_and_Add_Notes.py)
- **Test Error:** Testing stopped due to inability to login as listing owner. Both email and Google login attempts failed due to invalid credentials and security restrictions. Cannot proceed to verify lead status updates and notes without successful login.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[ERROR] Warning: React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.%s fetchPriority fetchpriority 
    at img
    at div
    at div
    at Index (http://127.0.0.1:8080/src/pages/Index.tsx:36:43)
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Outlet (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4494:26)
    at div
    at main
    at _c8 (http://127.0.0.1:8080/src/components/ui/sidebar.tsx:322:62)
    at div
    at div
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at http://127.0.0.1:8080/src/components/ui/sidebar.tsx:50:72
    at Layout
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Routes (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4558:5)
    at Suspense
    at Router (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4501:15)
    at BrowserRouter (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:5247:5)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at LocationProvider (http://127.0.0.1:8080/src/contexts/LocationContext.tsx:25:36)
    at AuthProvider (http://127.0.0.1:8080/src/contexts/AuthContext.tsx:26:32)
    at QueryClientProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=590d1dc8:2934:3)
    at App (http://127.0.0.1:8080/src/App.tsx?t=1765040830332:102:5) (at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-F34GCA6J.js?v=590d1dc8:520:37)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://thxrxacsrwtadvvdwken.supabase.co/auth/v1/token?grant_type=password:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing. (at https://accounts.youtube.com/accounts/CheckConnection?pmpo=https%3A%2F%2Faccounts.google.com&v=-1399365697&timestamp=1765048607661:0:0)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A0983A001C380000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at https://accounts.google.com/v3/signin/identifier?opparams=%253Fredirect_to%253Dhttp%25253A%25252F%25252F127.0.0.1%25253A8080%25252Fauth%25252Fcallback&dsh=S238320468%3A1765048602552864&client_id=481804954423-74mggau4n6ikj6eo1bo3l6llfc9j7p76.apps.googleusercontent.com&o2v=2&prompt=select_account&redirect_uri=https%3A%2F%2Fthxrxacsrwtadvvdwken.supabase.co%2Fauth%2Fv1%2Fcallback&response_type=code&scope=email+profile&service=lso&state=eyJhbGciOiJIUzI1NiIsImtpZCI6IlFXSnZNUURvT3ZBMkhTdksiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE3NjUwNDg5MDAsInNpdGVfdXJsIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6ODA4MC8iLCJpZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImZ1bmN0aW9uX2hvb2tzIjpudWxsLCJwcm92aWRlciI6Imdvb2dsZSIsInJlZmVycmVyIjoiaHR0cDovLzEyNy4wLjAuMTo4MDgwL2F1dGgvY2FsbGJhY2siLCJmbG93X3N0YXRlX2lkIjoiNGUyNzg5NmYtMzY2NC00MmE3LWI3YjUtZTQ4MDJjM2IwMWQwIn0.u3RzjBU_3DBWFg-UYKAW8rSr_J1OSxm-gV5RJIPg0ik&flowName=GeneralOAuthFlow&continue=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%2Fconsent%3Fauthuser%3Dunknown%26part%3DAJi8hAN6CKtij_pb7dV3xMgQQyEiaOtuH6KPvL-PzbTFIjOABNJQ7V90aeJzGlMmnyq5F18ZQ74ShXNbJiRN3_F25EunYiZjXJAKegQdVxbVsJrvGUjrr4RHDxUj8UinCWDtlSZJPJ_caSJgTjgVWUvCXx3PuhAkwMy_iUtQb_efYNCVwtKD9-rUWPxcFXNzw0cr6qnMw6ZKvuv15q_-JAwlsCcLS2vKUk0akGvWfqv35Ffv_PUkngncUzq-9I1DfhqV4NIHa7fIF7LLopKEjIQGW6wFxfvYa9crEz1VZmm2tFEfr9Ozg9wKwt0L-9_Fy_O5Waez_0lEEr34V07Q-yOaO4dVhDrW0OYSnzTZjUgkdJ3GsgjXTs8sNmB7KqgrQyxreC7X_eeawvLRG4L_7nmfHwB9W8t9BlT8RTuHLilBLvDUKEJS_Yi3IQoAhPCOJhhFVpKBJIoBNMFzpzQKwDaw-conLCdav7flyyFEMQABg2G-GoCOyvs%26flowName%3DGeneralOAuthFlow%26as%3DS238320468%253A1765048602552864%26client_id%3D481804954423-74mggau4n6ikj6eo1bo3l6llfc9j7p76.apps.googleusercontent.com%26requestPath%3D%252Fsignin%252Foauth%252Fconsent%23&app_domain=https%3A%2F%2Fthxrxacsrwtadvvdwken.supabase.co&rart=ANgoxcfvfUUiBfO9Bp_598ix4eeuKA5YSVJZs9HVUkEXzie_bWo9a3xhCUt36lrXUTlblZyqeMPxKGurZUEonOeIvPMvsRBRCgYVnoRoJkOVfw2TqmuDz9M:0:0)
[WARNING] An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing. (at https://accounts.youtube.com/accounts/CheckConnection?pmpo=https%3A%2F%2Faccounts.google.com&v=-1399365697&timestamp=1765048654506:0:0)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A0983A001C380000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at https://accounts.google.com/v3/signin/identifier?opparams=%253Fredirect_to%253Dhttp%25253A%25252F%25252F127.0.0.1%25253A8080%25252Fauth%25252Fcallback&dsh=S238320468%3A1765048602552864&client_id=481804954423-74mggau4n6ikj6eo1bo3l6llfc9j7p76.apps.googleusercontent.com&o2v=2&prompt=select_account&redirect_uri=https%3A%2F%2Fthxrxacsrwtadvvdwken.supabase.co%2Fauth%2Fv1%2Fcallback&response_type=code&scope=email+profile&service=lso&state=eyJhbGciOiJIUzI1NiIsImtpZCI6IlFXSnZNUURvT3ZBMkhTdksiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE3NjUwNDg5MDAsInNpdGVfdXJsIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6ODA4MC8iLCJpZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImZ1bmN0aW9uX2hvb2tzIjpudWxsLCJwcm92aWRlciI6Imdvb2dsZSIsInJlZmVycmVyIjoiaHR0cDovLzEyNy4wLjAuMTo4MDgwL2F1dGgvY2FsbGJhY2siLCJmbG93X3N0YXRlX2lkIjoiNGUyNzg5NmYtMzY2NC00MmE3LWI3YjUtZTQ4MDJjM2IwMWQwIn0.u3RzjBU_3DBWFg-UYKAW8rSr_J1OSxm-gV5RJIPg0ik&flowName=GeneralOAuthFlow&continue=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%2Fconsent%3Fauthuser%3Dunknown%26part%3DAJi8hAN6CKtij_pb7dV3xMgQQyEiaOtuH6KPvL-PzbTFIjOABNJQ7V90aeJzGlMmnyq5F18ZQ74ShXNbJiRN3_F25EunYiZjXJAKegQdVxbVsJrvGUjrr4RHDxUj8UinCWDtlSZJPJ_caSJgTjgVWUvCXx3PuhAkwMy_iUtQb_efYNCVwtKD9-rUWPxcFXNzw0cr6qnMw6ZKvuv15q_-JAwlsCcLS2vKUk0akGvWfqv35Ffv_PUkngncUzq-9I1DfhqV4NIHa7fIF7LLopKEjIQGW6wFxfvYa9crEz1VZmm2tFEfr9Ozg9wKwt0L-9_Fy_O5Waez_0lEEr34V07Q-yOaO4dVhDrW0OYSnzTZjUgkdJ3GsgjXTs8sNmB7KqgrQyxreC7X_eeawvLRG4L_7nmfHwB9W8t9BlT8RTuHLilBLvDUKEJS_Yi3IQoAhPCOJhhFVpKBJIoBNMFzpzQKwDaw-conLCdav7flyyFEMQABg2G-GoCOyvs%26flowName%3DGeneralOAuthFlow%26as%3DS238320468%253A1765048602552864%26client_id%3D481804954423-74mggau4n6ikj6eo1bo3l6llfc9j7p76.apps.googleusercontent.com%26requestPath%3D%252Fsignin%252Foauth%252Fconsent%23&app_domain=https%3A%2F%2Fthxrxacsrwtadvvdwken.supabase.co&rart=ANgoxcfvfUUiBfO9Bp_598ix4eeuKA5YSVJZs9HVUkEXzie_bWo9a3xhCUt36lrXUTlblZyqeMPxKGurZUEonOeIvPMvsRBRCgYVnoRoJkOVfw2TqmuDz9M:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6f8d6b34-f1ec-4dfc-b9c2-1a68a05725b9/6bd403f5-e86c-439c-9666-5dfe5d7e2362
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012
- **Test Name:** Create and Manage Ad Campaign with Analytics Tracking
- **Test Code:** [TC012_Create_and_Manage_Ad_Campaign_with_Analytics_Tracking.py](./TC012_Create_and_Manage_Ad_Campaign_with_Analytics_Tracking.py)
- **Test Error:** Unable to proceed with the task as login attempts for the listing owner failed due to invalid credentials and OAuth login restrictions. Without successful login, the campaign creation and analytics verification cannot be performed. Please provide valid credentials or an alternative login method to continue testing.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[ERROR] Warning: React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.%s fetchPriority fetchpriority 
    at img
    at div
    at div
    at Index (http://127.0.0.1:8080/src/pages/Index.tsx:36:43)
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Outlet (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4494:26)
    at div
    at main
    at _c8 (http://127.0.0.1:8080/src/components/ui/sidebar.tsx:322:62)
    at div
    at div
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at http://127.0.0.1:8080/src/components/ui/sidebar.tsx:50:72
    at Layout
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Routes (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4558:5)
    at Suspense
    at Router (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4501:15)
    at BrowserRouter (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:5247:5)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at LocationProvider (http://127.0.0.1:8080/src/contexts/LocationContext.tsx:25:36)
    at AuthProvider (http://127.0.0.1:8080/src/contexts/AuthContext.tsx:26:32)
    at QueryClientProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=590d1dc8:2934:3)
    at App (http://127.0.0.1:8080/src/App.tsx?t=1765040830332:102:5) (at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-F34GCA6J.js?v=590d1dc8:520:37)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://thxrxacsrwtadvvdwken.supabase.co/auth/v1/token?grant_type=password:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://thxrxacsrwtadvvdwken.supabase.co/auth/v1/token?grant_type=password:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing. (at https://accounts.youtube.com/accounts/CheckConnection?pmpo=https%3A%2F%2Faccounts.google.com&v=-1153894690&timestamp=1765048671976:0:0)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A06C3B00641B0000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at https://accounts.google.com/v3/signin/identifier?opparams=%253Fredirect_to%253Dhttp%25253A%25252F%25252F127.0.0.1%25253A8080%25252Fauth%25252Fcallback&dsh=S-1743146025%3A1765048666134858&client_id=481804954423-74mggau4n6ikj6eo1bo3l6llfc9j7p76.apps.googleusercontent.com&o2v=2&prompt=select_account&redirect_uri=https%3A%2F%2Fthxrxacsrwtadvvdwken.supabase.co%2Fauth%2Fv1%2Fcallback&response_type=code&scope=email+profile&service=lso&state=eyJhbGciOiJIUzI1NiIsImtpZCI6IlFXSnZNUURvT3ZBMkhTdksiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE3NjUwNDg5NjMsInNpdGVfdXJsIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6ODA4MC8iLCJpZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImZ1bmN0aW9uX2hvb2tzIjpudWxsLCJwcm92aWRlciI6Imdvb2dsZSIsInJlZmVycmVyIjoiaHR0cDovLzEyNy4wLjAuMTo4MDgwL2F1dGgvY2FsbGJhY2siLCJmbG93X3N0YXRlX2lkIjoiYWM3MWU1YzktNTk2OC00ZWMxLTlmMzgtMGZiMTYyODVkY2E3In0.dK9IqJQLWIgA5xtitruVDD4b4Wr7fKIYaf8ebpVlbJ0&flowName=GeneralOAuthFlow&continue=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%2Fconsent%3Fauthuser%3Dunknown%26part%3DAJi8hANpDjXbZviPfeyQa6rrQH7TAOl_XjxulvVa7pcJ8iCgnNcTtbIXn233uFu-qK1-R8g_5itlptJM5yOjHVpBAYrbRiC-YIEIjvuhLzjZI8xJ_AiStWb_lRM1S5Mig0xww6uv3vRLaGGoq1qNzKrYTLj28GcGzT24RqFw-3B7K5TVZvjhJ0KzQo9pPhbS9OVrZxo4oY2l20f46fCQg_pfkQYx1Lqe0WFc4q4roX9zVSZk_psIHGyZaR7jfijR54QrkoCRmAY9zUaH_tytzLGA5ClyWKQ5VDayfL9dQsP9XMIqNjE1m1Qa3ZiprO8XzpKUJKY9fuQKrlk17s-tynUS31I6AbqzcFrBbHv_fs8yJt69S6PeiQcGlB29JpOY5tWWAO1QbV9weXLLevsfESHEEC_dmglfeV_igrUalNTxOSnH5O_IkxoCBNB3YV_mEjHwxAnQC7fpdkEGuUP9qEhYdo_ZR8PNmbn9tyAPL9HZL4JLss-3JyA%26flowName%3DGeneralOAuthFlow%26as%3DS-1743146025%253A1765048666134858%26client_id%3D481804954423-74mggau4n6ikj6eo1bo3l6llfc9j7p76.apps.googleusercontent.com%26requestPath%3D%252Fsignin%252Foauth%252Fconsent%23&app_domain=https%3A%2F%2Fthxrxacsrwtadvvdwken.supabase.co&rart=ANgoxcd7U5NXuTcRNF8NdB7m4ycwePIP5C31eTp3mWZZv_X2bi4BIclYYaEPNXlaRfUAv4kn9q4dqeLRYLZXY_ZKLZPfg4dyhWKqAMYX9YUFSts1gtuMCFQ:0:0)
[WARNING] An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing. (at https://accounts.youtube.com/accounts/CheckConnection?pmpo=https%3A%2F%2Faccounts.google.com&v=1434133676&timestamp=1765048706896:0:0)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A06C3B00641B0000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at https://accounts.google.com/v3/signin/identifier?opparams=%253Fredirect_to%253Dhttp%25253A%25252F%25252F127.0.0.1%25253A8080%25252Fauth%25252Fcallback&dsh=S908454061%3A1765048705098140&app_domain=https%3A%2F%2Fthxrxacsrwtadvvdwken.supabase.co&client_id=481804954423-74mggau4n6ikj6eo1bo3l6llfc9j7p76.apps.googleusercontent.com&continue=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%2Fconsent%3Fauthuser%3Dunknown%26part%3DAJi8hAPskN00gpD-5xsGKNUCR5OZh3N9Cd-bdSHqq-llLSnRxnKgLkPw4fnvIEURyVE-O3SbPHnaVePxPWE8vSnV_mOR481R5nkp6b_EEmL_E0pci9xEm4569sQHcnk4rWwFFP4aedcQbI21yUWnvOJ0RQZ0JdlG5eulFMkCPRKcQ0-hz_qabOIl69-TRXTmFVEkHRMpHPb5dMlnscq3pVciHNm7964MLlmvyCGPnQTN52QovvnkEB2gjULTkRPZOc2maMg0v0JOV1wtOBuY0FpZl1dhSRA2u4fwWY4zIwreCg442W83O7rOn8_HafznKOQsCyULnxq2hcs-zoRTFJY2XiQAsg1ePQzRkBc1YGiBSHtLhwggpICPxafkQkp_h9BsfWWl_GFcJWXQOQm-0hGqiKuV_Ha-4hxx5Gxvx4ONXNsnoKWS2_s8xdMKdS42mI9iRmPT_emgwlI0HCqGvjjgniHG5jNfvRR89zAzCtziS0j3fiF1KUk%26flowName%3DGeneralOAuthFlow%26as%3DS908454061%253A1765048705098140%26client_id%3D481804954423-74mggau4n6ikj6eo1bo3l6llfc9j7p76.apps.googleusercontent.com%26requestPath%3D%252Fsignin%252Foauth%252Fconsent%23&flowName=GeneralOAuthFlow&o2v=2&prompt=select_account&rart=ANgoxcdviHcoAVIhOHXSCJjSP9DNDtE-BOe0D8s0H-QV2rWA9pCKHZNXDRrl7GGHyIXQ12INuo70uoHKYORtkwmvB9sDDjAPGGi9kb0uR_kFE_qOx-RNuNM&redirect_uri=https%3A%2F%2Fthxrxacsrwtadvvdwken.supabase.co%2Fauth%2Fv1%2Fcallback&response_type=code&scope=email+profile&service=lso&state=eyJhbGciOiJIUzI1NiIsImtpZCI6IlFXSnZNUURvT3ZBMkhTdksiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE3NjUwNDg5NjMsInNpdGVfdXJsIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6ODA4MC8iLCJpZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImZ1bmN0aW9uX2hvb2tzIjpudWxsLCJwcm92aWRlciI6Imdvb2dsZSIsInJlZmVycmVyIjoiaHR0cDovLzEyNy4wLjAuMTo4MDgwL2F1dGgvY2FsbGJhY2siLCJmbG93X3N0YXRlX2lkIjoiYWM3MWU1YzktNTk2OC00ZWMxLTlmMzgtMGZiMTYyODVkY2E3In0.dK9IqJQLWIgA5xtitruVDD4b4Wr7fKIYaf8ebpVlbJ0:0:0)
[WARNING] An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing. (at https://accounts.youtube.com/accounts/CheckConnection?pmpo=https%3A%2F%2Faccounts.google.com&v=283837754&timestamp=1765048752135:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6f8d6b34-f1ec-4dfc-b9c2-1a68a05725b9/0fea05e0-586a-496d-a203-16e4232be4ef
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013
- **Test Name:** Write Eligible Review and Enforce One Review per User
- **Test Code:** [TC013_Write_Eligible_Review_and_Enforce_One_Review_per_User.py](./TC013_Write_Eligible_Review_and_Enforce_One_Review_per_User.py)
- **Test Error:** Login failure for eligible users prevents testing review submission functionality. Reported issue and stopping further testing until resolved.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[ERROR] Warning: React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.%s fetchPriority fetchpriority 
    at img
    at div
    at div
    at Index (http://127.0.0.1:8080/src/pages/Index.tsx:36:43)
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Outlet (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4494:26)
    at div
    at main
    at _c8 (http://127.0.0.1:8080/src/components/ui/sidebar.tsx:322:62)
    at div
    at div
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at http://127.0.0.1:8080/src/components/ui/sidebar.tsx:50:72
    at Layout
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Routes (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4558:5)
    at Suspense
    at Router (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4501:15)
    at BrowserRouter (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:5247:5)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at LocationProvider (http://127.0.0.1:8080/src/contexts/LocationContext.tsx:25:36)
    at AuthProvider (http://127.0.0.1:8080/src/contexts/AuthContext.tsx:26:32)
    at QueryClientProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=590d1dc8:2934:3)
    at App (http://127.0.0.1:8080/src/App.tsx?t=1765040830332:102:5) (at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-F34GCA6J.js?v=590d1dc8:520:37)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://thxrxacsrwtadvvdwken.supabase.co/auth/v1/token?grant_type=password:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://thxrxacsrwtadvvdwken.supabase.co/auth/v1/token?grant_type=password:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6f8d6b34-f1ec-4dfc-b9c2-1a68a05725b9/8964122c-d1e4-434a-9305-1aa6c8f47c6a
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014
- **Test Name:** Report Listings and Users with Admin Moderation Workflow
- **Test Code:** [TC014_Report_Listings_and_Users_with_Admin_Moderation_Workflow.py](./TC014_Report_Listings_and_Users_with_Admin_Moderation_Workflow.py)
- **Test Error:** User login failed via all tested methods (email and Google OAuth) due to authentication and security errors. Cannot proceed with testing user reporting and admin review features. Recommend fixing login issues before retesting.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[ERROR] Warning: React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.%s fetchPriority fetchpriority 
    at img
    at div
    at div
    at Index (http://127.0.0.1:8080/src/pages/Index.tsx:36:43)
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Outlet (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4494:26)
    at div
    at main
    at _c8 (http://127.0.0.1:8080/src/components/ui/sidebar.tsx:322:62)
    at div
    at div
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at http://127.0.0.1:8080/src/components/ui/sidebar.tsx:50:72
    at Layout
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Routes (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4558:5)
    at Suspense
    at Router (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4501:15)
    at BrowserRouter (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:5247:5)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at LocationProvider (http://127.0.0.1:8080/src/contexts/LocationContext.tsx:25:36)
    at AuthProvider (http://127.0.0.1:8080/src/contexts/AuthContext.tsx:26:32)
    at QueryClientProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=590d1dc8:2934:3)
    at App (http://127.0.0.1:8080/src/App.tsx?t=1765040830332:102:5) (at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-F34GCA6J.js?v=590d1dc8:520:37)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://thxrxacsrwtadvvdwken.supabase.co/auth/v1/token?grant_type=password:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing. (at https://accounts.youtube.com/accounts/CheckConnection?pmpo=https%3A%2F%2Faccounts.google.com&v=-1180102696&timestamp=1765048630653:0:0)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A0183B002C090000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at https://accounts.google.com/v3/signin/identifier?opparams=%253Fredirect_to%253Dhttp%25253A%25252F%25252F127.0.0.1%25253A8080%25252Fauth%25252Fcallback&dsh=S-1793607476%3A1765048625147102&client_id=481804954423-74mggau4n6ikj6eo1bo3l6llfc9j7p76.apps.googleusercontent.com&o2v=2&prompt=select_account&redirect_uri=https%3A%2F%2Fthxrxacsrwtadvvdwken.supabase.co%2Fauth%2Fv1%2Fcallback&response_type=code&scope=email+profile&service=lso&state=eyJhbGciOiJIUzI1NiIsImtpZCI6IlFXSnZNUURvT3ZBMkhTdksiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE3NjUwNDg5MjIsInNpdGVfdXJsIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6ODA4MC8iLCJpZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImZ1bmN0aW9uX2hvb2tzIjpudWxsLCJwcm92aWRlciI6Imdvb2dsZSIsInJlZmVycmVyIjoiaHR0cDovLzEyNy4wLjAuMTo4MDgwL2F1dGgvY2FsbGJhY2siLCJmbG93X3N0YXRlX2lkIjoiZjMyYjM3ZjktYjc5MC00ZjFhLTg3MmYtMGNjMmQ0MzU5MDU4In0.LhzqjvPjo3ZBkJ5BNUW9_7u9X8hHCI9yCKx4n4pToiE&flowName=GeneralOAuthFlow&continue=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%2Fconsent%3Fauthuser%3Dunknown%26part%3DAJi8hAN8P8ztwibql35ZhMARYSW49dcmAQI1PBTYD4w_XA8-UjSYBFMhO_qQiSUHbywY2Zx_Oma8dCaYZFFe9s3tAMJeCEH5iWkmnQhqPUJXZjB7gsyUi21dAcmOj-WAnfbx0ZCzoFzKITzoYSUkAskJzM0IxYEtmM6Pm0KzFFq7jAtJP83-frnj5HoaAXg-VBRwChDEUOOWRypUQNwQTDmYseh_-WlPn9b61_Nui9AQgBNrmf8K8JMaX_GxMLLAYIjm_Np4k_JtaJ0Eq9z99hXIANCzb99tC_niysQ-bCSOpUYpqM29so2uEWhN0N8Wv4lYTfFFq1XCwMYP4TFUM6v32K0tDFLMzAcupD7286Vg8t4KdSORuMVQkeQFNAYUwIBSBfoUHOBYdxVUefMlnKRLAFwENAQXRFO1_u8_SZh58L__pyWWvpAkE-eW0Hqa0PXxBi8BkRswfS9IZsZCg-KDuVp3eXUC4vKt5zp23ovxs41U36bCK7A%26flowName%3DGeneralOAuthFlow%26as%3DS-1793607476%253A1765048625147102%26client_id%3D481804954423-74mggau4n6ikj6eo1bo3l6llfc9j7p76.apps.googleusercontent.com%26requestPath%3D%252Fsignin%252Foauth%252Fconsent%23&app_domain=https%3A%2F%2Fthxrxacsrwtadvvdwken.supabase.co&rart=ANgoxcc3P94qi3PP9JGvETo5z0qJ2tR2CXI4bbQDVuhdJU1kILuwF-zmryT66LvYlwZ2x7-WLTNObgdRhujDtcm6FsY0wyVgZxZoOdiN320GjTVTpFWVI98:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6f8d6b34-f1ec-4dfc-b9c2-1a68a05725b9/60743234-dfef-4bf2-8b55-fb8c6380dd39
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015
- **Test Name:** Real-Time Chat Messaging with Lead Linkage
- **Test Code:** [TC015_Real_Time_Chat_Messaging_with_Lead_Linkage.py](./TC015_Real_Time_Chat_Messaging_with_Lead_Linkage.py)
- **Test Error:** Login attempt failed due to invalid credentials. Cannot proceed with user login without valid credentials. Please provide valid user login credentials to continue testing the chat functionality.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[ERROR] Warning: React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.%s fetchPriority fetchpriority 
    at img
    at div
    at div
    at Index (http://127.0.0.1:8080/src/pages/Index.tsx:36:43)
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Outlet (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4494:26)
    at div
    at main
    at _c8 (http://127.0.0.1:8080/src/components/ui/sidebar.tsx:322:62)
    at div
    at div
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at http://127.0.0.1:8080/src/components/ui/sidebar.tsx:50:72
    at Layout
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Routes (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4558:5)
    at Suspense
    at Router (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4501:15)
    at BrowserRouter (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:5247:5)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at LocationProvider (http://127.0.0.1:8080/src/contexts/LocationContext.tsx:25:36)
    at AuthProvider (http://127.0.0.1:8080/src/contexts/AuthContext.tsx:26:32)
    at QueryClientProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=590d1dc8:2934:3)
    at App (http://127.0.0.1:8080/src/App.tsx?t=1765040830332:102:5) (at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-F34GCA6J.js?v=590d1dc8:520:37)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://thxrxacsrwtadvvdwken.supabase.co/auth/v1/token?grant_type=password:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6f8d6b34-f1ec-4dfc-b9c2-1a68a05725b9/3f678ab5-0981-4830-bb7d-4231d7e051a9
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC016
- **Test Name:** Admin Dashboard Role-Based Access Control
- **Test Code:** [TC016_Admin_Dashboard_Role_Based_Access_Control.py](./TC016_Admin_Dashboard_Role_Based_Access_Control.py)
- **Test Error:** Task stopped due to inability to login as admin user with limited permissions. Repeated invalid login credentials errors prevent further testing of role-based access controls. Please provide valid credentials or fix the login issue to continue.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[ERROR] Warning: React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.%s fetchPriority fetchpriority 
    at img
    at div
    at div
    at Index (http://127.0.0.1:8080/src/pages/Index.tsx:36:43)
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Outlet (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4494:26)
    at div
    at main
    at _c8 (http://127.0.0.1:8080/src/components/ui/sidebar.tsx:322:62)
    at div
    at div
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at http://127.0.0.1:8080/src/components/ui/sidebar.tsx:50:72
    at Layout
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Routes (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4558:5)
    at Suspense
    at Router (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4501:15)
    at BrowserRouter (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:5247:5)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at LocationProvider (http://127.0.0.1:8080/src/contexts/LocationContext.tsx:25:36)
    at AuthProvider (http://127.0.0.1:8080/src/contexts/AuthContext.tsx:26:32)
    at QueryClientProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=590d1dc8:2934:3)
    at App (http://127.0.0.1:8080/src/App.tsx?t=1765040830332:102:5) (at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-F34GCA6J.js?v=590d1dc8:520:37)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://thxrxacsrwtadvvdwken.supabase.co/auth/v1/token?grant_type=password:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://thxrxacsrwtadvvdwken.supabase.co/auth/v1/token?grant_type=password:0:0)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6f8d6b34-f1ec-4dfc-b9c2-1a68a05725b9/fe9ba599-2914-4b1d-a72f-4d60739e01f9
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC017
- **Test Name:** Mobile App Location, Camera, and Sharing Permissions and Features
- **Test Code:** [TC017_Mobile_App_Location_Camera_and_Sharing_Permissions_and_Features.py](./TC017_Mobile_App_Location_Camera_and_Sharing_Permissions_and_Features.py)
- **Test Error:** The app requires login to proceed with permission requests, but Google sign-in is blocked due to security restrictions in the current environment. Unable to verify native permissions for GPS, camera, and sharing features. Recommend testing on a supported device or environment that allows authentication.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[ERROR] Warning: React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.%s fetchPriority fetchpriority 
    at img
    at div
    at div
    at Index (http://127.0.0.1:8080/src/pages/Index.tsx:36:43)
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Outlet (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4494:26)
    at div
    at main
    at _c8 (http://127.0.0.1:8080/src/components/ui/sidebar.tsx:322:62)
    at div
    at div
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at http://127.0.0.1:8080/src/components/ui/sidebar.tsx:50:72
    at Layout
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Routes (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4558:5)
    at Suspense
    at Router (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4501:15)
    at BrowserRouter (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:5247:5)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at LocationProvider (http://127.0.0.1:8080/src/contexts/LocationContext.tsx:25:36)
    at AuthProvider (http://127.0.0.1:8080/src/contexts/AuthContext.tsx:26:32)
    at QueryClientProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=590d1dc8:2934:3)
    at App (http://127.0.0.1:8080/src/App.tsx?t=1765040830332:102:5) (at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-F34GCA6J.js?v=590d1dc8:520:37)
[WARNING] An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing. (at https://accounts.youtube.com/accounts/CheckConnection?pmpo=https%3A%2F%2Faccounts.google.com&v=-1740904406&timestamp=1765048584696:0:0)
[WARNING] [GroupMarkerNotSet(crbug.com/242999)!:A0D83A0024020000]Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content. (at https://accounts.google.com/v3/signin/identifier?opparams=%253Fredirect_to%253Dhttp%25253A%25252F%25252F127.0.0.1%25253A8080%25252Fauth%25252Fcallback&dsh=S1075302553%3A1765048579183010&client_id=481804954423-74mggau4n6ikj6eo1bo3l6llfc9j7p76.apps.googleusercontent.com&o2v=2&prompt=select_account&redirect_uri=https%3A%2F%2Fthxrxacsrwtadvvdwken.supabase.co%2Fauth%2Fv1%2Fcallback&response_type=code&scope=email+profile&service=lso&state=eyJhbGciOiJIUzI1NiIsImtpZCI6IlFXSnZNUURvT3ZBMkhTdksiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE3NjUwNDg4NzcsInNpdGVfdXJsIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6ODA4MC8iLCJpZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImZ1bmN0aW9uX2hvb2tzIjpudWxsLCJwcm92aWRlciI6Imdvb2dsZSIsInJlZmVycmVyIjoiaHR0cDovLzEyNy4wLjAuMTo4MDgwL2F1dGgvY2FsbGJhY2siLCJmbG93X3N0YXRlX2lkIjoiZTkwNjEzN2MtMmI0NS00NzYzLWJjNGUtYmRhNDhhODc4OWY5In0.E0P3LbSsICVy3kC-cFol4H59AKbpAjzM0rVe00Y2FfQ&flowName=GeneralOAuthFlow&continue=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%2Fconsent%3Fauthuser%3Dunknown%26part%3DAJi8hAPx_hBfCpoJY2AKd0iuEESBhVORpflJ4wgBXAOWUHGpvmRz82mA_PhNBHVKj9H_92xc1RLgLRsx3sdH91RU0V2HtH2KB2oX8M5WClfPu6s7rkfbUZbiXad16LBGLEssWM8mOwcai2-7SYE4S2T3wbrzruJHCXOt9kp5Mop59Is8jM93db2yu13iByRQLdNeAsby81_GlPlpgbgktel8ZyvO6wAwyrTB-tPDOeBrH92jO0yj-Qrg7jw0_tEddW6ML68KfuWiarIoyhesXO_2mS09iseurtw1QZa41HtxkkNakMt7dmMLuuMGol-OuUSIMG1grwMmU5YJnLF4gNftYS3i6om0P9N0TWuMT9NujYwvwtjvNZfOLfL7oknhagOxsB0DgdYaM-g0EkGyuZCSY5W5RmRHBKJ2exXDVw0qr-6U1Pn6y4FfV8BBRsfWT9fyVhCuVfrsqcL4NCcJss1FumLWfSHob4RBUW5KGS4VaT9rjcK2SeE%26flowName%3DGeneralOAuthFlow%26as%3DS1075302553%253A1765048579183010%26client_id%3D481804954423-74mggau4n6ikj6eo1bo3l6llfc9j7p76.apps.googleusercontent.com%26requestPath%3D%252Fsignin%252Foauth%252Fconsent%23&app_domain=https%3A%2F%2Fthxrxacsrwtadvvdwken.supabase.co&rart=ANgoxcdyYQyzm0-V2w9UBmVHxG2eRCrOq83QLX05BqwGRwjwy4Wwgtmd8Pt4MylWpjyqPG8s9HW09cGZKgtHMHO6F-wGWF3sgPg5JT7esF6UaThPcnq-2QE:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6f8d6b34-f1ec-4dfc-b9c2-1a68a05725b9/26c0e0df-fc69-4916-9bb8-f56b1d52ac77
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC018
- **Test Name:** Performance Benchmark Testing with Lighthouse
- **Test Code:** [TC018_Performance_Benchmark_Testing_with_Lighthouse.py](./TC018_Performance_Benchmark_Testing_with_Lighthouse.py)
- **Test Error:** The web application homepage does not provide Lighthouse audit results or scores for Performance, SEO, Accessibility, or load time. Therefore, it is not possible to verify the benchmarks internally. The issue has been reported. Task is now complete.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[ERROR] Warning: React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.%s fetchPriority fetchpriority 
    at img
    at div
    at div
    at Index (http://127.0.0.1:8080/src/pages/Index.tsx:36:43)
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Outlet (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4494:26)
    at div
    at main
    at _c8 (http://127.0.0.1:8080/src/components/ui/sidebar.tsx:322:62)
    at div
    at div
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at http://127.0.0.1:8080/src/components/ui/sidebar.tsx:50:72
    at Layout
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Routes (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4558:5)
    at Suspense
    at Router (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4501:15)
    at BrowserRouter (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:5247:5)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at LocationProvider (http://127.0.0.1:8080/src/contexts/LocationContext.tsx:25:36)
    at AuthProvider (http://127.0.0.1:8080/src/contexts/AuthContext.tsx:26:32)
    at QueryClientProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=590d1dc8:2934:3)
    at App (http://127.0.0.1:8080/src/App.tsx?t=1765040830332:102:5) (at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-F34GCA6J.js?v=590d1dc8:520:37)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6f8d6b34-f1ec-4dfc-b9c2-1a68a05725b9/abfde8df-9b85-4af6-8f75-88a06904c32e
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC019
- **Test Name:** Security Enforcement of Row Level Security on APIs and Data
- **Test Code:** [TC019_Security_Enforcement_of_Row_Level_Security_on_APIs_and_Data.py](./TC019_Security_Enforcement_of_Row_Level_Security_on_APIs_and_Data.py)
- **Test Error:** Login attempt failed due to invalid credentials. Cannot proceed with testing access control for other users' private data without valid login. Please provide valid normal user credentials or alternative login method to continue testing.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[ERROR] Warning: React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.%s fetchPriority fetchpriority 
    at img
    at div
    at div
    at Index (http://127.0.0.1:8080/src/pages/Index.tsx:36:43)
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Outlet (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4494:26)
    at div
    at main
    at _c8 (http://127.0.0.1:8080/src/components/ui/sidebar.tsx:322:62)
    at div
    at div
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at http://127.0.0.1:8080/src/components/ui/sidebar.tsx:50:72
    at Layout
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Routes (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4558:5)
    at Suspense
    at Router (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4501:15)
    at BrowserRouter (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:5247:5)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at LocationProvider (http://127.0.0.1:8080/src/contexts/LocationContext.tsx:25:36)
    at AuthProvider (http://127.0.0.1:8080/src/contexts/AuthContext.tsx:26:32)
    at QueryClientProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=590d1dc8:2934:3)
    at App (http://127.0.0.1:8080/src/App.tsx?t=1765040830332:102:5) (at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-F34GCA6J.js?v=590d1dc8:520:37)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://thxrxacsrwtadvvdwken.supabase.co/auth/v1/token?grant_type=password:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6f8d6b34-f1ec-4dfc-b9c2-1a68a05725b9/ff53bd02-7f84-447c-b85b-50ff608154bd
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC020
- **Test Name:** Map View with Zillow-Style Clustering and Price Markers
- **Test Code:** [TC020_Map_View_with_Zillow_Style_Clustering_and_Price_Markers.py](./TC020_Map_View_with_Zillow_Style_Clustering_and_Price_Markers.py)
- **Test Error:** The map view page displays listings as price markers with clustering as expected. However, the 'Filters' button does not open any filter options, blocking further testing of filter functionality and real-time updates. Reporting this issue and stopping further testing.
Browser Console Logs:
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[ERROR] Warning: React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.%s fetchPriority fetchpriority 
    at img
    at div
    at div
    at Index (http://127.0.0.1:8080/src/pages/Index.tsx:36:43)
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Outlet (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4494:26)
    at div
    at main
    at _c8 (http://127.0.0.1:8080/src/components/ui/sidebar.tsx:322:62)
    at div
    at div
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at http://127.0.0.1:8080/src/components/ui/sidebar.tsx:50:72
    at Layout
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Routes (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4558:5)
    at Suspense
    at Router (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4501:15)
    at BrowserRouter (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:5247:5)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at LocationProvider (http://127.0.0.1:8080/src/contexts/LocationContext.tsx:25:36)
    at AuthProvider (http://127.0.0.1:8080/src/contexts/AuthContext.tsx:26:32)
    at QueryClientProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=590d1dc8:2934:3)
    at App (http://127.0.0.1:8080/src/App.tsx?t=1765040830332:102:5) (at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-F34GCA6J.js?v=590d1dc8:520:37)
[ERROR] The above error occurred in the <SelectItem> component:

    at http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-select.js?v=590d1dc8:851:7
    at _c8 (http://127.0.0.1:8080/src/components/ui/select.tsx:143:60)
    at div
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-CFLEJNO6.js?v=590d1dc8:43:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=590d1dc8:79:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=590d1dc8:56:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-2XVWDIH6.js?v=590d1dc8:41:15
    at http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-select.js?v=590d1dc8:762:13
    at div
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=590d1dc8:79:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=590d1dc8:56:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-2XVWDIH6.js?v=590d1dc8:41:15
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-select.js?v=590d1dc8:305:58
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=590d1dc8:79:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=590d1dc8:56:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-CFLEJNO6.js?v=590d1dc8:43:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3MXZQP3H.js?v=590d1dc8:262:22
    at SelectPortal
    at _c4 (http://127.0.0.1:8080/src/components/ui/select.tsx:92:63)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at CollectionProvider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-2XVWDIH6.js?v=590d1dc8:31:13)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at Popper (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-IJEJ4GM2.js?v=590d1dc8:1947:11)
    at Select (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-select.js?v=590d1dc8:91:5)
    at div
    at div
    at div
    at _c (http://127.0.0.1:8080/src/components/ui/card.tsx:23:53)
    at MapFilters (http://127.0.0.1:8080/src/components/MapFilters.tsx:27:23)
    at div
    at div
    at div
    at div
    at MapView (http://127.0.0.1:8080/src/pages/MapView.tsx:39:22)
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Outlet (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4494:26)
    at div
    at main
    at _c8 (http://127.0.0.1:8080/src/components/ui/sidebar.tsx:322:62)
    at div
    at div
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at http://127.0.0.1:8080/src/components/ui/sidebar.tsx:50:72
    at Layout
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Routes (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4558:5)
    at Suspense
    at Router (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4501:15)
    at BrowserRouter (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:5247:5)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at LocationProvider (http://127.0.0.1:8080/src/contexts/LocationContext.tsx:25:36)
    at AuthProvider (http://127.0.0.1:8080/src/contexts/AuthContext.tsx:26:32)
    at QueryClientProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=590d1dc8:2934:3)
    at App (http://127.0.0.1:8080/src/App.tsx?t=1765040830332:102:5)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries. (at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-F34GCA6J.js?v=590d1dc8:14079:30)
[ERROR] The above error occurred in the <SelectItem> component:

    at http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-select.js?v=590d1dc8:851:7
    at _c8 (http://127.0.0.1:8080/src/components/ui/select.tsx:143:60)
    at div
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-CFLEJNO6.js?v=590d1dc8:43:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=590d1dc8:79:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=590d1dc8:56:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-2XVWDIH6.js?v=590d1dc8:41:15
    at http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-select.js?v=590d1dc8:762:13
    at div
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=590d1dc8:79:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=590d1dc8:56:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-2XVWDIH6.js?v=590d1dc8:41:15
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-select.js?v=590d1dc8:305:58
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=590d1dc8:79:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=590d1dc8:56:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-CFLEJNO6.js?v=590d1dc8:43:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3MXZQP3H.js?v=590d1dc8:262:22
    at SelectPortal
    at _c4 (http://127.0.0.1:8080/src/components/ui/select.tsx:92:63)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at CollectionProvider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-2XVWDIH6.js?v=590d1dc8:31:13)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at Popper (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-IJEJ4GM2.js?v=590d1dc8:1947:11)
    at Select (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-select.js?v=590d1dc8:91:5)
    at div
    at div
    at div
    at _c (http://127.0.0.1:8080/src/components/ui/card.tsx:23:53)
    at MapFilters (http://127.0.0.1:8080/src/components/MapFilters.tsx:27:23)
    at div
    at div
    at div
    at div
    at MapView (http://127.0.0.1:8080/src/pages/MapView.tsx:39:22)
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Outlet (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4494:26)
    at div
    at main
    at _c8 (http://127.0.0.1:8080/src/components/ui/sidebar.tsx:322:62)
    at div
    at div
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at http://127.0.0.1:8080/src/components/ui/sidebar.tsx:50:72
    at Layout
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Routes (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4558:5)
    at Suspense
    at Router (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4501:15)
    at BrowserRouter (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:5247:5)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at LocationProvider (http://127.0.0.1:8080/src/contexts/LocationContext.tsx:25:36)
    at AuthProvider (http://127.0.0.1:8080/src/contexts/AuthContext.tsx:26:32)
    at QueryClientProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=590d1dc8:2934:3)
    at App (http://127.0.0.1:8080/src/App.tsx?t=1765040830332:102:5)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries. (at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-F34GCA6J.js?v=590d1dc8:14079:30)
[ERROR] The above error occurred in the <SelectItem> component:

    at http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-select.js?v=590d1dc8:851:7
    at _c8 (http://127.0.0.1:8080/src/components/ui/select.tsx:143:60)
    at div
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-CFLEJNO6.js?v=590d1dc8:43:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=590d1dc8:79:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=590d1dc8:56:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-2XVWDIH6.js?v=590d1dc8:41:15
    at http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-select.js?v=590d1dc8:762:13
    at div
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=590d1dc8:79:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=590d1dc8:56:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-2XVWDIH6.js?v=590d1dc8:41:15
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-select.js?v=590d1dc8:305:58
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=590d1dc8:79:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=590d1dc8:56:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-CFLEJNO6.js?v=590d1dc8:43:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3MXZQP3H.js?v=590d1dc8:262:22
    at SelectPortal
    at _c4 (http://127.0.0.1:8080/src/components/ui/select.tsx:92:63)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at CollectionProvider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-2XVWDIH6.js?v=590d1dc8:31:13)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at Popper (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-IJEJ4GM2.js?v=590d1dc8:1947:11)
    at Select (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-select.js?v=590d1dc8:91:5)
    at div
    at div
    at div
    at _c (http://127.0.0.1:8080/src/components/ui/card.tsx:23:53)
    at MapFilters (http://127.0.0.1:8080/src/components/MapFilters.tsx:27:23)
    at div
    at div
    at div
    at MapView (http://127.0.0.1:8080/src/pages/MapView.tsx:39:22)
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Outlet (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4494:26)
    at div
    at main
    at _c8 (http://127.0.0.1:8080/src/components/ui/sidebar.tsx:322:62)
    at div
    at div
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at http://127.0.0.1:8080/src/components/ui/sidebar.tsx:50:72
    at Layout
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Routes (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4558:5)
    at Suspense
    at Router (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4501:15)
    at BrowserRouter (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:5247:5)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at LocationProvider (http://127.0.0.1:8080/src/contexts/LocationContext.tsx:25:36)
    at AuthProvider (http://127.0.0.1:8080/src/contexts/AuthContext.tsx:26:32)
    at QueryClientProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=590d1dc8:2934:3)
    at App (http://127.0.0.1:8080/src/App.tsx?t=1765040830332:102:5)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries. (at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-F34GCA6J.js?v=590d1dc8:14079:30)
[ERROR] The above error occurred in the <SelectItem> component:

    at http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-select.js?v=590d1dc8:851:7
    at _c8 (http://127.0.0.1:8080/src/components/ui/select.tsx:143:60)
    at div
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-CFLEJNO6.js?v=590d1dc8:43:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=590d1dc8:79:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=590d1dc8:56:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-2XVWDIH6.js?v=590d1dc8:41:15
    at http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-select.js?v=590d1dc8:762:13
    at div
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=590d1dc8:79:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=590d1dc8:56:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-2XVWDIH6.js?v=590d1dc8:41:15
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-select.js?v=590d1dc8:305:58
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=590d1dc8:79:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=590d1dc8:56:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-CFLEJNO6.js?v=590d1dc8:43:13
    at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3MXZQP3H.js?v=590d1dc8:262:22
    at SelectPortal
    at _c4 (http://127.0.0.1:8080/src/components/ui/select.tsx:92:63)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at CollectionProvider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-2XVWDIH6.js?v=590d1dc8:31:13)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at Popper (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-IJEJ4GM2.js?v=590d1dc8:1947:11)
    at Select (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-select.js?v=590d1dc8:91:5)
    at div
    at div
    at div
    at _c (http://127.0.0.1:8080/src/components/ui/card.tsx:23:53)
    at MapFilters (http://127.0.0.1:8080/src/components/MapFilters.tsx:27:23)
    at div
    at div
    at div
    at MapView (http://127.0.0.1:8080/src/pages/MapView.tsx:39:22)
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Outlet (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4494:26)
    at div
    at main
    at _c8 (http://127.0.0.1:8080/src/components/ui/sidebar.tsx:322:62)
    at div
    at div
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at http://127.0.0.1:8080/src/components/ui/sidebar.tsx:50:72
    at Layout
    at RenderedRoute (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4088:5)
    at Routes (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4558:5)
    at Suspense
    at Router (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4501:15)
    at BrowserRouter (http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:5247:5)
    at Provider (http://127.0.0.1:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=590d1dc8:38:15)
    at TooltipProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=590d1dc8:65:5)
    at LocationProvider (http://127.0.0.1:8080/src/contexts/LocationContext.tsx:25:36)
    at AuthProvider (http://127.0.0.1:8080/src/contexts/AuthContext.tsx:26:32)
    at QueryClientProvider (http://127.0.0.1:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=590d1dc8:2934:3)
    at App (http://127.0.0.1:8080/src/App.tsx?t=1765040830332:102:5)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries. (at http://127.0.0.1:8080/node_modules/.vite/deps/chunk-F34GCA6J.js?v=590d1dc8:14079:30)
[WARNING] ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
[WARNING] ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. (at http://127.0.0.1:8080/node_modules/.vite/deps/react-router-dom.js?v=590d1dc8:4392:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6f8d6b34-f1ec-4dfc-b9c2-1a68a05725b9/8d8ade4c-e9b1-41d5-99ec-4086be2d091d
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **15.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---