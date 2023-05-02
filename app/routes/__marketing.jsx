import { Outlet } from "@remix-run/react";
import { getUserFromSession } from '~/util/auth.server';
import MainHeader from "~/components/navigation/MainHeader";

import marketingStyles from `~/styles/marketing.css`

export default function MarketingLayout() {
    return (
        <>
            <MainHeader />
            <Outlet />
        </>
    )
}

export function loader({request}) {
    return getUserFromSession(request);
}

export function links() {
    return [{
        rel: 'stylesheet',
        href: marketingStyles
    }]
}

export const headers = () => {
    return {
      'Cache-Control': 'max-age=3600' // 60 minutes
    }
  }  