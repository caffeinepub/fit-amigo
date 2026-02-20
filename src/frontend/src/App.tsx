import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import Layout from './components/Layout';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderHistory from './pages/OrderHistory';
import OrderDetail from './pages/OrderDetail';
import WorkoutTracker from './pages/WorkoutTracker';
import AddWorkout from './pages/AddWorkout';
import AdminDashboard from './pages/AdminDashboard';
import AdminProductManagement from './pages/AdminProductManagement';
import AdminNewsManagement from './pages/AdminNewsManagement';
import FiTube from './pages/FiTube';
import VideoDetail from './pages/VideoDetail';
import UploadVideo from './pages/UploadVideo';
import RunningMonitor from './pages/RunningMonitor';
import AddRunningSession from './pages/AddRunningSession';
import FoodTracker from './pages/FoodTracker';
import AddFood from './pages/AddFood';
import SearchResults from './pages/SearchResults';
import ComingSoon from './components/ComingSoon';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Store,
});

const storeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/store',
  component: Store,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$productId',
  component: ProductDetail,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: Cart,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: Checkout,
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order-confirmation/$orderId',
  component: OrderConfirmation,
});

const orderHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders',
  component: OrderHistory,
});

const orderDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order/$orderId',
  component: OrderDetail,
});

const workoutTrackerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/workout-tracker',
  component: WorkoutTracker,
});

const addWorkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/add-workout',
  component: AddWorkout,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboard,
});

const adminProductManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/products',
  component: AdminProductManagement,
});

const adminNewsManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/news',
  component: AdminNewsManagement,
});

const fitubeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/fitube',
  component: FiTube,
});

const videoDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/fitube/$videoId',
  component: VideoDetail,
});

const uploadVideoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/fitube/upload',
  component: UploadVideo,
});

const runningRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/running',
  component: RunningMonitor,
});

const addRunningSessionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/running/add',
  component: AddRunningSession,
});

const foodTrackerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/food',
  component: FoodTracker,
});

const addFoodRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/food/add',
  component: AddFood,
});

const newsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/news',
  component: () => <ComingSoon featureName="Fitness News" description="Stay updated with the latest fitness and sports news" />,
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  component: SearchResults,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  storeRoute,
  productDetailRoute,
  cartRoute,
  checkoutRoute,
  orderConfirmationRoute,
  orderHistoryRoute,
  orderDetailRoute,
  workoutTrackerRoute,
  addWorkoutRoute,
  adminDashboardRoute,
  adminProductManagementRoute,
  adminNewsManagementRoute,
  fitubeRoute,
  videoDetailRoute,
  uploadVideoRoute,
  runningRoute,
  addRunningSessionRoute,
  foodTrackerRoute,
  addFoodRoute,
  newsRoute,
  searchRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
