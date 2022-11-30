import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './App.css';
import Upload from './components/Upload';
import NotFound from './components/NotFound';
import DataTable from './components/DataTable';
import Datas from './components/Datas';

import Signup from "./Screens/auth/Signup";
import Login from "./Screens/auth/Login";
import EmailActivation from "./Screens/auth/EmailActivation";
import ResetPassword from "./Screens/auth/resetPassword/Reset";
import NewPassword from "./Screens/auth/resetPassword/NewPassword";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, signup_user } from "./features/userSlice";
import Protected from "./Protected";
import Layout from "./Layouts/screenLayout";


import "material-react-toastify/dist/ReactToastify.css";


function App() {
  const user = useSelector(selectUser);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/email-activation/:token" element={<EmailActivation />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/new-password/:token" element={<NewPassword />} />


          <Route path="/" element={
            <Protected user={user}>
              <Layout>
                <Upload />
              </Layout>
            </Protected>
          } />
          <Route path="/dataTable/:id" element={
            <Protected user={user}>
              <Layout>
                <DataTable />
              </Layout>
            </Protected>
          } />
          <Route path="/datas/:id" element={
            <Protected user={user}>
              <Layout>
                <Datas />
              </Layout>
            </Protected>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
//

export default App;
