export const dynamic = "force-static";
import ScriptureTypePageComponent from '@/components/ScriptureTypePageComponent';

const ScriptureTypePage = async ({ params }: { params: Promise<{ scripture: string }> }) => {
  const resolvedParams = await params;
  return <ScriptureTypePageComponent scripture={resolvedParams.scripture} />;
};

export default ScriptureTypePage; 