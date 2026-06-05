import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import DashboardLayout from "./DashboardLayout";

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <DashboardLayout>{children}</DashboardLayout>
    </NextIntlClientProvider>
  );
}