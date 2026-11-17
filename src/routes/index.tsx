
import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'

import { RootLayout } from '../layouts/RootLayout'
import { HomePage } from '../pages/HomePage'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { NotFoundPage } from '../pages/NotFoundPage'

import { LoginPage } from '../features/auth/pages/LoginPage'
import { SignupPage } from '../features/auth/pages/SignupPage'
import { ProfilePage } from '../features/auth/pages/ProfilePage'
import { VendorApplicationPage } from '../features/vendor/pages/VendorApplicationPage'

// Root route
const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
})

// Home route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

// Login route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

// Signup route
const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignupPage,
})

// Profile route
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
})

// Vendor application route
const partnerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/partner',
  component: VendorApplicationPage,
})

// Other page definitions
const pageDefinitions = [
  {
    path: '/hotels',
    title: 'Hotels',
    description: 'Discover places to stay across Bangladesh and beyond.',
  },
  {
    path: '/flights',
    title: 'Flights',
    description: 'Explore flight journeys and travel options.',
  },
  {
    path: '/bus',
    title: 'Bus',
    description: 'Explore intercity bus journeys.',
  },
  {
    path: '/train',
    title: 'Train',
    description: 'Explore train journeys and routes.',
  },
  {
    path: '/tours',
    title: 'Tours',
    description: 'Discover curated travel experiences and tour packages.',
  },
  {
    path: '/appointments',
    title: 'Appointments',
    description: 'Find and book appointments with service providers.',
  },
  {
    path: '/explore',
    title: 'Explore',
    description: 'Explore destinations, stays, journeys and services.',
  },
  {
    path: '/about',
    title: 'About Us',
    description: 'Learn more about TripNest.',
  },
  {
    path: '/help',
    title: 'Help Center',
    description: 'Get help with TripNest services.',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy',
    description: 'Read the TripNest privacy policy.',
  },
  {
    path: '/terms',
    title: 'Terms of Service',
    description: 'Read the TripNest terms of service.',
  },
] as const

// Placeholder routes
const placeholderRoutes = pageDefinitions.map((page) =>
  createRoute({
    getParentRoute: () => rootRoute,
    path: page.path,
    component: () => (
      <PlaceholderPage
        title={page.title}
        description={page.description}
      />
    ),
  }),
)

// Complete route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  profileRoute,
  partnerRoute,
  ...placeholderRoutes,
])

// Router instance
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

// TanStack Router type registration
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
