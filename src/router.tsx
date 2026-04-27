import { createBrowserRouter } from "react-router-dom"
import { RootLayout } from "@/layouts/RootLayout"
import { WelcomeView } from "@/views/WelcomeView"
import ChatView from "@/views/ChatView"
import { DealWizardView } from "@/views/DealWizardView"
import { ContractCreateView } from "@/views/ContractCreateView"
import { ContractFromDealView } from "@/views/ContractFromDealView"
import { ContractEditView } from "@/views/ContractEditView"
import { ComponentPlayground } from "@/components/ComponentPlayground"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <WelcomeView /> },
      { path: "chat", element: <ChatView /> },
      { path: "deal/new", element: <DealWizardView /> },
      { path: "contract/new", element: <ContractCreateView /> },
      { path: "contract/from-deal", element: <ContractFromDealView /> },
      { path: "contract/:id/edit", element: <ContractEditView /> },
      { path: "contract/:id/review", element: <ChatView /> },
      ...(import.meta.env.DEV
        ? [{ path: "dev/components", element: <ComponentPlayground /> }]
        : []),
    ],
  },
])
