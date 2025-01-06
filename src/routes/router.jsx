import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../views/Dashboard';
import CustomerDetails from '../views/CustomerDetails';
import DailyTransactions from '../views/DailyTransactions';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard/>,
  },
  {
    path: "/customer-details",
    element: <CustomerDetails />,
  },
  {
    path: "/daily-transactions",
    element: <DailyTransactions />,
  },
]);



export default router
