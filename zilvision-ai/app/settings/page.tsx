import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SettingsPanel from "@/components/SettingsPanel";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl font-700 mb-1">Settings</h1>
      <p className="text-mist text-sm mb-8">Manage your account and preferences.</p>
      <SettingsPanel session={session} />
    </div>
  );
}
