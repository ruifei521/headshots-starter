import ClientSideModelsList from "@/components/realtime/ClientSideModelsList";
import OverviewLoadError from "@/components/OverviewLoadError";

import { redirect } from "next/navigation";

import type { Metadata } from "next";

import { logger } from "@/lib/logger";

import { isPaymentEnabled } from "@/lib/payment-config";

import {

  fetchOverviewCredits,

  fetchOverviewModels,

  getOverviewUser,

} from "@/lib/overview-data";
import { loginRedirectPath } from "@/lib/login-redirect.server";



export const metadata: Metadata = {

  title: "Your AI Headshots Dashboard",

  description:

    "Manage your AI headshot models, view generated results, and create new professional headshots.",

};



export const dynamic = "force-dynamic";



export default async function Index() {

  try {

    const user = await getOverviewUser();



    if (!user) {

      return redirect(loginRedirectPath());

    }



    const [models, creditsAvailable] = await Promise.all([

      fetchOverviewModels(user.id, user.email),

      isPaymentEnabled() ? fetchOverviewCredits(user.id) : Promise.resolve(null),

    ]);



    return (

      <ClientSideModelsList

        serverModels={models}

        creditsAvailable={creditsAvailable}

      />

    );

  } catch (e) {

    logger.error(

      "Overview page: Supabase query failed, showing empty state:",

      e

    );

    return <OverviewLoadError />;

  }

}


