import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import BaseLayout from "@/components/Layout";
import { PetPlaceDetail, PetWalk, PetWalkDetail, Roulette } from "@/pages";
import ProtectedRoute from "@/components/Router/components/ProtectedRoute";
import Loading from "@/components/Loading";
import getUserInfoLoader from "./loader/getUserInfo.loader";
import { QueryClient } from "@tanstack/react-query";

const ErrorPage = lazy(() => import("@/pages/Error"));
const HomePage = lazy(() => import("@/pages/Home"));
const PetMedicalPage = lazy(() => import("@/pages/PetMedical"));
const PetPlacePage = lazy(() => import("@/pages/PetPlace"));
const PetFoodPage = lazy(() => import("@/pages/PetFood"));
const PetFuneralPage = lazy(() => import("@/pages/PetFuneral"));
const PostCreatePage = lazy(() => import("@/pages/PostCreate"));
const PostDetailPage = lazy(() => import("@/pages/PostDetail"));
const PostUpdatePage = lazy(() => import("@/pages/PostUpdate"));
const CommunityPage = lazy(() => import("@/pages/Community"));
const LoginPage = lazy(() => import("@/pages/Login"));
const ProfilePage = lazy(() => import("@/pages/Profile"));
const CreatePetProfile = lazy(() => import("@/pages/CreatePetProfile"));
const PetFriendsPage = lazy(() => import("@/pages/PetFriends"));
const ChatPage = lazy(() => import("@/pages/Chat"));
const Menu = lazy(() => import("@/pages/Menu"));

const qc = new QueryClient();

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;

const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseLayout />,
    errorElement: <ErrorPage />,
    loader: () => getUserInfoLoader(qc),
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<Loading />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "/community",
        element: (
          <Suspense fallback={<Loading />}>
            <CommunityPage />
          </Suspense>
        ),
      },
      {
        path: "/community/create",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <PostCreatePage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/community/update/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <PostUpdatePage />
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<Loading />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: "/petmedi",
        element: (
          <Suspense fallback={<Loading />}>
            <PetMedicalPage />
          </Suspense>
        ),
      },
      {
        path: "/petplace",
        element: (
          <Suspense fallback={<Loading />}>
            <PetPlacePage />
          </Suspense>
        ),
      },
      {
        path: "/petplace/:id",
        element: <PetPlaceDetail />,
      },
      {
        path: "/petfuneral",
        element: (
          <Suspense fallback={<Loading />}>
            <PetFuneralPage />
          </Suspense>
        ),
      },
      {
        path: "/petfood",
        element: (
          <Suspense fallback={<Loading />}>
            <PetFoodPage />
          </Suspense>
        ),
      },
      {
        path: "/petwalk",
        element: (
          <Suspense fallback={<Loading />}>
            <PetWalk />
          </Suspense>
        ),
      },
      {
        path: "/petwalk/detail",
        element: (
          <Suspense fallback={<Loading />}>
            <PetWalkDetail />
          </Suspense>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <ProfilePage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/createpet",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <CreatePetProfile />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/petfriends",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <PetFriendsPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/roulette",
        element: (
          <Suspense fallback={<Loading />}>
            <Roulette />
          </Suspense>
        ),
      },
      {
        path: "/menu",
        element: (
          <Suspense fallback={<Loading />}>
            <Menu />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/community/post/:id",
    element: (
      <Suspense fallback={<Loading />}>
        <PostDetailPage />
      </Suspense>
    ),
  },
  {
    path: "/chat/:nickname",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<Loading />}>
          <ChatPage />
        </Suspense>
      </ProtectedRoute>
    ),
    loader: () => getUserInfoLoader(qc),
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
